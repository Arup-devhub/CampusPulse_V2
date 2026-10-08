import React, { useState, useEffect, useRef } from "react";
import {
  Video, VideoOff, Mic, MicOff, Square, Play, Send, ChevronRight,
  Clock, X, AlertCircle, Sparkles, ShieldCheck, RefreshCw, Volume2,
  CheckCircle2, AlertTriangle, ArrowRight
} from "lucide-react";
import { interviewService, InterviewQuestionItem, RecordedAnswerResponse } from "../../services/interviewService";

interface LiveInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: string;
  roleTitle?: string;
  onFinishInterview: () => void;
}

export const LiveInterviewModal: React.FC<LiveInterviewModalProps> = ({
  isOpen,
  onClose,
  company = "TCS",
  roleTitle = "Digital Software Engineer",
  onFinishInterview
}) => {
  // Permission step state
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [requestingPermission, setRequestingPermission] = useState(false);

  // Live session & Question progression
  const questions: InterviewQuestionItem[] = interviewService.getQuestions();
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(18 * 60 + 42); // 18:42

  // Camera & Mic track state
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);

  // Real Recording state
  const [recordingStatus, setRecordingStatus] = useState<"idle" | "recording" | "recorded" | "uploading" | "submitted">("idle");
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [isPlayingReview, setIsPlayingReview] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, RecordedAnswerResponse>>({});

  // Media references
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const playbackVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Initialize or teardown when isOpen toggles
  useEffect(() => {
    if (isOpen) {
      interviewService.startSession(company, roleTitle);
      setCurrentQIndex(0);
      setSecondsRemaining(18 * 60 + 42);
      setSubmittedAnswers({});
    } else {
      stopAllMediaTracks();
      setPermissionGranted(false);
      setPermissionError(null);
      setRecordingStatus("idle");
      if (recordedBlobUrl) {
        URL.revokeObjectURL(recordedBlobUrl);
        setRecordedBlobUrl(null);
      }
    }
  }, [isOpen]);

  // General Interview Countdown Timer
  useEffect(() => {
    if (!isOpen || !permissionGranted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, permissionGranted]);

  // Teardown tracks when unmounting
  useEffect(() => {
    return () => {
      stopAllMediaTracks();
    };
  }, []);

  const stopAllMediaTracks = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  /**
   * Explicit pre-interview permission request handler adhering to PRD §29 & §48:
   * "Tell the user: Camera and microphone access is required to conduct your AI interview.
   *  Your permissions will only be used during the interview session.
   *  Then request navigator.mediaDevices.getUserMedia({ video: true, audio: true })."
   */
  const handleRequestPermissions = async () => {
    setRequestingPermission(true);
    setPermissionError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Your browser does not support WebRTC media recording APIs.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });

      mediaStreamRef.current = stream;
      setPermissionGranted(true);
      setCameraActive(true);
      setMicActive(true);

      // Attach to live video element
      setTimeout(() => {
        if (liveVideoRef.current) {
          liveVideoRef.current.srcObject = stream;
          liveVideoRef.current.play().catch((err) => console.warn("Video autoPlay note:", err));
        }
      }, 100);
    } catch (err: any) {
      console.warn("Media device error:", err);
      let msg = "We couldn't access your camera or microphone. Check your browser permissions and try again.";
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        msg = "Camera and microphone access was denied by your browser. Please allow device access in your address bar and retry.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        msg = "No webcam or microphone was detected on this device. You may continue in simulated hardware preview mode.";
      }
      setPermissionError(msg);
    } finally {
      setRequestingPermission(false);
    }
  };

  // Fallback preview mode for environments where hardware is absent or blocked
  const handleProceedSimulatedHardware = () => {
    setPermissionGranted(true);
    setCameraActive(true);
    setMicActive(true);
  };

  // Toggle Camera Track
  const handleToggleCamera = () => {
    if (mediaStreamRef.current) {
      const videoTracks = mediaStreamRef.current.getVideoTracks();
      videoTracks.forEach((t) => (t.enabled = !cameraActive));
    }
    setCameraActive((prev) => !prev);
  };

  // Toggle Microphone Track
  const handleToggleMic = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach((t) => (t.enabled = !micActive));
    }
    setMicActive((prev) => !prev);
  };

  // Start Real Browser MediaRecorder
  const handleStartRecording = () => {
    setRecordingSeconds(0);
    recordedChunksRef.current = [];
    setRecordedBlob(null);
    if (recordedBlobUrl) {
      URL.revokeObjectURL(recordedBlobUrl);
      setRecordedBlobUrl(null);
    }

    try {
      let stream = mediaStreamRef.current;

      // If no hardware stream (simulated fallback), synthesize a canvas stream
      if (!stream) {
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#181818";
          ctx.fillRect(0, 0, 640, 360);
          ctx.fillStyle = "#FFFFFF";
          ctx.font = "20px Inter, sans-serif";
          ctx.fillText("CampusPulse Candidate Stream", 160, 180);
        }
        stream = canvas.captureStream(15);
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : MediaRecorder.isTypeSupported("video/webm")
        ? "video/webm"
        : "video/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        setRecordingStatus("recorded");
      };

      recorder.start(500); // 500ms timeslices
      mediaRecorderRef.current = recorder;
      setRecordingStatus("recording");

      // Recording elapsed timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start MediaRecorder:", err);
      setRecordingStatus("idle");
      alert("Browser failed to initialize recording. Please ensure camera/microphone permissions are granted.");
    }
  };

  // Stop Recording
  const handleStopRecording = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  // Submit Answer
  const handleSubmitAnswer = async () => {
    if (!recordedBlob) return;

    setRecordingStatus("uploading");
    const activeQ = questions[currentQIndex];

    const res = await interviewService.submitAnswer({
      sessionId: interviewService.getActiveSession()?.sessionId || "int-sess-default",
      questionId: activeQ.id,
      mediaBlob: recordedBlob,
      durationSeconds: recordingSeconds
    });

    if (res.success && res.response) {
      setSubmittedAnswers((prev) => ({
        ...prev,
        [activeQ.id]: res.response!
      }));
      setRecordingStatus("submitted");
      setSubmissionSuccess("Answer submitted successfully. Progressing to next technical question...");

      setTimeout(() => {
        setSubmissionSuccess(null);
        handleNextQuestion();
      }, 1200);
    } else {
      setRecordingStatus("recorded");
      alert(res.error || "Failed to upload answer. Please retry.");
    }
  };

  // Move to next question or complete interview
  const handleNextQuestion = () => {
    setRecordingStatus("idle");
    setRecordingSeconds(0);
    setRecordedBlob(null);
    if (recordedBlobUrl) {
      URL.revokeObjectURL(recordedBlobUrl);
      setRecordedBlobUrl(null);
    }

    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Completed all questions
      stopAllMediaTracks();
      interviewService.finishSession();
      onFinishInterview();
    }
  };

  if (!isOpen) return null;

  const currentQ = questions[currentQIndex] || questions[0];

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="modal-backdrop-layer" role="dialog" aria-modal="true">
      <div className="modal-card-box modal-lg" style={{ height: "92vh" }}>
        {/* Top header */}
        <div
          className="modal-header-bar"
          style={{ background: "var(--cp-near-black)", color: "var(--cp-white)", borderBottom: "1px solid var(--cp-grey-800)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "var(--cp-grey-400)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              CampusPulse AI Technical Mock Interview
            </span>
            <span style={{ color: "var(--cp-grey-600)" }}>|</span>
            <b style={{ color: "var(--cp-white)", fontSize: 14 }}>{company} · {roleTitle}</b>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--cp-grey-300)" }}>
              <Clock size={15} />
              <span style={{ fontFamily: "monospace", fontWeight: 700 }}>{formatTimer(secondsRemaining)} remaining</span>
            </div>

            <button
              className="btn-ghost"
              onClick={() => {
                stopAllMediaTracks();
                onClose();
              }}
              style={{ color: "var(--cp-white)" }}
              aria-label="Exit Interview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* STEP 1: EXPLICIT PERMISSION GATEWAY */}
        {!permissionGranted ? (
          <div style={{ padding: "48px 32px", maxWidth: 640, margin: "auto", textAlign: "center" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "var(--cp-grey-100)",
                color: "var(--cp-black)",
                display: "grid",
                placeItems: "center",
                margin: "0 auto 18px"
              }}
            >
              <Video size={28} />
            </div>

            <h2 style={{ fontSize: 22, color: "var(--cp-black)", marginBottom: 8 }}>
              Before Starting Your AI Interview
            </h2>
            <p style={{ fontSize: 14, color: "var(--cp-grey-600)", lineHeight: 1.6, marginBottom: 24 }}>
              CampusPulse requires real-time access to your <b>camera</b> and <b>microphone</b> to record candidate verbal responses and conduct AI speech evaluation.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                textAlign: "left",
                marginBottom: 24
              }}
            >
              <div style={{ padding: 16, border: "1px solid var(--cp-grey-200)", borderRadius: "var(--cp-radius-sm)", background: "var(--cp-grey-50)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: "var(--cp-black)" }}>
                  <Video size={16} /> Camera Access
                </div>
                <span className="badge badge-ready" style={{ marginTop: 6, display: "inline-block" }}>
                  Required
                </span>
                <p style={{ fontSize: 11, color: "var(--cp-grey-600)", marginTop: 6 }}>
                  Streams candidate video for live proctoring and assessment integrity.
                </p>
              </div>

              <div style={{ padding: 16, border: "1px solid var(--cp-grey-200)", borderRadius: "var(--cp-radius-sm)", background: "var(--cp-grey-50)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: "var(--cp-black)" }}>
                  <Mic size={16} /> Microphone Access
                </div>
                <span className="badge badge-ready" style={{ marginTop: 6, display: "inline-block" }}>
                  Required
                </span>
                <p style={{ fontSize: 11, color: "var(--cp-grey-600)", marginTop: 6 }}>
                  Captures verbal algorithm explanations for technical scoring.
                </p>
              </div>
            </div>

            <div
              style={{
                padding: "12px 16px",
                background: "var(--cp-grey-50)",
                border: "1px solid var(--cp-grey-200)",
                borderRadius: "var(--cp-radius-sm)",
                fontSize: 12,
                color: "var(--cp-grey-700)",
                textAlign: "left",
                marginBottom: 24,
                display: "flex",
                alignItems: "center",
                gap: 10
              }}
            >
              <ShieldCheck size={18} style={{ color: "var(--cp-success)", flexShrink: 0 }} />
              <span>
                <b>Privacy Commitment:</b> Your camera and microphone are used solely during this active examination session and are terminated immediately upon exit.
              </span>
            </div>

            {permissionError && (
              <div className="auth-alert-banner error" style={{ marginBottom: 20, textAlign: "left" }}>
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <div style={{ fontSize: 13 }}>
                  <b>Device Access Notice</b>
                  <p style={{ marginTop: 2 }}>{permissionError}</p>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  stopAllMediaTracks();
                  onClose();
                }}
              >
                Cancel & Return
              </button>

              <button
                className="btn btn-primary"
                onClick={handleRequestPermissions}
                disabled={requestingPermission}
              >
                {requestingPermission ? "Connecting Media Devices..." : "Allow & Continue to Mock Interview"}
              </button>

              {permissionError && (
                <button
                  className="btn btn-secondary"
                  onClick={handleProceedSimulatedHardware}
                >
                  Continue in Preview Mode
                </button>
              )}
            </div>
          </div>
        ) : (
          /* STEP 2: LIVE INTERVIEW WORKSPACE */
          <div className="live-interview-split-workspace">
            {/* Candidate live camera area */}
            <div className="candidate-video-box" style={{ minHeight: 380 }}>
              {/* Top status indicator tag */}
              <div className={`recording-indicator-tag ${recordingStatus === "recording" ? "active" : ""}`}>
                <i />
                <span>
                  {recordingStatus === "recording"
                    ? `Recording Answer (${formatTimer(recordingSeconds)})`
                    : recordingStatus === "recorded"
                    ? "Answer Recorded (Ready to Submit)"
                    : recordingStatus === "uploading"
                    ? "Uploading Answer..."
                    : "Camera Live · Idle"}
                </span>
              </div>

              {/* REAL VIDEO ELEMENT */}
              <video
                ref={liveVideoRef}
                autoPlay
                muted
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: cameraActive && mediaStreamRef.current ? "block" : "none"
                }}
              />

              {/* Muted or fallback overlay when camera is off */}
              {(!cameraActive || !mediaStreamRef.current) && (
                <div className="mock-video-stream">
                  <div className="mock-avatar-camera">
                    <VideoOff size={32} style={{ color: "var(--cp-grey-500)" }} />
                  </div>
                  <span style={{ fontSize: 13, color: "var(--cp-grey-300)", fontWeight: 600 }}>
                    Candidate Stream Muted
                  </span>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                    Camera track disabled. Toggle below to resume stream.
                  </span>
                </div>
              )}

              {/* Video Bottom Floating Controls */}
              <div className="video-bottom-controls">
                <button
                  className={`control-circle-btn ${!cameraActive ? "off" : ""}`}
                  onClick={handleToggleCamera}
                  title={cameraActive ? "Mute Camera" : "Turn on Camera"}
                  aria-label={cameraActive ? "Mute Camera" : "Turn on Camera"}
                >
                  {cameraActive ? <Video size={18} /> : <VideoOff size={18} />}
                </button>

                <button
                  className={`control-circle-btn ${!micActive ? "off" : ""}`}
                  onClick={handleToggleMic}
                  title={micActive ? "Mute Microphone" : "Turn on Microphone"}
                  aria-label={micActive ? "Mute Microphone" : "Turn on Microphone"}
                >
                  {micActive ? <Mic size={18} /> : <MicOff size={18} />}
                </button>

                {/* Primary Recording Action Trigger */}
                {recordingStatus === "idle" && (
                  <button
                    className="btn btn-sm"
                    style={{
                      borderRadius: 99,
                      padding: "0 18px",
                      background: "var(--cp-white)",
                      color: "var(--cp-black)",
                      fontWeight: 600
                    }}
                    onClick={handleStartRecording}
                  >
                    <Play size={14} />
                    <span>Record Answer</span>
                  </button>
                )}

                {recordingStatus === "recording" && (
                  <button
                    className="btn btn-sm"
                    style={{
                      borderRadius: 99,
                      padding: "0 18px",
                      background: "var(--cp-error)",
                      color: "var(--cp-white)",
                      fontWeight: 600
                    }}
                    onClick={handleStopRecording}
                  >
                    <Square size={14} />
                    <span>Stop Recording</span>
                  </button>
                )}

                {recordingStatus === "recorded" && (
                  <button
                    className="btn btn-sm btn-secondary"
                    style={{
                      borderRadius: 99,
                      padding: "0 14px",
                      background: "var(--cp-grey-900)",
                      color: "var(--cp-white)",
                      borderColor: "var(--cp-grey-700)"
                    }}
                    onClick={handleStartRecording}
                  >
                    <RefreshCw size={13} />
                    <span>Re-record</span>
                  </button>
                )}
              </div>
            </div>

            {/* AI Interviewer prompt & answer submission panel */}
            <div className="interviewer-chat-box">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span className="eyebrow-tag">
                  Question {currentQIndex + 1} of {questions.length}
                </span>
                <span className="badge badge-neutral">Stage 3: Technical Defense</span>
              </div>

              <div style={{ marginBottom: 18 }}>
                <h3 style={{ fontSize: 17, color: "var(--cp-black)", lineHeight: 1.4, fontWeight: 600 }}>
                  "{currentQ.text}"
                </h3>
                <p style={{ fontSize: 12, color: "var(--cp-grey-600)", marginTop: 6 }}>
                  <b>Rubric Focus:</b> {currentQ.rubricFocus}
                </p>
              </div>

              {/* Status & Recording playback / review */}
              <div
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "var(--cp-radius-sm)",
                  background: "var(--cp-grey-50)",
                  border: "1px solid var(--cp-grey-200)",
                  display: "flex",
                  flexDirection: "column",
                  marginBottom: 18
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Sparkles size={14} style={{ color: "var(--cp-black)" }} />
                    <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--cp-grey-600)" }}>
                      Recording Status & Verification
                    </span>
                  </div>

                  {recordingStatus === "recording" && (
                    <span className="badge badge-developing">
                      ● Recording {formatTimer(recordingSeconds)}
                    </span>
                  )}

                  {recordingStatus === "recorded" && (
                    <span className="badge badge-ready">
                      Recorded ({recordingSeconds}s)
                    </span>
                  )}
                </div>

                {recordingStatus === "idle" && (
                  <p style={{ fontSize: 13, color: "var(--cp-grey-600)", fontStyle: "italic", margin: "auto 0" }}>
                    When ready, click <b>"Record Answer"</b> to capture your verbal response using your microphone.
                  </p>
                )}

                {recordingStatus === "recording" && (
                  <div style={{ margin: "auto 0", textAlign: "center" }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: "var(--cp-error)", fontFamily: "monospace" }}>
                      ● {formatTimer(recordingSeconds)}
                    </div>
                    <span style={{ fontSize: 12, color: "var(--cp-grey-600)", marginTop: 4, display: "block" }}>
                      Listening to speech... Speak clearly into the microphone.
                    </span>
                  </div>
                )}

                {recordingStatus === "recorded" && (
                  <div style={{ margin: "auto 0", display: "flex", flexDirection: "column", gap: 10 }}>
                    <span style={{ fontSize: 13, color: "var(--cp-grey-800)" }}>
                      Response successfully captured! You can review your recording before submitting.
                    </span>

                    {recordedBlobUrl && (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <audio controls src={recordedBlobUrl} style={{ width: "100%", height: 36 }} />
                      </div>
                    )}
                  </div>
                )}

                {recordingStatus === "uploading" && (
                  <div style={{ margin: "auto 0", textAlign: "center" }}>
                    <div style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>
                      <RefreshCw size={24} style={{ color: "var(--cp-black)" }} />
                    </div>
                    <h4 style={{ fontSize: 14, color: "var(--cp-black)", marginTop: 8 }}>Uploading answer...</h4>
                    <span style={{ fontSize: 12, color: "var(--cp-grey-500)", marginTop: 2, display: "block" }}>
                      Please do not close this page.
                    </span>
                  </div>
                )}

                {recordingStatus === "submitted" && (
                  <div style={{ margin: "auto 0", textAlign: "center", color: "var(--cp-success)" }}>
                    <CheckCircle2 size={28} style={{ margin: "0 auto 6px" }} />
                    <b style={{ fontSize: 14 }}>Answer submitted successfully.</b>
                  </div>
                )}
              </div>

              {/* Bottom Action Buttons */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    stopAllMediaTracks();
                    onClose();
                  }}
                >
                  Exit Interview
                </button>

                <div style={{ display: "flex", gap: 10 }}>
                  {recordingStatus === "recorded" ? (
                    <button
                      className="btn btn-primary"
                      onClick={handleSubmitAnswer}
                    >
                      <Send size={14} />
                      <span>Submit Answer</span>
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary"
                      onClick={handleNextQuestion}
                    >
                      <span>Skip / Next Question</span>
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
