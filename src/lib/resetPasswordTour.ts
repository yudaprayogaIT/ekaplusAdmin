"use client";

import type React from "react";
import type { DriveStep, Driver } from "driver.js";

export const RESET_PASSWORD_TOUR_TOTAL_STEPS = 6;

export const RESET_PASSWORD_TOUR_SELECTORS = {
  trigger: "[data-tour='profile-reset-action']",
  modal: "[data-tour='profile-reset-modal']",
  newPassword: "[data-tour='profile-reset-new-password']",
  confirmPassword: "[data-tour='profile-reset-confirm-password']",
  submit: "[data-tour='profile-reset-submit']",
} as const;

export type ResetPasswordTourStep = "password";

type ResetPasswordTourActions = {
  driverRef: React.MutableRefObject<Driver | null>;
  backToMenu: () => void;
  goToResetModal: () => Promise<boolean>;
  goToResetForm: () => Promise<boolean>;
  goToResetConfirm: () => Promise<boolean>;
  goToResetSubmit: () => Promise<boolean>;
  backToResetButton: () => Promise<boolean>;
  backToResetModal: () => Promise<boolean>;
  backToResetNewPassword: () => Promise<boolean>;
  backToResetConfirm: () => Promise<boolean>;
  finishTour: () => void;
};

export function getResetPasswordTourStartIndex(): number {
  return 0;
}

export function createResetPasswordTourSteps(
  actions: ResetPasswordTourActions,
): DriveStep[] {
  return [
    {
      element: RESET_PASSWORD_TOUR_SELECTORS.trigger,
      popover: {
        title: "Masuk ke Flow Reset Password",
        description:
          "Klik Reset Password untuk membuka form penggantian password akun Anda.",
        side: "bottom",
        align: "center",
        onPrevClick: () => {
          actions.backToMenu();
        },
        onNextClick: async () => {
          const ready = await actions.goToResetModal();
          if (ready) {
            actions.driverRef.current?.moveNext();
          }
        },
        onCloseClick: () => {
          actions.finishTour();
        },
      },
    },
    {
      element: RESET_PASSWORD_TOUR_SELECTORS.modal,
      popover: {
        title: "Form Reset Password",
        description:
          "Setelah tombol reset dibuka, modal ini menjadi area utama untuk mengisi password baru dengan aman.",
        side: "left",
        align: "start",
        onPrevClick: async () => {
          const ready = await actions.backToResetButton();
          if (ready) {
            actions.driverRef.current?.movePrevious();
          }
        },
        onNextClick: async () => {
          const ready = await actions.goToResetForm();
          if (ready) {
            actions.driverRef.current?.moveNext();
          }
        },
        onCloseClick: () => {
          actions.finishTour();
        },
      },
    },
    {
      element: RESET_PASSWORD_TOUR_SELECTORS.newPassword,
      popover: {
        title: "Isi Password Baru",
        description:
          "Masukkan password baru yang aman. Gunakan minimal 8 karakter dan sertakan angka agar lolos validasi.",
        side: "bottom",
        align: "start",
        onPrevClick: async () => {
          const ready = await actions.backToResetModal();
          if (ready) {
            actions.driverRef.current?.movePrevious();
          }
        },
        onNextClick: async () => {
          const ready = await actions.goToResetConfirm();
          if (ready) {
            actions.driverRef.current?.moveNext();
          }
        },
        onCloseClick: () => {
          actions.finishTour();
        },
      },
    },
    {
      element: RESET_PASSWORD_TOUR_SELECTORS.confirmPassword,
      popover: {
        title: "Konfirmasi Password Baru",
        description:
          "Ulangi password yang sama di field konfirmasi agar sistem bisa memastikan tidak ada typo.",
        side: "bottom",
        align: "start",
        onPrevClick: async () => {
          const ready = await actions.backToResetNewPassword();
          if (ready) {
            actions.driverRef.current?.movePrevious();
          }
        },
        onNextClick: async () => {
          const ready = await actions.goToResetSubmit();
          if (ready) {
            actions.driverRef.current?.moveNext();
          }
        },
        onCloseClick: () => {
          actions.finishTour();
        },
      },
    },
    {
      element: RESET_PASSWORD_TOUR_SELECTORS.submit,
      popover: {
        title: "Simpan Password Baru",
        description:
          "Jika password baru dan konfirmasinya sudah sesuai, klik Update Password untuk menyimpan perubahan.",
        side: "top",
        align: "end",
        doneBtnText: "Selesai",
        onPrevClick: async () => {
          const ready = await actions.backToResetConfirm();
          if (ready) {
            actions.driverRef.current?.movePrevious();
          }
        },
        onDoneClick: () => {
          actions.finishTour();
        },
        onCloseClick: () => {
          actions.finishTour();
        },
      },
    },
  ];
}
