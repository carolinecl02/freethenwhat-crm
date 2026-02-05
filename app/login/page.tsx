"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
        return;
      }
      setCheckingAuth(false);
    });
  }, [router]);

  let supabase: SupabaseClient;
  try {
    supabase = createClient();
  } catch (e) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-sm text-center text-primary-text">
          <p className="font-medium">Configuration error</p>
          <p className="text-sm text-secondary-text mt-1">
            {e instanceof Error ? e.message : "Missing NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"}
          </p>
        </div>
      </div>
    );
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-secondary-text">Loading…</p>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          console.error("Sign in error:", error);
          setMessage({ type: "error", text: error.message });
          setLoading(false);
          return;
        }
        // Full page navigation so the next request sends the new session cookies to the server
        window.location.href = "/dashboard";
        return;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          console.error("Sign up error:", error);
          setMessage({ type: "error", text: error.message });
          setLoading(false);
          return;
        }
        setMessage({
          type: "success",
          text: "Check your email for the confirmation link, or sign in if you're already confirmed.",
        });
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-surface rounded-card shadow-card p-8 border border-secondary-text/10">
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-primary-text">
              Free. Then What
            </h1>
            <p className="text-sm text-secondary-text mt-1">
              {mode === "signin" ? "Sign in to your account" : "Create an account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-primary-text mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-panel border border-secondary-text/20 bg-background text-primary-text placeholder:text-secondary-text/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-primary-text mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 rounded-panel border border-secondary-text/20 bg-background text-primary-text placeholder:text-secondary-text/60 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
                minLength={6}
              />
            </div>

            {message && (
              <p
                className={`text-sm ${
                  message.type === "error" ? "text-red-600" : "text-green-600"
                }`}
              >
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-panel bg-accent text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setMessage(null);
              }}
              className="text-sm text-accent hover:underline"
            >
              {mode === "signin"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
