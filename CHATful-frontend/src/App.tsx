import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateChatbot from "./pages/CreateChatbot";
import WidgetBuilder from "./pages/WidgetBuilder";
import EmbedScript from "./pages/EmbedScript";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Dashboard routes */}
              <Route
                path="/dashboard"
                element={(
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/dashboard/chatbots/new"
                element={(
                  <ProtectedRoute>
                    <CreateChatbot />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/dashboard/chatbots/:id"
                element={(
                  <ProtectedRoute>
                    <WidgetBuilder />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/dashboard/chatbots/:id/widget"
                element={(
                  <ProtectedRoute>
                    <WidgetBuilder />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/dashboard/chatbots/:id/embed"
                element={(
                  <ProtectedRoute>
                    <EmbedScript />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/dashboard/billing"
                element={(
                  <ProtectedRoute>
                    <Billing />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/dashboard/payments"
                element={(
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/dashboard/subscription"
                element={(
                  <ProtectedRoute>
                    <Subscription />
                  </ProtectedRoute>
                )}
              />
              <Route
                path="/dashboard/settings"
                element={(
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                )}
              />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
