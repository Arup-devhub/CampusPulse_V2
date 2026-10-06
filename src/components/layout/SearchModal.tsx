import React, { useState, useEffect, useRef } from "react";
import { Search, X, Users, Building2, Briefcase, ClipboardCheck, ArrowRight } from "lucide-react";
import { Page } from "../../types";
import { initialStudents, initialCompanies, initialDrives, initialAssessments } from "../../data/mockData";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

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

  const q = query.toLowerCase().trim();

  const matchedStudents = q
    ? initialStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.regNo.toLowerCase().includes(q) ||
          s.branch.toLowerCase().includes(q)
      )
    : initialStudents.slice(0, 3);

  const matchedCompanies = q
    ? initialCompanies.filter(
        (c) => c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)
      )
    : initialCompanies.slice(0, 2);

  const matchedDrives = q
    ? initialDrives.filter(
        (d) => d.company.toLowerCase().includes(q) || d.role.toLowerCase().includes(q)
      )
    : initialDrives.slice(0, 2);

  return (
    <div className="modal-backdrop-layer" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card-box"
        style={{ width: "min(640px, 94vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--cp-grey-200)" }}>
          <Search size={18} style={{ color: "var(--cp-grey-500)" }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search students, companies, drives, assessments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 15,
              color: "var(--cp-black)"
            }}
          />
          <button className="btn-ghost" onClick={onClose} aria-label="Close search">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-scroll" style={{ maxHeight: "60vh", padding: "16px 20px" }}>
          {/* Students section */}
          {matchedStudents.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <span className="eyebrow-tag" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={12} /> Students ({matchedStudents.length})
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {matchedStudents.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "var(--cp-radius-sm)",
                      border: "1px solid var(--cp-grey-200)",
                      cursor: "pointer",
                      fontSize: 13
                    }}
                    onClick={() => {
                      onNavigate("Students");
                      onClose();
                    }}
                  >
                    <div>
                      <b>{s.name}</b>
                      <span style={{ color: "var(--cp-grey-500)", marginLeft: 8, fontSize: 12 }}>
                        {s.regNo} · {s.branch.split(" ")[0]} · CGPA {s.cgpa}
                      </span>
                    </div>
                    <span className={`badge ${s.risk === "Ready" ? "badge-ready" : s.risk === "Developing" ? "badge-developing" : "badge-risk"}`}>
                      {s.readiness}% {s.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Companies section */}
          {matchedCompanies.length > 0 && (
            <div style={{ marginBottom: 18 }}>
              <span className="eyebrow-tag" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Building2 size={12} /> Companies ({matchedCompanies.length})
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {matchedCompanies.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "var(--cp-radius-sm)",
                      border: "1px solid var(--cp-grey-200)",
                      cursor: "pointer",
                      fontSize: 13
                    }}
                    onClick={() => {
                      onNavigate("Recruiters");
                      onClose();
                    }}
                  >
                    <div>
                      <b>{c.name}</b>
                      <span style={{ color: "var(--cp-grey-500)", marginLeft: 8, fontSize: 12 }}>
                        {c.industry}
                      </span>
                    </div>
                    <span className="badge badge-neutral">{c.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Drives section */}
          {matchedDrives.length > 0 && (
            <div>
              <span className="eyebrow-tag" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Briefcase size={12} /> Placement Drives ({matchedDrives.length})
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                {matchedDrives.map((d) => (
                  <div
                    key={d.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "var(--cp-radius-sm)",
                      border: "1px solid var(--cp-grey-200)",
                      cursor: "pointer",
                      fontSize: 13
                    }}
                    onClick={() => {
                      onNavigate("Placement Drives");
                      onClose();
                    }}
                  >
                    <div>
                      <b>{d.company}</b>
                      <span style={{ color: "var(--cp-grey-500)", marginLeft: 8, fontSize: 12 }}>
                        {d.role} · {d.package}
                      </span>
                    </div>
                    <ArrowRight size={14} style={{ color: "var(--cp-grey-400)" }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
