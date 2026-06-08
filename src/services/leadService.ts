import { api } from "./api";
import type { Lead, LeadInput, LeadStats } from "@/lib/leads/types";

export const leadService = {
  list: () => api.get<Lead[]>("/api/leads"),
  search: (q: string) => api.get<Lead[]>(`/api/leads/search?q=${encodeURIComponent(q)}`),
  stats: () => api.get<LeadStats>("/api/leads/stats"),
  create: (input: LeadInput) => api.post<Lead>("/api/leads", input),
  update: (id: string, input: Partial<LeadInput>) => api.put<Lead>(`/api/leads/${id}`, input),
  remove: (id: string) => api.delete<{ ok: true }>(`/api/leads/${id}`),
};
