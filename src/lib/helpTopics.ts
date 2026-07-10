"use client";

import {
  clearFeatureTourFollowUpStep,
  clearPendingFeatureTourStep,
  setFeatureTourFollowUpStep,
  profileFeatureTourConfig,
  setPendingFeatureTourStep,
  type FeatureTourStep,
} from "@/lib/featureTour";
import { setPendingCustomerRegistrationApproveTour } from "@/lib/customerRegistrationApproveTour";

export type HelpTopic = {
  id: string;
  title: string;
  description: string;
  route: string;
  action: "profile-tour" | "customer-registration-approve-tour";
  step?: FeatureTourStep;
};

export const helpTopics: HelpTopic[] = [
  {
    id: "edit-profile",
    title: "Edit Profile",
    description:
      "Pelajari cara memperbarui informasi profil Anda, seperti nama, data pribadi, foto profil dan informasi akun lainnya.",
    route: "/profile",
    action: "profile-tour",
    step: "edit",
  },
  {
    id: "approve-customer-register",
    title: "Approve Customer Register",
    description:
      "Ikuti simulasi proses approval registrasi customer menggunakan data contoh yang sudah disiapkan.",
    route: "/customers/registrations",
    action: "customer-registration-approve-tour",
  },
];

type HelpRouter = {
  push: (href: string) => void;
};

export function launchHelpTopic(router: HelpRouter, topic: HelpTopic) {
  if (topic.action === "profile-tour" && topic.step) {
    clearPendingFeatureTourStep(profileFeatureTourConfig);
    clearFeatureTourFollowUpStep(profileFeatureTourConfig);
    setPendingFeatureTourStep(profileFeatureTourConfig, "profile-menu");
    setFeatureTourFollowUpStep(profileFeatureTourConfig, topic.step);
    return;
  }

  if (topic.action === "customer-registration-approve-tour") {
    setPendingCustomerRegistrationApproveTour();
  }
  router.push(topic.route);
}
