import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CreditCard,
  Calendar,
  Clock,
  Receipt,
  AlertTriangle,
} from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface PlanDetails {
  id: string;
  name: string;
  code: string;
  price_cents: number;
  currency: string;
}

interface SubscriptionDetails {
  id: string;
  status: "active" | "trialing" | "pending" | "canceled" | "past_due";
  started_at: string;
  cancel_at_period_end: boolean;
  current_period_end: string | null;
  provider: "manual" | "stripe" | "paymob";
  provider_subscription_id: string;
  plan: PlanDetails;
}

const providerIcons: Record<string, string> = {
  stripe: "💳",
  paymob: "🏦",
  manual: "📄",
};

const providerColors: Record<string, string> = {
  stripe: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  paymob: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  manual: "bg-muted text-muted-foreground",
};

const planColors: Record<string, string> = {
  free: "bg-muted text-muted-foreground",
  pro: "bg-primary/10 text-primary",
  scale: "bg-gradient-to-r from-primary to-accent text-white",
};

const Subscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    const response = await api.get<SubscriptionDetails>(
      "/billing/subscriptions/me"
    );

    if (response.status === 404) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    if (response.error) {
      toast.error(response.error);
      setLoading(false);
      return;
    }

    if (response.data) {
      setSubscription(response.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not available";

    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (priceCents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(priceCents / 100);
  };

  const handleCancelSubscription = async () => {
    setCanceling(true);
    const response = await api.post<SubscriptionDetails>(
      "/billing/subscriptions/cancel"
    );
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success("Subscription cancellation scheduled");
      if (response.data) {
        setSubscription(response.data);
      }
      await fetchSubscription();
    }
    setCanceling(false);
  };

  return (
    <>
      <Helmet>
        <title>Subscription Details | CHATful</title>
      </Helmet>

      <DashboardLayout title="Subscription Details">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">Manage your subscription</p>
            <Link to="/dashboard/payments">
              <Button variant="outline" size="sm">
                <Receipt className="h-4 w-4 mr-2" />
                View Payments
              </Button>
            </Link>
          </div>

          {loading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ) : !subscription ? (
            <Card>
              <CardContent className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No active subscription</h3>
                <p className="text-muted-foreground mb-4">
                  You're currently on the free plan. Upgrade to unlock more features.
                </p>
                <Link to="/dashboard/billing">
                  <Button>View Plans</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Current Plan Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Current Plan
                        <Badge
                          className={
                            planColors[subscription.plan.code.toLowerCase()] ||
                            planColors.pro
                          }
                        >
                          {subscription.plan.name}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Plan price: {formatPrice(subscription.plan.price_cents)}
                      </CardDescription>
                    </div>
                    <div className="text-4xl">
                      {providerIcons[subscription.provider] || "💳"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subscription Details */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <Calendar className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Started</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(subscription.started_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Current Period Ends</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(subscription.current_period_end)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Provider */}
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Payment Provider</p>
                        <p className="text-sm text-muted-foreground">
                          Billed via {subscription.provider}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={providerColors[subscription.provider] || ""}
                    >
                      {subscription.provider.charAt(0).toUpperCase() +
                        subscription.provider.slice(1)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Manage Subscription</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/dashboard/billing" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Change Plan
                    </Button>
                  </Link>
                  <Link to="/dashboard/payments" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Receipt className="h-4 w-4 mr-2" />
                      View Payment History
                    </Button>
                  </Link>

                  {subscription.status !== "canceled" && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="w-full justify-start"
                          disabled={subscription.cancel_at_period_end}
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          {subscription.cancel_at_period_end
                            ? "Cancellation Scheduled"
                            : "Cancel Subscription"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel your subscription? You'll
                            continue to have access until{" "}
                            {formatDate(subscription.current_period_end)}, but your
                            subscription won't renew after that.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCancelSubscription}
                            disabled={canceling}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {canceling ? "Canceling..." : "Yes, Cancel"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {subscription.status === "canceled" && (
                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                            Subscription Canceled
                          </p>
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                            Your subscription will end on{" "}
                            {formatDate(subscription.current_period_end)}. You can
                            resubscribe anytime before then.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Subscription;
