import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Page, Role } from "../../types";

interface AccessDeniedProps {
  attemptedPage: Page;
  userRole: Role;
  onGoToDashboard: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  attemptedPage,
  userRole,
  onGoToDashboard
}) => {
  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="access-denied-icon">
          <ShieldAlert size={36} />
        </div>
        <h2>Access denied</h2>
        <p className="access-denied-description">
          You don't have permission to access the <strong>{attemptedPage}</strong> page with your current <strong>{userRole}</strong> credentials.
        </p>
        <div style={{ marginTop: 24 }}>
          <button className="btn btn-primary" onClick={onGoToDashboard}>
            <ArrowLeft size={16} /> Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
