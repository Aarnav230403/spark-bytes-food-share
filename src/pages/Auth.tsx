import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  // Added sign-up fields + error state
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // helper to check BU email
  const isBuEmail = (value: string) => /@bu\.edu$/i.test(value.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      // Login flow
      console.log("Logging in:", { email, password });
      //TODO: Integrate with backend authentication call login API
      return;
    }
    // Sign-up flow validations
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your BU email.");
      return;
    }
    // Enforce BU email domain for sign up
    if (!isBuEmail(email)) {
      setError("You must sign up with a BU email address (ending with @bu.edu).");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const signupPayload = { fullName, email, password };
    console.log("Signing up:", signupPayload);
    // TODO: call signup API

  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="text-2xl font-bold text-primary hover:text-primary-dark transition-colors">
          Spark Bytes
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-fade-in shadow-card-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin
                ? "Sign in to manage your event reservations"
                : "Join SparkBytes to discover and manage campus events"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full name only for sign up */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {/* Confirm password only for sign up */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              {isLogin && (
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-dark transition-colors">
                    Forgot password?
                  </Link>
                </div>
              )}

              {error && <div className="text-sm text-red-600">{error}</div>}

              <Button type="submit" className="w-full" size="lg">
                {isLogin ? "Log In" : "Sign Up"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>

          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFullName("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                  setError(null);
                }}
                className="text-primary hover:text-primary-dark transition-colors font-medium"
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </div>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        <p>Part of the BU community effort to reduce food waste!</p>
      </footer>
    </div>
  );
};

export default Auth;
