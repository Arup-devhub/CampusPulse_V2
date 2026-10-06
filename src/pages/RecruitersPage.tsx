import React, { useState } from "react";
import { Building2, Briefcase, Mail, MapPin, ExternalLink, Plus } from "lucide-react";
import { initialCompanies } from "../data/mockData";
import { Company } from "../types";

export const RecruitersPage: React.FC = () => {
  const [filter, setFilter] = useState("All");

  const filtered = initialCompanies.filter(
    (c) => filter === "All" || c.status === filter
  );

  return (
    <div>
      <div className="page-header-block">
        <div>
          <span className="eyebrow-tag">Corporate Relations Hub</span>
          <h1 className="page-title">Recruiter & Company Directory</h1>
          <p className="page-description">
            Manage corporate recruiting partnerships, visit schedules, published job descriptions, and candidate eligibility criteria.
          </p>
        </div>

        <div className="page-actions-group">
          <button className="btn btn-primary" onClick={() => alert("New recruiter onboarding invitation sent.")}>
            <Plus size={15} /> Add Corporate Partner
          </button>
        </div>
      </div>

      <div className="cp-card">
        <div className="table-filter-bar">
          <div className="filter-controls">
            <select
              className="filter-select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Partnership Statuses</option>
              <option value="Active Partner">Active Partner</option>
              <option value="Visiting Soon">Visiting Soon</option>
            </select>
          </div>

          <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>
            {filtered.length} corporate recruiters connected
          </span>
        </div>

        <div className="table-container">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Industry Sector</th>
                <th>Primary Location</th>
                <th>Open Roles</th>
                <th>Active Drives</th>
                <th>Average CTC Package</th>
                <th>Status</th>
                <th>Recruitment Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cmp) => (
                <tr key={cmp.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "var(--cp-radius-sm)",
                          background: "var(--cp-near-black)",
                          color: "var(--cp-white)",
                          display: "grid",
                          placeItems: "center",
                          fontWeight: 700,
                          fontSize: 12
                        }}
                      >
                        {cmp.name[0]}
                      </div>
                      <b>{cmp.name}</b>
                    </div>
                  </td>
                  <td>{cmp.industry}</td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                      <MapPin size={13} style={{ color: "var(--cp-grey-400)" }} />
                      {cmp.location}
                    </span>
                  </td>
                  <td>
                    <b>{cmp.openRoles} roles</b>
                  </td>
                  <td>{cmp.activeDrives} active</td>
                  <td>
                    <b>{cmp.avgPackage}</b>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        cmp.status === "Active Partner" ? "badge-ready" : "badge-developing"
                      }`}
                    >
                      {cmp.status}
                    </span>
                  </td>
                  <td>
                    <a
                      href={`mailto:${cmp.recruiterContact}`}
                      style={{ fontSize: 12, color: "var(--cp-grey-700)", textDecoration: "underline" }}
                    >
                      {cmp.recruiterContact}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
