import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Crown, Zap } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { api } from "@/lib/api";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out CHATful",
    features: [
      "1 chatbot",
      "200 conversations/month",
      "Basic widget customization",
      "Email support",
    ],
    current: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For growing businesses",
    features: [
      "5 chatbots",
      "5,000 conversations/month",
      "Advanced customization",
      "Remove CHATful branding",
      "Priority support",
      "Analytics dashboard",
    ],
    popular: true,
    current: false,
  },
  {
    id: "scale",
    name: "Scale",
    price: "$99",
    period: "per month",
    description: "For large organizations",
    features: [
      "Unlimited chatbots",
      "Unlimited conversations",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "Custom AI training",
    ],
    current: false,
  },
];

const Billing = () => {
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async (planId: string) => {
    if (planId !== "pro") return;

    setIsUpgrading(true);
    setSelectedPlan(planId);

    try {
      const response = await api.post<{ checkout_url: string }>(
        "/billing/subscriptions/subscribe",
        { plan_code: "pro" }
      );

      if (response.data?.checkout_url) {
        window.location.href = response.data.checkout_url;
        return;
      }

      if (response.status === 400 && response.error === "User already has an active subscription.") {
        toast.warning(response.error);
        return;
      }

      if (response.error) {
        toast.error(response.error);
      }
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Billing & Plans - CHATful</title>
      </Helmet>

      <DashboardLayout title="Billing & Plans">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <p className="text-muted-foreground">
              Manage your subscription and upgrade your plan.
            </p>
          </div>

          {/* Current Plan Card */}
          <div className="bg-card rounded-xl border border-border p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Crown className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="font-semibold">Current Plan: Free</h2>
                  <p className="text-sm text-muted-foreground">200 conversations remaining this month</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Resets on</p>
                  <p className="font-medium">Jan 1, 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-card rounded-2xl p-6 border transition-all duration-300 ${
                  plan.popular
                    ? "border-primary shadow-lg shadow-glow"
                    : plan.current
                    ? "border-primary/50"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 gradient-hero text-primary-foreground text-sm font-medium rounded-full flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Most Popular
                  </div>
                )}

                {plan.current && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-secondary text-secondary-foreground text-sm font-medium rounded-full">
                    Current Plan
                  </div>
                )}

                <div className="text-center mb-6 pt-2">
                  <h3 className="text-xl font-display font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-display font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-primary" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "hero" : plan.current ? "secondary" : "outline"}
                  className="w-full"
                  disabled={plan.current || isUpgrading}
                  onClick={() => handleUpgrade(plan.id)}
                >
                  {plan.current ? "Current Plan" : plan.id === "scale" ? "Contact Sales" : "Upgrade"}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period." },
                { q: "What happens if I exceed my conversation limit?", a: "You'll receive a notification when you're approaching your limit. You can upgrade your plan at any time to continue using the service." },
                { q: "Do you offer refunds?", a: "We offer a 14-day money-back guarantee for all paid plans. No questions asked." },
                { q: "Can I switch plans?", a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately." },
              ].map((item) => (
                <div key={item.q} className="bg-card rounded-xl border border-border p-4">
                  <h3 className="font-medium mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Billing;
