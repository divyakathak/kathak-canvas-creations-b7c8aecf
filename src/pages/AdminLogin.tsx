import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    document.title = "Admin · Anaya Rao";
  }, []);

  useEffect(() => {
    if (!loading && user && isAdmin) nav("/admin", { replace: true });
  }, [user, isAdmin, loading, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
        setBusy(false);
        return;
      }
      // Self-promote to admin if no admin exists yet (bootstrap)
      if (data.user) {
        const { data: existing } = await supabase
          .from("user_roles")
          .select("id")
          .eq("role", "admin")
          .limit(1);

        if (!existing || existing.length === 0) {
          await supabase.from("user_roles").insert([{ user_id: data.user.id, role: "admin" }]);
          toast({
            title: "Welcome, admin",
            description: "Account created and promoted to admin.",
          });
        } else {
          toast({
            title: "Account created",
            description: "An admin must grant you access.",
          });
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      }
    }
    setBusy(false);
  };

  return (
    <div className="min-h-screen bg-noir flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-12">
          <p className="font-display text-3xl tracking-wider text-cream">
            Anaya<span className="text-primary"> · </span>Rao
          </p>
          <p className="eyebrow text-cream/40 mt-2 text-[10px]">Admin Portal</p>
        </Link>

        <div className="border border-border p-8 md:p-10 bg-card">
          <h1 className="font-display text-3xl text-cream italic mb-8">
            {mode === "signin" ? "Sign In" : "Create Admin Account"}
          </h1>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="eyebrow text-cream/60 block mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border focus:border-primary outline-none px-4 py-3 text-cream"
              />
            </div>
            <div>
              <label className="eyebrow text-cream/60 block mb-2">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input border border-border focus:border-primary outline-none px-4 py-3 text-cream"
              />
            </div>

            <Button type="submit" variant="gold" className="w-full" disabled={busy}>
              {busy ? "..." : mode === "signin" ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <button
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="block w-full mt-6 eyebrow text-cream/50 hover:text-primary text-center"
          >
            {mode === "signin"
              ? "First time? Create the admin account →"
              : "← Back to sign in"}
          </button>

          {mode === "signup" && (
            <p className="text-xs text-cream/40 mt-4 text-center">
              The first account created becomes the admin automatically.
            </p>
          )}
        </div>

        <Link to="/" className="block text-center mt-8 eyebrow text-cream/40 hover:text-primary text-[10px]">
          ← Back to site
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
