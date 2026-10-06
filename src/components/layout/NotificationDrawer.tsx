import React, { useState, useEffect } from "react";
import { X, CheckCheck, Briefcase, BookOpen, ClipboardCheck, AlertCircle } from "lucide-react";
import { NotificationItem, Page } from "../../types";

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (page: Page) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}) => {
  const [filter, setFilter] = useState<"all" | "unread">("all");

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

  const displayList = notifications.filter((n) => (filter === "unread" ? !n.read : true));

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "drive":
        return <Briefcase size={16} />;
      case "workshop":
        return <BookOpen size={16} />;
      case "assessment":
        return <ClipboardCheck size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const getTargetPage = (type: NotificationItem["type"]): Page => {
    switch (type) {
      case "drive":
        return "Placement Drives";
      case "workshop":
        return "Workshops";
      case "assessment":
        return "Assessments";
      default:
        return "Dashboard";
    }
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} aria-hidden="true" />
      <aside className="slide-drawer" role="dialog" aria-label="Notifications Panel">
        <div className="modal-header-bar">
          <div>
            <h2>Notifications</h2>
            <p style={{ fontSize: 12, color: "var(--cp-grey-500)", marginTop: 2 }}>
              Placement alerts, interventions, and schedule updates
            </p>
          </div>
          <button className="btn-ghost" onClick={onClose} aria-label="Close notifications">
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--cp-grey-200)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilter("all")}
            >
              All ({notifications.length})
            </button>
            <button
              className={`btn btn-sm ${filter === "unread" ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setFilter("unread")}
            >
              Unread ({notifications.filter((n) => !n.read).length})
            </button>
          </div>

          <button
            className="btn btn-sm btn-ghost"
            style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}
            onClick={onMarkAllAsRead}
          >
            <CheckCheck size={14} />
            <span>Mark all read</span>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px" }}>
          {displayList.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 10px", color: "var(--cp-grey-500)", fontSize: 13 }}>
              No notifications to display.
            </div>
          ) : (
            displayList.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: "14px 12px",
                  borderRadius: "var(--cp-radius-sm)",
                  border: "1px solid var(--cp-grey-200)",
                  backgroundColor: item.read ? "var(--cp-white)" : "var(--cp-grey-50)",
                  marginBottom: 10,
                  cursor: "pointer",
                  transition: "border-color 150ms ease"
                }}
                onClick={() => {
                  onSelectNotification(getTargetPage(item.type));
                  onClose();
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 4,
                      background: "var(--cp-grey-100)",
                      display: "grid",
                      placeItems: "center",
                      color: "var(--cp-grey-800)"
                    }}
                  >
                    {getIcon(item.type)}
                  </div>
                  <b style={{ fontSize: 13, color: "var(--cp-black)" }}>{item.title}</b>
                  {!item.read && (
                    <span
                      style={{
                        marginLeft: "auto",
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        backgroundColor: "var(--cp-black)"
                      }}
                    />
                  )}
                </div>
                <p style={{ fontSize: 12, color: "var(--cp-grey-600)", lineHeight: 1.4, margin: "4px 0" }}>
                  {item.message}
                </p>
                <span style={{ fontSize: 10, color: "var(--cp-grey-500)", display: "block" }}>
                  {item.time}
                </span>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
};
