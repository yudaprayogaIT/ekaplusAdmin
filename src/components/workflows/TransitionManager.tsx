// src/components/workflows/TransitionManager.tsx
"use client";
import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FaArrowRight,
  FaChevronDown,
  FaGripVertical,
  FaPlus,
  FaSearch,
  FaTrash,
  FaUser,
  FaUsers,
  FaListOl,
  FaExclamationTriangle,
} from "react-icons/fa";
import { SelectedState } from "./StateManager";
import { Role } from "./WorkflowList";

export type TransitionInput = {
  id?: number;
  workflow_id?: number;
  from_state_id: number;
  to_state_id: number;
  action: string;
  mode: "single" | "parallel" | "sequence";
  allowed_role_ids: number[];
  min_required: number;
  condition_js?: string;
  before_js?: string;
  after_js?: string;
  auto?: boolean;
  schedule_cron?: string;
  stop_if_fail?: boolean;
  created_by?: number;
  updated_by?: number;
};

type Props = {
  selectedStates: SelectedState[];
  roles: Role[];
  transitions: TransitionInput[];
  onChange: (transitions: TransitionInput[]) => void;
};

type RolePickerPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
};

type SortableTransitionRowsProps = {
  id: number;
  index: number;
  children: ReactNode;
  errors: string[];
  startsGroup: boolean;
};

function SortableTransitionRows({
  id,
  index,
  children,
  errors,
  startsGroup,
}: SortableTransitionRowsProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const hasErrors = errors.length > 0;

  return (
    <Fragment>
      <tr
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.55 : 1,
          position: "relative",
          zIndex: isDragging ? 10 : undefined,
        }}
        className={`${hasErrors ? "bg-red-50/40" : "bg-white"} ${
          startsGroup && index > 0 ? "border-t-4 border-t-orange-100" : ""
        }`}
      >
        <td className="px-2 py-3 align-top">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Pindahkan transition nomor ${index + 1}`}
            title="Drag untuk mengubah urutan"
            className="touch-none cursor-grab rounded-md p-2 text-gray-400 transition-colors hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 active:cursor-grabbing"
          >
            <FaGripVertical className="h-4 w-4" />
          </button>
        </td>
        <td className="px-2 py-3 align-top text-sm font-semibold text-gray-500">
          {index + 1}
        </td>
        {children}
      </tr>
      {hasErrors ? (
        <tr className="bg-red-50/60">
          <td colSpan={2} />
          <td colSpan={6} className="px-4 pb-3 pt-0">
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
              <ul className="space-y-1">
                {errors.map((error) => (
                  <li
                    key={error}
                    className="flex items-center gap-2 text-xs font-medium text-red-700"
                  >
                    <FaExclamationTriangle className="h-3 w-3 flex-shrink-0" />
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </td>
        </tr>
      ) : null}
    </Fragment>
  );
}

export default function TransitionManager({
  selectedStates,
  roles,
  transitions,
  onChange,
}: Props) {
  const [openRolePickerIndex, setOpenRolePickerIndex] = useState<number | null>(
    null,
  );
  const [rolePickerPosition, setRolePickerPosition] =
    useState<RolePickerPosition | null>(null);
  const [roleSearch, setRoleSearch] = useState("");
  const rolePickerRef = useRef<HTMLDivElement | null>(null);
  const rolePickerButtonRefs = useRef(new Map<number, HTMLButtonElement>());
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const activeButton =
        openRolePickerIndex === null
          ? null
          : rolePickerButtonRefs.current.get(openRolePickerIndex);

      if (
        openRolePickerIndex !== null &&
        !rolePickerRef.current?.contains(event.target as Node) &&
        !activeButton?.contains(event.target as Node)
      ) {
        setOpenRolePickerIndex(null);
        setRolePickerPosition(null);
        setRoleSearch("");
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [openRolePickerIndex]);

  const toggleRolePicker = (
    index: number,
    button: HTMLButtonElement,
  ) => {
    if (openRolePickerIndex === index) {
      setOpenRolePickerIndex(null);
      setRolePickerPosition(null);
      setRoleSearch("");
      return;
    }

    const rect = button.getBoundingClientRect();
    const viewportPadding = 12;
    const gap = 8;
    const desiredWidth = 320;
    const width = Math.min(
      desiredWidth,
      window.innerWidth - viewportPadding * 2,
    );
    const left = Math.min(
      Math.max(rect.left, viewportPadding),
      window.innerWidth - width - viewportPadding,
    );
    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;
    const openAbove = spaceBelow < 240 && spaceAbove > spaceBelow;
    const maxHeight = Math.max(120, Math.min(320, openAbove ? spaceAbove : spaceBelow));
    const top = openAbove
      ? Math.max(viewportPadding, rect.top - maxHeight - gap)
      : rect.bottom + gap;

    setRolePickerPosition({ top, left, width, maxHeight });
    setRoleSearch("");
    setOpenRolePickerIndex(index);
  };

  // Add new transition
  const addTransition = () => {
    if (selectedStates.length < 2) {
      alert("Pilih minimal 2 state terlebih dahulu");
      return;
    }

    onChange([
      ...transitions,
      {
        from_state_id: selectedStates[0].state_id,
        to_state_id: selectedStates[1]?.state_id || selectedStates[0].state_id,
        action: "",
        mode: "single",
        allowed_role_ids: [],
        min_required: 1,
      },
    ]);
  };

  // Remove transition
  const removeTransition = (index: number) => {
    onChange(transitions.filter((_, i) => i !== index));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);
    if (
      !Number.isInteger(oldIndex) ||
      !Number.isInteger(newIndex) ||
      oldIndex < 0 ||
      newIndex < 0 ||
      oldIndex >= transitions.length ||
      newIndex >= transitions.length
    ) {
      return;
    }

    setOpenRolePickerIndex(null);
    setRolePickerPosition(null);
    setRoleSearch("");
    onChange(arrayMove(transitions, oldIndex, newIndex));
  };

  // Update transition
  const updateTransition = (
    index: number,
    updates: Partial<TransitionInput>,
  ) => {
    onChange(
      transitions.map((t, i) => (i === index ? { ...t, ...updates } : t)),
    );
  };

  // Toggle role selection
  const toggleRole = (index: number, roleId: number) => {
    const transition = transitions[index];
    const hasRole = transition.allowed_role_ids.includes(roleId);

    updateTransition(index, {
      allowed_role_ids: hasRole
        ? transition.allowed_role_ids.filter((id) => id !== roleId)
        : [...transition.allowed_role_ids, roleId],
    });
  };

  // Validate transition
  const validateTransition = (transition: TransitionInput): string[] => {
    const errors: string[] = [];

    if (transition.from_state_id === transition.to_state_id) {
      errors.push("From state dan To state tidak boleh sama");
    }

    if (!transition.action.trim()) {
      errors.push("Action tidak boleh kosong");
    }

    if (transition.allowed_role_ids.length === 0) {
      errors.push("Pilih minimal 1 role");
    }

    if (
      (transition.mode === "parallel" || transition.mode === "sequence") &&
      transition.min_required < 1
    ) {
      errors.push("Min required harus minimal 1");
    }

    if (
      (transition.mode === "parallel" || transition.mode === "sequence") &&
      transition.min_required > transition.allowed_role_ids.length
    ) {
      errors.push("Min required tidak boleh lebih dari jumlah role");
    }

    return errors;
  };

  const displayedRoles = [...roles]
    .filter((role) => Number(role.IsSystem) === 1)
    .filter((role) =>
      role.Name.toLocaleLowerCase("id").includes(
        roleSearch.trim().toLocaleLowerCase("id"),
      ),
    )
    .sort((left, right) =>
      left.Name.localeCompare(right.Name, "id", { sensitivity: "base" }),
    );

  const displayedStates = [...selectedStates].sort((left, right) =>
    left.state_name.localeCompare(right.state_name, "id", {
      sensitivity: "base",
    }),
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Transitions</h3>
          <p className="text-sm text-gray-600">
            Definisikan transisi antar state dan role yang diizinkan
          </p>
        </div>
      </div>

      {selectedStates.length < 2 && (
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800 font-medium">
            Pilih minimal 2 state terlebih dahulu untuk membuat transitions
          </p>
        </div>
      )}

      {transitions.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            {transitions.length} transition
          </span>
          {transitions.every(
            (transition) => validateTransition(transition).length === 0,
          ) && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Valid
            </span>
          )}
          {/* <span className="text-xs text-gray-500">
            Tarik ikon pegangan untuk mengurutkan dan dekatkan Current State
            yang sama agar menjadi satu kelompok.
          </span> */}
        </div>
      )}

      {transitions.length === 0 && selectedStates.length >= 2 && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
          <FaArrowRight className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <h4 className="mb-2 text-base font-bold text-gray-900">
            Belum Ada Transition
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            Tambahkan minimal 1 transition untuk mendefinisikan alur workflow
          </p>
          <button
            type="button"
            onClick={addTransition}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-orange-700"
          >
            <FaPlus className="h-4 w-4" />
            Add First Transition
          </button>
        </div>
      )}

      {transitions.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-hidden rounded-2xl border border-red-100 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-red-100">
                <thead className="bg-gray-50/80">
                  <tr className="text-left">
                    <th className="w-12 px-2 py-3">
                      <span className="sr-only">Urutkan</span>
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      No
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Current State
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Action Name
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Next State
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Approval Mode
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Allowed Roles
                    </th>
                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100 bg-white">
                  <SortableContext
                    items={transitions.map((_, index) => index)}
                    strategy={verticalListSortingStrategy}
                  >
                    {transitions.map((transition, index) => {
                      const errors = validateTransition(transition);
                      const startsGroup =
                        index === 0 ||
                        transitions[index - 1].from_state_id !==
                          transition.from_state_id;

                      return (
                        <SortableTransitionRows
                          key={transition.id ?? `new-${index}`}
                          id={index}
                          index={index}
                          errors={errors}
                          startsGroup={startsGroup}
                        >
                          <td className="px-4 py-3 align-top">
                            <div className="space-y-1">
                              {/* {startsGroup ? (
                        <span className="mb-1 inline-flex rounded-md bg-orange-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                          Awal kelompok
                        </span>
                      ) : null} */}
                              <select
                                value={transition.from_state_id}
                                onChange={(e) =>
                                  updateTransition(index, {
                                    from_state_id: parseInt(e.target.value),
                                  })
                                }
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                              >
                                {displayedStates.map((state) => (
                                  <option
                                    key={state.state_id}
                                    value={state.state_id}
                                  >
                                    {state.state_name}
                                  </option>
                                ))}
                              </select>
                              <code className="block whitespace-normal break-words text-[11px] text-gray-500">
                                {selectedStates.find(
                                  (state) =>
                                    state.state_id === transition.from_state_id,
                                )?.state_name || "-"}
                              </code>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={transition.action}
                                onChange={(e) =>
                                  updateTransition(index, {
                                    action: e.target.value,
                                  })
                                }
                                placeholder="submit / approve / reject"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="space-y-1">
                              <select
                                value={transition.to_state_id}
                                onChange={(e) =>
                                  updateTransition(index, {
                                    to_state_id: parseInt(e.target.value),
                                  })
                                }
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                              >
                                {displayedStates.map((state) => (
                                  <option
                                    key={state.state_id}
                                    value={state.state_id}
                                  >
                                    {state.state_name}
                                  </option>
                                ))}
                              </select>
                              <code className="text-[11px] text-gray-500">
                                {selectedStates.find(
                                  (state) =>
                                    state.state_id === transition.to_state_id,
                                )?.state_name || "-"}
                              </code>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="space-y-2">
                              <select
                                value={transition.mode}
                                onChange={(e) => {
                                  const nextMode = e.target.value as
                                    | "single"
                                    | "parallel"
                                    | "sequence";
                                  updateTransition(index, {
                                    mode: nextMode,
                                    min_required:
                                      nextMode === "single"
                                        ? 1
                                        : nextMode === "sequence"
                                          ? transition.allowed_role_ids
                                              .length || 1
                                          : Math.max(
                                              transition.min_required,
                                              1,
                                            ),
                                  });
                                }}
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:border-orange-500 focus:outline-none"
                              >
                                <option value="single">Single</option>
                                <option value="parallel">Parallel</option>
                                <option value="sequence">Sequence</option>
                              </select>
                              <span
                                className={`inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ${
                                  transition.mode === "single"
                                    ? "bg-blue-50 text-blue-700"
                                    : transition.mode === "parallel"
                                      ? "bg-orange-50 text-orange-700"
                                      : "bg-purple-50 text-purple-700"
                                }`}
                              >
                                {transition.mode === "single" ? (
                                  <FaUser className="h-3 w-3" />
                                ) : transition.mode === "parallel" ? (
                                  <FaUsers className="h-3 w-3" />
                                ) : (
                                  <FaListOl className="h-3 w-3" />
                                )}
                                {transition.mode}
                              </span>
                              {(transition.mode === "parallel" ||
                                transition.mode === "sequence") && (
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-medium text-gray-500">
                                    Min Required
                                  </span>
                                  <input
                                    type="number"
                                    min="1"
                                    max={
                                      transition.allowed_role_ids.length || 1
                                    }
                                    value={transition.min_required}
                                    onChange={(e) =>
                                      updateTransition(index, {
                                        min_required:
                                          parseInt(e.target.value) || 1,
                                      })
                                    }
                                    className="w-20 rounded-md border border-gray-200 px-2 py-1 text-xs focus:border-orange-500 focus:outline-none"
                                  />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-1.5">
                                {transition.allowed_role_ids.length > 0 ? (
                                  <>
                                    {transition.allowed_role_ids
                                      .slice(0, 2)
                                      .map((roleId) => {
                                        const role = roles.find(
                                          (item) => item.ID === roleId,
                                        );
                                        return (
                                          <span
                                            key={`${index}-${roleId}`}
                                            className="inline-flex rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700"
                                          >
                                            {role?.Name || `Role #${roleId}`}
                                          </span>
                                        );
                                      })}
                                    {transition.allowed_role_ids.length > 2 ? (
                                      <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-600">
                                        +
                                        {transition.allowed_role_ids.length - 2}{" "}
                                        lagi
                                      </span>
                                    ) : null}
                                  </>
                                ) : (
                                  <span className="text-xs text-gray-400">
                                    Belum ada role
                                  </span>
                                )}
                              </div>

                              <div>
                                <button
                                  type="button"
                                  ref={(element) => {
                                    if (element) {
                                      rolePickerButtonRefs.current.set(
                                        index,
                                        element,
                                      );
                                    } else {
                                      rolePickerButtonRefs.current.delete(index);
                                    }
                                  }}
                                  onClick={(event) =>
                                    toggleRolePicker(
                                      index,
                                      event.currentTarget,
                                    )
                                  }
                                  aria-expanded={openRolePickerIndex === index}
                                  className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition-all hover:bg-gray-50"
                                >
                                  <span>
                                    {transition.allowed_role_ids.length > 0
                                      ? `${transition.allowed_role_ids.length} role dipilih`
                                      : "Pilih role"}
                                  </span>
                                  <FaChevronDown
                                    className={`h-3 w-3 text-gray-400 transition-transform ${
                                      openRolePickerIndex === index
                                        ? "rotate-180"
                                        : ""
                                    }`}
                                  />
                                </button>

                                {openRolePickerIndex === index &&
                                rolePickerPosition
                                  ? createPortal(
                                  <div
                                    ref={rolePickerRef}
                                    style={{
                                      position: "fixed",
                                      top: rolePickerPosition.top,
                                      left: rolePickerPosition.left,
                                      width: rolePickerPosition.width,
                                      maxHeight: rolePickerPosition.maxHeight,
                                    }}
                                    className="z-[100] overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-2xl"
                                  >
                                    <div className="relative mb-2 flex-shrink-0">
                                      <FaSearch className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                                      <input
                                        type="search"
                                        value={roleSearch}
                                        onChange={(event) =>
                                          setRoleSearch(event.target.value)
                                        }
                                        placeholder="Cari role..."
                                        autoFocus
                                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                      />
                                    </div>
                                    <div
                                      style={{
                                        maxHeight:
                                          rolePickerPosition.maxHeight - 58,
                                      }}
                                      className="space-y-1 overflow-y-auto pr-1"
                                    >
                                      {displayedRoles.map((role) => {
                                        const isSelected =
                                          transition.allowed_role_ids.includes(
                                            role.ID,
                                          );

                                        return (
                                          <label
                                            key={role.ID}
                                            className={`flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs transition-all ${
                                              isSelected
                                                ? "bg-blue-50 text-blue-700"
                                                : "hover:bg-gray-50 text-gray-700"
                                            }`}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={isSelected}
                                              onChange={() =>
                                                toggleRole(index, role.ID)
                                              }
                                              className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="flex-1">
                                              {role.Name}
                                            </span>
                                          </label>
                                        );
                                      })}
                                      {displayedRoles.length === 0 ? (
                                        <p className="px-3 py-6 text-center text-xs text-gray-500">
                                          Role tidak ditemukan
                                        </p>
                                      ) : null}
                                    </div>
                                  </div>,
                                  document.body,
                                )
                                  : null}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <button
                              type="button"
                              onClick={() => removeTransition(index)}
                              className="rounded-md p-2 text-red-500 transition-all hover:bg-red-50"
                            >
                              <FaTrash className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </SortableTransitionRows>
                      );
                    })}
                  </SortableContext>
                </tbody>
              </table>
            </div>
          </div>
        </DndContext>
      )}
      <button
        type="button"
        onClick={addTransition}
        disabled={selectedStates.length < 2}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-red-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaPlus className="h-3 w-3" />
        Add New Transition
      </button>
    </div>
  );
}
