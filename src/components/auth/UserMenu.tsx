// src/components/auth/UserMenu.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import LoginForm from "./LoginForm";
import { useRouter } from "next/navigation";
import { getFileUrl } from "@/config/api";
import {
  FEATURE_TOUR_PENDING_CHANGED_EVENT,
  clearFeatureTourFollowUpStep,
  clearPendingFeatureTourStep,
  getFeatureTourFollowUpStep,
  getPendingFeatureTourStep,
  isFeatureTourSeen,
  markFeatureTourSeen,
  profileFeatureTourConfig,
  setPendingFeatureTourStep,
} from "@/lib/featureTour";
import {
  createDriverSteps,
  createDriverTour,
  waitForElement,
} from "@/lib/driverTour";
import {
  createProfileHeaderTourSteps,
  PROFILE_TOUR_TOTAL_STEPS,
} from "@/lib/profileFeatureTour";
import { OPEN_LOGIN_MODAL_EVENT } from "@/lib/loginPrompt";
import { FaArrowRight, FaKey, FaSignInAlt } from "react-icons/fa";
import type { Driver } from "driver.js";

export default function UserMenu() {
  const { currentUser, currentRole, permissions, isAuthenticated, isLoading } =
    useAuth();
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showProfileCoachmark, setShowProfileCoachmark] = useState(false);
  const [showHelpHoverCard, setShowHelpHoverCard] = useState(false);
  const [hoveringHelpCard, setHoveringHelpCard] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [helpCardRect, setHelpCardRect] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [pendingTourStep, setPendingTourStepState] =
    useState<ReturnType<typeof getPendingFeatureTourStep>>(null);
  const hideHoverCardTimerRef = useRef<number | null>(null);
  const profileTourDriverRef = useRef<Driver | null>(null);
  const profileTourAdvancingRef = useRef(false);
  const profileTourSkippingRef = useRef(false);
  const isHelpNoticeVisible =
    showProfileCoachmark || showHelpHoverCard || hoveringHelpCard;

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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncPendingTourStep = () => {
      setPendingTourStepState(
        getPendingFeatureTourStep(profileFeatureTourConfig),
      );
    };

    syncPendingTourStep();
    window.addEventListener(
      FEATURE_TOUR_PENDING_CHANGED_EVENT,
      syncPendingTourStep,
    );
    return () => {
      window.removeEventListener(
        FEATURE_TOUR_PENDING_CHANGED_EVENT,
        syncPendingTourStep,
      );
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOpenLoginModal = () => {
      setShowLoginForm(true);
    };

    window.addEventListener(OPEN_LOGIN_MODAL_EVENT, handleOpenLoginModal);
    return () => {
      window.removeEventListener(OPEN_LOGIN_MODAL_EVENT, handleOpenLoginModal);
    };
  }, []);

  const handleProfileClick = useCallback(() => {
    profileTourAdvancingRef.current = pendingTourStep === "profile-menu";
    profileTourDriverRef.current?.destroy();
    profileTourDriverRef.current = null;
    const followUpStep = getFeatureTourFollowUpStep(profileFeatureTourConfig);
    if (pendingTourStep === "profile-menu" && followUpStep) {
      setPendingFeatureTourStep(profileFeatureTourConfig, followUpStep);
    } else {
      clearPendingFeatureTourStep(profileFeatureTourConfig);
    }
    clearFeatureTourFollowUpStep(profileFeatureTourConfig);
    setShowProfileCoachmark(false);
    setShowHelpHoverCard(false);
    setHoveringHelpCard(false);
    router.push("/profile");
  }, [pendingTourStep, router]);

  useLayoutEffect(() => {
    if (!isHelpNoticeVisible || typeof window === "undefined") {
      setHelpCardRect(null);
      return;
    }

    const updateHelpCardRect = () => {
      const anchor = document.querySelector("[data-tour='help-center-button']");
      if (!(anchor instanceof HTMLElement)) return;

      const rect = anchor.getBoundingClientRect();
      const cardWidth = Math.min(280, Math.max(window.innerWidth - 32, 240));
      const viewportPadding = 12;
      const horizontalGap = 14;
      const preferredLeft = rect.left - cardWidth - horizontalGap;
      const maxLeft = window.innerWidth - cardWidth - viewportPadding;

      setHelpCardRect({
        top: Math.max(viewportPadding, rect.top + rect.height / 2 - 52),
        left: Math.max(viewportPadding, Math.min(preferredLeft, maxLeft)),
        width: cardWidth,
      });
    };

    updateHelpCardRect();
    window.addEventListener("resize", updateHelpCardRect);
    window.addEventListener("scroll", updateHelpCardRect, true);

    return () => {
      window.removeEventListener("resize", updateHelpCardRect);
      window.removeEventListener("scroll", updateHelpCardRect, true);
    };
  }, [isHelpNoticeVisible]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      isLoading ||
      typeof window === "undefined" ||
      isFeatureTourSeen(profileFeatureTourConfig) ||
      pendingTourStep !== "menu"
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setShowProfileCoachmark(true);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isAuthenticated, isLoading, pendingTourStep]);

  useEffect(() => {
    if (
      !isAuthenticated ||
      isLoading ||
      typeof window === "undefined" ||
      pendingTourStep !== "profile-menu"
    ) {
      profileTourAdvancingRef.current = false;
      profileTourSkippingRef.current = false;
      profileTourDriverRef.current?.destroy();
      profileTourDriverRef.current = null;
      return;
    }

    let cancelled = false;

    const startProfileTour = async () => {
      const openProfileFromTour = () => {
        profileTourAdvancingRef.current = pendingTourStep === "profile-menu";
        profileTourDriverRef.current?.destroy();
        profileTourDriverRef.current = null;
        const followUpStep = getFeatureTourFollowUpStep(profileFeatureTourConfig);
        if (pendingTourStep === "profile-menu" && followUpStep) {
          setPendingFeatureTourStep(profileFeatureTourConfig, followUpStep);
        } else {
          clearPendingFeatureTourStep(profileFeatureTourConfig);
        }
        clearFeatureTourFollowUpStep(profileFeatureTourConfig);
        setShowProfileCoachmark(false);
        setShowHelpHoverCard(false);
        setHoveringHelpCard(false);
        router.push("/profile");
      };

      const skipProfileTourFromHeader = () => {
        profileTourSkippingRef.current = true;
        profileTourDriverRef.current?.destroy();
        profileTourDriverRef.current = null;
      };

      const target = await waitForElement("[data-tour='profile-menu-button']", {
        timeout: 4000,
        interval: 100,
      });

      if (cancelled || !target) return;

      profileTourDriverRef.current?.destroy();
      profileTourDriverRef.current = createDriverTour({
        doneBtnText: "Buka Profile",
        onDestroyed: () => {
          profileTourDriverRef.current = null;

          if (profileTourAdvancingRef.current) {
            profileTourAdvancingRef.current = false;
            return;
          }

          if (profileTourSkippingRef.current) {
            profileTourSkippingRef.current = false;
          }

          markFeatureTourSeen(profileFeatureTourConfig);
          clearPendingFeatureTourStep(profileFeatureTourConfig);
          clearFeatureTourFollowUpStep(profileFeatureTourConfig);
        },
        steps: createDriverSteps(
          createProfileHeaderTourSteps({
            openProfile: openProfileFromTour,
            skipTour: skipProfileTourFromHeader,
          }),
          {
            totalSteps: PROFILE_TOUR_TOTAL_STEPS,
            stepOffset: 0,
          },
        ),
      });

      profileTourDriverRef.current.drive();
    };

    void startProfileTour();

    return () => {
      cancelled = true;
      profileTourDriverRef.current?.destroy();
      profileTourDriverRef.current = null;
    };
  }, [isAuthenticated, isLoading, pendingTourStep, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const helpButton = document.querySelector(
      "[data-tour='help-center-button']",
    );
    if (!(helpButton instanceof HTMLElement)) return;

    const clearHideTimer = () => {
      if (hideHoverCardTimerRef.current !== null) {
        window.clearTimeout(hideHoverCardTimerRef.current);
        hideHoverCardTimerRef.current = null;
      }
    };

    const handleMouseEnter = () => {
      clearHideTimer();
      setShowHelpHoverCard(true);
    };

    const handleMouseLeave = () => {
      clearHideTimer();
      hideHoverCardTimerRef.current = window.setTimeout(() => {
        setShowHelpHoverCard(false);
      }, 120);
    };

    helpButton.addEventListener("mouseenter", handleMouseEnter);
    helpButton.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearHideTimer();
      helpButton.removeEventListener("mouseenter", handleMouseEnter);
      helpButton.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!showProfileCoachmark || typeof window === "undefined") return;

    const handleKeyDown = () => {
      markFeatureTourSeen(profileFeatureTourConfig);
      clearPendingFeatureTourStep(profileFeatureTourConfig);
      setShowProfileCoachmark(false);
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [showProfileCoachmark]);

  const acknowledgeProfileCoachmark = () => {
    markFeatureTourSeen(profileFeatureTourConfig);
    clearPendingFeatureTourStep(profileFeatureTourConfig);
    clearFeatureTourFollowUpStep(profileFeatureTourConfig);
    setShowProfileCoachmark(false);
    setShowHelpHoverCard(false);
    setHoveringHelpCard(false);
  };

  const handleHelpClick = () => {
    markFeatureTourSeen(profileFeatureTourConfig);
    clearPendingFeatureTourStep(profileFeatureTourConfig);
    clearFeatureTourFollowUpStep(profileFeatureTourConfig);
    setShowProfileCoachmark(false);
    setShowHelpHoverCard(false);
    setHoveringHelpCard(false);
    router.push("/help");
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
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleProfileClick}
          data-tour="profile-menu-button"
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
              {isHelpNoticeVisible && helpCardRect ? (
                <motion.div
                  initial={{ opacity: 0, x: 8, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="fixed z-[1001]"
                  onMouseEnter={() => {
                    if (hideHoverCardTimerRef.current !== null) {
                      window.clearTimeout(hideHoverCardTimerRef.current);
                      hideHoverCardTimerRef.current = null;
                    }
                    setHoveringHelpCard(true);
                  }}
                  onMouseLeave={() => {
                    setHoveringHelpCard(false);
                    if (!showProfileCoachmark) {
                      hideHoverCardTimerRef.current = window.setTimeout(() => {
                        setShowHelpHoverCard(false);
                      }, 120);
                    }
                  }}
                  style={
                    helpCardRect
                      ? {
                          top: helpCardRect.top,
                          left: helpCardRect.left,
                          width: helpCardRect.width,
                        }
                      : undefined
                  }
                >
                  <div className="relative rounded-2xl border border-red-100 bg-white/95 p-3 shadow-xl backdrop-blur-sm">
                    <div className="absolute right-[-6px] top-9 h-3 w-3 rotate-45 border-r border-t border-red-100 bg-white/95" />
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-red-50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-red-500">
                        Panduan Bantuan
                      </span>
                      <button
                        type="button"
                        onClick={acknowledgeProfileCoachmark}
                        className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Tutup pemberitahuan bantuan"
                      >
                        ×
                      </button>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-600">
                      Butuh bantuan memakai EKA+ Admin? Klik menu Help untuk
                      panduan interaktif.
                    </p>
                    <div className="mt-3 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={handleHelpClick}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 transition hover:text-red-700"
                      >
                        Buka Help
                        <FaArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}

      <LoginForm open={showLoginForm} onClose={() => setShowLoginForm(false)} />
    </>
  );
}
