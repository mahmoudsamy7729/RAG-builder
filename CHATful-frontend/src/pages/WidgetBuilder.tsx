import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Save,
  Loader2,
  MessageCircle
} from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { api } from "@/lib/api";

type WidgetPosition = "bottom-left" | "bottom-right";

type WidgetConfig = {
  displayName: string;
  primaryColor: string;
  accentColor: string;
  position: WidgetPosition;
  welcomeMessage: string;
  inputPlaceholder: string;
  showPoweredBy: boolean;
  style: "bubble" | "button";
  avatar: string;
};

type WidgetConfigResponse = {
  bot_id: string;
  display_name: string;
  primary_color: string;
  accent_color: string;
  position: WidgetPosition;
  welcome_message: string;
  input_placeholder: string;
  show_powered_by: boolean;
};

const DEFAULT_WIDGET_CONFIG: WidgetConfig = {
  displayName: "Support Bot",
  primaryColor: "#3b82f6",
  accentColor: "#1e40af",
  position: "bottom-right",
  welcomeMessage: "Hi dY`< How can I help you?",
  inputPlaceholder: "Type your messageƒİ",
  showPoweredBy: true,
  style: "bubble",
  avatar: "bot",
};

const WidgetBuilder = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [config, setConfig] = useState<WidgetConfig>({ ...DEFAULT_WIDGET_CONFIG });

  useEffect(() => {
    let isMounted = true;

    const fetchWidgetConfig = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const result = await api.get<WidgetConfigResponse>(`/widget/config/${id}`, false);

      if (!isMounted) return;

      if (result.data) {
        setConfig(prev => ({
          ...prev,
          displayName: result.data.display_name,
          primaryColor: result.data.primary_color,
          accentColor: result.data.accent_color,
          position: result.data.position,
          welcomeMessage: result.data.welcome_message,
          inputPlaceholder: result.data.input_placeholder,
          showPoweredBy: result.data.show_powered_by,
        }));
      } else if (result.status === 404) {
        setConfig({ ...DEFAULT_WIDGET_CONFIG });
      } else if (result.error) {
        toast.error(result.error);
      }

      setIsLoading(false);
    };

    fetchWidgetConfig();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const updateConfig = <K extends keyof typeof config>(key: K, value: typeof config[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!id) return;

    setIsSaving(true);
    const result = await api.put<WidgetConfigResponse>(`/${id}/widget-settings`, {
      display_name: config.displayName,
      primary_color: config.primaryColor,
      accent_color: config.accentColor,
      position: config.position,
      welcome_message: config.welcomeMessage,
      input_placeholder: config.inputPlaceholder,
      show_powered_by: config.showPoweredBy,
    });

    if (result.data) {
      setConfig(prev => ({
        ...prev,
        displayName: result.data.display_name,
        primaryColor: result.data.primary_color,
        accentColor: result.data.accent_color,
        position: result.data.position,
        welcomeMessage: result.data.welcome_message,
        inputPlaceholder: result.data.input_placeholder,
        showPoweredBy: result.data.show_powered_by,
      }));

      const embedLink = `${window.location.origin}/dashboard/chatbots/${id}/embed`;

      toast.success("Widget settings saved", {
        description: "Your widget has been updated.",
        action: {
          label: "Copy embed link",
          onClick: async () => {
            await navigator.clipboard.writeText(embedLink);
            toast.success("Embed link copied");
          },
        },
      });
    } else if (result.error) {
      toast.error(result.error);
    }

    setIsSaving(false);
  };

  return (
    <>
      <Helmet>
        <title>Widget Builder - CHATful</title>
      </Helmet>

      <DashboardLayout title="Widget Builder">
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-7rem)]">
          {/* Sidebar Controls */}
          <aside className="w-full lg:w-96 bg-card border-b lg:border-b-0 lg:border-r border-border p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Widget Settings</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/dashboard/chatbots/${id}/embed`}>
                    Get Embed Code
                  </Link>
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving || isLoading}>
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label>Widget Name</Label>
                <Input
                  value={config.displayName}
                  onChange={(e) => updateConfig("displayName", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => updateConfig("primaryColor", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                      disabled={isLoading}
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => updateConfig("primaryColor", e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => updateConfig("accentColor", e.target.value)}
                      className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                      disabled={isLoading}
                    />
                    <Input
                      value={config.accentColor}
                      onChange={(e) => updateConfig("accentColor", e.target.value)}
                      className="flex-1"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label>Position</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["bottom-right", "bottom-left"] as const).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => updateConfig("position", pos)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        config.position === pos
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      disabled={isLoading}
                    >
                      {pos.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="space-y-2">
                <Label>Widget Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["bubble", "button"] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => updateConfig("style", style)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        config.style === style
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      disabled={isLoading}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Welcome Message */}
              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <Input
                  value={config.welcomeMessage}
                  onChange={(e) => updateConfig("welcomeMessage", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Placeholder */}
              <div className="space-y-2">
                <Label>Input Placeholder</Label>
                <Input
                  value={config.inputPlaceholder}
                  onChange={(e) => updateConfig("inputPlaceholder", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Powered by */}
              <div className="flex items-center justify-between">
                <Label>Show "Powered by CHATful"</Label>
                <Switch
                  checked={config.showPoweredBy}
                  onCheckedChange={(checked) => updateConfig("showPoweredBy", checked)}
                  disabled={isLoading}
                />
              </div>
            </div>
          </aside>

          {/* Preview Area */}
          <main className="flex-1 p-8 flex items-center justify-center bg-gradient-to-br from-secondary/50 to-background relative overflow-hidden">
            <div className="text-center text-muted-foreground mb-auto mt-8">
              <p className="text-sm">Live Preview</p>
            </div>

            {/* Widget Preview */}
            <div 
              className={`absolute ${config.position === "bottom-right" ? "right-8" : "left-8"} bottom-8`}
            >
              {/* Chat bubble trigger */}
              <div 
                className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center cursor-pointer transform hover:scale-105 transition-transform"
                style={{ backgroundColor: config.primaryColor }}
              >
                <MessageCircle className="h-6 w-6 text-primary-foreground" />
              </div>

              {/* Chat window preview */}
              <div 
                className={`absolute bottom-16 ${config.position === "bottom-right" ? "right-0" : "left-0"} w-80 bg-card rounded-2xl shadow-xl border border-border overflow-hidden`}
              >
                {/* Header */}
                <div 
                  className="p-4 text-primary-foreground"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{config.displayName}</p>
                      <p className="text-xs opacity-80">Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 min-h-[200px] bg-background">
                  <div 
                    className="inline-block max-w-[80%] p-3 rounded-2xl rounded-bl-sm text-primary-foreground text-sm"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    {config.welcomeMessage}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border bg-card">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      placeholder={config.inputPlaceholder}
                      className="flex-1 px-4 py-2 rounded-full bg-secondary text-sm outline-none"
                      disabled
                    />
                    <button 
                      className="p-2 rounded-full"
                      style={{ backgroundColor: config.primaryColor }}
                      disabled
                    >
                      <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  {config.showPoweredBy && (
                    <p className="text-xs text-center text-muted-foreground mt-3">
                      Powered by <span className="font-medium">CHATful</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </DashboardLayout>
    </>
  );
};

export default WidgetBuilder;
