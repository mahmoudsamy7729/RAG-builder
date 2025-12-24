import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const EmbedScript = () => {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL 

  const embedCode = `<script>
    window.CHATFUL_WIDGET = { botId: "${id || "botId"}" };
  </script>
  <script src="${API_BASE}/widget.js"></script>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Helmet>
        <title>Embed Script - CHATful</title>
      </Helmet>

      <DashboardLayout title="Embed Your Chatbot">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
          <div className="mb-8">
            <p className="text-muted-foreground">
              Add this script to your website to display your AI chatbot.
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            {/* Code block */}
            <div className="bg-foreground/5 p-6">
              <pre className="text-sm overflow-x-auto">
                <code className="text-foreground">{embedCode}</code>
              </pre>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Paste this code before the closing <code className="bg-secondary px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag
              </p>
              <Button onClick={handleCopy} variant={copied ? "default" : "outline"} size="sm">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 space-y-6">
            <h2 className="text-lg font-semibold">Installation Guide</h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-1">Copy the embed code</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the "Copy Code" button above to copy the script to your clipboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-1">Add to your website</h3>
                  <p className="text-sm text-muted-foreground">
                    Paste the script just before the closing <code className="bg-secondary px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag in your HTML file.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-medium mb-1">That's it!</h3>
                  <p className="text-sm text-muted-foreground">
                    The chatbot widget will automatically appear on your website. Customize its appearance from the Widget Builder.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
              <h3 className="font-medium text-primary mb-2">Platform-specific guides</h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {["WordPress", "Shopify", "Webflow", "Squarespace"].map((platform) => (
                  <a
                    key={platform}
                    href="#"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {platform} Installation
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <Button variant="outline" asChild className="flex-1">
              <Link to={`/dashboard/chatbots/${id}/widget`}>
                Edit Widget
              </Link>
            </Button>
            <Button asChild className="flex-1">
              <Link to="/dashboard">
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default EmbedScript;
