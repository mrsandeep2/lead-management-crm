import { motion } from "framer-motion";
import type { LeadStatus } from "@/lib/leads/types";

const STYLES: Record<LeadStatus, string> = {
  New: "bg-[oklch(0.95_0.04_250)] text-[oklch(0.4_0.18_250)] ring-[oklch(0.8_0.1_250)]",
  Contacted: "bg-[oklch(0.95_0.04_305)] text-[oklch(0.42_0.18_305)] ring-[oklch(0.82_0.1_305)]",
  Qualified: "bg-[oklch(0.96_0.06_85)] text-[oklch(0.42_0.16_70)] ring-[oklch(0.85_0.12_85)]",
  Converted: "bg-[oklch(0.94_0.06_155)] text-[oklch(0.38_0.14_155)] ring-[oklch(0.82_0.12_155)]",
  Lost: "bg-[oklch(0.95_0.04_27)] text-[oklch(0.45_0.18_27)] ring-[oklch(0.85_0.1_27)]",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </motion.span>
  );
}
