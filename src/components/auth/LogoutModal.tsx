import React, { useEffect } from "react";
import { LogOut, X } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirmLogout }) => {
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

  return (
    <div className="modal-backdrop-layer" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card-box"
        style={{ width: "min(460px, 94vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "var(--cp-radius-sm)",
                backgroundColor: "var(--cp-error-bg)",
                color: "var(--cp-error)",
                display: "grid",
                placeItems: "center"
              }}
            >
              <LogOut size={16} />
            </div>
            <h2>Log out of CampusPulse?</h2>
          </div>
          <button className="btn-ghost" onClick={onClose} aria-label="Cancel">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-scroll">
          <p style={{ fontSize: 14, color: "var(--cp-grey-700)", lineHeight: 1.5 }}>
            You will need to sign in again to access placement readiness scores, assessment results, and targeted workshops.
          </p>
        </div>

        <div className="modal-footer-bar">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirmLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
