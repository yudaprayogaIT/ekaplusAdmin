"use client";

import EntityDetailModal from "@/components/entity-management/EntityDetailModal";
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaClock,
  FaLayerGroup,
  FaTag,
} from "react-icons/fa";
import {
  AuthzResource,
  normalizeDescription,
  normalizeModuleName,
} from "./ResourceList";

type Props = {
  open: boolean;
  onClose: () => void;
  resource: AuthzResource | null;
};

function formatDateTime(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ResourceDetailModal({
  open,
  onClose,
  resource,
}: Props) {
  if (!open || !resource) return null;

  return (
    <EntityDetailModal
      open={open}
      onClose={onClose}
      icon={<FaBoxOpen className="h-5 w-5" />}
      eyebrow="Resource Detail"
      title={resource.Name}
      subtitle={
        <code className="inline-flex rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700">
          {resource.Slug}
        </code>
      }
      maxWidthClassName="max-w-3xl"
      accentClasses={{ iconBg: "bg-cyan-50", iconText: "text-cyan-600" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-cyan-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-cyan-700">
            <FaTag className="h-4 w-4" />
            <span className="text-sm font-semibold">ID</span>
          </div>
          <p className="text-xl font-bold text-cyan-900">#{resource.ID}</p>
        </div>

        <div className="rounded-2xl bg-emerald-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-emerald-700">
            <FaLayerGroup className="h-4 w-4" />
            <span className="text-sm font-semibold">Module</span>
          </div>
          <p className="text-base font-bold text-emerald-900">
            {normalizeModuleName(resource.Module)}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-700">
            <FaTag className="h-4 w-4" />
            <span className="text-sm font-semibold">Slug</span>
          </div>
          <p className="break-all font-mono text-sm font-bold text-slate-900">
            {resource.Slug}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Description
        </h3>
        <p className="text-sm leading-6 text-gray-700">
          {normalizeDescription(resource.Description)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-100 p-4">
          <div className="mb-2 flex items-center gap-2 text-gray-500">
            <FaCalendarAlt className="h-4 w-4" />
            <span className="text-sm font-semibold">Created At</span>
          </div>
          <p className="text-sm font-medium text-gray-800">
            {formatDateTime(resource.CreatedAt)}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 p-4">
          <div className="mb-2 flex items-center gap-2 text-gray-500">
            <FaClock className="h-4 w-4" />
            <span className="text-sm font-semibold">Updated At</span>
          </div>
          <p className="text-sm font-medium text-gray-800">
            {formatDateTime(resource.UpdatedAt)}
          </p>
        </div>
      </div>
    </EntityDetailModal>
  );
}
