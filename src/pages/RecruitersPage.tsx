import React, { useState } from "react";
import { Building2, Briefcase, Mail, MapPin, ExternalLink, Plus, X, CheckCircle2 } from "lucide-react";
import { initialCompanies } from "../data/mockData";
import { Company } from "../types";

export const RecruitersPage: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [filter, setFilter] = useState("All");
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [activePartner, setActivePartner] = useState<Company | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [industry, setIndustry] = useState("Information Technology");
  const [location, setLocation] = useState("Bengaluru, India");
  const [contact, setContact] = useState("");
  const [avgPkg, setAvgPkg] = useState("₹7.5 LPA");

  const filtered = companies.filter(
    (c) => filter === "All" || c.status === filter
  );

  const handleAddPartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;

    const newCompany: Company = {
      id: `cmp-${Date.now()}`,
      name,
      industry,
      location,
      openRoles: 3,
      activeDrives: 1,
      avgPackage: avgPkg,
      status: "Active Partner",
      recruiterContact: contact
    };

    setCompanies((prev) => [newCompany, ...prev]);
    setIsAddPartnerOpen(false);
    setName("");
    setContact("");
  };

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
          <button className="btn btn-primary" onClick={() => setIsAddPartnerOpen(true)}>
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
                <th>Recruiter Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cmp) => (
                <tr key={cmp.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "var(--cp-radius-sm)",
                          background: "var(--cp-grey-900)",
                          color: "var(--cp-white)",
                          display: "grid",
                          placeItems: "center",
                          fontSize: 12,
                          fontWeight: 700
                        }}
                      >
                        {cmp.name[0]}
                      </div>
                      <b>{cmp.name}</b>
                    </div>
                  </td>
                  <td>{cmp.industry}</td>
                  <td>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--cp-grey-700)" }}>
                      <MapPin size={13} style={{ color: "var(--cp-grey-400)" }} />
                      {cmp.location}
                    </span>
                  </td>
                  <td>{cmp.openRoles} Positions</td>
                  <td>
                    <b>{cmp.activeDrives}</b>
                  </td>
                  <td>
                    <b>{cmp.avgPackage}</b>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        cmp.status === "Active Partner" ? "badge-ready" : "badge-neutral"
                      }`}
                    >
                      {cmp.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: "var(--cp-grey-600)" }}>
                      {cmp.recruiterContact}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() => setActivePartner(cmp)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD CORPORATE PARTNER MODAL */}
      {isAddPartnerOpen && (
        <div className="modal-backdrop-layer" onClick={() => setIsAddPartnerOpen(false)} role="dialog" aria-modal="true">
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()} style={{ width: "min(520px, 94vw)" }}>
            <div className="modal-header-bar">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Building2 size={18} />
                <div>
                  <h2>Add Corporate Partner</h2>
                  <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>Onboard new campus employer</span>
                </div>
              </div>
              <button className="btn-ghost" onClick={() => setIsAddPartnerOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPartnerSubmit}>
              <div className="modal-body-scroll">
                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Microsoft India, Amazon, L&T"
                    required
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-group">
                    <label className="form-label">Industry</label>
                    <input
                      type="text"
                      className="form-input"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Average CTC</label>
                    <input
                      type="text"
                      className="form-input"
                      value={avgPkg}
                      onChange={(e) => setAvgPkg(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 12 }}>
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Lead Recruiter Contact / Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="campus.recruiting@company.com"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer-bar">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAddPartnerOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Corporate Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PARTNER DETAILS MODAL */}
      {activePartner && (
        <div className="modal-backdrop-layer" onClick={() => setActivePartner(null)} role="dialog" aria-modal="true">
          <div className="modal-card-box" onClick={(e) => e.stopPropagation()} style={{ width: "min(540px, 94vw)" }}>
            <div className="modal-header-bar">
              <div>
                <h2>{activePartner.name}</h2>
                <span style={{ fontSize: 12, color: "var(--cp-grey-500)" }}>{activePartner.industry} · {activePartner.location}</span>
              </div>
              <button className="btn-ghost" onClick={() => setActivePartner(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-body-scroll">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: 14, background: "var(--cp-grey-50)", borderRadius: "var(--cp-radius-sm)", marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>Open Roles</span>
                  <b style={{ display: "block", fontSize: 14 }}>{activePartner.openRoles} Active Profiles</b>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>Average CTC</span>
                  <b style={{ display: "block", fontSize: 14 }}>{activePartner.avgPackage}</b>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>Status</span>
                  <span className="badge badge-ready">{activePartner.status}</span>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--cp-grey-500)" }}>Contact</span>
                  <span style={{ fontSize: 12, color: "var(--cp-grey-800)" }}>{activePartner.recruiterContact}</span>
                </div>
              </div>

              <div>
                <span className="eyebrow-tag">Partnership Engagement</span>
                <p style={{ fontSize: 13, color: "var(--cp-grey-700)", lineHeight: 1.5, marginTop: 4 }}>
                  Engaged for annual campus recruitment. Eligible students undergo stage-wise screening consisting of diagnostic coding assessment, technical interview defense, and direct selection.
                </p>
              </div>
            </div>

            <div className="modal-footer-bar">
              <button className="btn btn-primary" onClick={() => setActivePartner(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
