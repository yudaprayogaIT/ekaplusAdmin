// src/components/layout/Sidebar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaHeart,
  FaShoppingBag,
  FaBoxes,
  FaTags,
  FaUsers,
  FaBuilding,
  FaWhatsapp,
  FaEnvelope,
  FaClipboardList,
  FaUser,
  FaUserShield,
  FaLayerGroup,
  FaStar,
} from "react-icons/fa";
import { MdInventory, MdMessage } from "react-icons/md";
import { BiSolidPurchaseTag } from "react-icons/bi";

type MenuItem = { label: string; href: string; icon: React.ReactNode | string };

const MAIN_MENU: MenuItem[] = [
  { label: "Dashboard", href: "/", icon: <FaHome className="w-5 h-5" /> },
  {
    label: "Favorites",
    href: "/favorites",
    icon: <FaHeart className="w-5 h-5" />,
  },
  { label: "Inbox", href: "/inbox", icon: <MdMessage className="w-5 h-5" /> },
  {
    label: "Order Lists",
    href: "/orders",
    icon: <FaClipboardList className="w-5 h-5" />,
  },
  {
    label: "Product Stock",
    href: "/stock",
    icon: <MdInventory className="w-5 h-5" />,
  },
];

const SECONDARY_MENU: MenuItem[] = [
  { label: "Users", href: "/users", icon: <FaUser className="w-5 h-5" /> },
  {
    label: "Branches",
    href: "/branches",
    icon: <FaBuilding className="w-5 h-5" />,
  },
  {
    label: "WA Accounts",
    href: "/waAdmin",
    icon: <FaWhatsapp className="w-5 h-5" />,
  },
  {
    label: "Email",
    href: "/email/accounts",
    icon: <FaEnvelope className="w-5 h-5" />,
  },
  {
    label: "To-Do",
    href: "/todo",
    icon: <FaClipboardList className="w-5 h-5" />,
  },
];

const CATALOG_SUBMENU: MenuItem[] = [
   {
    label: "Type",
    href: "/types",
    icon: <BiSolidPurchaseTag className="w-4 h-4" />,
  },
  {
    label: "Items",
    href: "/items",
    icon: <BiSolidPurchaseTag className="w-4 h-4" />,
  },
  {
    label: "Variants",
    href: "/variants",
    icon: <BiSolidPurchaseTag className="w-4 h-4" />,
  },
  {
    label: "Products",
    href: "/products",
    icon: <FaShoppingBag className="w-4 h-4" />,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: <FaTags className="w-4 h-4" />,
  },
];

const CUSTOMER_SUBMENU: MenuItem[] = [
  {
    label: "Member",
    href: "/members",
    icon: <FaUserShield className="w-4 h-4" />,
  },
  {
    label: "Group",
    href: "/memberGroups",
    icon: <FaUsers className="w-4 h-4" />,
  },
  {
    label: "Tiers",
    href: "/member-tiers",
    icon: <FaStar className="w-4 h-4" />,
  },
];

// Export function untuk digunakan di Header
export function useSidebarCollapse() {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("sidebar-collapsed");
      setCollapsed(v === "1");
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("sidebar-collapsed", collapsed ? "1" : "0");
    } catch {}
  }, [collapsed]);

  return { collapsed, setCollapsed };
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname() || "/";
  const [catalogOpen, setCatalogOpen] = useState<boolean>(false);
  const [customerOpen, setCustomerOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const collapsedWidth = 80;
  const expandedWidth = 200;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      pathname.startsWith("/products") ||
      pathname.startsWith("/categories") ||
      pathname.startsWith("/items")
    ) {
      setCatalogOpen(true);
    }
    if (
      pathname.startsWith("/members") ||
      pathname.startsWith("/memberGroups") ||
      pathname.startsWith("/member-tiers")
    ) {
      setCustomerOpen(true);
    }
  }, [pathname]);

  const isMenuActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setCollapsed(true)}
          aria-hidden
        />
      )}

      <motion.aside
        aria-label="Sidebar"
        initial={false}
        animate={{
          x: isMobile ? (collapsed ? "-100%" : 0) : 0,
          width: isMobile
            ? expandedWidth
            : collapsed
            ? collapsedWidth
            : expandedWidth,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          minWidth: isMobile
            ? expandedWidth
            : collapsed
            ? collapsedWidth
            : expandedWidth,
          maxWidth: expandedWidth,
        }}
        className={`h-screen bg-white flex flex-col ${
          isMobile
            ? "fixed top-0 left-0 z-50 shadow-2xl"
            : "border-r border-gray-100"
        }`}
      >
        {/* Logo section */}
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {collapsed && !isMobile ? (
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-base font-semibold text-gray-800">
                  Eka+ Admin
                </span>
              </>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {/* Main menu */}
            {MAIN_MENU.map((m) => {
              const active = isMenuActive(m.href);
              return (
                <li key={m.href}>
                  <Link href={m.href} className="no-underline block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        active
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                          : "text-gray-600 hover:bg-gray-50"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <div
                        className={`flex items-center justify-center ${
                          active ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {typeof m.icon === "string" ? (
                          <Image
                            src={m.icon}
                            alt={m.label}
                            width={20}
                            height={20}
                          />
                        ) : (
                          m.icon
                        )}
                      </div>
                      {!collapsed && (
                        <>
                          <span className="text-sm font-medium flex-1">
                            {m.label}
                          </span>
                          {active && (
                            <motion.svg
                              initial={{ x: -5, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                d="M9 6l6 6-6 6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          )}
                        </>
                      )}
                    </motion.div>
                  </Link>
                </li>
              );
            })}

            <div className="my-4 border-t border-gray-100" />

            {/* Catalog parent */}
            <li>
              {(() => {
                const parentActive = CATALOG_SUBMENU.some((c) =>
                  isMenuActive(c.href)
                );
                return (
                  <>
                    <button
                      className="w-full"
                      onClick={() => setCatalogOpen((s) => !s)}
                      aria-expanded={catalogOpen}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          parentActive
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                            : "text-gray-600 hover:bg-gray-50"
                        } ${collapsed ? "justify-center" : ""}`}
                      >
                        <FaBoxes
                          className={`w-5 h-5 ${
                            parentActive ? "text-white" : "text-gray-500"
                          }`}
                        />
                        {!collapsed && (
                          <>
                            <span className="text-sm font-medium flex-1">
                              Catalog
                            </span>
                            <motion.svg
                              animate={{ rotate: catalogOpen ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                d="M9 6l6 6-6 6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          </>
                        )}
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {catalogOpen && !collapsed && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 ml-3 space-y-1 overflow-hidden"
                        >
                          {CATALOG_SUBMENU.map((c) => {
                            const active = isMenuActive(c.href);
                            return (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  className="no-underline block"
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.02, x: 2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                      active
                                        ? "bg-gradient-to-r from-pink-400 to-red-500 text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                  >
                                    <div
                                      className={`flex items-center justify-center ${
                                        active ? "text-white" : "text-gray-400"
                                      }`}
                                    >
                                      {typeof c.icon === "string" ? (
                                        <Image
                                          src={c.icon}
                                          alt={c.label}
                                          width={16}
                                          height={16}
                                        />
                                      ) : (
                                        c.icon
                                      )}
                                    </div>
                                    <span className="text-sm">{c.label}</span>
                                  </motion.div>
                                </Link>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                );
              })()}
            </li>

            <div className="my-4 border-t border-gray-100" />

            {/* Customer parent */}
            <li>
              {(() => {
                const parentActive = CUSTOMER_SUBMENU.some((c) =>
                  isMenuActive(c.href)
                );
                return (
                  <>
                    <button
                      className="w-full"
                      onClick={() => setCustomerOpen((s) => !s)}
                      aria-expanded={customerOpen}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                          parentActive
                            ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                            : "text-gray-600 hover:bg-gray-50"
                        } ${collapsed ? "justify-center" : ""}`}
                      >
                        <FaLayerGroup
                          className={`w-5 h-5 ${
                            parentActive ? "text-white" : "text-gray-500"
                          }`}
                        />
                        {!collapsed && (
                          <>
                            <span className="text-sm font-medium flex-1">
                              Customer
                            </span>
                            <motion.svg
                              animate={{ rotate: customerOpen ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                d="M9 6l6 6-6 6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          </>
                        )}
                      </motion.div>
                    </button>
                    <AnimatePresence initial={false}>
                      {customerOpen && !collapsed && (
                        <motion.ul
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 ml-3 space-y-1 overflow-hidden"
                        >
                          {CUSTOMER_SUBMENU.map((c) => {
                            const active = isMenuActive(c.href);
                            return (
                              <li key={c.href}>
                                <Link
                                  href={c.href}
                                  className="no-underline block"
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.02, x: 2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                                      active
                                        ? "bg-gradient-to-r from-pink-400 to-red-500 text-white shadow-md"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                                  >
                                    <div
                                      className={`flex items-center justify-center ${
                                        active ? "text-white" : "text-gray-400"
                                      }`}
                                    >
                                      {typeof c.icon === "string" ? (
                                        <Image
                                          src={c.icon}
                                          alt={c.label}
                                          width={16}
                                          height={16}
                                        />
                                      ) : (
                                        c.icon
                                      )}
                                    </div>
                                    <span className="text-sm">{c.label}</span>
                                  </motion.div>
                                </Link>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </>
                );
              })()}
            </li>

            <div className="my-4 border-t border-gray-100" />

            {/* Secondary menu */}
            {SECONDARY_MENU.map((m) => {
              const active = isMenuActive(m.href);
              return (
                <li key={m.href}>
                  <Link href={m.href} className="no-underline block">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                        active
                          ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                          : "text-gray-600 hover:bg-gray-50"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <div
                        className={`flex items-center justify-center ${
                          active ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {typeof m.icon === "string" ? (
                          <Image
                            src={m.icon}
                            alt={m.label}
                            width={20}
                            height={20}
                          />
                        ) : (
                          m.icon
                        )}
                      </div>
                      {!collapsed && (
                        <span className="text-sm font-medium">{m.label}</span>
                      )}
                    </motion.div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="text-center text-xs text-gray-500">v1.0</div>
        </div>
      </motion.aside>
    </>
  );
}
