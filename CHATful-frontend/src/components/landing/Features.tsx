import { Brain, Paintbrush, Shield, MessageCircle, BarChart3, Zap } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Knowledge-Powered AI",
    description: "Your chatbot learns from your documents and provides accurate, context-aware responses.",
  },
  {
    icon: Paintbrush,
    title: "Fully Customizable",
    description: "Match your brand with custom colors, avatars, positions, and personalized messages.",
  },
  {
    icon: Shield,
    title: "Secure Storage",
    description: "Your knowledge base is encrypted and stored securely. Your data stays yours.",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Preview",
    description: "See exactly how your chatbot will look and behave before going live.",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    description: "Track conversations, popular questions, and user satisfaction. (Coming soon)",
    badge: "Soon",
  },
  {
    icon: Zap,
    title: "Instant Deployment",
    description: "One script, endless possibilities. Deploy your chatbot in seconds on any website.",
  },
];

const Features = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            Everything You Need to <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you create the perfect AI assistant for your customers.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-card rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {feature.badge && (
                <div className="absolute top-4 right-4 px-2 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">
                  {feature.badge}
                </div>
              )}

              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>

              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
