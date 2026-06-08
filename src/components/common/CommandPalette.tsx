import { useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import { LayoutDashboard, Users, Plus, LogOut, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";

export function CommandPalette({
  open,
  setOpen,
  onSignOut,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  onSignOut: () => void;
}) {
  const navigate = useNavigate();
  const { toggle, theme } = useTheme();

  const run = (fn: () => void) => () => { setOpen(false); fn(); };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="fixed left-1/2 top-[20%] z-50 w-[92%] max-w-xl -translate-x-1/2"
          >
            <Command className="glass-strong rounded-2xl overflow-hidden border border-border shadow-2xl">
              <Command.Input
                placeholder="Type a command or search…"
                className="w-full bg-transparent px-5 py-4 outline-none border-b border-border placeholder:text-muted-foreground"
              />
              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="px-4 py-6 text-sm text-muted-foreground">
                  No results.
                </Command.Empty>
                <Command.Group heading="Navigate" className="text-xs text-muted-foreground px-2 py-1">
                  <Item icon={<LayoutDashboard className="h-4 w-4" />} label="Go to Dashboard" onSelect={run(() => navigate({ to: "/dashboard" }))} />
                  <Item icon={<Users className="h-4 w-4" />} label="Go to Leads" onSelect={run(() => navigate({ to: "/leads", search: { new: false } }))} />
                </Command.Group>
                <Command.Group heading="Actions" className="text-xs text-muted-foreground px-2 py-1">
                  <Item icon={<Plus className="h-4 w-4" />} label="Add new lead" onSelect={run(() => navigate({ to: "/leads", search: { new: true } }))} />
                  <Item
                    icon={theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    onSelect={run(toggle)}
                  />
                  <Item icon={<LogOut className="h-4 w-4" />} label="Sign out" onSelect={run(onSignOut)} />
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Item({ icon, label, onSelect }: { icon: React.ReactNode; label: string; onSelect: () => void }) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm cursor-pointer data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary transition"
    >
      <span className="text-muted-foreground">{icon}</span>
      {label}
    </Command.Item>
  );
}
