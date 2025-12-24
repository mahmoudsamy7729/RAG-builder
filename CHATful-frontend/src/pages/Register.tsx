import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const result = await register(email, name, password);
    setIsLoading(false);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Account Created!",
        text: "A verification email has been sent to your email address. Please check your inbox.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
      }).then(() => {
        navigate("/login");
      });
    } else {
      toast.error(result.error || "Registration failed. Please try again.");
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account - CHATful</title>
        <meta name="description" content="Create your free CHATful account and start building AI chatbots in minutes." />
      </Helmet>

      <div className="min-h-screen flex">
        {/* Left panel - Illustration */}
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
              Join thousands of happy users
            </h2>
            <p className="text-lg text-primary-foreground/80">
              Create AI chatbots that actually understand your business and help your customers 24/7.
            </p>
          </div>
        </div>

        {/* Right panel - Form */}
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
              <h1 className="text-3xl font-display font-bold mb-2">Create your account</h1>
              <p className="text-muted-foreground">
                Start building AI chatbots for free. No credit card required.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="johndoe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                  autoComplete="username"
                />
              </div>

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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12"
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Create your free account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms</Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
              </p>
            </form>

            <p className="text-center text-muted-foreground mt-8">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
