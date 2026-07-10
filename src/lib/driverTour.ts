"use client";

import { driver, type Config, type DriveStep, type Driver } from "driver.js";

export function createDriverSteps(
  steps: DriveStep[],
  options?: {
    totalSteps?: number;
    stepOffset?: number;
  },
): DriveStep[] {
  const totalSteps = options?.totalSteps ?? steps.length;
  const stepOffset = options?.stepOffset ?? 0;

  return steps.map((step, index) => ({
    ...step,
    popover: step.popover
      ? {
          showProgress: step.popover.showProgress ?? true,
          progressText:
            step.popover.progressText ??
            `${stepOffset + index + 1} dari ${totalSteps}`,
          ...step.popover,
        }
      : step.popover,
  }));
}

export function createDriverTour(config?: Config): Driver {
  const customOnPopoverRender = config?.onPopoverRender;

  return driver({
    animate: true,
    allowClose: true,
    allowKeyboardControl: true,
    overlayOpacity: 0.42,
    smoothScroll: true,
    stagePadding: 10,
    stageRadius: 18,
    showProgress: true,
    progressText: "{{current}} dari {{total}}",
    nextBtnText: "Lanjut",
    prevBtnText: "Sebelumnya",
    doneBtnText: "Selesai",
    popoverClass: "app-driver-popover",
    onPopoverRender: (popover, opts) => {
      popover.closeButton.textContent = "Lewati";
      popover.closeButton.setAttribute("aria-label", "Lewati tour");
      popover.closeButton.classList.add("app-driver-skip-btn");
      customOnPopoverRender?.(popover, opts);
    },
    ...config,
  });
}

export async function waitForElement(
  selector: string,
  {
    timeout = 4000,
    interval = 100,
  }: {
    timeout?: number;
    interval?: number;
  } = {},
): Promise<HTMLElement | null> {
  if (typeof window === "undefined") return null;

  const startedAt = Date.now();

  return new Promise((resolve) => {
    const check = () => {
      const element = document.querySelector<HTMLElement>(selector);
      if (element) {
        resolve(element);
        return;
      }

      if (Date.now() - startedAt >= timeout) {
        resolve(null);
        return;
      }

      window.setTimeout(check, interval);
    };

    check();
  });
}

export async function waitForElementToDisappear(
  selector: string,
  {
    timeout = 4000,
    interval = 100,
  }: {
    timeout?: number;
    interval?: number;
  } = {},
): Promise<boolean> {
  if (typeof window === "undefined") return false;

  const startedAt = Date.now();

  return new Promise((resolve) => {
    const check = () => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element) {
        resolve(true);
        return;
      }

      if (Date.now() - startedAt >= timeout) {
        resolve(false);
        return;
      }

      window.setTimeout(check, interval);
    };

    check();
  });
}
