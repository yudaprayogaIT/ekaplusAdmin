"use client";

import type React from "react";
import type { DriveStep, Driver } from "driver.js";
import type { FeatureTourStep } from "@/lib/featureTour";

export const PROFILE_TOUR_TOTAL_STEPS = 5;

export const PROFILE_TOUR_SELECTORS = {
  menu: "[data-tour='profile-menu-button']",
  edit: "[data-tour='profile-edit-action']",
  photo: "[data-tour='profile-photo-action']",
  form: "[data-tour='profile-form-section']",
  save: "[data-tour='profile-save-action']",
} as const;

export type ProfilePageTourStep = Extract<
  FeatureTourStep,
  "edit" | "photo" | "form" | "save"
>;

type HeaderTourActions = {
  openProfile: () => void;
  skipTour: () => void;
};

type PageTourActions = {
  driverRef: React.MutableRefObject<Driver | null>;
  backToMenu: () => void;
  goToPhoto: () => Promise<boolean>;
  goToForm: () => Promise<boolean>;
  goToSave: () => Promise<boolean>;
  backToEdit: () => Promise<boolean>;
  backToPhoto: () => Promise<boolean>;
  backToForm: () => Promise<boolean>;
  finishTour: () => void;
};

export function getProfilePageTourStartIndex(
  step: ProfilePageTourStep,
): number {
  if (step === "photo") return 1;
  if (step === "form") return 2;
  if (step === "save") return 3;
  return 0;
}

export function createProfileHeaderTourSteps(
  actions: HeaderTourActions,
): DriveStep[] {
  return [
    {
      element: PROFILE_TOUR_SELECTORS.menu,
      popover: {
        title: "Masuk ke Menu Profile",
        description:
          "Klik menu profile untuk membuka halaman profil sebelum lanjut ke langkah edit berikutnya.",
        side: "left",
        align: "start",
        doneBtnText: "Buka Profile",
        onDoneClick: () => {
          actions.openProfile();
        },
        onCloseClick: () => {
          actions.skipTour();
        },
      },
    },
  ];
}

export function createProfilePageTourSteps(
  actions: PageTourActions,
): DriveStep[] {
  return [
    {
      element: PROFILE_TOUR_SELECTORS.edit,
      popover: {
        title: "Sekarang profil bisa diedit langsung",
        description: "Klik edit profile untuk mengedit profil anda.",
        side: "bottom",
        align: "center",
        disableButtons: [],
        onPrevClick: () => {
          actions.backToMenu();
        },
        onNextClick: async () => {
          const ready = await actions.goToPhoto();
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
      element: PROFILE_TOUR_SELECTORS.photo,
      popover: {
        title: "Foto profil juga bisa diganti",
        description:
          "Di dalam form edit profile, kamu bisa klik ikon pensil ini untuk memilih foto profil baru.",
        side: "left",
        align: "center",
        // nextBtnText: "Lanjut Edit Data",
        onNextClick: async () => {
          const ready = await actions.goToForm();
          if (ready) {
            actions.driverRef.current?.moveNext();
          }
        },
        onPrevClick: async () => {
          const ready = await actions.backToEdit();
          if (ready) {
            actions.driverRef.current?.movePrevious();
          }
        },
        onCloseClick: () => {
          actions.finishTour();
        },
      },
    },
    {
      element: PROFILE_TOUR_SELECTORS.form,
      popover: {
        title: "Anda juga bisa mengedit data anda disini",
        description:
          "Di bagian ini anda bisa memperbarui data identitas dan alamat sebelum menyimpan perubahan profil.",
        side: "right",
        align: "start",
        // nextBtnText: "Lanjut Save",
        onPrevClick: async () => {
          const ready = await actions.backToPhoto();
          if (ready) {
            actions.driverRef.current?.movePrevious();
          }
        },
        onNextClick: async () => {
          const ready = await actions.goToSave();
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
      element: PROFILE_TOUR_SELECTORS.save,
      popover: {
        title: "Setelah selesai, simpan perubahan",
        description:
          "Kalau semua data sudah sesuai, klik Save Changes untuk menyimpan update profil anda.",
        side: "left",
        align: "center",
        doneBtnText: "Selesai",
        onPrevClick: async () => {
          const ready = await actions.backToForm();
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
