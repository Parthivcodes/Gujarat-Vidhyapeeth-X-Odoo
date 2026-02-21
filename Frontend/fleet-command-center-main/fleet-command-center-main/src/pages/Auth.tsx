import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLogin } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Zap, Loader2, Eye, EyeOff } from "lucide-react";
import authHero from "@/assets/auth-hero.jpg";

export default function Auth() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    loginMutation.mutate(
      { email, password },
      {
        onSuccess: () => navigate("/"),
        onError: (err: unknown) => {
          const axiosErr = err as { response?: { data?: { message?: string } } };
          setError(axiosErr.response?.data?.message || "Invalid credentials");
        },
      }
    );
  };

  return (
    <div className="flex min-h-screen">
      {/* Left branding panel */}
      <div className="relative hidden flex-1 lg:block">
        <img
          src={authHero}
          alt="Fleet yard at night"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/40" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary glow-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">FleetFlow</span>
          </div>
          <div className="max-w-md">
            <h2 className="text-3xl font-bold leading-tight text-foreground">
              Your logistics
              <br />
              <span className="text-gradient-primary">command center.</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Manage your fleet, dispatch trips, track maintenance, and monitor performance — all from one powerful dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full max-w-lg flex-col justify-center px-8 py-12 lg:px-16">
        <div className="lg:hidden mb-8 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary glow-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-base font-bold text-foreground">FleetFlow</span>
        </div>

        <div>
          <h1 className="text-xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your FleetFlow account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-10 bg-secondary/50 border-border focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                Password
              </Label>
              <button type="button" className="text-xs text-primary hover:underline">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10 bg-secondary/50 border-border pr-10 focus:border-primary focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-xs text-muted-foreground">
                Remember me
              </Label>
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="h-10 w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-primary"
          >
            {loginMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
