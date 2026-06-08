import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";

type FormValues = { email: string; password: string };

export const Route = createFileRoute("/auth")({
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      if (mode === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: { emailRedirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) throw error;
        toast.success("Account created — welcome!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        toast.success("Welcome back");
      }
      navigate({ to: "/dashboard" });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 gradient-brand opacity-90" />
        <div className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -top-24 -left-24 w-[22rem] h-[22rem] rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 text-white">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Lumen CRM</span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="relative z-10 text-white"
        >
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            Turn conversations into conversions.
          </h1>
          <p className="mt-4 text-white/80 max-w-md">
            A premium lead management workspace built for modern teams. Track every prospect,
            measure every touchpoint, ship with confidence.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {["Realtime stats", "Status pipelines", "Premium UX"].map((t) => (
              <div key={t} className="rounded-2xl bg-white/10 backdrop-blur px-4 py-3 text-sm">
                {t}
              </div>
            ))}
          </div>
        </motion.div>
        <div className="relative z-10 text-xs text-white/60">© Lumen CRM</div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md glass rounded-3xl p-8 sm:p-10"
        >
          <div className="lg:hidden mb-6 flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl gradient-brand flex items-center justify-center text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Lumen CRM</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === "sign-in" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "sign-in" ? "Sign in to access your leads." : "Start managing leads in seconds."}
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Enter a valid email" },
                })}
                className="mt-1.5 w-full rounded-xl bg-input/60 border border-border px-4 py-2.5 outline-none focus:ring-4 focus:ring-ring transition"
                placeholder="you@company.com"
              />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
                className="mt-1.5 w-full rounded-xl bg-input/60 border border-border px-4 py-2.5 outline-none focus:ring-4 focus:ring-ring transition"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl gradient-brand text-primary-foreground font-medium py-2.5 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>
                {mode === "sign-in" ? "Sign in" : "Create account"}
                <ArrowRight className="h-4 w-4" />
              </>}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "sign-in" ? (
              <>Don't have an account?{" "}
                <button onClick={() => setMode("sign-up")} className="text-primary font-medium hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>Already have an account?{" "}
                <button onClick={() => setMode("sign-in")} className="text-primary font-medium hover:underline">
                  Sign in
                </button>
              </>
            )}
          </div>
          <Link to="/" className="hidden" />
        </motion.div>
      </div>
    </div>
  );
}
