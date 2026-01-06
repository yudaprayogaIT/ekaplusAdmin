// src/components/layout/Sidebar.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
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
  FaShieldAlt,
  FaProjectDiagram,
  FaCog,
  FaLock,
  FaDatabase,
  FaCircle,
  FaFolder,
} from "react-icons/fa";
import { MdMapsHomeWork, MdMessage } from "react-icons/md";
import { BiSolidPurchaseTag, BiSolidUserDetail } from "react-icons/bi";
import { AiFillProduct } from "react-icons/ai";
import { GiKnightBanner } from "react-icons/gi";
import { FaUserGroup } from "react-icons/fa6";

export type MenuItem = {
  label: string;
  href: string;
  icon: React.ReactNode | string;
  category?: string;
  permission?: string;
  permissions?: string[];
  requireAuth?: boolean;
};

// Dashboard - always visible
const DASHBOARD_MENU: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: <FaHome className="w-5 h-5" />,
    category: "Main"
  },
];

// Main menu - requires auth
const MAIN_MENU: MenuItem[] = [
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: <FaHeart className="w-5 h-5" />,
    category: "Main",
    requireAuth: true,
  },
  {
    label: "Banner",
    href: "/banners",
    icon: <GiKnightBanner className="w-5 h-5" />,
    category: "Main",
    requireAuth: true,
  },
  {
    label: "Inbox",
    href: "/inbox",
    icon: <MdMessage className="w-5 h-5" />,
    category: "Main",
    requireAuth: true,
  },
  {
    label: "Order Lists",
    href: "/orders",
    icon: <FaClipboardList className="w-5 h-5" />,
    category: "Main",
    requireAuth: true,
  },
];

const SECONDARY_MENU: MenuItem[] = [
  {
    label: "File Management",
    href: "/files",
    icon: <FaFolder className="w-5 h-5" />,
    category: "Tools",
    requireAuth: true,
  },
  {
    label: "Whatsapp",
    href: "/whatsapp",
    icon: <FaWhatsapp className="w-5 h-5" />,
    category: "Tools",
    requireAuth: true,
  },
  {
    label: "To-Do",
    href: "/todo",
    icon: <FaClipboardList className="w-5 h-5" />,
    category: "Tools",
    requireAuth: true,
  },
];

// DISABLED: Permission checks disabled (migrasi ke SQL) - all menu items visible to authenticated users
const ADMIN_MENU: MenuItem[] = [
  {
    label: "Email",
    href: "/emails",
    icon: <FaEnvelope className="w-4 h-4" />,
    category: "System",
    // permission: "emails.view", // DISABLED
    requireAuth: true,
  },
  {
    label: "Roles & Permissions",
    href: "/roles",
    icon: <FaShieldAlt className="w-4 h-4" />,
    category: "System",
    // permission: "roles.view", // DISABLED
    requireAuth: true,
  },
  {
    label: "Users",
    href: "/users",
    icon: <FaUser className="w-5 h-5" />,
    category: "System",
    // permissions: ["users.view", "users.view_branch"], // DISABLED
    requireAuth: true,
  },
  {
    label: "Workflows",
    href: "/workflows",
    icon: <FaProjectDiagram className="w-4 h-4" />,
    category: "System",
    // permission: "workflows.view", // DISABLED
    requireAuth: true,
  },
  {
    label: "Workflow States",
    href: "/workflow-states",
    icon: <FaCircle className="w-4 h-4" />,
    category: "System",
    // permission: "workflows.view", // DISABLED
    requireAuth: true,
  },
];

const MASTER_MENU: MenuItem[] = [
  {
    label: "Branches",
    href: "/branches",
    icon: <FaBuilding className="w-4 h-4" />,
    category: "Master Data",
    // permission: "branches.view",
    requireAuth: true,
  },
  {
    label: "Items",
    href: "/items",
    icon: <BiSolidPurchaseTag className="w-4 h-4" />,
    category: "Master Data",
    requireAuth: true,
  },
];

const CATALOG_SUBMENU: MenuItem[] = [
  {
    label: "Type",
    href: "/types",
    icon: <BiSolidPurchaseTag className="w-4 h-4" />,
    category: "Catalog",
    requireAuth: true,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: <FaTags className="w-4 h-4" />,
    category: "Catalog",
    requireAuth: true,
  },
  {
    label: "Products",
    href: "/products",
    icon: <FaShoppingBag className="w-4 h-4" />,
    category: "Catalog",
    requireAuth: true,
  },
  {
    label: "Variants",
    href: "/variants",
    icon: <AiFillProduct className="w-4 h-4" />,
    category: "Catalog",
    requireAuth: true,
  },
];

const CUSTOMER_SUBMENU: MenuItem[] = [
  {
    label: "Customer Register",
    href: "/customers/registrations",
    icon: <BiSolidUserDetail className="w-4 h-4" />,
    category: "Customer",
    requireAuth: true,
  },
  {
    label: "Global Party",
    href: "/customers/global_party",
    icon: <FaUsers className="w-4 h-4" />,
    category: "Customer",
    requireAuth: true,
  },
  {
    label: "Global Customer",
    href: "/customers/global_customer",
    icon: <FaUserGroup className="w-4 h-4" />,
    category: "Customer",
    requireAuth: true,
  },
  {
    label: "Branch Customer",
    href: "/customers/branch_customer",
    icon: <FaUserShield className="w-4 h-4" />,
    category: "Customer",
    requireAuth: true,
  },
  {
    label: "Members",
    href: "/members",
    icon: <MdMapsHomeWork className="w-4 h-4" />,
    category: "Customer",
    requireAuth: true,
  },
  {
    label: "Tiers",
    href: "/member-tiers",
    icon: <FaStar className="w-4 h-4" />,
    category: "Customer",
    requireAuth: true,
  },
];

// Export function to get all menu items for search functionality
export function getAllMenuItems(): MenuItem[] {
  return [
    ...DASHBOARD_MENU,
    ...MAIN_MENU,
    ...MASTER_MENU,
    ...CATALOG_SUBMENU,
    ...CUSTOMER_SUBMENU,
    ...SECONDARY_MENU,
    ...ADMIN_MENU,
  ];
}

// Export hook untuk digunakan di AdminLayout
export function useSidebarCollapse() {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem("sidebar-collapsed");
      if (v === "1") {
        setCollapsed(true);
      }
      setIsInitialized(true);
    } catch {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("sidebar-collapsed", collapsed ? "1" : "0");
      } catch {}
    }
  }, [collapsed, isInitialized]);

  return { collapsed, setCollapsed };
}

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean | ((prev: boolean) => boolean)) => void;
}

// Submenu names for accordion
type SubmenuName = "master" | "catalog" | "customer" | "admin" | null;

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname() || "/";
  const { hasPermission, hasAnyPermission, isAuthenticated, currentRole } =
    useAuth();

  // Single state for accordion - only one submenu can be open at a time
  const [openSubmenu, setOpenSubmenu] = useState<SubmenuName>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const collapsedWidth = 72;
  const expandedWidth = 240;

  // Toggle submenu with accordion behavior
  const toggleSubmenu = (menuName: SubmenuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
  };

  const canSeeMenu = (item: MenuItem): boolean => {
    if (item.requireAuth && !isAuthenticated) return false;
    if (!item.permission && !item.permissions) return true;
    if (!isAuthenticated) return false;
    if (item.permission) return hasPermission(item.permission);
    if (item.permissions) return hasAnyPermission(item.permissions);
    return true;
  };

  const showAdminSection =
    isAuthenticated && ADMIN_MENU.some((item) => canSeeMenu(item));

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  // Auto-open submenu based on current path
  useEffect(() => {
    if (pathname.startsWith("/branches") || pathname.startsWith("/items")) {
      setOpenSubmenu("master");
    } else if (
      pathname.startsWith("/products") ||
      pathname.startsWith("/categories") ||
      pathname.startsWith("/types") ||
      pathname.startsWith("/variants")
    ) {
      setOpenSubmenu("catalog");
    } else if (
      pathname.startsWith("/members") ||
      pathname.startsWith("/memberGroups") ||
      pathname.startsWith("/member-tiers")
    ) {
      setOpenSubmenu("customer");
    } else if (
      pathname.startsWith("/roles") ||
      pathname.startsWith("/workflows") ||
      pathname.startsWith("/emails")
    ) {
      setOpenSubmenu("admin");
    }
  }, [pathname]);

  const isMenuActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const renderMenuItem = (m: MenuItem, isSubmenu = false) => {
    if (!canSeeMenu(m)) return null;
    const active = isMenuActive(m.href);

    return (
      <li key={m.href}>
        <Link href={m.href} className="no-underline block">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 px-3 ${
              isSubmenu ? "py-2" : "py-2.5"
            } ${isSubmenu ? "rounded-lg" : "rounded-xl"} transition-all ${
              active
                ? isSubmenu
                  ? "bg-gradient-to-r from-pink-400 to-red-500 text-white shadow-md"
                  : "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                : "text-gray-600 hover:bg-gray-50"
            } ${collapsed && !isMobile ? "justify-center px-2" : ""}`}
            title={collapsed && !isMobile ? m.label : undefined}
          >
            <div
              className={`flex items-center justify-center flex-shrink-0 ${
                active
                  ? "text-white"
                  : isSubmenu
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              {typeof m.icon === "string" ? (
                <Image
                  src={m.icon}
                  alt={m.label}
                  width={isSubmenu ? 16 : 20}
                  height={isSubmenu ? 16 : 20}
                />
              ) : (
                m.icon
              )}
            </div>
            {(!collapsed || isMobile) && (
              <>
                <span
                  className={`${
                    isSubmenu ? "text-sm" : "text-sm font-medium"
                  } flex-1 truncate`}
                >
                  {m.label}
                </span>
                {active && !isSubmenu && (
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
  };

  const renderSubmenuParent = (
    label: string,
    icon: React.ReactNode,
    menuName: SubmenuName,
    submenu: MenuItem[]
  ) => {
    const visibleSubmenu = submenu.filter(canSeeMenu);
    if (visibleSubmenu.length === 0) return null;

    const isOpen = openSubmenu === menuName;
    const parentActive = visibleSubmenu.some((c) => isMenuActive(c.href));

    return (
      <li>
        <button
          className="w-full"
          onClick={() => toggleSubmenu(menuName)}
          aria-expanded={isOpen}
          title={collapsed && !isMobile ? label : undefined}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              parentActive
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200"
                : "text-gray-600 hover:bg-gray-50"
            } ${collapsed && !isMobile ? "justify-center px-2" : ""}`}
          >
            <div
              className={`flex-shrink-0 ${
                parentActive ? "text-white" : "text-gray-500"
              }`}
            >
              {icon}
            </div>
            {(!collapsed || isMobile) && (
              <>
                <span className="text-sm font-medium flex-1 text-left">
                  {label}
                </span>
                <motion.svg
                  animate={{ rotate: isOpen ? 90 : 0 }}
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
          {isOpen && (!collapsed || isMobile) && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1 ml-3 space-y-1 overflow-hidden"
            >
              {visibleSubmenu.map((c) => renderMenuItem(c, true))}
            </motion.ul>
          )}
        </AnimatePresence>
      </li>
    );
  };

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
            : "relative border-r border-gray-100"
        }`}
      >
        {/* Logo section */}
        <div className="px-3 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">E</span>
            </div>
            {(!collapsed || isMobile) && (
              <span className="text-base font-semibold text-gray-800 truncate">
                Eka+ Admin
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {/* Dashboard - always visible */}
            {DASHBOARD_MENU.map((m) => renderMenuItem(m))}

            {/* Show login prompt if not authenticated - only when expanded */}
            {!isAuthenticated && (!collapsed || isMobile) && (
              <div className="mt-4 mx-1 p-3 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                  <FaLock className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-semibold text-gray-700">
                    Login Required
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Silakan login untuk mengakses menu lainnya
                </p>
                <div className="text-xs text-red-600">
                  Klik <span className="font-semibold">Login</span> di kanan
                  atas
                </div>
              </div>
            )}

            {/* Show lock icon when collapsed and not authenticated */}
            {!isAuthenticated && collapsed && !isMobile && (
              <li className="flex justify-center py-4">
                <div
                  className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center"
                  title="Login required"
                >
                  <FaLock className="w-4 h-4 text-red-400" />
                </div>
              </li>
            )}

            {/* Other menus - only show when authenticated */}
            {isAuthenticated && (
              <>
                {MAIN_MENU.filter(canSeeMenu).map((m) => renderMenuItem(m))}

                <div className="my-3 border-t border-gray-100 mx-1" />

                {renderSubmenuParent(
                  "Master Data",
                  <FaDatabase className="w-5 h-5" />,
                  "master",
                  MASTER_MENU
                )}

                <div className="my-3 border-t border-gray-100 mx-1" />

                {renderSubmenuParent(
                  "Catalog",
                  <FaBoxes className="w-5 h-5" />,
                  "catalog",
                  CATALOG_SUBMENU
                )}

                <div className="my-3 border-t border-gray-100 mx-1" />

                {renderSubmenuParent(
                  "Customer",
                  <FaLayerGroup className="w-5 h-5" />,
                  "customer",
                  CUSTOMER_SUBMENU
                )}

                <div className="my-3 border-t border-gray-100 mx-1" />

                {SECONDARY_MENU.filter(canSeeMenu).map((m) =>
                  renderMenuItem(m)
                )}

                {showAdminSection && (
                  <>
                    <div className="my-3 border-t border-gray-100 mx-1" />

                    {(!collapsed || isMobile) && (
                      <div className="px-3 mb-2">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                          <FaLock className="w-2.5 h-2.5" />
                          Admin Only
                        </span>
                      </div>
                    )}

                    {renderSubmenuParent(
                      "System",
                      <FaCog className="w-5 h-5" />,
                      "admin",
                      ADMIN_MENU
                    )}
                  </>
                )}
              </>
            )}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-2 py-3 border-t border-gray-100">
          {(!collapsed || isMobile) && currentRole && (
            <div className="mb-2 px-2">
              <span
                className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium rounded-lg"
                style={{
                  backgroundColor: `${currentRole.color}15`,
                  color: currentRole.color,
                }}
              >
                <FaUserShield className="w-3 h-3" />
                {currentRole.display_name}
              </span>
            </div>
          )}
          <div className="text-center text-xs text-gray-400">v1.0</div>
        </div>
      </motion.aside>
    </>
  );
}
