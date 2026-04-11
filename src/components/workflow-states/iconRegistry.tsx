"use client";

import React from "react";
import {
  FaBell,
  FaCheckCircle,
  FaCircle,
  FaClock,
  FaClipboard,
  FaEdit,
  FaExclamationTriangle,
  FaHome,
  FaLock,
  FaSearch,
  FaStar,
  FaTimesCircle,
  FaUnlock,
  FaUser,
} from "react-icons/fa";

type IconComponent = React.ComponentType<{ className?: string }>;

export type WorkflowStateIconOption = {
  value: string;
  label: string;
  Icon: IconComponent;
  aliases?: string[];
};

export const WORKFLOW_STATE_ICON_OPTIONS: WorkflowStateIconOption[] = [
  { value: "edit", label: "Edit", Icon: FaEdit, aliases: ["fa-edit", "pencil"] },
  {
    value: "approved",
    label: "Approved",
    Icon: FaCheckCircle,
    aliases: ["check", "success", "fa-check", "fa-check-circle"],
  },
  {
    value: "rejected",
    label: "Rejected",
    Icon: FaTimesCircle,
    aliases: ["times", "close", "error", "fa-times", "fa-times-circle"],
  },
  { value: "pending", label: "Pending", Icon: FaClock, aliases: ["clock", "fa-clock"] },
  { value: "review", label: "Review", Icon: FaSearch, aliases: ["search", "fa-search"] },
  {
    value: "warning",
    label: "Warning",
    Icon: FaExclamationTriangle,
    aliases: ["alert", "fa-warning", "fa-exclamation-triangle"],
  },
  { value: "new", label: "New", Icon: FaStar, aliases: ["star", "fa-star"] },
  { value: "locked", label: "Locked", Icon: FaLock, aliases: ["lock", "fa-lock"] },
  { value: "unlocked", label: "Unlocked", Icon: FaUnlock, aliases: ["unlock", "fa-unlock"] },
  {
    value: "document",
    label: "Document",
    Icon: FaClipboard,
    aliases: ["clipboard", "file", "fa-clipboard"],
  },
  { value: "home", label: "Home", Icon: FaHome, aliases: ["fa-home", "house"] },
  { value: "user", label: "User", Icon: FaUser, aliases: ["fa-user", "profile"] },
  { value: "bell", label: "Bell", Icon: FaBell, aliases: ["fa-bell", "notification"] },
];

function normalizeIconToken(icon?: string | null) {
  return icon?.trim().toLowerCase() || "";
}

export function getWorkflowStateIconOption(icon?: string | null) {
  const normalizedIcon = normalizeIconToken(icon);
  if (!normalizedIcon) return null;

  return (
    WORKFLOW_STATE_ICON_OPTIONS.find(
      (item) =>
        item.value === normalizedIcon || item.aliases?.includes(normalizedIcon)
    ) || null
  );
}

export function renderWorkflowStateIcon(
  icon?: string | null,
  className = "w-6 h-6"
) {
  const option = getWorkflowStateIconOption(icon);
  if (!option) {
    return <FaCircle className={className} />;
  }

  const Icon = option.Icon;
  return <Icon className={className} />;
}
