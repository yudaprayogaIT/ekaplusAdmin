"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaAddressBook,
  FaCheckCircle,
  FaEdit,
  FaIdBadge,
  FaPlus,
  FaTrash,
  FaUserTie,
} from "react-icons/fa";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { API_CONFIG, apiFetch, getAuthHeaders, getResourceUrl } from "@/config/api";
import { useAuth } from "@/contexts/AuthContext";
import { fetchAllQueryRows } from "@/utils/fetchAllQueryRows";
import type {
  Contact,
  ContactIdentity,
  CustomerContact,
  CustomerPosition,
} from "@/types/contact";

type ContactApiRow = {
  id: number | string;
  name?: string | null;
  full_name?: string | null;
  display_name?: string | null;
  disabled?: number | null;
};

type PositionApiRow = {
  id: number | string;
  name?: string | null;
  position_name?: string | null;
  disabled?: number | null;
};

type CustomerContactApiRow = {
  id: number | string;
  name?: string | null;
  parent_id?: number | string | null;
  parent_type?: string | null;
  contact_id?: number | string | { id?: number | string } | null;
  position_id?: number | string | { id?: number | string } | null;
  title?: string | null;
  is_primary?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
};

type IdentityApiRow = {
  id: number | string;
  contact_id?: number | string | { id?: number | string } | null;
  channel?: string | null;
  handle?: string | null;
  external_id?: string | null;
  is_verified?: number | null;
};

type RelationDraft = {
  id?: number;
  contact_id: string;
  position_id: string;
  title: string;
  is_primary: boolean;
};

type HydratedRelation = CustomerContact & {
  contact?: Contact;
  position?: CustomerPosition;
  identities: ContactIdentity[];
};

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  if (value && typeof value === "object" && "id" in value) {
    return toNumber((value as { id?: unknown }).id);
  }
  return 0;
}

function mapContact(row: ContactApiRow): Contact {
  return {
    id: toNumber(row.id),
    name: row.name || undefined,
    full_name: row.full_name || row.name || "-",
    display_name: row.display_name || undefined,
    disabled: Number(row.disabled || 0),
  };
}

function mapPosition(row: PositionApiRow): CustomerPosition {
  return {
    id: toNumber(row.id),
    name: row.name || undefined,
    position_name: row.position_name || row.name || "-",
    disabled: Number(row.disabled || 0),
  };
}

function mapRelation(row: CustomerContactApiRow): CustomerContact {
  return {
    id: toNumber(row.id),
    name: row.name || undefined,
    parent_id: toNumber(row.parent_id),
    parent_type: row.parent_type || "branch_customer",
    contact_id: toNumber(row.contact_id),
    position_id: toNumber(row.position_id),
    title: row.title || undefined,
    is_primary: Number(row.is_primary || 0),
    created_at: row.created_at || undefined,
    updated_at: row.updated_at || undefined,
  };
}

function mapIdentity(row: IdentityApiRow): ContactIdentity {
  return {
    id: toNumber(row.id),
    contact_id: toNumber(row.contact_id),
    channel: row.channel || "",
    handle: row.handle || "",
    external_id: row.external_id || undefined,
    is_verified: Number(row.is_verified || 0),
  };
}

function RelationFormModal({
  open,
  onClose,
  initial,
  onSubmit,
  saving,
  error,
  contacts,
  positions,
}: {
  open: boolean;
  onClose: () => void;
  initial: HydratedRelation | null;
  onSubmit: (payload: RelationDraft) => Promise<void>;
  saving: boolean;
  error: string | null;
  contacts: Contact[];
  positions: CustomerPosition[];
}) {
  const [draft, setDraft] = useState<RelationDraft>({
    contact_id: "",
    position_id: "",
    title: "",
    is_primary: false,
  });

  useEffect(() => {
    if (!open) return;
    setDraft({
      id: initial?.id,
      contact_id: initial?.contact_id ? String(initial.contact_id) : "",
      position_id: initial?.position_id ? String(initial.position_id) : "",
      title: initial?.title || "",
      is_primary: Number(initial?.is_primary || 0) === 1,
    });
  }, [initial, open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/60 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !saving) onClose();
          }}
        >
          <motion.form
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            onSubmit={async (event) => {
              event.preventDefault();
              await onSubmit(draft);
            }}
            className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl"
          >
            <div className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_55%),linear-gradient(135deg,#eff6ff,#ffffff_55%,#f8fafc)] px-6 py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-blue-700">
                Branch Contact Relation
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {initial ? "Edit Relasi Contact" : "Tambah Relasi Contact"}
              </h3>
            </div>

            <div className="space-y-5 p-6">
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Contact</span>
                <select
                  value={draft.contact_id}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, contact_id: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  disabled={saving}
                  required
                >
                  <option value="">Pilih contact</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={String(contact.id)}>
                      {contact.full_name}
                      {contact.display_name ? ` (${contact.display_name})` : ""}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Position</span>
                <select
                  value={draft.position_id}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, position_id: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  disabled={saving}
                  required
                >
                  <option value="">Pilih position</option>
                  {positions.map((position) => (
                    <option key={position.id} value={String(position.id)}>
                      {position.position_name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Title</span>
                <input
                  value={draft.title}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, title: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500"
                  disabled={saving}
                  placeholder="Contoh: PIC Purchasing, Decision Maker"
                />
              </label>

              <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={draft.is_primary}
                  onChange={(event) =>
                    setDraft((prev) => ({ ...prev, is_primary: event.target.checked }))
                  }
                  disabled={saving}
                />
                Jadikan primary contact
              </label>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : initial ? "Update Relasi" : "Simpan Relasi"}
              </button>
            </div>
          </motion.form>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function BCContactRelationsPanel({
  branchCustomerId,
}: {
  branchCustomerId: number;
}) {
  const { token, isAuthenticated } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [positions, setPositions] = useState<CustomerPosition[]>([]);
  const [identities, setIdentities] = useState<ContactIdentity[]>([]);
  const [relations, setRelations] = useState<CustomerContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<HydratedRelation | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  const loadData = useCallback(async () => {
    if (!isAuthenticated || !token || !branchCustomerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeaders(token);
      const [relationRows, contactRows, positionRows] = await Promise.all([
        fetchAllQueryRows<CustomerContactApiRow>({
          endpoint: API_CONFIG.ENDPOINTS.CUSTOMER_CONTACT,
          spec: {
            fields: ["*"],
            filters: [
              ["parent_type", "=", "branch_customer"],
              ["parent_id", "=", branchCustomerId],
            ],
          },
          token,
          requestInit: { headers },
          errorMessage: "Gagal memuat relasi contact",
        }),
        fetchAllQueryRows<ContactApiRow>({
          endpoint: API_CONFIG.ENDPOINTS.CONTACT,
          spec: {
            fields: ["id", "name", "full_name", "display_name", "disabled"],
          },
          token,
          requestInit: { headers },
          errorMessage: "Gagal memuat contact lookup",
        }),
        fetchAllQueryRows<PositionApiRow>({
          endpoint: API_CONFIG.ENDPOINTS.CUSTOMER_POSITION,
          spec: {
            fields: ["id", "name", "position_name", "disabled"],
          },
          token,
          requestInit: { headers },
          errorMessage: "Gagal memuat position lookup",
        }),
      ]);

      const mappedRelations: CustomerContact[] = (
        Array.isArray(relationRows) ? relationRows : []
      ).map(mapRelation);
      const relatedContactIds: number[] = Array.from(
        new Set(mappedRelations.map((item: CustomerContact) => item.contact_id).filter(Boolean)),
      );

      let mappedIdentities: ContactIdentity[] = [];
      if (relatedContactIds.length > 0) {
        const identityRows = await fetchAllQueryRows<IdentityApiRow>({
          endpoint: API_CONFIG.ENDPOINTS.CONTACT_IDENTITIES,
          spec: {
            fields: ["*"],
            filters: [["contact_id", "in", relatedContactIds]],
          },
          token,
          requestInit: { headers },
          errorMessage: "Gagal memuat contact identities",
        });
        mappedIdentities = identityRows.map(mapIdentity);
      }

      setRelations(mappedRelations);
      setContacts(contactRows.map(mapContact));
      setPositions(positionRows.map(mapPosition));
      setIdentities(mappedIdentities);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    } finally {
      setLoading(false);
    }
  }, [branchCustomerId, isAuthenticated, token]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const hydratedRelations = useMemo(() => {
    const contactMap = new Map(contacts.map((contact) => [contact.id, contact]));
    const positionMap = new Map(positions.map((position) => [position.id, position]));
    const identityMap = new Map<number, ContactIdentity[]>();

    identities.forEach((identity) => {
      const current = identityMap.get(identity.contact_id) || [];
      current.push(identity);
      identityMap.set(identity.contact_id, current);
    });

    return [...relations]
      .map((relation) => ({
        ...relation,
        contact: contactMap.get(relation.contact_id),
        position: positionMap.get(relation.position_id),
        identities: identityMap.get(relation.contact_id) || [],
      }))
      .sort((a, b) => {
        const primaryDiff = Number(b.is_primary || 0) - Number(a.is_primary || 0);
        if (primaryDiff !== 0) return primaryDiff;
        return (a.contact?.full_name || "").localeCompare(b.contact?.full_name || "");
      });
  }, [contacts, identities, positions, relations]);

  const submitRelation = async (payload: RelationDraft) => {
    if (!token) return;
    setSaving(true);
    setModalError(null);
    try {
      const response = await apiFetch(
        payload.id
          ? getResourceUrl(API_CONFIG.ENDPOINTS.CUSTOMER_CONTACT, payload.id)
          : getResourceUrl(API_CONFIG.ENDPOINTS.CUSTOMER_CONTACT),
        {
          method: payload.id ? "PUT" : "POST",
          headers: getAuthHeaders(token),
          body: JSON.stringify({
            parent_type: "branch_customer",
            parent_id: branchCustomerId,
            contact_id: Number(payload.contact_id),
            position_id: Number(payload.position_id),
            title: payload.title.trim() || null,
            is_primary: payload.is_primary ? 1 : 0,
          }),
        },
        token,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Gagal menyimpan relasi contact (${response.status})`,
        );
      }

      setModalOpen(false);
      setModalInitial(null);
      await loadData();
    } catch (submitError) {
      setModalError(
        submitError instanceof Error ? submitError.message : String(submitError),
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteRelation = (item: HydratedRelation) => {
    if (!token) return;
    actionRef.current = async () => {
      const response = await apiFetch(
        getResourceUrl(API_CONFIG.ENDPOINTS.CUSTOMER_CONTACT, item.id),
        {
          method: "DELETE",
          headers: getAuthHeaders(token),
        },
        token,
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Gagal menghapus relasi contact (${response.status})`,
        );
      }
      await loadData();
    };
    setConfirmOpen(true);
  };

  const activeContacts = contacts.filter((contact) => Number(contact.disabled || 0) !== 1);
  const activePositions = positions.filter((position) => Number(position.disabled || 0) !== 1);

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <FaAddressBook className="text-lg" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700">
              Contact Relation
            </p>
            <h3 className="text-2xl font-bold text-slate-900">Customer Contacts</h3>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setModalError(null);
            setModalInitial(null);
            setModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
        >
          <FaPlus className="text-xs" />
          Tambah Contact Relation
        </button>
      </div>

      {error ? (
        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mb-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Related Contact
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{relations.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Primary Contact
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {relations.filter((item) => Number(item.is_primary || 0) === 1).length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
            Available Lookup
          </p>
          <p className="mt-2 text-base font-semibold text-slate-900">
            {activeContacts.length} contact / {activePositions.length} position
          </p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-12 text-center text-sm text-slate-500">
          Memuat relasi contact...
        </div>
      ) : hydratedRelations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-12 text-center">
          <FaUserTie className="mx-auto text-3xl text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-700">
            Belum ada contact relation
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Tambahkan contact master yang relevan lalu hubungkan ke branch customer ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {hydratedRelations.map((relation) => (
            <div
              key={relation.id}
              className={`rounded-[24px] border p-5 shadow-sm ${
                Number(relation.is_primary || 0) === 1
                  ? "border-blue-200 bg-blue-50/50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-lg font-bold text-slate-900">
                      {relation.contact?.full_name || `Contact #${relation.contact_id}`}
                    </h4>
                    {Number(relation.is_primary || 0) === 1 ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white">
                        <FaCheckCircle className="text-[10px]" />
                        Primary
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    {relation.contact?.display_name || relation.title || "-"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setModalError(null);
                      setModalInitial(relation);
                      setModalOpen(true);
                    }}
                    className="rounded-xl border border-blue-200 p-2 text-blue-700 hover:bg-blue-50"
                  >
                    <FaEdit className="text-sm" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteRelation(relation)}
                    className="rounded-xl border border-rose-200 p-2 text-rose-700 hover:bg-rose-50"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex items-center gap-2 text-slate-500">
                    <FaIdBadge className="text-xs" />
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em]">
                      Position
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {relation.position?.position_name || `Position #${relation.position_id}`}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                    Title
                  </p>
                  <p className="mt-2 text-sm text-slate-700">{relation.title || "-"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">
                    Identity
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {relation.identities.length} channel terdaftar
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {relation.identities.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500">
                    Contact ini belum memiliki identity.
                  </div>
                ) : (
                  relation.identities.slice(0, 3).map((identity) => (
                    <div
                      key={identity.id}
                      className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {identity.channel}
                        </p>
                        <p className="text-sm text-slate-600">{identity.handle}</p>
                      </div>
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold ${
                          Number(identity.is_verified || 0) === 1
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        <FaCheckCircle className="text-[10px]" />
                        {Number(identity.is_verified || 0) === 1 ? "Verified" : "Pending"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <RelationFormModal
        open={modalOpen}
        onClose={() => {
          if (saving) return;
          setModalOpen(false);
          setModalInitial(null);
          setModalError(null);
        }}
        initial={modalInitial}
        onSubmit={submitRelation}
        saving={saving}
        error={modalError}
        contacts={activeContacts}
        positions={activePositions}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Hapus Relasi Contact"
        description="Yakin ingin menghapus relasi contact dari branch customer ini?"
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onCancel={() => {
          setConfirmOpen(false);
          actionRef.current = null;
        }}
        onConfirm={async () => {
          setConfirmOpen(false);
          const action = actionRef.current;
          actionRef.current = null;
          if (!action) return;
          try {
            await action();
          } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : String(deleteError));
          }
        }}
      />
    </section>
  );
}
