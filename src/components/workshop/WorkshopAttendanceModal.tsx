import React, { useEffect, useState } from "react";
import { CheckCircle2, Users, TrendingUp, X, Award } from "lucide-react";
import { WorkshopCohort } from "../../types";

interface WorkshopAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop: WorkshopCohort;
}

export const WorkshopAttendanceModal: React.FC<WorkshopAttendanceModalProps> = ({
  isOpen,
  onClose,
  workshop
}) => {
  const [attendance, setAttendance] = useState([
    { name: "Priyanshu Dash", regNo: "2101297042", status: "Present", checkIn: "10:02 AM", scoreBefore: 54, scoreAfter: 78 },
    { name: "Aarav Sharma", regNo: "2101297011", status: "Present", checkIn: "10:04 AM", scoreBefore: 52, scoreAfter: 74 },
    { name: "Sneha Mohanty", regNo: "2101297089", status: "Present", checkIn: "10:01 AM", scoreBefore: 60, scoreAfter: 82 },
    { name: "Rohan Verma", regNo: "2101297055", status: "Absent", checkIn: "—", scoreBefore: 48, scoreAfter: 48 },
    { name: "Debashis Nayak", regNo: "2101297034", status: "Present", checkIn: "10:08 AM", scoreBefore: 50, scoreAfter: 72 }
  ]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleStatus = (idx: number) => {
    setAttendance((prev) =>
      prev.map((row, i) =>
        i === idx
          ? {
              ...row,
              status: row.status === "Present" ? "Absent" : "Present",
              checkIn: row.status === "Present" ? "—" : "10:12 AM"
            }
          : row
      )
    );
  };

  return (
    <div className="modal-backdrop-layer" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card-box modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-bar">
          <div>
            <h2>{workshop.title} — Intervention Impact & Attendance</h2>
            <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
              {workshop.linkedDrive} · Held on {workshop.date} ({workshop.deliveryMode})
            </span>
          </div>
          <button className="btn-ghost" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-scroll">
          {/* Cohort impact metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
              padding: "18px",
              background: "var(--cp-grey-50)",
              border: "1px solid var(--cp-grey-200)",
              borderRadius: "var(--cp-radius-md)",
              marginBottom: 24
            }}
          >
            <div>
              <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>
                Target Cohort
              </span>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--cp-black)", marginTop: 2 }}>
                {workshop.capacity} Students
              </div>
              <span style={{ fontSize: 11, color: "var(--cp-grey-600)" }}>47 Registered</span>
            </div>

            <div>
              <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>
                Attended / Completed
              </span>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--cp-black)", marginTop: 2 }}>
                43 Students
              </div>
              <span style={{ fontSize: 11, color: "var(--cp-success)", fontWeight: 600 }}>89% Attendance</span>
            </div>

            <div>
              <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>
                DSA Score Change
              </span>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--cp-black)", marginTop: 2 }}>
                54% → 76%
              </div>
              <span style={{ fontSize: 11, color: "var(--cp-success)", fontWeight: 600 }}>+22 pts Descriptive Gain</span>
            </div>

            <div>
              <span style={{ fontSize: 11, color: "var(--cp-grey-500)", textTransform: "uppercase" }}>
                Company Readiness
              </span>
              <div style={{ fontSize: 24, fontWeight: 700, color: "var(--cp-black)", marginTop: 2 }}>
                61% → 73%
              </div>
              <span style={{ fontSize: 11, color: "var(--cp-success)", fontWeight: 600 }}>31 crossed threshold</span>
            </div>
          </div>

          <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="eyebrow-tag" style={{ margin: 0 }}>Roster & Attendance Log</span>
            <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
              Click status badge to toggle Present/Absent
            </span>
          </div>

          <table className="cp-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Registration No.</th>
                <th>Check-in Time</th>
                <th>Pre-Assessment</th>
                <th>Post-Assessment</th>
                <th>Improvement</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((row, idx) => (
                <tr key={idx}>
                  <td>
                    <b>{row.name}</b>
                  </td>
                  <td>
                    <code style={{ fontSize: 12 }}>{row.regNo}</code>
                  </td>
                  <td>{row.checkIn}</td>
                  <td>{row.scoreBefore}%</td>
                  <td>{row.scoreAfter}%</td>
                  <td>
                    <span className="badge badge-ready">
                      +{row.scoreAfter - row.scoreBefore} pts
                    </span>
                  </td>
                  <td>
                    <button
                      className={`badge ${row.status === "Present" ? "badge-ready" : "badge-risk"}`}
                      onClick={() => toggleStatus(idx)}
                      title="Click to toggle status"
                    >
                      {row.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="modal-footer-bar">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              alert("Readiness recalculated across active placement drives for this cohort!");
              onClose();
            }}
          >
            Recalculate Cohort Readiness
          </button>
        </div>
      </div>
    </div>
  );
};
