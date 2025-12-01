// src/components/dashboard/Dashboard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaBox,
  FaLayerGroup,
  FaTags,
  FaMapMarkerAlt,
  FaCubes,
  FaArrowRight,
  FaFire,
  FaChartLine,
  FaPlus,
  FaUsers,
  FaShieldAlt,
  FaProjectDiagram,
  FaLock,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import type { Item, ItemVariant, Product, Category } from "@/types";

// Additional types for dashboard
type Branch = {
  id: number;
  name: string;
  address?: string;
};

type DashboardStats = {
  totalProducts: number;
  totalItems: number;
  totalVariants: number;
  totalCategories: number;
  totalBranches: number;
  hotDealsCount: number;
  unmappedItems: number;
};

// Data URLs
const PRODUCTS_DATA_URL = "/data/products.json";
const ITEMS_DATA_URL = "/data/items.json";
const VARIANTS_DATA_URL = "/data/variants.json";
const CATEGORIES_DATA_URL = "/data/itemCategories.json";
const BRANCHES_DATA_URL = "/data/branches.json";

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  href,
  delay = 0,
  subtitle,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  href: string;
  delay?: number;
  subtitle?: string;
}) {
  const colorClasses: Record<
    string,
    { bg: string; icon: string; border: string }
  > = {
    red: {
      bg: "from-red-500 to-red-600",
      icon: "bg-red-100 text-red-600",
      border: "border-red-100",
    },
    blue: {
      bg: "from-blue-500 to-blue-600",
      icon: "bg-blue-100 text-blue-600",
      border: "border-blue-100",
    },
    purple: {
      bg: "from-purple-500 to-purple-600",
      icon: "bg-purple-100 text-purple-600",
      border: "border-purple-100",
    },
    green: {
      bg: "from-green-500 to-green-600",
      icon: "bg-green-100 text-green-600",
      border: "border-green-100",
    },
    orange: {
      bg: "from-orange-500 to-orange-600",
      icon: "bg-orange-100 text-orange-600",
      border: "border-orange-100",
    },
    yellow: {
      bg: "from-yellow-500 to-yellow-600",
      icon: "bg-yellow-100 text-yellow-700",
      border: "border-yellow-100",
    },
  };

  const colors = colorClasses[color] || colorClasses.red;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link href={href}>
        <motion.div
          whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
          className={`bg-white rounded-2xl p-6 border-2 ${colors.border} cursor-pointer transition-all group overflow-hidden relative`}
        >
          {/* Background Decoration */}
          <div
            className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${colors.bg} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}
          />

          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-14 h-14 ${colors.icon} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-7 h-7" />
              </div>
              <FaArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-1 transition-all" />
            </div>

            <div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {value.toLocaleString()}
              </p>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {subtitle && (
                <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Admin Quick Actions Component
type AdminAction = {
  name: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
  permission?: string;
  permissions?: string[];
};

const adminActions: AdminAction[] = [
  {
    name: "Kelola Users",
    description: "Lihat dan kelola semua pengguna",
    href: "/users",
    icon: FaUsers,
    color: "bg-blue-500",
    permissions: ['users.view', 'users.view_branch']
  },
  {
    name: "Roles & Permissions",
    description: "Atur role dan hak akses",
    href: "/roles",
    icon: FaShieldAlt,
    color: "bg-amber-500",
    permission: 'roles.view'
  },
  {
    name: "Workflow",
    description: "Kelola approval workflow",
    href: "/workflows",
    icon: FaProjectDiagram,
    color: "bg-purple-500",
    permission: 'workflows.view'
  },
  {
    name: "Branches",
    description: "Kelola data cabang",
    href: "/branches",
    icon: FaMapMarkerAlt,
    color: "bg-green-500",
    permission: 'branches.view'
  },
];

function AdminQuickActions() {
  const { hasPermission, hasAnyPermission, isAuthenticated } = useAuth();

  // Filter actions based on permissions
  const visibleActions = adminActions.filter((action) => {
    if (!isAuthenticated) return true; // Show all when not logged in
    if (action.permission) return hasPermission(action.permission);
    if (action.permissions) return hasAnyPermission(action.permissions);
    return true;
  });

  if (visibleActions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="mb-6"
    >
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FaShieldAlt className="w-5 h-5 text-gray-400" />
        Aksi Cepat Admin
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminActions.map((action) => {
          const hasAccess = !isAuthenticated || (
            action.permission 
              ? hasPermission(action.permission) 
              : action.permissions 
                ? hasAnyPermission(action.permissions)
                : true
          );

          if (!hasAccess) {
            return (
              <div 
                key={action.href}
                className="bg-gray-50 rounded-2xl p-5 border-2 border-gray-100 opacity-50 cursor-not-allowed"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center mb-3 text-gray-400">
                  <FaLock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-400 mb-1">{action.name}</h3>
                <p className="text-xs text-gray-300">{action.description}</p>
              </div>
            );
          }

          return (
            <Link key={action.href} href={action.href}>
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm cursor-pointer group h-full"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1 group-hover:text-red-600 transition-colors">
                  {action.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{action.description}</p>
                <div className="flex items-center text-red-500 text-xs font-medium group-hover:translate-x-1 transition-transform">
                  <span>Buka</span>
                  <FaArrowRight className="w-2.5 h-2.5 ml-1" />
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

// Category Distribution Card
function CategoryDistribution({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const categoryStats = categories
    .map((cat) => ({
      name: cat.name,
      count: products.filter((p) => p.itemCategory?.id === cat.id).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const maxCount = Math.max(...categoryStats.map((c) => c.count), 1);

  const colors = [
    "from-red-500 to-red-600",
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-green-500 to-green-600",
    "from-orange-500 to-orange-600",
    "from-pink-500 to-pink-600",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <FaTags className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Distribusi Kategori</h3>
            <p className="text-xs text-gray-500">Produk per kategori</p>
          </div>
        </div>
        <Link
          href="/categories"
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          Lihat Semua
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {categoryStats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FaTags className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Belum ada data kategori</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categoryStats.map((cat, idx) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                  {cat.name}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {cat.count}
                </span>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.count / maxCount) * 100}%` }}
                  transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                  className={`h-full bg-gradient-to-r ${
                    colors[idx % colors.length]
                  } rounded-full`}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Recent Products Card
function RecentProducts({ products }: { products: Product[] }) {
  const recentProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <FaBox className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Produk Terbaru</h3>
            <p className="text-xs text-gray-500">5 produk terakhir</p>
          </div>
        </div>
        <Link
          href="/products"
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          Lihat Semua
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {recentProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FaBox className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Belum ada produk</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentProducts.map((product, idx) => {
            const firstVariant = product.variants?.[0]?.item;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {firstVariant?.image ? (
                    <Image
                      width={48}
                      height={48}
                      src={firstVariant.image}
                      alt={product.name}
                      className="object-contain w-full h-full p-1"
                    />
                  ) : (
                    <FaBox className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500">
                      {product.itemCategory?.name || "Uncategorized"}
                    </span>
                    {product.isHotDeals && (
                      <span className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-xs font-medium flex items-center gap-1">
                        <FaFire className="w-2.5 h-2.5" />
                        Hot
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-lg">
                    {product.variants?.length || 0} varian
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

// Quick Actions Card (Catalog)
function QuickActions() {
  const actions = [
    { label: "Tambah Produk", href: "/products", icon: FaBox, color: "red" },
    { label: "Tambah Item", href: "/items", icon: FaCubes, color: "blue" },
    {
      label: "Mapping Varian",
      href: "/variants",
      icon: FaLayerGroup,
      color: "purple",
    },
    {
      label: "Kelola Kategori",
      href: "/categories",
      icon: FaTags,
      color: "green",
    },
  ];

  const colorClasses: Record<string, string> = {
    red: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-200",
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-blue-200",
    purple:
      "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-purple-200",
    green:
      "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
          <FaPlus className="w-5 h-5 text-gray-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Aksi Cepat Katalog</h3>
          <p className="text-xs text-gray-500">Shortcut ke fitur katalog</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, idx) => (
          <Link key={action.label} href={action.href}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-3 p-4 bg-gradient-to-r ${
                colorClasses[action.color]
              } text-white rounded-xl cursor-pointer shadow-lg transition-all`}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{action.label}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// Hot Deals Section
function HotDealsSection({ products }: { products: Product[] }) {
  const hotDeals = products.filter((p) => p.isHotDeals).slice(0, 4);

  if (hotDeals.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-2xl p-6 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaFire className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Hot Deals</h3>
              <p className="text-sm text-white/80">
                {hotDeals.length} produk unggulan
              </p>
            </div>
          </div>
          <Link
            href="/products?filter=hotdeals"
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
          >
            Lihat Semua
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hotDeals.map((product, idx) => {
            const firstVariant = product.variants?.[0]?.item;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors"
              >
                <div className="w-full h-20 bg-white/20 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                  {firstVariant?.image ? (
                    <Image
                      width={80}
                      height={80}
                      src={firstVariant.image}
                      alt={product.name}
                      className="object-contain w-full h-full p-2"
                    />
                  ) : (
                    <FaBox className="w-8 h-8 text-white/50" />
                  )}
                </div>
                <h4 className="text-sm font-semibold truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-white/70 mt-1">
                  {product.variants?.length || 0} varian
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// Branch Overview
function BranchOverview({ branches }: { branches: Branch[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <FaMapMarkerAlt className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Cabang</h3>
            <p className="text-xs text-gray-500">
              {branches.length} lokasi aktif
            </p>
          </div>
        </div>
        <Link
          href="/branches"
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
        >
          Kelola
          <FaArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {branches.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <FaMapMarkerAlt className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Belum ada cabang</p>
        </div>
      ) : (
        <div className="space-y-2 ">
          {branches.slice(0, 5).map((branch, idx) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + idx * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-sm">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {branch.name}
                </p>

                {branch.address && (
                  <p className="text-xs text-gray-500 truncate">
                    {branch.address}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
          {branches.length > 5 && (
            <p className="text-xs text-gray-500 text-center pt-2">
              +{branches.length - 5} cabang lainnya
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Main Dashboard Component
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalItems: 0,
    totalVariants: 0,
    totalCategories: 0,
    totalBranches: 0,
    hotDealsCount: 0,
    unmappedItems: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Load all data in parallel
        const [productsRes, itemsRes, variantsRes, categoriesRes, branchesRes] =
          await Promise.all([
            fetch(PRODUCTS_DATA_URL, { cache: "no-store" }),
            fetch(ITEMS_DATA_URL, { cache: "no-store" }),
            fetch(VARIANTS_DATA_URL, { cache: "no-store" }),
            fetch(CATEGORIES_DATA_URL, { cache: "no-store" }),
            fetch(BRANCHES_DATA_URL, { cache: "no-store" }),
          ]);

        let productsData: Product[] = [];
        let itemsData: Item[] = [];
        let variantsData: ItemVariant[] = [];
        let categoriesData: Category[] = [];
        let branchesData: Branch[] = [];

        if (productsRes.ok) {
          const rawProducts = await productsRes.json();
          productsData = rawProducts;
        }
        if (itemsRes.ok) itemsData = await itemsRes.json();
        if (variantsRes.ok) variantsData = await variantsRes.json();
        if (categoriesRes.ok) categoriesData = await categoriesRes.json();
        if (branchesRes.ok) branchesData = await branchesRes.json();

        // Merge products with variants
        const productsWithVariants: Product[] = productsData.map((product) => {
          const productVariants = variantsData.filter(
            (v) => v.productid === product.id
          );
          return {
            ...product,
            variants: productVariants,
          };
        });

        // Calculate stats
        const mappedItemIds = new Set(variantsData.map((v) => v.item.id));
        const unmappedItems = itemsData.filter(
          (item) => !mappedItemIds.has(item.id)
        );

        setStats({
          totalProducts: productsData.length,
          totalItems: itemsData.length,
          totalVariants: variantsData.length,
          totalCategories: categoriesData.length,
          totalBranches: branchesData.length,
          hotDealsCount: productsWithVariants.filter((p) => p.isHotDeals)
            .length,
          unmappedItems: unmappedItems.length,
        });

        setProducts(productsWithVariants);
        setCategories(categoriesData);
        setBranches(branchesData);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-600 font-medium">
            Memuat dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Selamat datang di Admin E-Katalog
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FaChartLine className="w-4 h-4" />
          <span>Overview data katalog Anda</span>
        </div>
      </motion.div>

      {/* Admin Quick Actions */}
      <AdminQuickActions />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Produk"
          value={stats.totalProducts}
          icon={FaBox}
          color="red"
          href="/products"
          delay={0}
          subtitle={`${stats.hotDealsCount} hot deals`}
        />
        <StatCard
          title="Total Items"
          value={stats.totalItems}
          icon={FaCubes}
          color="blue"
          href="/items"
          delay={0.05}
          subtitle={`${stats.unmappedItems} belum di-mapping`}
        />
        <StatCard
          title="Variant Mapping"
          value={stats.totalVariants}
          icon={FaLayerGroup}
          color="purple"
          href="/variants"
          delay={0.1}
        />
        <StatCard
          title="Kategori"
          value={stats.totalCategories}
          icon={FaTags}
          color="green"
          href="/categories"
          delay={0.15}
        />
        <StatCard
          title="Cabang"
          value={stats.totalBranches}
          icon={FaMapMarkerAlt}
          color="orange"
          href="/branches"
          delay={0.2}
        />
      </div>

      {/* Hot Deals Section */}
      <HotDealsSection products={products} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Products */}
        <div className="lg:col-span-2 space-y-6">
          <RecentProducts products={products} />
          <CategoryDistribution categories={categories} products={products} />
        </div>

        {/* Right Column - Quick Actions & Branches */}
        <div className="space-y-6">
          <QuickActions />
          <BranchOverview branches={branches} />
        </div>
      </div>
    </div>
  );
}