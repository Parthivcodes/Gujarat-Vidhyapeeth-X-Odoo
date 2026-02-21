import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useRegister } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Loader2, Eye, EyeOff, UserPlus } from "lucide-react";
import authHero from "@/assets/auth-hero.jpg";

export default function Signup() {
    const navigate = useNavigate();
    const registerMutation = useRegister();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [role, setRole] = useState("fleet_manager");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !passwordConfirmation || !role) {
            setError("Please fill in all fields");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        if (password !== passwordConfirmation) {
            setError("Passwords do not match");
            return;
        }
        setError("");
        registerMutation.mutate(
            { name, email, password, password_confirmation: passwordConfirmation, role },
            {
                onSuccess: () => navigate("/"),
                onError: (err: unknown) => {
                    const axiosErr = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
                    if (axiosErr.response?.data?.errors) {
                        const msgs = Object.values(axiosErr.response.data.errors).flat();
                        setError(msgs.join(". "));
                    } else {
                        setError(axiosErr.response?.data?.message || "Registration failed");
                    }
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
                            Join the future of
                            <br />
                            <span className="text-gradient-primary">fleet management.</span>
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            Create your account and start managing your fleet, dispatch trips, track maintenance, and monitor performance — all from one powerful dashboard.
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
                    <h1 className="text-xl font-bold text-foreground">Create your account</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Get started with FleetFlow in seconds
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-medium text-muted-foreground">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                            className="h-10 bg-secondary/50 border-border focus:border-primary focus:ring-primary"
                        />
                    </div>

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
                        <Label htmlFor="password" className="text-xs font-medium text-muted-foreground">
                            Password
                        </Label>
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

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className="text-xs font-medium text-muted-foreground">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Input
                                id="password_confirmation"
                                type={showConfirm ? "text" : "password"}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                placeholder="••••••••"
                                className="h-10 bg-secondary/50 border-border pr-10 focus:border-primary focus:ring-primary"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role" className="text-xs font-medium text-muted-foreground">
                            Account Role
                        </Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger id="role" className="h-10 bg-secondary/50 border-border focus:border-primary focus:ring-primary">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fleet_manager">Fleet Manager</SelectItem>
                                <SelectItem value="dispatcher">Dispatcher</SelectItem>
                                <SelectItem value="safety_officer">Safety Officer</SelectItem>
                                <SelectItem value="financial_analyst">Financial Analyst</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {error && (
                        <p className="text-xs text-destructive">{error}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="h-10 w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-primary"
                    >
                        {registerMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-2">
                                <UserPlus className="h-4 w-4" />
                                Create Account
                            </span>
                        )}
                    </Button>

                    <p className="text-center text-xs text-muted-foreground">
                        Already have an account?{" "}
                        <Link to="/auth" className="font-medium text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
