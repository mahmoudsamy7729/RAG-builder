import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Upload, 
  FileText, 
  X,
  Loader2,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { api } from "@/lib/api";

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  status: "uploading" | "complete" | "error";
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface CreateChatbotResponse {
  id: string;
}

const CreateChatbot = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const [file] = newFiles;

    if (!file) {
      return;
    }

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast.error("Only PDF files are supported");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Maximum size is 10 MB");
      return;
    }

    setUploadedFile({
      file,
      name: file.name,
      size: file.size,
      status: "complete",
    });
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      toast.error("Please enter a chatbot name");
      return;
    }

    if (trimmedName.length < 3 || trimmedName.length > 100) {
      toast.error("Chatbot name must be between 3 and 100 characters");
      return;
    }

    if (trimmedDescription.length > 500) {
      toast.error("Description must be 500 characters or fewer");
      return;
    }

    if (!uploadedFile) {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsSubmitting(true);

    const additionalData: Record<string, string> = { name: trimmedName };

    if (trimmedDescription) {
      additionalData.description = trimmedDescription;
    }

    try {
      const result = await api.uploadFile<CreateChatbotResponse>(
        "/chatbots",
        uploadedFile.file,
        additionalData
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      const chatbotId = result.data?.id;

      if (!chatbotId) {
        toast.error("Unable to retrieve chatbot details. Please try again.");
        return;
      }

      toast.success("Chatbot created successfully!");
      navigate(`/dashboard/chatbots/${chatbotId}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create chatbot. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Chatbot - CHATful</title>
      </Helmet>

      <DashboardLayout title="Create New Chatbot">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
          <div className="mb-8">
            <p className="text-muted-foreground">
              Upload your knowledge base and configure your chatbot.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold">Basic Information</h2>
              
              <div className="space-y-2">
                <Label htmlFor="name">Chatbot Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Support Bot"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="What will this chatbot help with?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold">Knowledge Base</h2>
              <p className="text-sm text-muted-foreground">
                Upload a PDF knowledge base that your chatbot will use to answer questions.
              </p>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  isDragging 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileInput}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="h-12 w-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <p className="font-medium mb-1">Drop a file here or click to upload</p>
                <p className="text-sm text-muted-foreground">PDF files up to 10MB</p>
              </div>

              {/* File list */}
              {uploadedFile && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {uploadedFile.status === "complete" && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1 hover:bg-background rounded transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" asChild className="flex-1">
                <Link to="/dashboard">Cancel</Link>
              </Button>
              <Button type="submit" variant="hero" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Create & Customize Widget"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </>
  );
};

export default CreateChatbot;
