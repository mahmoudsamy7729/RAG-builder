import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error(result.error || "Login failed. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - CHATful</title>
        <meta name="description" content="Log in to your CHATful account to manage your AI chatbots." />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left panel - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
          <div className="max-w-md w-full mx-auto">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl mb-12">
              <div className="h-10 w-10 gradient-hero rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <span>CHATful</span>
            </Link>

            <div className="mb-8">
              <h1 className="text-3xl font-display font-bold mb-2">Welcome back</h1>
              <p className="text-muted-foreground">
                Log in to manage your chatbots and knowledge bases.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Login to CHATful
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-muted-foreground mt-8">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary font-medium hover:underline">
                Create one for free
              </Link>
            </p>
          </div>
        </div>

        {/* Right panel - Illustration */}
        <div className="hidden lg:flex w-1/2 gradient-hero items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-40 h-40 bg-primary-foreground/10 rounded-full blur-2xl" />
            <div className="absolute bottom-20 right-10 w-60 h-60 bg-primary-foreground/10 rounded-full blur-2xl" />
          </div>
          
          <div className="relative z-10 text-primary-foreground text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-8 bg-primary-foreground/20 rounded-3xl flex items-center justify-center backdrop-blur">
              <MessageSquare className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">
              Your AI chatbot is waiting
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Access your dashboard to manage chatbots, upload knowledge bases, and view analytics.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
