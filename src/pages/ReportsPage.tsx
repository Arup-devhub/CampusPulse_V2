import React, { useState } from "react";
import { BarChart3, Download, FileText, Filter, Calendar, CheckCircle2 } from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

const branchConversionData = [
  { branch: "CSE", placed: 78, total: 100 },
  { branch: "IT", placed: 72, total: 100 },
  { branch: "ECE", placed: 58, total: 100 },
  { branch: "EEE", placed: 49, total: 100 },
  { branch: "Mech", placed: 42, total: 100 }
];

const outcomeMixData = [
  { name: "Placed", value: 52, color: "#111111" },
  { name: "In Interviews", value: 18, color: "#4a4a4a" },
  { name: "Placement Ready", value: 20, color: "#808080" },
  { name: "At Risk", value: 10, color: "#d4d4d4" }
];

export const ReportsPage: React.FC = () => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const reportsList = [
    { name: "Institutional Placement Conversion Report", updated: "Yesterday", size: "2.4 MB" },
    { name: "Company-Wise Student Readiness Audit", updated: "3 days ago", size: "1.8 MB" },
    { name: "College Workshop Intervention & Impact Report", updated: "4 days ago", size: "1.1 MB" },
    { name: "Probabilistic AI Proctoring Flag Summary", updated: "1 week ago", size: "860 KB" },
    { name: "Departmental Skill-Gap Variance Report", updated: "2 weeks ago", size: "3.2 MB" }
  ];

  const handleDownloadReport = (name: string) => {
    const reportContent = `CAMPUSPULSE INSTITUTIONAL AUDIT REPORT\n` +
      `==========================================\n` +
      `Title: ${name}\n` +
      `Timestamp: ${new Date().toISOString()}\n` +
      `Directorate: University Placement & Training Directorate\n\n` +
      `EXECUTIVE SUMMARY:\n` +
      `- Total Batch Candidates: 1,248\n` +
      `- Verified Placement Offers: 584 (46.8% conversion)\n` +
      `- Placement Readiness Index: 74% avg across CSE/IT\n` +
      `- High Priority Interventions Conducted: 8 Workshops\n\n` +
      `BRANCH CONVERSION BREAKDOWN:\n` +
      `- Computer Science & Engineering (CSE): 78% placed\n` +
      `- Information Technology (IT): 72% placed\n` +
      `- Electronics & Communication (ECE): 58% placed\n` +
      `- Electrical & Electronics (EEE): 49% placed\n` +
      `- Mechanical Engineering: 42% placed\n\n` +
      `[CampusPulse Governance & NAAC Accreditation Compliance Verified]`;

    const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name.toLowerCase().replace(/\s+/g, "_") + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Downloaded "${name}"`);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Placement Intelligence Analytics</span>
          <h1 className="page-title">Institutional Placement & Readiness Reports</h1>
          <p className="page-description">
            Branch-wise hiring conversions, outcome distributions, and official auditable documentation.
          </p>
        </div>

        <div className="page-actions-group">
          <button
            className="btn btn-primary"
            onClick={() => handleDownloadReport("Comprehensive Placement Digest")}
          >
            <Download size={15} /> Export Complete Digest
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="auth-alert-banner success" style={{ marginBottom: 16 }}>
          <CheckCircle2 size={16} />
          <span style={{ fontSize: 13 }}>{downloadSuccess}</span>
        </div>
      )}

      <div className="grid-2col">
        {/* Branch Conversion Chart */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Branch-Wise Conversion Rates (%)</h3>
              <p>Percentage of eligible cohort receiving confirmed placement offers</p>
            </div>
          </div>

          <div style={{ height: 260, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchConversionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#666", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111",
                    border: "none",
                    borderRadius: 6,
                    color: "#fff",
                    fontSize: 12
                  }}
                />
                <Bar dataKey="placed" fill="#111111" radius={[4, 4, 0, 0]} name="Placed %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Outcome Mix Donut Chart */}
        <div className="cp-card">
          <div className="card-title-bar">
            <div>
              <h3>Placement Status Distribution</h3>
              <p>Current candidate cohort stage breakdown</p>
            </div>
          </div>

          <div style={{ height: 260, width: "100%", display: "flex", alignItems: "center" }}>
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={outcomeMixData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {outcomeMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "40%", fontSize: 12 }}>
              {outcomeMixData.map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
                  <span style={{ color: "var(--cp-grey-700)" }}>{item.name}</span>
                  <b style={{ marginLeft: "auto", color: "var(--cp-black)" }}>{item.value}%</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Downloadable Institutional Reports Table */}
      <div className="cp-card" style={{ marginTop: 24 }}>
        <div className="card-title-bar">
          <div>
            <h3>Generated Operational & Readiness Reports</h3>
            <p>Downloadable institutional records for governance and NAAC compliance</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {reportsList.map((rep, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 10px",
                borderBottom: idx === reportsList.length - 1 ? "none" : "1px solid var(--cp-grey-100)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 4,
                    background: "var(--cp-grey-100)",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--cp-grey-800)"
                  }}
                >
                  <FileText size={16} />
                </div>
                <div>
                  <b style={{ fontSize: 13, color: "var(--cp-black)", display: "block" }}>{rep.name}</b>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>
                    Generated {rep.updated} · {rep.size} · Standard PDF
                  </span>
                </div>
              </div>

              <button
                className="btn btn-sm btn-secondary"
                onClick={() => handleDownloadReport(rep.name)}
              >
                <Download size={13} /> Download Report
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
