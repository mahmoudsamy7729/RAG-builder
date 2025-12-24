import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Receipt } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

interface Payment {
  id: string;
  subscription_id: string | null;
  provider: "manual" | "stripe" | "paymob";
  provider_invoice_id: string;
  status: "succeeded" | "pending" | "failed";
  created_at: string;
  amount?: number;
  currency?: string;
}

const providerColors: Record<string, string> = {
  manual:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  stripe: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  paymob: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

const statusColors: Record<string, string> = {
  succeeded: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  failed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get<Payment[]>("/billing/payments/me");
        if (response.data) {
          setPayments(response.data);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Helmet>
        <title>Payment History | CHATful</title>
      </Helmet>

      <DashboardLayout title="Payment History">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">View your payment history</p>
            <Link to="/dashboard/subscription">
              <Button variant="outline" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                View Subscription
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                All Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payments yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Your payment history will appear here once you subscribe to a plan.
                  </p>
                  <Link to="/dashboard/billing">
                    <Button>View Plans</Button>
                  </Link>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">
                            {payment.subscription_id ?? "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                providerColors[payment.provider] ?? "bg-muted text-muted-foreground"
                              }
                            >
                              {payment.provider.charAt(0).toUpperCase() +
                                payment.provider.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={
                                statusColors[payment.status] ?? "bg-muted text-muted-foreground"
                              }
                            >
                              {payment.status.charAt(0).toUpperCase() +
                                payment.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(payment.created_at)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Payments;
