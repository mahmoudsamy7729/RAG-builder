import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Upload, MessageSquare, Code } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl" />
        
        {/* Floating bubbles */}
        <div className="absolute top-32 right-1/4 w-4 h-4 bg-primary/30 rounded-full animate-float" />
        <div className="absolute bottom-40 left-1/4 w-6 h-6 bg-accent/30 rounded-full animate-float-delayed" />
        <div className="absolute top-1/2 right-20 w-3 h-3 bg-primary/40 rounded-full animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Copy */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now in Public Beta
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight">
              Build AI Chatbots from{" "}
              <span className="gradient-text">Your Knowledge Base</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
              Upload your content, customize your widget, and embed anywhere with one script. 
              Create intelligent chatbots that actually understand your business — in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="xl" variant="hero" asChild>
                <Link to="/register">
                  Start for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="hero-outline" className="group">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                5-minute setup
              </div>
            </div>
          </div>

          {/* Right side - Dashboard preview */}
          <div className="relative lg:pl-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative">
              {/* Main dashboard card */}
              <div className="glass rounded-2xl border border-border/50 p-6 shadow-xl">
                <div className="space-y-4">
                  {/* Upload card */}
                  <div className="bg-background rounded-xl p-4 border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg gradient-hero flex items-center justify-center">
                        <Upload className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Knowledge Base</p>
                        <p className="text-xs text-muted-foreground">Upload your content</p>
                      </div>
                    </div>
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">company-docs.pdf</p>
                      <div className="w-full bg-secondary rounded-full h-1.5 mt-2">
                        <div className="gradient-hero h-1.5 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Widget preview */}
                  <div className="bg-background rounded-xl p-4 border border-border shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Widget Preview</p>
                        <p className="text-xs text-muted-foreground">Live customization</p>
                      </div>
                    </div>
                    <div className="bg-primary rounded-xl p-3 text-primary-foreground">
                      <p className="text-sm font-medium">👋 Hi! How can I help you today?</p>
                    </div>
                  </div>

                  {/* Embed snippet */}
                  <div className="bg-foreground/5 rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Code className="h-4 w-4 text-primary" />
                      <p className="text-xs font-medium">Embed Script</p>
                    </div>
                    <code className="text-xs text-muted-foreground block bg-background rounded p-2 overflow-hidden">
                      {'<script src="cdn.chatful.ai/w.js" />'}
                    </code>
                  </div>
                </div>
              </div>

              {/* Floating accent elements */}
              <div className="absolute -right-4 -top-4 w-20 h-20 gradient-hero rounded-2xl rotate-12 opacity-20 animate-float" />
              <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-accent rounded-xl -rotate-12 opacity-20 animate-float-delayed" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
