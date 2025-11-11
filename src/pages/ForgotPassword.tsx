import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "http://localhost:8080/update-password"
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess("If an account with that email exists, a reset link has been sent.");
        }
};

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-6">
                <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
                    TerrierTable
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <Card className="w-full max-w-md animate-fade-in shadow-card-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                        <CardDescription className="text-center">
                            Enter your email to receive a password reset link.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="student@bu.edu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            {error && <div className="text-sm text-red-600">{error}</div>}
                            {success && <div className="text-sm text-green-600">{success}</div>}

                            <Button type="submit" className="w-full" size="lg">
                                Send Reset Link
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <div className="text-sm text-center text-muted-foreground">
                            Remembered your password?{" "}
                            <Link to="/auth" className="text-primary hover:text-primary-dark transition-colors font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </main>

            <footer className="p-6 text-center text-sm text-muted-foreground">
                <p>Part of the BU community effort to reduce food waste!</p>
            </footer>
        </div>
    );
};

export default ForgotPassword;