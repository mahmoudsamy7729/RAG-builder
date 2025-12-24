import { Upload, Palette, Code2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Content",
    description: "Drag & drop your PDFs, DOCX files, or text documents. We'll process and understand your knowledge base automatically.",
    step: "01",
  },
  {
    icon: Palette,
    title: "Customize Your Widget",
    description: "Choose colors, avatar, position, and messages. Preview your chatbot in real-time as you design.",
    step: "02",
  },
  {
    icon: Code2,
    title: "Embed & Go Live",
    description: "Copy a single line of code and paste it on your website. Your AI chatbot is instantly live.",
    step: "03",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get your AI-powered chatbot up and running in three simple steps. No coding required.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative group animate-slide-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-accent/50" />
              )}

              <div className="relative bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 gradient-hero rounded-xl flex items-center justify-center font-display font-bold text-primary-foreground shadow-lg">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-xl font-display font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
