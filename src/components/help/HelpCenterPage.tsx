"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaArrowRight, FaCirclePlay, FaRegLightbulb } from "react-icons/fa6";
import { helpTopics, launchHelpTopic } from "@/lib/helpTopics";

export default function HelpCenterPage() {
  const router = useRouter();

  return (
    <section className="mx-auto flex w-full p-4 flex-col gap-6">
      <div className="overflow-hidden rounded-[28px] border border-red-100 bg-gradient-to-br from-white via-red-50 to-amber-50 shadow-sm">
        <div className="flex flex-col gap-6 px-6 py-8 md:px-8 md:py-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-red-600 shadow-sm">
            <FaRegLightbulb className="h-3.5 w-3.5" />
            Help Center
          </div>
          <div className="max-w-3xl">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Pilih Panduan yang Ingin Dipelajari{" "}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
              Pilih salah satu topik di bawah ini. Sistem akan membuka halaman
              yang sesuai dan memandu Anda langkah demi langkah.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {helpTopics.map((topic, index) => (
          <motion.article
            key={topic.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.05 }}
            className="flex h-full flex-col justify-between rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                <FaCirclePlay className="h-3 w-3" />
                Topik Panduan
              </div>
              <h2 className="mt-4 text-xl font-semibold text-slate-900">
                {topic.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {topic.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => launchHelpTopic(router, topic)}
              className="mt-6 inline-flex items-center cursor-pointer justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
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
