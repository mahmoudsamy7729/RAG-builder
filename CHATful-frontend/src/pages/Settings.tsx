import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet-async";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

const Settings = () => {
  const { logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Profile updated!");
    setIsSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwords.new.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsChangingPassword(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Password changed successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
    setIsChangingPassword(false);
  };

  return (
    <>
      <Helmet>
        <title>Settings - CHATful</title>
      </Helmet>

      <DashboardLayout title="Account Settings">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-2xl">
          <div className="mb-8">
            <p className="text-muted-foreground">
              Manage your account information and preferences.
            </p>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-semibold mb-4">Profile Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-semibold mb-4">Change Password</h2>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  />
                </div>

                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Change Password
                </Button>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-card rounded-xl border border-destructive/50 p-6">
              <h2 className="font-semibold text-destructive mb-4">Danger Zone</h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Log out from all devices</p>
                  <p className="text-sm text-muted-foreground">This will sign you out everywhere</p>
                </div>
                <Button variant="destructive" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Settings;
