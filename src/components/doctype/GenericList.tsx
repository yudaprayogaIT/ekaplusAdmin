// src/components/doctype/GenericList.tsx
/**
 * Generic List Component
 *
 * Main orchestrator component that brings together all generic components.
 * Renders a complete CRUD interface based on DocTypeConfig.
 *
 * @example
 * ```typescript
 * <GenericList config={branchConfig} />
 * ```
 */

import React, { useState, useRef } from "react";
import { FaPlus, FaSearch, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useDocTypeList } from "@/lib/doctype/useDocTypeList";
import { useDocTypeFilters } from "@/lib/doctype/useDocTypeFilters";
import { useDocType } from "@/lib/doctype/useDocType";
import { GenericStats } from "./GenericStats";
import { GenericSearchSort } from "./GenericSearchSort";
import { GenericFilters } from "./GenericFilters";
import { GenericCard } from "./GenericCard";
import { GenericModal } from "./GenericModal";
import { GenericDetailModal } from "./GenericDetailModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { DocTypeConfig, ViewMode } from "@/lib/doctype/types";

export interface GenericListProps<T extends Record<string, unknown>> {
  /** DocType configuration */
  config: DocTypeConfig<T>;

  /** Custom card renderer */
  renderCard?: (item: T, viewMode: ViewMode) => React.ReactNode;

  /** Custom stats renderer */
  renderStats?: (items: T[]) => React.ReactNode;

  /** Custom header renderer */
  renderHeader?: (items: T[]) => React.ReactNode;

  /** Custom empty state renderer */
  renderEmpty?: () => React.ReactNode;
}

/**
 * Generic List Component
 */
export function GenericList<T extends Record<string, unknown>>({
  config,
  renderCard,
  renderStats,
  renderHeader,
  renderEmpty,
}: GenericListProps<T>) {
  const { token, isAuthenticated, isLoading: authLoading, hasPermission } = useAuth();

  // Data loading
  const { items, loading, error, setItems } = useDocTypeList<T>(
    config,
    token,
    isAuthenticated
  );

  // Filters, search, and sort
  const {
    searchQuery,
    setSearchQuery,
    activeFilters,
    setFilter,
    resetFilters,
    sortBy,
    setSortBy,
    sortedItems,
    hasActiveFilters,
  } = useDocTypeFilters<T>(items, config);

  // CRUD operations
  const { delete: deleteItem } = useDocType<T>(config, token);

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>(
    config.defaultViewMode || "grid"
  );

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState<T | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<T | null>(null);

  // Confirm dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmDesc, setConfirmDesc] = useState("");
  const actionRef = useRef<(() => Promise<void>) | null>(null);

  // Check permissions
  const canCreate = config.permissions?.create
    ? typeof config.permissions.create === "string"
      ? hasPermission(config.permissions.create)
      : config.permissions.create
    : true;

  const canUpdate = config.permissions?.update
    ? typeof config.permissions.update === "string"
      ? hasPermission(config.permissions.update)
      : config.permissions.update
    : true;

  const canDelete = config.permissions?.delete
    ? typeof config.permissions.delete === "string"
      ? hasPermission(config.permissions.delete)
      : config.permissions.delete
    : true;

  // Handlers
  const handleAdd = () => {
    setModalInitial(null);
    setModalOpen(true);
  };

  const handleEdit = (item: T) => {
    setModalInitial(item);
    setModalOpen(true);
  };

  const openDetail = (item: T) => {
    setDetailItem(item);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setDetailItem(null);
  };

  const onDetailEdit = (item: T) => {
    closeDetail();
    setTimeout(() => handleEdit(item), 80);
  };

  const onDetailDelete = (item: T) => {
    closeDetail();
    setTimeout(() => promptDelete(item), 80);
  };

  const promptDelete = (item: T) => {
    const title = String(item[config.titleField]);
    setConfirmTitle(`Delete ${config.label}`);
    setConfirmDesc(`Are you sure you want to delete "${title}"?`);
    actionRef.current = async () => {
      try {
        await deleteItem(item.id as number | string);
        // Optimistically remove from local state
        setItems((prev) => prev.filter((i) => i.id !== item.id));
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    };
    setConfirmOpen(true);
  };

  const confirmOk = async () => {
    setConfirmOpen(false);
    if (actionRef.current) {
      await actionRef.current();
      actionRef.current = null;
    }
  };

  const confirmCancel = () => {
    actionRef.current = null;
    setConfirmOpen(false);
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login required
  const requireAuth = config.requireAuth !== false;
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaLock className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Login Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to access {config.labelPlural}. Click the Login button in the top right corner.
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Loading {config.labelPlural.toLowerCase()}...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-8 text-center">
        <div className="inline-flex flex-col items-center gap-3 px-6 py-4 bg-red-50 text-red-600 rounded-xl border border-red-100 max-w-md">
          <span className="text-sm font-medium">{error}</span>
          {error.includes("terhubung") && (
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  // Group items if groupBy is configured
  const groupedItems = config.groupBy
    ? (() => {
        const groups = new Map<unknown, T[]>();
        sortedItems.forEach((item) => {
          const groupValue = item[config.groupBy!.field];
          if (!groups.has(groupValue)) {
            groups.set(groupValue, []);
          }
          groups.get(groupValue)!.push(item);
        });
        return Array.from(groups.entries()).map(([value, items]) => ({
          value,
          label: config.groupBy!.label(value),
          description: config.groupBy!.description?.(value),
          items,
        }));
      })()
    : null;

  return (
    <div>
      {/* Header */}
      {renderHeader ? (
        renderHeader(items)
      ) : (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              {config.labelPlural}
            </h1>
            {config.description && (
              <p className="text-sm md:text-base text-gray-600">
                {config.description}
              </p>
            )}
          </div>

          {canCreate && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all font-medium"
            >
              <FaPlus className="w-4 h-4" />
              <span>Add {config.label}</span>
            </motion.button>
          )}
        </div>
      )}

      {/* Stats Cards */}
      {renderStats ? renderStats(items) : <GenericStats config={config} items={items} />}

      {/* Search, Sort & View Toggle */}
      {sortBy && (
        <GenericSearchSort
          config={config}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}

      {/* Filters */}
      <div className="mb-6">
        <GenericFilters
          config={config}
          activeFilters={activeFilters}
          onFilterChange={setFilter}
          onReset={hasActiveFilters ? resetFilters : undefined}
        />
      </div>

      {/* Items Display */}
      {sortedItems.length === 0 ? (
        renderEmpty ? (
          renderEmpty()
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No {config.labelPlural} Found
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery || hasActiveFilters
                ? "Try adjusting your search or filters"
                : `No ${config.labelPlural.toLowerCase()} have been added yet`}
            </p>
          </div>
        )
      ) : groupedItems ? (
        <div className="space-y-10">
          {groupedItems.map((group) => (
            <section key={String(group.value)}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {group.label}
                  </h2>
                  {group.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {group.description}
                    </p>
                  )}
                </div>
              </div>

              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {group.items.map((item) => (
                  <GenericCard
                    key={String(item.id)}
                    item={item}
                    config={config}
                    viewMode={viewMode}
                    onEdit={canUpdate ? () => handleEdit(item) : undefined}
                    onDelete={canDelete ? () => promptDelete(item) : undefined}
                    onView={() => openDetail(item)}
                    canEdit={canUpdate}
                    canDelete={canDelete}
                    renderCard={renderCard}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {sortedItems.map((item) => (
            <GenericCard
              key={String(item.id)}
              item={item}
              config={config}
              viewMode={viewMode}
              onEdit={canUpdate ? () => handleEdit(item) : undefined}
              onDelete={canDelete ? () => promptDelete(item) : undefined}
              onView={() => openDetail(item)}
              canEdit={canUpdate}
              canDelete={canDelete}
              renderCard={renderCard}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <GenericModal
        config={config}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={modalInitial}
        token={token}
      />

      <GenericDetailModal
        config={config}
        open={detailOpen}
        onClose={closeDetail}
        item={detailItem}
        onEdit={canUpdate ? onDetailEdit : undefined}
        onDelete={canDelete ? onDetailDelete : undefined}
        canEdit={canUpdate}
        canDelete={canDelete}
      />

      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        description={confirmDesc}
        onConfirm={confirmOk}
        onCancel={confirmCancel}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}
