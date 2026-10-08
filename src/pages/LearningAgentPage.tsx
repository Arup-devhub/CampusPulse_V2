import React, { useState, useRef } from "react";
import {
  FileText, UploadCloud, Search, SlidersHorizontal, MoreVertical,
  Sparkles, Layers, Crosshair, Bot, Wand2, ChevronRight,
  Share2, PlayCircle, HelpCircle, LayoutGrid, CheckSquare,
  ArrowUp, Volume2, Play, Pause, RotateCcw, Shuffle,
  CheckCircle2, XCircle, Plus, Link2, Copy, Download,
  ExternalLink, BookmarkCheck, BookOpen, GraduationCap,
  Clock, Edit3, X, Eye, Trash2
} from "lucide-react";
import { UserProfile } from "../services/authService";
import "./learningAgent.css";

interface LearningAgentPageProps {
  currentUser?: UserProfile | null;
  onNavigate?: (page: any) => void;
}

export type StudyFormat = "overview" | "mindmap" | "flashcards" | "quiz" | "infographic" | "youtube";

interface SourceItem {
  id: string;
  name: string;
  type: "pdf" | "doc" | "link" | "text";
  size?: string;
  pages?: number;
  addedTime: string;
  topic: string;
  summary: string;
}

// Initial mock sources strictly matching reference image
const INITIAL_SOURCES: SourceItem[] = [
  {
    id: "src-1",
    name: "Operating_Systems_Notes.pdf",
    type: "pdf",
    size: "12.4 MB",
    pages: 48,
    addedTime: "Added 2 hours ago",
    topic: "Operating Systems",
    summary: "Comprehensive lecture notes covering Process Scheduling, Concurrency, Deadlocks, Memory Management, and File Systems."
  },
  {
    id: "src-2",
    name: "DBMS_Unit_3.docx",
    type: "doc",
    size: "2.1 MB",
    pages: 28,
    addedTime: "Added 5 hours ago",
    topic: "Database Management Systems",
    summary: "Unit 3 materials covering Relational Algebra, SQL Joins, Normalization (1NF to BCNF), and ACID Transactions."
  },
  {
    id: "src-3",
    name: "https://example.com/notes",
    type: "link",
    size: "Web page",
    addedTime: "Added 1 day ago",
    topic: "Computer Networks & Sockets",
    summary: "Web documentation on OSI & TCP/IP models, Socket Programming in C/Python, DNS, and HTTP/3 protocol mechanics."
  }
];

export const LearningAgentPage: React.FC<LearningAgentPageProps> = ({ currentUser }) => {
  // Sources state
  const [sources, setSources] = useState<SourceItem[]>(INITIAL_SOURCES);
  const [selectedSourceId, setSelectedSourceId] = useState<string>("src-1");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");

  // Active source resolution
  const activeSource = sources.find((s) => s.id === selectedSourceId) || sources[0];
  const [topicTitle, setTopicTitle] = useState(activeSource?.topic || "Operating Systems");

  // Output format selection & generated status
  const [activeFormat, setActiveFormat] = useState<StudyFormat | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Chat conversation state
  const [messages, setMessages] = useState<Array<{ sender: "user" | "agent"; text: string; citation?: string }>>([
    {
      sender: "agent",
      text: "Hello! I've loaded your source notes. What concept would you like to explore or generate?",
      citation: "Operating_Systems_Notes.pdf • Page 1"
    }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Modals state
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [addSourceTab, setAddSourceTab] = useState<"upload" | "paste" | "link">("upload");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newUrl, setNewUrl] = useState("");

  // Audio overview playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<"1.0x" | "1.25x" | "1.5x">("1.0x");

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<number[]>([]);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // File input ref for upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter sources
  const filteredSources = sources
    .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.topic.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  // Handle switching source
  const handleSelectSource = (src: SourceItem) => {
    setSelectedSourceId(src.id);
    setTopicTitle(src.topic);
    // Reset flashcards and quiz state when switching source
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  // Trigger Study Material Generation
  const handleSelectFormat = (format: StudyFormat) => {
    setActiveFormat(format);
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  // Submit Chat Prompt
  const handleSendPrompt = (promptText?: string) => {
    const textToSend = promptText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = { sender: "user" as const, text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!promptText) setChatInput("");

    // Simulate Agent RAG retrieval response
    setTimeout(() => {
      let agentReply = "";
      let citation = `${activeSource.name} • Page 14`;

      const lower = textToSend.toLowerCase();
      if (lower.includes("deadlock")) {
        agentReply = "Deadlock requires all 4 Coffman conditions simultaneously: 1. Mutual Exclusion, 2. Hold & Wait, 3. No Preemption, and 4. Circular Wait. Prevention typically breaks Circular Wait using strict resource ordering.";
        citation = `${activeSource.name} • Page 26`;
      } else if (lower.includes("scheduling") || lower.includes("cpu")) {
        agentReply = "CPU Scheduling policies include FCFS (simple, Convoy effect risk), SJF (optimal average waiting time, but starvation risk), and Round Robin (time quantum based, ideal for interactive systems).";
        citation = `${activeSource.name} • Page 12`;
      } else if (lower.includes("paging") || lower.includes("segmentation") || lower.includes("memory")) {
        agentReply = "Paging breaks physical memory into fixed-size frames and eliminates external fragmentation. Segmentation organizes logical memory by variable-size user program segments (code, data, stack).";
        citation = `${activeSource.name} • Page 38`;
      } else {
        agentReply = `Based on ${activeSource.topic}, the core principle involves balancing resource utilization, throughput, and system responsiveness while guaranteeing thread-safety and race condition prevention.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: agentReply,
          citation
        }
      ]);
    }, 700);
  };

  // Add Source Handler
  const handleAddSourceSubmit = () => {
    let newSource: SourceItem;
    if (addSourceTab === "link") {
      newSource = {
        id: `src-${Date.now()}`,
        name: newUrl || "https://web.mit.edu/os-notes",
        type: "link",
        size: "Web resource",
        addedTime: "Added just now",
        topic: newTitle || "Distributed Systems & Cloud",
        summary: "Online documentation on distributed consensus and high-throughput architectures."
      };
    } else if (addSourceTab === "paste") {
      newSource = {
        id: `src-${Date.now()}`,
        name: newTitle ? `${newTitle}.txt` : "Pasted_Notes.txt",
        type: "text",
        size: "14.2 KB",
        pages: 3,
        addedTime: "Added just now",
        topic: newTitle || "Custom Revision Notes",
        summary: newContent.slice(0, 120) || "Pasted notes for quick retrieval and study synthesis."
      };
    } else {
      newSource = {
        id: `src-${Date.now()}`,
        name: newTitle || "Computer_Networks_Unit_2.pdf",
        type: "pdf",
        size: "4.8 MB",
        pages: 18,
        addedTime: "Added just now",
        topic: "Computer Networks",
        summary: "Transport Layer, TCP Flow Control, Congestion Window, and UDP protocols."
      };
    }

    setSources([newSource, ...sources]);
    setSelectedSourceId(newSource.id);
    setTopicTitle(newSource.topic);
    setIsAddSourceOpen(false);
    setNewTitle("");
    setNewContent("");
    setNewUrl("");
  };

  // Delete source
  const handleDeleteSource = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sources.length <= 1) return;
    const remaining = sources.filter((s) => s.id !== id);
    setSources(remaining);
    if (selectedSourceId === id) {
      setSelectedSourceId(remaining[0].id);
      setTopicTitle(remaining[0].topic);
    }
  };

  // Student first name greeting
  const studentFirstName = currentUser?.name ? currentUser.name.split(" ")[0] : "Anjali";

  // Flashcards deck
  const flashcardsDeck = [
    {
      question: "What are the 4 necessary conditions for a Deadlock to occur?",
      category: "Deadlocks",
      answer: "1. Mutual Exclusion (non-shareable resources)\n2. Hold and Wait (process holds 1 resource and requests another)\n3. No Preemption (resources cannot be forcibly reclaimed)\n4. Circular Wait (closed chain of processes waiting).",
      page: "Page 26"
    },
    {
      question: "What is the difference between a Process and a Thread?",
      category: "Processes",
      answer: "A process is an executing program instance with its own virtual memory space and PCB. A thread is a lightweight execution unit inside a process that shares code, data, and open files, having its own stack and registers.",
      page: "Page 8"
    },
    {
      question: "How does the Round Robin (RR) algorithm handle process scheduling?",
      category: "CPU Scheduling",
      answer: "RR assigns a fixed time quantum to each ready process in a FIFO queue. If execution exceeds the quantum, the process is preempted and placed at the tail of the ready queue.",
      page: "Page 15"
    },
    {
      question: "What is Belady's Anomaly in Paging?",
      category: "Memory Management",
      answer: "Belady's Anomaly is a counter-intuitive phenomenon where increasing the number of allocated page frames causes more page faults. It commonly occurs in FIFO page replacement, but NOT in LRU or Optimal.",
      page: "Page 41"
    },
    {
      question: "What is the difference between Mutex and Semaphore?",
      category: "Synchronization",
      answer: "A Mutex is a locking mechanism with ownership (only the thread that locked it can unlock it). A Counting/Binary Semaphore is a signaling mechanism with integer state (wait/signal) where any thread can signal.",
      page: "Page 22"
    },
    {
      question: "What is Thrashing and how is it resolved?",
      category: "Virtual Memory",
      answer: "Thrashing occurs when the OS spends more time swapping pages in/out than executing instructions due to excessive page faults. Resolved using the Working Set Model or Local Page Replacement.",
      page: "Page 45"
    }
  ];

  // Quiz questions
  const quizQuestions = [
    {
      id: 1,
      q: "Which CPU scheduling algorithm gives the minimum average waiting time for a given set of processes?",
      options: [
        "First-Come, First-Served (FCFS)",
        "Shortest Job First (SJF / SRTF)",
        "Round Robin (RR)",
        "Priority Scheduling"
      ],
      correct: 1,
      explain: "Shortest Job First is proven optimal because scheduling shortest CPU bursts first minimizes queue wait times for subsequent jobs."
    },
    {
      id: 2,
      q: "Which condition can be prevented to eliminate deadlock without requiring resource preemption?",
      options: [
        "Mutual Exclusion",
        "Circular Wait via global resource ordering",
        "Hold and Wait by ignoring requests",
        "Starvation avoidance"
      ],
      correct: 1,
      explain: "Imposing a total numerical ordering on all resource types and requiring processes to request resources in strictly ascending order prevents circular wait."
    },
    {
      id: 3,
      q: "What causes Translation Lookaside Buffer (TLB) Reach to be a critical hardware metric?",
      options: [
        "It measures the total disk swap capacity",
        "It defines the amount of virtual memory accessible without TLB misses (TLB entries × Page size)",
        "It calculates clock cycles needed for context switching",
        "It limits the number of threads per CPU core"
      ],
      correct: 1,
      explain: "TLB Reach = Number of TLB entries × Page Size. A larger TLB reach minimizes high-latency multi-level page table traversals in RAM."
    },
    {
      id: 4,
      q: "In UNIX-like operating systems, what system call creates a new child process with duplicated address space?",
      options: ["exec()", "fork()", "pthread_create()", "wait()"],
      correct: 1,
      explain: "The fork() system call creates an exact copy of the calling process via copy-on-write (COW) memory semantics."
    }
  ];

  // YouTube recommendations list
  const youtubeVideos = [
    {
      title: "Operating Systems Full Course | College & Placement Syllabus",
      channel: "Gate Smashers",
      duration: "11:42:18",
      views: "1.8M views",
      rating: "4.9 ★",
      url: "https://www.youtube.com/results?search_query=gate+smashers+operating+systems",
      tags: ["High-Yield", "Core CS", "Placement Ready"]
    },
    {
      title: "CPU Scheduling Algorithms: FCFS, SJF, SRTF & Round Robin with Problems",
      channel: "Abdul Bari",
      duration: "42:15",
      views: "940K views",
      rating: "4.9 ★",
      url: "https://www.youtube.com/results?search_query=abdul+bari+cpu+scheduling",
      tags: ["Solved Problems", "GATE / Interviews"]
    },
    {
      title: "Deadlock Avoidance & Banker's Algorithm Step-by-Step",
      channel: "NPTEL Computer Science",
      duration: "34:50",
      views: "420K views",
      rating: "4.8 ★",
      url: "https://www.youtube.com/results?search_query=banker+algorithm+nptel",
      tags: ["Theoretical Rigor", "IIT Kharagpur"]
    },
    {
      title: "Virtual Memory, Paging & Page Tables Demystified",
      channel: "Computerphile",
      duration: "18:24",
      views: "620K views",
      rating: "4.9 ★",
      url: "https://www.youtube.com/results?search_query=computerphile+virtual+memory",
      tags: ["Visual Animation", "Hardware Architecture"]
    }
  ];

  return (
    <div className="learning-agent-root" aria-label="Learning Agent Studio">
      {/* Page Top Context Bar */}
      <div className="la-top-bar">
        <div className="la-badge-agent">
          <Sparkles size={14} />
          <span>NotebookLM Powered Learning Agent • Student Hub</span>
        </div>
        <div className="la-top-actions">
          <button className="la-mini-btn" onClick={() => setIsAddSourceOpen(true)}>
            <Plus size={14} /> Add Source
          </button>
          <button
            className="la-mini-btn"
            onClick={() => {
              setActiveFormat("overview");
              handleSendPrompt("Provide full executive summary and key interview points");
            }}
          >
            <Wand2 size={14} /> Auto-Synthesize
          </button>
        </div>
      </div>

      {/* 3-Column Studio Grid (NotebookLM Exact Architecture) */}
      <div className="la-studio-layout">
        {/* ===================================================================
            COLUMN 1: Learning Sources (Left)
            =================================================================== */}
        <aside className="la-column la-sources-col">
          <div className="la-col-header">
            <div className="la-col-header-icon">
              <FileText size={18} />
            </div>
            <div>
              <h2 className="la-col-title">Learning Sources</h2>
              <p className="la-col-subtitle">Upload your study material or add links to get started</p>
            </div>
          </div>

          {/* Primary + Add Source Button */}
          <button
            type="button"
            className="la-add-source-btn"
            onClick={() => setIsAddSourceOpen(true)}
            aria-label="Add new source document"
          >
            <Plus size={16} />
            <span>Add Source</span>
          </button>

          {/* Drag & Drop Files Area */}
          <div
            className="la-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const f = e.dataTransfer.files[0];
                const newSrc: SourceItem = {
                  id: `src-${Date.now()}`,
                  name: f.name,
                  type: f.name.endsWith(".docx") ? "doc" : "pdf",
                  size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
                  pages: Math.max(12, Math.floor(f.size / 50000)),
                  addedTime: "Added just now",
                  topic: f.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
                  summary: "User uploaded study material ready for analysis."
                };
                setSources([newSrc, ...sources]);
                setSelectedSourceId(newSrc.id);
                setTopicTitle(newSrc.topic);
              }
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".pdf,.docx,.doc,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const f = e.target.files[0];
                  const newSrc: SourceItem = {
                    id: `src-${Date.now()}`,
                    name: f.name,
                    type: f.name.endsWith(".docx") ? "doc" : "pdf",
                    size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
                    pages: Math.max(12, Math.floor(f.size / 50000)),
                    addedTime: "Added just now",
                    topic: f.name.replace(/\.[^/.]+$/, "").replace(/_/g, " "),
                    summary: "User uploaded study material ready for analysis."
                  };
                  setSources([newSrc, ...sources]);
                  setSelectedSourceId(newSrc.id);
                  setTopicTitle(newSrc.topic);
                }
              }}
            />
            <UploadCloud size={28} className="la-dropzone-icon" />
            <span className="la-dropzone-title">Drag & drop files here</span>
            <span className="la-dropzone-action">or click to browse</span>
            <span className="la-dropzone-hint">Supports PDF, DOCX, TXT, or add a link</span>
          </div>

          {/* Quick Action Icons Row */}
          <div className="la-quick-actions-row">
            <button
              type="button"
              className="la-quick-btn"
              onClick={() => {
                setAddSourceTab("upload");
                setIsAddSourceOpen(true);
              }}
            >
              <FileText size={16} style={{ color: "#ef4444" }} />
              <span>Upload PDF</span>
            </button>
            <button
              type="button"
              className="la-quick-btn"
              onClick={() => {
                setAddSourceTab("upload");
                setIsAddSourceOpen(true);
              }}
            >
              <BookOpen size={16} style={{ color: "#3b82f6" }} />
              <span>Upload Doc</span>
            </button>
            <button
              type="button"
              className="la-quick-btn"
              onClick={() => {
                setAddSourceTab("paste");
                setIsAddSourceOpen(true);
              }}
            >
              <Copy size={16} style={{ color: "#a855f7" }} />
              <span>Paste Text</span>
            </button>
            <button
              type="button"
              className="la-quick-btn"
              onClick={() => {
                setAddSourceTab("link");
                setIsAddSourceOpen(true);
              }}
            >
              <Link2 size={16} style={{ color: "#14b8a6" }} />
              <span>Add Link</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="la-search-wrapper">
            <Search size={14} className="la-search-icon" />
            <input
              type="text"
              className="la-search-input"
              placeholder="Search your sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="la-search-filter-btn"
              title="Filter sources"
              onClick={() => setSortBy(sortBy === "newest" ? "name" : "newest")}
            >
              <SlidersHorizontal size={13} />
            </button>
          </div>

          {/* Sources List Header */}
          <div className="la-sources-list-head">
            <span>Your Sources ({sources.length})</span>
            <select
              className="la-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">Newest ▾</option>
              <option value="name">Title A-Z ▾</option>
            </select>
          </div>

          {/* Sources List Items */}
          <div className="la-sources-list">
            {filteredSources.map((src) => {
              const isSelected = src.id === selectedSourceId;
              return (
                <div
                  key={src.id}
                  className={`la-source-item ${isSelected ? "active" : ""}`}
                  onClick={() => handleSelectSource(src)}
                >
                  <div className={`la-source-icon-badge ${src.type}`}>
                    {src.type === "pdf" && <FileText size={16} />}
                    {src.type === "doc" && <BookOpen size={16} />}
                    {src.type === "link" && <Link2 size={16} />}
                    {src.type === "text" && <Copy size={16} />}
                  </div>

                  <div className="la-source-info">
                    <div className="la-source-name" title={src.name}>
                      {src.name}
                    </div>
                    <div className="la-source-meta">
                      {src.type.toUpperCase()} • {src.size} {src.pages ? `• ${src.pages} pages` : ""}
                    </div>
                    <div className="la-source-time">{src.addedTime}</div>
                  </div>

                  <button
                    type="button"
                    className="la-source-more-btn"
                    title="Delete source"
                    onClick={(e) => handleDeleteSource(src.id, e)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* ===================================================================
            COLUMN 2: Main Stage / Workspace & Chat Studio (Center)
            =================================================================== */}
        <main className="la-column la-center-col">
          {/* Greeting Header */}
          <div className="la-greeting-box">
            <h1 className="la-greeting-title">Hi {studentFirstName},</h1>
            <h2 className="la-greeting-sub">Let's create something amazing from your study materials.</h2>
            <p className="la-greeting-desc">
              Your Learning Agent will read your sources, understand the content, and help you create personalized study material, visual summaries, and practice resources.
            </p>
          </div>

          {/* Active Selected Source Banner */}
          <div className="la-active-source-card">
            <div className="la-active-source-left">
              <div className="la-active-source-badge-icon">
                <FileText size={20} />
              </div>
              <div className="la-active-source-details">
                <span className="la-selected-count-tag">1 source selected</span>
                <div className="la-active-title" title={activeSource.topic || activeSource.name}>
                  {activeSource.topic || activeSource.name}
                </div>
                <div className="la-active-submeta">
                  {activeSource.type.toUpperCase()} • {activeSource.size} {activeSource.pages ? `• ${activeSource.pages} pages` : ""}
                </div>
              </div>
            </div>

            <div className="la-active-source-divider" />

            <div className="la-active-source-right">
              <div className="la-topic-label-row">
                <span>Topic / Title</span>
                <Edit3 size={11} className="la-topic-pencil-icon" />
              </div>
              <div className="la-topic-editor-box">
                <input
                  type="text"
                  className="la-topic-input"
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="Topic title..."
                />
                <ChevronRight size={15} className="la-topic-chevron" />
              </div>
            </div>
          </div>

          {/* 3 Status / Capability Pills Row */}
          <div className="la-status-pills-row">
            <div className="la-status-pill">
              <div className="la-status-icon-wrap">
                <Layers size={16} />
              </div>
              <div className="la-status-text">
                <span className="la-status-label">Source Loaded</span>
                <span className="la-status-val">1 document</span>
              </div>
            </div>

            <div className="la-status-pill">
              <div className="la-status-icon-wrap" style={{ color: "#38bdf8", background: "rgba(56, 189, 248, 0.1)" }}>
                <Crosshair size={16} />
              </div>
              <div className="la-status-text">
                <span className="la-status-label">Ready to Generate</span>
                <span className="la-status-val">RAG + LLM</span>
              </div>
            </div>

            <div className="la-status-pill">
              <div className="la-status-icon-wrap" style={{ color: "#a855f7", background: "rgba(168, 85, 247, 0.1)" }}>
                <Bot size={16} />
              </div>
              <div className="la-status-text">
                <span className="la-status-label">Your Personalized</span>
                <span className="la-status-val">Learning Agent</span>
              </div>
            </div>
          </div>

          {/* Workspace Body / Stage */}
          <div className="la-workspace-body">
            {isGenerating ? (
              <div className="la-generating-box">
                <div className="la-generating-spinner" />
                <span style={{ fontSize: 13, color: "#94a3b8" }}>
                  Synthesizing {activeFormat?.toUpperCase()} from {activeSource.name}...
                </span>
              </div>
            ) : !activeFormat ? (
              /* Welcome / Empty state matching reference */
              <div className="la-empty-state-welcome">
                <GraduationCap className="la-cap-illustration" />
                <div className="la-welcome-slogan">Better notes. Deeper understanding. Bigger goals.</div>
                <div className="la-quick-prompt-chips">
                  <button
                    className="la-prompt-chip"
                    onClick={() => handleSendPrompt("Explain CPU scheduling algorithms with real-world examples")}
                  >
                    ✨ Explain CPU scheduling algorithms
                  </button>
                  <button
                    className="la-prompt-chip"
                    onClick={() => handleSendPrompt("What are the 4 conditions for Deadlock?")}
                  >
                    ✨ 4 Deadlock Coffman conditions
                  </button>
                  <button
                    className="la-prompt-chip"
                    onClick={() => handleSendPrompt("Compare Paging and Segmentation memory management")}
                  >
                    ✨ Paging vs Segmentation
                  </button>
                  <button
                    className="la-prompt-chip"
                    onClick={() => handleSelectFormat("mindmap")}
                  >
                    🧠 Generate Structured Mind Map
                  </button>
                </div>
              </div>
            ) : (
              /* Generated Study Material Stage */
              <div className="la-material-view-wrap">
                <div className="la-view-mode-bar">
                  <div className="la-mode-tabs">
                    <button
                      className={`la-tab-btn ${activeFormat === "overview" ? "active" : ""}`}
                      onClick={() => handleSelectFormat("overview")}
                    >
                      <FileText size={13} /> Overview
                    </button>
                    <button
                      className={`la-tab-btn ${activeFormat === "mindmap" ? "active" : ""}`}
                      onClick={() => handleSelectFormat("mindmap")}
                    >
                      <Share2 size={13} /> Mind Map
                    </button>
                    <button
                      className={`la-tab-btn ${activeFormat === "flashcards" ? "active" : ""}`}
                      onClick={() => handleSelectFormat("flashcards")}
                    >
                      <Layers size={13} /> Flashcards
                    </button>
                    <button
                      className={`la-tab-btn ${activeFormat === "quiz" ? "active" : ""}`}
                      onClick={() => handleSelectFormat("quiz")}
                    >
                      <CheckSquare size={13} /> Quiz
                    </button>
                    <button
                      className={`la-tab-btn ${activeFormat === "infographic" ? "active" : ""}`}
                      onClick={() => handleSelectFormat("infographic")}
                    >
                      <LayoutGrid size={13} /> Infographic
                    </button>
                    <button
                      className={`la-tab-btn ${activeFormat === "youtube" ? "active" : ""}`}
                      onClick={() => handleSelectFormat("youtube")}
                    >
                      <PlayCircle size={13} /> YouTube
                    </button>
                  </div>

                  <div className="la-action-icons-group">
                    <button
                      className="la-ghost-icon-btn"
                      title="Clear View"
                      onClick={() => setActiveFormat(null)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Material Content Viewport */}
                <div className="la-material-container">
                  {/* MODE 1: OVERVIEW */}
                  {activeFormat === "overview" && (
                    <div className="la-overview-section">
                      {/* Signature NotebookLM Audio Overview Deep Dive Bar */}
                      <div className="la-audio-player-bar">
                        <div className="la-audio-left">
                          <button
                            className="la-audio-play-btn"
                            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                          >
                            {isPlayingAudio ? <Pause size={18} /> : <Play size={18} />}
                          </button>
                          <div className="la-audio-meta">
                            <span className="la-audio-title">
                              <Volume2 size={14} /> AI Audio Deep Dive (12:45)
                            </span>
                            <span className="la-audio-sub">
                              {isPlayingAudio ? "Playing: Co-hosts Alex & Maya discussing core insights..." : "Conversational synthesis podcast generated from your source"}
                            </span>
                          </div>
                        </div>
                        <div className="la-audio-right">
                          <button
                            className="la-audio-speed-btn"
                            onClick={() =>
                              setAudioSpeed(audioSpeed === "1.0x" ? "1.25x" : audioSpeed === "1.25x" ? "1.5x" : "1.0x")
                            }
                          >
                            {audioSpeed}
                          </button>
                        </div>
                      </div>

                      {/* Executive Summary */}
                      <div className="la-overview-summary-card">
                        <strong style={{ display: "block", color: "#38bdf8", marginBottom: 6, fontSize: 14 }}>
                          Executive Summary: {topicTitle}
                        </strong>
                        <p style={{ marginBottom: 10 }}>
                          The study notes for <strong>{topicTitle}</strong> synthesize core placement engineering fundamentals. The material establishes foundational primitives between kernel abstractions, CPU scheduling algorithms <span className="la-citation-tag" onClick={() => handleSendPrompt("Explain CPU Scheduling")}>p. 12</span>, synchronization semaphores <span className="la-citation-tag" onClick={() => handleSendPrompt("Explain Semaphores")}>p. 22</span>, and virtual memory mapping <span className="la-citation-tag" onClick={() => handleSendPrompt("Explain Paging")}>p. 38</span>.
                        </p>
                        <p>
                          Key emphasis is placed on race-condition elimination, deadlock prevention criteria, and memory page-fault minimization for performance-critical systems.
                        </p>
                      </div>

                      {/* Concepts Breakdown Grid */}
                      <div className="la-concepts-grid">
                        <div className="la-concept-card">
                          <span className="la-concept-title">
                            <CheckSquare size={14} /> 1. Process Lifecycle & PCB
                          </span>
                          <span className="la-concept-desc">
                            Processes transition through New, Ready, Running, Waiting, and Terminated states. Each maintains state in a Process Control Block (PCB).
                          </span>
                        </div>

                        <div className="la-concept-card">
                          <span className="la-concept-title">
                            <CheckSquare size={14} /> 2. CPU Scheduling
                          </span>
                          <span className="la-concept-desc">
                            Preemptive vs Non-preemptive policies. FCFS suffers from Convoy Effect; SJF minimizes average waiting time; Round Robin guarantees fair interactive latency.
                          </span>
                        </div>

                        <div className="la-concept-card">
                          <span className="la-concept-title">
                            <CheckSquare size={14} /> 3. Synchronization & Locks
                          </span>
                          <span className="la-concept-desc">
                            Critical Section Problem requires Mutual Exclusion, Progress, and Bounded Waiting. Solved using Mutex locks and Counting Semaphores.
                          </span>
                        </div>

                        <div className="la-concept-card">
                          <span className="la-concept-title">
                            <CheckSquare size={14} /> 4. Deadlock & Coffman Rules
                          </span>
                          <span className="la-concept-desc">
                            Occurs when Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait coexist. Avoided using Dijkstra's Banker's Algorithm.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 2: MIND MAP */}
                  {activeFormat === "mindmap" && (
                    <div className="la-mindmap-view">
                      <div style={{ fontSize: 13, color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
                        <span>Interactive Structured Concept Hierarchy</span>
                        <span style={{ color: "#38bdf8" }}>Click branches to inspect</span>
                      </div>

                      <div className="la-mindmap-canvas">
                        <div className="la-tree-root">
                          <div className="la-node-hub">{topicTitle}</div>

                          <div className="la-tree-branches">
                            <div className="la-tree-branch-item">
                              <div
                                className="la-branch-node"
                                onClick={() => handleSendPrompt("Explain Process Management")}
                              >
                                Process Management
                              </div>
                              <div className="la-sub-leaves">
                                <span className="la-leaf-node" onClick={() => handleSendPrompt("Explain PCB")}>PCB</span>
                                <span className="la-leaf-node" onClick={() => handleSendPrompt("Explain Threads")}>Threads</span>
                                <span className="la-leaf-node" onClick={() => handleSendPrompt("Explain Context Switch")}>Context Switch</span>
                              </div>
                            </div>

                            <div className="la-tree-branch-item">
                              <div
                                className="la-branch-node"
                                onClick={() => handleSendPrompt("Explain CPU Scheduling")}
                              >
                                CPU Scheduling
                              </div>
                              <div className="la-sub-leaves">
                                <span className="la-leaf-node">FCFS</span>
                                <span className="la-leaf-node">SJF</span>
                                <span className="la-leaf-node">Round Robin</span>
                                <span className="la-leaf-node">Multilevel Queue</span>
                              </div>
                            </div>

                            <div className="la-tree-branch-item">
                              <div
                                className="la-branch-node"
                                onClick={() => handleSendPrompt("Explain Concurrency")}
                              >
                                Concurrency & Sync
                              </div>
                              <div className="la-sub-leaves">
                                <span className="la-leaf-node">Critical Section</span>
                                <span className="la-leaf-node">Mutex</span>
                                <span className="la-leaf-node">Semaphores</span>
                              </div>
                            </div>

                            <div className="la-tree-branch-item">
                              <div
                                className="la-branch-node"
                                onClick={() => handleSendPrompt("Explain Deadlocks")}
                              >
                                Deadlock Handling
                              </div>
                              <div className="la-sub-leaves">
                                <span className="la-leaf-node">Coffman 4</span>
                                <span className="la-leaf-node">Banker's Alg</span>
                                <span className="la-leaf-node">Resource Graph</span>
                              </div>
                            </div>

                            <div className="la-tree-branch-item">
                              <div
                                className="la-branch-node"
                                onClick={() => handleSendPrompt("Explain Memory Management")}
                              >
                                Memory Management
                              </div>
                              <div className="la-sub-leaves">
                                <span className="la-leaf-node">Paging</span>
                                <span className="la-leaf-node">TLB</span>
                                <span className="la-leaf-node">Page Faults</span>
                                <span className="la-leaf-node">LRU</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 3: FLASHCARDS */}
                  {activeFormat === "flashcards" && (
                    <div className="la-flashcards-view">
                      <div style={{ display: "flex", justifyContent: "space-between", width: "100%", maxWidth: 520, fontSize: 12, color: "#94a3b8" }}>
                        <span>
                          Card {currentCardIndex + 1} of {flashcardsDeck.length}
                        </span>
                        <span style={{ color: "#34d399" }}>
                          {masteredCards.length} Mastered
                        </span>
                      </div>

                      {/* 3D Flip Card */}
                      <div
                        className="la-flashcard-stage"
                        onClick={() => setIsFlipped(!isFlipped)}
                      >
                        <div className={`la-flashcard-inner ${isFlipped ? "flipped" : ""}`}>
                          {/* Front */}
                          <div className="la-flashcard-front">
                            <span className="la-card-category-tag">
                              {flashcardsDeck[currentCardIndex].category}
                            </span>
                            <p className="la-card-question">
                              {flashcardsDeck[currentCardIndex].question}
                            </p>
                            <span className="la-card-hint">
                              <RotateCcw size={12} /> Click card or space to flip answer
                            </span>
                          </div>

                          {/* Back */}
                          <div className="la-flashcard-back">
                            <span className="la-card-category-tag">
                              Verified Key Answer • {flashcardsDeck[currentCardIndex].page}
                            </span>
                            <div className="la-card-answer" style={{ whiteSpace: "pre-line" }}>
                              {flashcardsDeck[currentCardIndex].answer}
                            </div>
                            <span className="la-card-hint">
                              <RotateCcw size={12} /> Click to flip back
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Flashcard Navigation Controls */}
                      <div className="la-card-controls">
                        <button
                          className="la-card-btn"
                          disabled={currentCardIndex === 0}
                          onClick={() => {
                            setIsFlipped(false);
                            setCurrentCardIndex((prev) => Math.max(0, prev - 1));
                          }}
                        >
                          ← Previous
                        </button>

                        <button
                          className="la-card-btn master-btn"
                          onClick={() => {
                            if (!masteredCards.includes(currentCardIndex)) {
                              setMasteredCards([...masteredCards, currentCardIndex]);
                            }
                          }}
                        >
                          <BookmarkCheck size={14} /> Mastered
                        </button>

                        <button
                          className="la-card-btn"
                          disabled={currentCardIndex === flashcardsDeck.length - 1}
                          onClick={() => {
                            setIsFlipped(false);
                            setCurrentCardIndex((prev) => Math.min(flashcardsDeck.length - 1, prev + 1));
                          }}
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MODE 4: QUIZ */}
                  {activeFormat === "quiz" && (
                    <div className="la-quiz-view">
                      <div className="la-quiz-header-bar">
                        <span>Placement Preparation Quiz ({quizQuestions.length} Questions)</span>
                        <span className="la-quiz-score-pill">
                          {quizSubmitted
                            ? `Score: ${Object.entries(quizAnswers).filter(([idx, ans]) => quizQuestions[Number(idx)].correct === ans).length} / ${quizQuestions.length}`
                            : "In Progress"}
                        </span>
                      </div>

                      {quizQuestions.map((q, idx) => {
                        const selectedAnswer = quizAnswers[idx];
                        const isAnswered = selectedAnswer !== undefined;

                        return (
                          <div key={q.id} className="la-quiz-question-box">
                            <div className="la-quiz-q-title">
                              {idx + 1}. {q.q}
                            </div>

                            <div className="la-quiz-options-list">
                              {q.options.map((opt, optIdx) => {
                                const isCorrect = q.correct === optIdx;
                                const isUserSelected = selectedAnswer === optIdx;

                                let statusClass = "";
                                if (isAnswered) {
                                  if (isUserSelected && isCorrect) statusClass = "correct";
                                  else if (isUserSelected && !isCorrect) statusClass = "wrong";
                                  else if (isCorrect) statusClass = "correct";
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    className={`la-quiz-option-btn ${statusClass}`}
                                    onClick={() => {
                                      if (!isAnswered) {
                                        setQuizAnswers((prev) => ({ ...prev, [idx]: optIdx }));
                                      }
                                    }}
                                  >
                                    <span style={{ fontWeight: 700, opacity: 0.7 }}>
                                      {String.fromCharCode(65 + optIdx)}.
                                    </span>
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {isAnswered && (
                              <div className="la-quiz-explain-card">
                                <strong style={{ color: "#38bdf8" }}>Explanation: </strong>
                                {q.explain}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                        <button
                          className="la-mini-btn"
                          onClick={() => {
                            setQuizAnswers({});
                            setQuizSubmitted(false);
                          }}
                        >
                          <RotateCcw size={13} /> Retake Quiz
                        </button>
                      </div>
                    </div>
                  )}

                  {/* MODE 5: INFOGRAPHIC */}
                  {activeFormat === "infographic" && (
                    <div className="la-infographic-view">
                      <div className="la-info-grid">
                        {/* Comparison Card: Paging vs Segmentation */}
                        <div className="la-info-card">
                          <div className="la-info-card-header">
                            <LayoutGrid size={16} />
                            <span>Paging vs. Segmentation</span>
                          </div>
                          <table className="la-info-table">
                            <thead>
                              <tr>
                                <th>Parameter</th>
                                <th>Paging</th>
                                <th>Segmentation</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>Block Size</td>
                                <td>Fixed (e.g. 4KB)</td>
                                <td>Variable size</td>
                              </tr>
                              <tr>
                                <td>Fragmentation</td>
                                <td>Internal only</td>
                                <td>External only</td>
                              </tr>
                              <tr>
                                <td>User View</td>
                                <td>Hidden from user</td>
                                <td>Matches user modules</td>
                              </tr>
                              <tr>
                                <td>Hardware</td>
                                <td>Page Table / TLB</td>
                                <td>Segment Table / Base+Limit</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Coffman 4 Conditions Matrix */}
                        <div className="la-info-card">
                          <div className="la-info-card-header" style={{ color: "#f87171" }}>
                            <HelpCircle size={16} />
                            <span>Deadlock Coffman Conditions</span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12 }}>
                            <div style={{ background: "#0b1120", padding: 8, borderRadius: 6, border: "1px solid #1e293b" }}>
                              <strong style={{ color: "#f87171" }}>1. Mutual Exclusion:</strong> Non-shareable resource locks.
                            </div>
                            <div style={{ background: "#0b1120", padding: 8, borderRadius: 6, border: "1px solid #1e293b" }}>
                              <strong style={{ color: "#fbbf24" }}>2. Hold and Wait:</strong> Process holds 1 resource and requests more.
                            </div>
                            <div style={{ background: "#0b1120", padding: 8, borderRadius: 6, border: "1px solid #1e293b" }}>
                              <strong style={{ color: "#38bdf8" }}>3. No Preemption:</strong> Resources can only be released voluntarily.
                            </div>
                            <div style={{ background: "#0b1120", padding: 8, borderRadius: 6, border: "1px solid #1e293b" }}>
                              <strong style={{ color: "#a855f7" }}>4. Circular Wait:</strong> P0 → P1 → P2 → P0 cyclic wait dependency.
                            </div>
                          </div>
                        </div>

                        {/* Process State Transition Diagram */}
                        <div className="la-info-card" style={{ gridColumn: "1 / -1" }}>
                          <div className="la-info-card-header" style={{ color: "#34d399" }}>
                            <Share2 size={16} />
                            <span>Process State Machine Flow</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: "12px 6px" }}>
                            <div style={{ background: "#172554", border: "1px solid #2563eb", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                              <strong style={{ display: "block", color: "#93c5fd", fontSize: 13 }}>NEW</strong>
                              <span style={{ fontSize: 10, color: "#60a5fa" }}>created in disk</span>
                            </div>
                            <span style={{ color: "#64748b", fontWeight: 700 }}>→ Admitted →</span>
                            <div style={{ background: "#1e1b4b", border: "1px solid #6366f1", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                              <strong style={{ display: "block", color: "#c7d2fe", fontSize: 13 }}>READY</strong>
                              <span style={{ fontSize: 10, color: "#818cf8" }}>in Ready Queue</span>
                            </div>
                            <span style={{ color: "#64748b", fontWeight: 700 }}>→ Dispatched →</span>
                            <div style={{ background: "#064e3b", border: "1px solid #059669", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                              <strong style={{ display: "block", color: "#6ee7b7", fontSize: 13 }}>RUNNING</strong>
                              <span style={{ fontSize: 10, color: "#34d399" }}>on CPU</span>
                            </div>
                            <span style={{ color: "#64748b", fontWeight: 700 }}>→ Exit →</span>
                            <div style={{ background: "#312e81", border: "1px solid #4338ca", borderRadius: 8, padding: "8px 16px", textAlign: "center" }}>
                              <strong style={{ display: "block", color: "#e0e7ff", fontSize: 13 }}>TERMINATED</strong>
                              <span style={{ fontSize: 10, color: "#a5b4fc" }}>PCB freed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODE 6: YOUTUBE RECOMMENDATIONS */}
                  {activeFormat === "youtube" && (
                    <div className="la-youtube-view">
                      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 4 }}>
                        Top Curated High-Yield Lectures & Visual Walkthroughs for <strong>{topicTitle}</strong>
                      </div>

                      {youtubeVideos.map((vid, idx) => (
                        <div key={idx} className="la-yt-card">
                          <div className="la-yt-thumb-wrap">
                            <div className="la-yt-play-overlay">
                              <Play size={16} fill="#ffffff" />
                            </div>
                            <span className="la-yt-duration-badge">{vid.duration}</span>
                          </div>

                          <div className="la-yt-info">
                            <div className="la-yt-title">{vid.title}</div>
                            <div className="la-yt-channel">
                              <span>{vid.channel}</span> • <span style={{ color: "#fbbf24" }}>{vid.rating}</span>
                            </div>
                            <div className="la-yt-meta">
                              <span>{vid.views}</span>
                              <div style={{ display: "flex", gap: 4 }}>
                                {vid.tags.map((t, tIdx) => (
                                  <span
                                    key={tIdx}
                                    style={{
                                      fontSize: 10,
                                      background: "rgba(255,255,255,0.08)",
                                      padding: "1px 6px",
                                      borderRadius: 4
                                    }}
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <a
                            href={vid.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="la-yt-watch-btn"
                          >
                            <span>Watch</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Conversation Messages Thread if user interacted in chat */}
            {messages.length > 1 && (
              <div className="la-chat-thread" style={{ marginTop: 14 }}>
                {messages.slice(1).map((msg, i) => (
                  <div key={i} className={`la-chat-bubble ${msg.sender}`}>
                    <div>{msg.text}</div>
                    {msg.citation && (
                      <div style={{ fontSize: 10, opacity: 0.75, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                        <BookmarkCheck size={11} /> {msg.citation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky Bottom Chat / Query Bar (Matches Reference Image) */}
          <div className="la-bottom-chat-bar">
            <div className="la-ai-graphic-badge" title="Learning Agent AI Assistant">
              <span className="la-ai-graphic-glow" />
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="la-ai-graphic-svg">
                <defs>
                  <linearGradient id="aiPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                  <linearGradient id="aiCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="9.5" stroke="url(#aiPulseGrad)" strokeWidth="1.5" strokeDasharray="3 2" />
                <circle cx="12" cy="12" r="4.5" fill="url(#aiCoreGrad)" />
                <circle cx="12" cy="4.5" r="1.5" fill="#38bdf8" />
                <circle cx="12" cy="19.5" r="1.5" fill="#c084fc" />
                <circle cx="4.5" cy="12" r="1.5" fill="#818cf8" />
                <circle cx="19.5" cy="12" r="1.5" fill="#38bdf8" />
                <circle cx="12" cy="12" r="2" fill="#ffffff" />
              </svg>
            </div>
            <input
              type="text"
              className="la-chat-input"
              placeholder="Ask your learning agent or create study material..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendPrompt();
                }
              }}
            />
            <button
              type="button"
              className="la-chat-send-btn"
              onClick={() => handleSendPrompt()}
              aria-label="Send query to learning agent"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </main>

        {/* ===================================================================
            COLUMN 3: Create Study Material (Right)
            =================================================================== */}
        <aside className="la-column la-create-col">
          <div className="la-col-header">
            <div className="la-col-header-icon" style={{ background: "rgba(56, 189, 248, 0.12)", color: "#38bdf8" }}>
              <Wand2 size={18} />
            </div>
            <div>
              <h2 className="la-col-title">Create Study Material</h2>
              <p className="la-col-subtitle">Choose an output format for your learning content</p>
            </div>
          </div>

          {/* 6 Format Option Cards */}
          <div className="la-create-options-list">
            {/* 1. Overview */}
            <button
              type="button"
              className={`la-format-card ${activeFormat === "overview" ? "active" : ""}`}
              onClick={() => handleSelectFormat("overview")}
            >
              <div className="la-format-icon-badge overview">
                <FileText size={18} />
              </div>
              <div className="la-format-info">
                <div className="la-format-title">Overview</div>
                <div className="la-format-desc">Get a concise summary with key concepts and takeaways.</div>
              </div>
              <ChevronRight size={16} className="la-format-arrow" />
            </button>

            {/* 2. Mind Map */}
            <button
              type="button"
              className={`la-format-card ${activeFormat === "mindmap" ? "active" : ""}`}
              onClick={() => handleSelectFormat("mindmap")}
            >
              <div className="la-format-icon-badge mindmap">
                <Share2 size={18} />
              </div>
              <div className="la-format-info">
                <div className="la-format-title">Mind Map</div>
                <div className="la-format-desc">Visualize concepts and relationships with a structured mind map.</div>
              </div>
              <ChevronRight size={16} className="la-format-arrow" />
            </button>

            {/* 3. Flashcards */}
            <button
              type="button"
              className={`la-format-card ${activeFormat === "flashcards" ? "active" : ""}`}
              onClick={() => handleSelectFormat("flashcards")}
            >
              <div className="la-format-icon-badge flashcards">
                <Layers size={18} />
              </div>
              <div className="la-format-info">
                <div className="la-format-title">Flashcards</div>
                <div className="la-format-desc">Create interactive flashcards for better retention.</div>
              </div>
              <ChevronRight size={16} className="la-format-arrow" />
            </button>

            {/* 4. Quiz */}
            <button
              type="button"
              className={`la-format-card ${activeFormat === "quiz" ? "active" : ""}`}
              onClick={() => handleSelectFormat("quiz")}
            >
              <div className="la-format-icon-badge quiz">
                <HelpCircle size={18} />
              </div>
              <div className="la-format-info">
                <div className="la-format-title">Quiz</div>
                <div className="la-format-desc">Test your understanding with practice questions.</div>
              </div>
              <ChevronRight size={16} className="la-format-arrow" />
            </button>

            {/* 5. Infographic */}
            <button
              type="button"
              className={`la-format-card ${activeFormat === "infographic" ? "active" : ""}`}
              onClick={() => handleSelectFormat("infographic")}
            >
              <div className="la-format-icon-badge infographic">
                <LayoutGrid size={18} />
              </div>
              <div className="la-format-info">
                <div className="la-format-title">Infographic</div>
                <div className="la-format-desc">Get a visual infographic for quick learning.</div>
              </div>
              <ChevronRight size={16} className="la-format-arrow" />
            </button>

            {/* 6. YouTube Recommendations */}
            <button
              type="button"
              className={`la-format-card ${activeFormat === "youtube" ? "active" : ""}`}
              onClick={() => handleSelectFormat("youtube")}
            >
              <div className="la-format-icon-badge youtube">
                <PlayCircle size={18} />
              </div>
              <div className="la-format-info">
                <div className="la-format-title">YouTube Recommendations</div>
                <div className="la-format-desc">Discover relevant video resources for this topic.</div>
              </div>
              <ChevronRight size={16} className="la-format-arrow" />
            </button>
          </div>

          {/* Right Column Footer (Matches Screenshot) */}
          <div className="la-create-col-footer">
            <div className="la-col-footer-item">
              <FileText size={14} />
              <span>1 Source Selected</span>
            </div>
            <div className="la-col-footer-item">
              <Clock size={14} />
              <span>Est. Generation Time 1-2 minutes</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ===================================================================
          MODAL: Add Source
          =================================================================== */}
      {isAddSourceOpen && (
        <div className="la-modal-backdrop" onClick={() => setIsAddSourceOpen(false)}>
          <div className="la-modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="la-modal-header">
              <span className="la-modal-title">Add Study Source</span>
              <button className="la-modal-close-btn" onClick={() => setIsAddSourceOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <div className="la-modal-body">
              <div className="la-modal-tabs">
                <button
                  type="button"
                  className={`la-modal-tab-btn ${addSourceTab === "upload" ? "active" : ""}`}
                  onClick={() => setAddSourceTab("upload")}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  className={`la-modal-tab-btn ${addSourceTab === "paste" ? "active" : ""}`}
                  onClick={() => setAddSourceTab("paste")}
                >
                  Paste Text
                </button>
                <button
                  type="button"
                  className={`la-modal-tab-btn ${addSourceTab === "link" ? "active" : ""}`}
                  onClick={() => setAddSourceTab("link")}
                >
                  Add Link
                </button>
              </div>

              {addSourceTab === "upload" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label style={{ fontSize: 12, color: "#94a3b8" }}>Source Title / Subject</label>
                  <input
                    type="text"
                    className="la-modal-input-field"
                    placeholder="e.g. Computer Networks Chapter 4"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <div
                    className="la-dropzone"
                    style={{ marginTop: 6 }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud size={24} style={{ color: "#38bdf8" }} />
                    <span style={{ fontSize: 12, color: "#f1f5f9" }}>Click or drag a file here</span>
                    <span style={{ fontSize: 11, color: "#64748b" }}>PDF, DOCX, TXT up to 50MB</span>
                  </div>
                </div>
              )}

              {addSourceTab === "paste" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label style={{ fontSize: 12, color: "#94a3b8" }}>Notes Title</label>
                  <input
                    type="text"
                    className="la-modal-input-field"
                    placeholder="e.g. System Design Cheat Sheet"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <label style={{ fontSize: 12, color: "#94a3b8" }}>Paste Content</label>
                  <textarea
                    className="la-modal-input-field"
                    rows={6}
                    placeholder="Paste lecture transcript, summary notes, or code explanations..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                  />
                </div>
              )}

              {addSourceTab === "link" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label style={{ fontSize: 12, color: "#94a3b8" }}>Resource Name</label>
                  <input
                    type="text"
                    className="la-modal-input-field"
                    placeholder="e.g. Official React Documentation"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <label style={{ fontSize: 12, color: "#94a3b8" }}>Web URL</label>
                  <input
                    type="url"
                    className="la-modal-input-field"
                    placeholder="https://example.com/notes"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="la-modal-footer">
              <button className="la-modal-btn-cancel" onClick={() => setIsAddSourceOpen(false)}>
                Cancel
              </button>
              <button className="la-modal-btn-submit" onClick={handleAddSourceSubmit}>
                Load Source into Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
