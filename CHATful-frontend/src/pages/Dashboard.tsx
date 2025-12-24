import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Bot, 
  MessageCircle, 
  Crown,
  Code,
  MoreVertical,
  ChevronRight,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface Chatbot {
  id: string;
  name: string;
  status: "active" | "archived";
}

const Dashboard = () => {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChatbots = useCallback(async () => {
    setLoading(true);
    const response = await api.get<Chatbot[]>("/my-bots");

    if (response.error) {
      toast.error(response.error);
      setChatbots([]);
      setLoading(false);
      return;
    }

    if (response.data) {
      setChatbots(response.data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChatbots();
  }, [fetchChatbots]);

  const stats = [
    { label: "Total Chatbots", value: loading ? "—" : chatbots.length, icon: Bot, color: "text-primary" },
    {
      label: "Active Chatbots",
      value: loading ? "—" : chatbots.filter((bot) => bot.status === "active").length,
      icon: MessageCircle,
      color: "text-accent",
    },
    { label: "Current Plan", value: "Free", icon: Crown, color: "text-amber-500" },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - CHATful</title>
      </Helmet>

      <DashboardLayout title="Dashboard">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chatbots section */}
          <div className="bg-card rounded-xl border border-border">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold">Your Chatbots</h2>
                <p className="text-sm text-muted-foreground">Manage and configure your AI assistants</p>
              </div>
              <Button asChild>
                <Link to="/dashboard/chatbots/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Chatbot
                </Link>
              </Button>
            </div>
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full">
                      <Skeleton className="h-12 w-12 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-24" />
                  </div>
                ))}
              </div>
            ) : chatbots.length === 0 ? (
              <div className="p-12 text-center">
                <div className="h-16 w-16 mx-auto mb-4 bg-secondary rounded-2xl flex items-center justify-center">
                  <Bot className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">No chatbots yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Create your first AI chatbot and start engaging with your customers.
                </p>
                <Button asChild>
                  <Link to="/dashboard/chatbots/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create your first chatbot
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {chatbots.map((bot) => (
                  <div key={bot.id} className="flex items-center justify-between p-4 sm:p-6 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl gradient-hero flex items-center justify-center">
                        <Bot className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">{bot.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                            bot.status === "active" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200" : "bg-muted text-muted-foreground"
                          }`}>
                            <span className={`h-2 w-2 rounded-full ${bot.status === "active" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                            {bot.status === "active" ? "Active" : "Archived"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                        <Link to={`/dashboard/chatbots/${bot.id}/embed`}>
                          <Code className="h-4 w-4 mr-2" />
                          Get Script
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                        <Link to={`/dashboard/chatbots/${bot.id}`}>
                          Manage
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="sm:hidden">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover">
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/chatbots/${bot.id}`}>Manage</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/dashboard/chatbots/${bot.id}/embed`}>Get Script</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
