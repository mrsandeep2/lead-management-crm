/**
 * Lead service layer.
 * All DB access for leads goes through here so server routes (controllers)
 * stay thin and the same code shape works whether the request comes from
 * the TanStack server route or the standalone Express backend in /server.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Lead, LeadInput, LeadStats, LeadStatus } from "./types";
import { LEAD_STATUSES } from "./types";

export class LeadService {
  constructor(private supabase: SupabaseClient, private userId: string) {}

  async list(): Promise<Lead[]> {
    const { data, error } = await this.supabase
      .from("leads")
      .select("*")
      .eq("user_id", this.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Lead[];
  }

  async search(q: string): Promise<Lead[]> {
    const term = q.trim();
    if (!term) return this.list();
    const pattern = `%${term.replace(/[%_]/g, "")}%`;
    const { data, error } = await this.supabase
      .from("leads")
      .select("*")
      .eq("user_id", this.userId)
      .or(`name.ilike.${pattern},email.ilike.${pattern},company_name.ilike.${pattern}`)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Lead[];
  }

  async create(input: LeadInput): Promise<Lead> {
    const { data, error } = await this.supabase
      .from("leads")
      .insert({ ...input, user_id: this.userId })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as Lead;
  }

  async update(id: string, input: Partial<LeadInput>): Promise<Lead> {
    const { data, error } = await this.supabase
      .from("leads")
      .update(input)
      .eq("id", id)
      .eq("user_id", this.userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return data as Lead;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("leads")
      .delete()
      .eq("id", id)
      .eq("user_id", this.userId);
    if (error) throw new Error(error.message);
  }

  async stats(): Promise<LeadStats> {
    const leads = await this.list();
    const byStatus = LEAD_STATUSES.reduce((acc, s) => {
      acc[s] = 0;
      return acc;
    }, {} as Record<LeadStatus, number>);
    leads.forEach((l) => { byStatus[l.lead_status] += 1; });

    // Weekly trend (last 14 days)
    const days: { date: string; count: number }[] = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const count = leads.filter((l) => l.created_at.slice(0, 10) === key).length;
      days.push({ date: key, count });
    }

    return { total: leads.length, byStatus, weeklyTrend: days };
  }
}
