import React from "react";
import { Check, Circle } from "lucide-react";
import { PasswordRule } from "../../utils/validation";

interface PasswordRequirementsChecklistProps {
  rules: PasswordRule[];
}

export const PasswordRequirementsChecklist: React.FC<PasswordRequirementsChecklistProps> = ({ rules }) => {
  return (
    <div
      className="password-requirements-box"
      style={{
        marginTop: 8,
        padding: "10px 12px",
        borderRadius: "var(--cp-radius-sm)",
        background: "var(--cp-surface-subtle, var(--cp-grey-50))",
        border: "1px solid var(--cp-border, var(--cp-grey-200))",
        fontSize: 12,
      }}
      aria-label="Password requirements"
    >
      <div
        style={{
          fontWeight: 600,
          color: "var(--cp-text-secondary, var(--cp-grey-700))",
          marginBottom: 6,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        Password Requirements:
      </div>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 5,
        }}
      >
        {rules.map((rule) => (
          <li
            key={rule.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: rule.satisfied
                ? "var(--cp-text, var(--cp-black))"
                : "var(--cp-text-tertiary, var(--cp-grey-500))",
              transition: "color 0.15s ease",
            }}
          >
            {rule.satisfied ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: "var(--cp-success, #10b981)",
                  color: "#ffffff",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <Check size={10} strokeWidth={3} />
              </span>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 14,
                  height: 14,
                  color: "var(--cp-grey-400)",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <Circle size={10} strokeWidth={2} />
              </span>
            )}
            <span
              style={{
                textDecoration: rule.satisfied ? "none" : "none",
                fontWeight: rule.satisfied ? 500 : 400,
              }}
            >
              {rule.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
