// src/components/auth/UserMenu.tsx
"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "./LoginForm";
import { useRouter } from "next/navigation";
import { getFileUrl } from "@/config/api";
import {
  clearPendingFeatureTourStep,
  getPendingFeatureTourStep,
  isFeatureTourSeen,
  markFeatureTourSeen,
  profileFeatureTourConfig,
  setPendingFeatureTourStep,
} from "@/lib/featureTour";
import { FaArrowRight, FaKey, FaSignInAlt } from "react-icons/fa";

export default function UserMenu() {
  const { currentUser, currentRole, permissions, isAuthenticated, isLoading } =
    useAuth();
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showProfileCoachmark, setShowProfileCoachmark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [spotlightRect, setSpotlightRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const profileButtonRef = useRef<HTMLButtonElement | null>(null);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarUrl =
    getFileUrl(currentUser?.profile_pic) || currentUser?.profile_pic || "";

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!showProfileCoachmark || typeof window === "undefined") {
      setSpotlightRect(null);
      return;
    }

    const updateSpotlightRect = () => {
      const rect = profileButtonRef.current?.getBoundingClientRect();
      if (!rect) return;
      setSpotlightRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    updateSpotlightRect();
    window.addEventListener("resize", updateSpotlightRect);
    window.addEventListener("scroll", updateSpotlightRect, true);

    return () => {
      window.removeEventListener("resize", updateSpotlightRect);
      window.removeEventListener("scroll", updateSpotlightRect, true);
    };
  }, [showProfileCoachmark]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      isLoading ||
      typeof window === "undefined" ||
      isFeatureTourSeen(profileFeatureTourConfig) ||
      getPendingFeatureTourStep(profileFeatureTourConfig) !== "menu"
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowProfileCoachmark(true);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isAuthenticated, isLoading]);

  const acknowledgeProfileCoachmark = () => {
    markFeatureTourSeen(profileFeatureTourConfig);
    setShowProfileCoachmark(false);
  };

  const handleProfileClick = () => {
    clearPendingFeatureTourStep(profileFeatureTourConfig);
    setPendingFeatureTourStep(profileFeatureTourConfig, "edit");
    setShowProfileCoachmark(false);
    router.push("/profile");
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200" />
        <div className="hidden space-y-1 md:block">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowLoginForm(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-red-200 transition-all hover:shadow-xl"
        >
          <FaSignInAlt className="h-4 w-4" />
          <span>Login</span>
        </motion.button>

        <LoginForm
          open={showLoginForm}
          onClose={() => setShowLoginForm(false)}
        />
      </>
    );
  }

  return (
    <>
      <div>
        <motion.button
          ref={profileButtonRef}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleProfileClick}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm transition-all hover:shadow-md"
        >
          <div
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-sm font-bold text-white"
            style={{
              backgroundColor:
                currentUser?.profile_bg_color ||
                currentRole?.color ||
                "#6B7280",
            }}
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={currentUser?.full_name || "User avatar"}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : currentUser ? (
              getInitials(currentUser.full_name)
            ) : (
              "?"
            )}
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold leading-tight text-gray-800">
              {currentUser?.full_name}
            </p>
            <p
              className="text-xs font-medium leading-tight"
              style={{ color: currentRole?.color || "#6B7280" }}
            >
              {currentRole?.display_name}
            </p>
          </div>

          <div className="hidden items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 lg:flex">
            <FaKey className="h-3 w-3 text-gray-500" />
            <span className="text-xs font-medium text-gray-600">
              {permissions.length}
            </span>
          </div>
        </motion.button>
      </div>

      {mounted
        ? createPortal(
            <AnimatePresence>
              {showProfileCoachmark ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[1000] bg-slate-950/35 backdrop-blur-xs"
                    onClick={acknowledgeProfileCoachmark}
                  />
                  {spotlightRect ? (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.18 }}
                      type="button"
                      onClick={handleProfileClick}
                      className="fixed z-[1002] flex cursor-pointer items-center gap-3 rounded-xl border border-red-200 bg-white px-3 py-2 shadow-2xl ring-4 ring-white transition-all"
                      style={{
                        top: spotlightRect.top,
                        left: spotlightRect.left,
                        width: spotlightRect.width,
                        minHeight: spotlightRect.height,
                      }}
                    >
                      <div
                        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg text-sm font-bold text-white"
                        style={{
                          backgroundColor:
                            currentUser?.profile_bg_color ||
                            currentRole?.color ||
                            "#6B7280",
                        }}
                      >
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={currentUser?.full_name || "User avatar"}
                            width={36}
                            height={36}
                            className="h-full w-full object-cover"
                          />
                        ) : currentUser ? (
                          getInitials(currentUser.full_name)
                        ) : (
                          "?"
                        )}
                      </div>

                      <div className="hidden text-left md:block">
                        <p className="text-sm font-semibold leading-tight text-gray-800">
                          {currentUser?.full_name}
                        </p>
                        <p
                          className="text-xs font-medium leading-tight"
                          style={{ color: currentRole?.color || "#6B7280" }}
                        >
                          {currentRole?.display_name}
                        </p>
                      </div>

                      <div className="hidden items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 lg:flex">
                        <FaKey className="h-3 w-3 text-gray-500" />
                        <span className="text-xs font-medium text-gray-600">
                          {permissions.length}
                        </span>
                      </div>
                    </motion.button>
                  ) : null}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ duration: 0.2 }}
                    className="fixed left-14 top-28 z-[1001] w-[min(360px,calc(100vw-2rem))] md:left-20 md:top-32 lg:left-24 lg:top-96"
                  >
                    <div className="relative rounded-2xl border border-red-100 bg-white p-4 shadow-2xl">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-red-500">
                          Step 1 of 4
                        </span>
                        <button
                          type="button"
                          onClick={acknowledgeProfileCoachmark}
                          className="text-xs font-semibold text-slate-400 transition hover:text-slate-600"
                        >
                          Lewati
                        </button>
                      </div>
                      <h4 className="mt-3 text-base font-semibold text-slate-950">
                        Apa yang baru di halaman profile?
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Sekarang user bisa edit profil, edit foto profil, dan
                        reset password langsung dari halaman profile.
                      </p>
                      <p className="mt-4 text-xs italic text-slate-600">
                        Klik lanjutkan untuk ikuti tour atau klik lewati untuk
                        menutup
                      </p>
                      <div className="mt-4 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={handleProfileClick}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                        >
                          Buka Profile
                          <FaArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      <LoginForm open={showLoginForm} onClose={() => setShowLoginForm(false)} />
    </>
  );
}
