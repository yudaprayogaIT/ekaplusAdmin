"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowRight, FaCirclePlay } from "react-icons/fa6";
import { helpTopics, launchHelpTopic } from "@/lib/helpTopics";

export default function HelpCenterPage() {
  const router = useRouter();

  return (
    <section className="mx-auto flex w-full flex-col gap-5 p-4">
      <div className="border-b border-slate-200 pb-4">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
            Help Center
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
            Pilih Panduan
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Pilih topik, lalu sistem akan membuka halaman terkait dan memandu
            Anda langkah demi langkah.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {helpTopics.map((topic, index) => (
          <motion.article
            key={topic.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.05 }}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-red-200 hover:shadow-md md:flex-row md:items-center md:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <FaCirclePlay className="h-3 w-3" />
                  Topik Panduan
                </div>
                <h2 className="text-base font-semibold leading-snug text-slate-900 md:text-lg">
                  {topic.title}
                </h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {topic.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => launchHelpTopic(router, topic)}
              className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 md:min-w-40"
            >
              Mulai Panduan
              <FaArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
