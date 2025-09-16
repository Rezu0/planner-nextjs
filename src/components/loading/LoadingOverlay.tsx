"use client"

import { useLoading } from "@/components/loading/LoadingContext";
import { motion } from "framer-motion";

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-500/40 backdrop-blur-sm z-50">
      {/* Animasi titik */}
      <motion.div
        className="flex space-x-2 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.span
          className="w-3 h-3 rounded-full bg-white"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        />
        <motion.span
          className="w-3 h-3 rounded-full bg-white"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.2 }}
        />
        <motion.span
          className="w-3 h-3 rounded-full bg-white"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.4 }}
        />
      </motion.div>

      {/* Tulisan Loading */}
      <motion.p
        className="text-white text-lg font-medium tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Loading...
      </motion.p>
    </div>
  );
}