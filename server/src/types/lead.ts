export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Lost";

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Converted",
  "Lost",
];

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  lead_status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadInput {
  name: string;
  email: string;
  phone?: string | null;
  company_name?: string | null;
  lead_status: LeadStatus;
  notes?: string | null;
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  weeklyTrend: { date: string; count: number }[];
}
