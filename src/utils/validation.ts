export interface PasswordRule {
  id: string;
  label: string;
  satisfied: boolean;
}

export function isValidEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed) return false;
  // Standard format check: non-empty local-part @ non-empty domain . non-empty TLD
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
}

export function evaluatePassword(password: string): {
  rules: PasswordRule[];
  isValid: boolean;
} {
  const rules: PasswordRule[] = [
    {
      id: "length",
      label: "At least 8 characters long",
      satisfied: password.length >= 8,
    },
    {
      id: "uppercase",
      label: "At least one uppercase letter (A-Z)",
      satisfied: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "At least one lowercase letter (a-z)",
      satisfied: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "At least one number (0-9)",
      satisfied: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "At least one special character (e.g., !@#$%^&*)",
      satisfied: /[^A-Za-z0-9\s]/.test(password),
    },
  ];

  const isValid = rules.every((r) => r.satisfied);
  return { rules, isValid };
}
