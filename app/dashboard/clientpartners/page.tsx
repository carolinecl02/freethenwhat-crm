"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type ClientPartner = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  niche: string | null;
  phone_number: string | null;
  last_contact_date: string | null;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
};

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "email", label: "Email" },
  { key: "niche", label: "Niche" },
  { key: "phoneNumber", label: "Phone number" },
  { key: "type", label: "Type" },
  { key: "lastContactDate", label: "Last contact date" },
  { key: "status", label: "Status" },
] as const;

const TYPE_OPTIONS = [
  { value: "CP", label: "CP" },
  { value: "Referrer", label: "Referrer" },
] as const;

const STATUS_OPTIONS = [
  { value: "Identified", label: "Identified" },
  { value: "Reached out", label: "Reached out" },
  { value: "Meeting booked", label: "Meeting booked" },
  { value: "Meeting held - waiting", label: "Meeting held - waiting" },
  { value: "Meeting held - interested", label: "Meeting held - interested" },
  { value: "Meeting held - no go", label: "Meeting held - no go" },
] as const;

const defaultForm = {
  first_name: "",
  last_name: "",
  email: "",
  niche: "",
  phone_number: "",
  last_contact_date: "",
  type: "CP",
  status: "Identified",
};

function formatDate(value: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return value;
  }
}

function shortId(id: string) {
  return id.slice(0, 8);
}

function createLocalId() {
  return `cp_${Math.random().toString(36).slice(2, 10)}`;
}

const STATUS_STYLES: Record<string, string> = {
  "Identified": "bg-secondary-text/10 text-secondary-text",
  "Reached out": "bg-blue-100 text-blue-800",
  "Meeting booked": "bg-amber-100 text-amber-800",
  "Meeting held - waiting": "bg-purple-100 text-purple-800",
  "Meeting held - interested": "bg-emerald-100 text-emerald-800",
  "Meeting held - no go": "bg-red-100 text-red-800",
};

export default function ClientPartnersPage() {
  const [partners, setPartners] = useState<ClientPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<ClientPartner | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(defaultForm);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    niche: "",
    phoneNumber: "",
    lastContactDate: "",
    type: "",
    status: "",
  });

  const supabase = createClient();

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredPartners = partners.filter((p) => {
    if (filters.id && !p.id.toLowerCase().includes(filters.id.toLowerCase())) return false;
    if (filters.firstName && !p.first_name.toLowerCase().includes(filters.firstName.toLowerCase())) return false;
    if (filters.lastName && !p.last_name.toLowerCase().includes(filters.lastName.toLowerCase())) return false;
    if (filters.email && !p.email.toLowerCase().includes(filters.email.toLowerCase())) return false;
    if (filters.niche && !(p.niche || "").toLowerCase().includes(filters.niche.toLowerCase())) return false;
    if (filters.phoneNumber && !(p.phone_number || "").toLowerCase().includes(filters.phoneNumber.toLowerCase())) return false;
    if (filters.lastContactDate && p.last_contact_date !== filters.lastContactDate) return false;
    if (filters.type && p.type !== filters.type) return false;
    if (filters.status && p.status !== filters.status) return false;
    return true;
  });

  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("client_partners")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) {
      setError(err.message);
      setPartners([]);
    } else {
      setPartners((data as ClientPartner[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDetails = (partner: ClientPartner) => {
    setSelectedPartner(partner);
    setEditForm({
      first_name: partner.first_name,
      last_name: partner.last_name,
      email: partner.email,
      niche: partner.niche ?? "",
      phone_number: partner.phone_number ?? "",
      last_contact_date: partner.last_contact_date ?? "",
      type: partner.type,
      status: partner.status,
    });
    setEditError(null);
  };

  const openModal = () => {
    setForm(defaultForm);
    setFormError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError(null);
  };

  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const first_name = form.first_name.trim();
    const last_name = form.last_name.trim();
    const email = form.email.trim();
    const niche = form.niche.trim();
    const phone_number = form.phone_number.trim();

    if (!first_name || !last_name || !email) {
      setFormError("First name, last name and email are required.");
      return;
    }

    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setFormError("You must be logged in to add a client partner.");
      setSubmitting(false);
      return;
    }

    const { error: insertError } = await supabase.from("client_partners").insert({
      user_id: user.id,
      first_name,
      last_name,
      email,
      niche: niche || null,
      phone_number: phone_number || null,
      last_contact_date: form.last_contact_date || null,
      type: form.type,
      status: form.status,
    });

    setSubmitting(false);
    if (insertError) {
      setFormError(insertError.message);
      return;
    }

    closeModal();
    fetchPartners();
  };

  const handleUpdatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner) return;

    setEditError(null);

    const first_name = editForm.first_name.trim();
    const last_name = editForm.last_name.trim();
    const email = editForm.email.trim();
    const niche = editForm.niche.trim();
    const phone_number = editForm.phone_number.trim();

    if (!first_name || !last_name || !email) {
      setEditError("First name, last name and email are required.");
      return;
    }

    setEditSubmitting(true);

    const { error: updateError } = await supabase
      .from("client_partners")
      .update({
        first_name,
        last_name,
        email,
        niche: niche || null,
        phone_number: phone_number || null,
        last_contact_date: editForm.last_contact_date || null,
        type: editForm.type,
        status: editForm.status,
      })
      .eq("id", selectedPartner.id);

    setEditSubmitting(false);

    if (updateError) {
      setEditError(updateError.message);
      return;
    }

    // Keep drawer open but refresh data and reflect changes locally
    setSelectedPartner((prev) =>
      prev
        ? {
            ...prev,
            first_name,
            last_name,
            email,
            niche: niche || null,
            phone_number: phone_number || null,
            last_contact_date: editForm.last_contact_date || null,
            type: editForm.type,
            status: editForm.status,
          }
        : prev
    );
    fetchPartners();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page title + Add partner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary-text">
          Client partners
        </h1>
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent text-white font-medium px-4 py-2.5 shadow-card hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/40 transition-opacity shrink-0"
        >
          <PlusIcon className="w-5 h-5" />
          Add client partner
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-card shadow-card border border-secondary-text/5 overflow-hidden">
        {/* Filters row */}
        <div className="px-4 sm:px-5 py-4 border-b border-secondary-text/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-9 gap-3">
            <input
              type="text"
              placeholder="ID"
              value={filters.id}
              onChange={(e) => updateFilter("id", e.target.value)}
              className="rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <input
              type="text"
              placeholder="First name"
              value={filters.firstName}
              onChange={(e) => updateFilter("firstName", e.target.value)}
              className="rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <input
              type="text"
              placeholder="Last name"
              value={filters.lastName}
              onChange={(e) => updateFilter("lastName", e.target.value)}
              className="rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <input
              type="text"
              placeholder="Email"
              value={filters.email}
              onChange={(e) => updateFilter("email", e.target.value)}
              className="rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <input
              type="date"
              placeholder="Last contact date"
              value={filters.lastContactDate}
              onChange={(e) => updateFilter("lastContactDate", e.target.value)}
              className="rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <input
              type="text"
              placeholder="Niche"
              value={filters.niche}
              onChange={(e) => updateFilter("niche", e.target.value)}
              className="rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <input
              type="text"
              placeholder="Phone number"
              value={filters.phoneNumber}
              onChange={(e) => updateFilter("phoneNumber", e.target.value)}
              className="rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 placeholder-secondary-text focus:outline-none focus:ring-2 focus:ring-accent/40"
            />
            <select
              value={filters.type}
              onChange={(e) => updateFilter("type", e.target.value)}
              className="rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="">Type</option>
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="">Status</option>
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-secondary-text/10 bg-secondary-text/[0.03]">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="text-left text-xs font-semibold uppercase tracking-wider text-secondary-text px-4 sm:px-5 py-3.5 whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 sm:px-5 py-12 text-center text-secondary-text text-sm">
                    Loading…
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 sm:px-5 py-12 text-center text-red-600 text-sm">
                    {error}
                  </td>
                </tr>
              ) : filteredPartners.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="px-4 sm:px-5 py-12 text-center text-secondary-text text-sm">
                    No client partners yet. Use &quot;Add client partner&quot; to create your first one.
                  </td>
                </tr>
              ) : (
                filteredPartners.map((partner) => (
                  <tr
                    key={partner.id}
                    className="border-b border-secondary-text/5 hover:bg-secondary-text/[0.02] transition-colors"
                  >
                    <td className="px-4 sm:px-5 py-3 text-sm text-primary-text font-mono">
                      {shortId(partner.id)}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-sm text-primary-text">
                      {partner.first_name}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-sm text-primary-text">
                      {partner.last_name}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-sm text-primary-text">
                      {partner.email}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-sm text-primary-text">
                      {partner.niche || "—"}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-sm text-primary-text">
                      {partner.phone_number || "—"}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-sm text-primary-text">
                      {partner.type}
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-sm text-secondary-text">
                      {formatDate(partner.last_contact_date)}
                    </td>
                    <td className="px-4 sm:px-5 py-3">
                      <span
                        className={`
                          inline-flex text-xs font-medium px-2.5 py-1 rounded-full
                          ${STATUS_STYLES[partner.status] ?? "bg-secondary-text/10 text-secondary-text"}
                        `}
                      >
                        {partner.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => openDetails(partner)}
                        className="inline-flex items-center justify-center rounded-md border border-secondary-text/30 px-2.5 py-1.5 text-xs font-medium text-primary-text hover:bg-secondary-text/10 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add client partner modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-partner-title"
        >
          <div
            className="bg-white rounded-card shadow-card border border-secondary-text/10 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-secondary-text/10">
              <h2 id="add-partner-title" className="text-lg font-semibold text-primary-text">
                Add client partner
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-lg text-secondary-text hover:bg-secondary-text/10 hover:text-primary-text focus:outline-none focus:ring-2 focus:ring-accent/40"
                aria-label="Close"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddPartner} className="p-5 space-y-4">
              {formError && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-primary-text mb-1">
                  First name
                </label>
                <input
                  id="first_name"
                  type="text"
                  required
                  value={form.first_name}
                  onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                  className="w-full rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="Jane"
                />
              </div>
              <div>
                <label htmlFor="niche" className="block text-sm font-medium text-primary-text mb-1">
                  Niche <span className="text-secondary-text font-normal">(optional)</span>
                </label>
                <input
                  id="niche"
                  type="text"
                  value={form.niche}
                  onChange={(e) => setForm((f) => ({ ...f, niche: e.target.value }))}
                  className="w-full rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="e.g. SaaS founders"
                />
              </div>
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-primary-text mb-1">
                  Phone number <span className="text-secondary-text font-normal">(optional)</span>
                </label>
                <input
                  id="phone_number"
                  type="tel"
                  value={form.phone_number}
                  onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
                  className="w-full rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="+44 1234 567890"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-primary-text mb-1">
                  Last name
                </label>
                <input
                  id="last_name"
                  type="text"
                  required
                  value={form.last_name}
                  onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                  className="w-full rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="Smith"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary-text mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label htmlFor="last_contact_date" className="block text-sm font-medium text-primary-text mb-1">
                  Last contact date <span className="text-secondary-text font-normal">(optional)</span>
                </label>
                <input
                  id="last_contact_date"
                  type="date"
                  value={form.last_contact_date}
                  onChange={(e) => setForm((f) => ({ ...f, last_contact_date: e.target.value }))}
                  className="w-full rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-primary-text mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-primary-text mb-1">
                  Type
                </label>
                <select
                  id="type"
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full rounded-lg border border-secondary-text/20 bg-background text-primary-text text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {TYPE_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-secondary-text/20 px-4 py-2.5 text-sm font-medium text-primary-text hover:bg-secondary-text/5 focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-accent text-white px-4 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {submitting ? "Adding…" : "Add client partner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details drawer (editable) */}
      {selectedPartner && (
        <div
          className="fixed inset-0 z-40 flex justify-end bg-black/30"
          onClick={(e) => e.target === e.currentTarget && setSelectedPartner(null)}
          aria-modal="true"
          role="dialog"
        >
          <aside className="h-full w-full max-w-md bg-white border-l border-secondary-text/10 shadow-card flex flex-col">
            <header className="flex items-center justify-between px-5 py-4 border-b border-secondary-text/10">
              <div>
                <h2 className="text-lg font-semibold text-primary-text">
                  {editForm.first_name || selectedPartner.first_name}{" "}
                  {editForm.last_name || selectedPartner.last_name}
                </h2>
                <p className="text-xs text-secondary-text mt-0.5">
                  {editForm.email || selectedPartner.email}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPartner(null)}
                className="p-1.5 rounded-lg text-secondary-text hover:bg-secondary-text/10 hover:text-primary-text focus:outline-none focus:ring-2 focus:ring-accent/40"
                aria-label="Close details"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </header>

            <form onSubmit={handleUpdatePartner} className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {editError && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    {editError}
                  </p>
                )}

                <section className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-secondary-text">
                    Basic details
                  </h3>
                  <div className="bg-background rounded-card border border-secondary-text/10 px-3 py-3 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-secondary-text mb-1">
                        First name
                      </label>
                      <input
                        type="text"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm((f) => ({ ...f, first_name: e.target.value }))}
                        className="w-full rounded-lg border border-secondary-text/30 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary-text mb-1">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm((f) => ({ ...f, last_name: e.target.value }))}
                        className="w-full rounded-lg border border-secondary-text/30 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary-text mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full rounded-lg border border-secondary-text/30 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-secondary-text">
                    Partner info
                  </h3>
                  <div className="bg-background rounded-card border border-secondary-text/10 px-3 py-3 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-secondary-text mb-1">
                          Type
                        </label>
                        <select
                          value={editForm.type}
                          onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}
                          className="w-full rounded-lg border border-secondary-text/30 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                        >
                          {TYPE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-secondary-text mb-1">
                          Status
                        </label>
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm((f) => ({ ...f, status: e.target.value }))}
                          className="w-full rounded-lg border border-secondary-text/30 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                        >
                          {STATUS_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-secondary-text mb-1">
                        Last contact date
                      </label>
                      <input
                        type="date"
                        value={editForm.last_contact_date}
                        onChange={(e) => setEditForm((f) => ({ ...f, last_contact_date: e.target.value }))}
                        className="w-full rounded-lg border border-secondary-text/30 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-secondary-text">
                    Contact details
                  </h3>
                  <div className="bg-background rounded-card border border-secondary-text/10 px-3 py-3 space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-secondary-text mb-1">
                        Phone number
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone_number}
                        onChange={(e) => setEditForm((f) => ({ ...f, phone_number: e.target.value }))}
                        className="w-full rounded-lg border border-secondary-text/30 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-secondary-text">
                    Niche
                  </h3>
                  <div className="bg-background rounded-card border border-secondary-text/10 px-3 py-3">
                    <textarea
                      value={editForm.niche}
                      onChange={(e) => setEditForm((f) => ({ ...f, niche: e.target.value }))}
                      rows={3}
                      className="w-full resize-none rounded-lg border border-secondary-text/30 bg-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40"
                      placeholder="Describe their niche…"
                    />
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-secondary-text">
                    System
                  </h3>
                  <div className="bg-background rounded-card border border-secondary-text/10 px-3 py-2.5 text-xs text-secondary-text space-y-1.5">
                    <div className="flex justify-between gap-4">
                      <span>ID</span>
                      <span className="font-mono text-[11px] break-all text-primary-text">
                        {selectedPartner.id}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Created</span>
                      <span className="text-primary-text">
                        {formatDate(selectedPartner.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span>Last updated</span>
                      <span className="text-primary-text">
                        {formatDate(selectedPartner.updated_at)}
                      </span>
                    </div>
                  </div>
                </section>
              </div>

              <div className="border-t border-secondary-text/10 px-5 py-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="rounded-lg border border-secondary-text/20 px-4 py-2.5 text-sm font-medium text-primary-text hover:bg-secondary-text/5 focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="rounded-lg bg-accent text-white px-4 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-accent/40"
                >
                  {editSubmitting ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}

