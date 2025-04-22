import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { CardWithHover } from "@/components/ui/card-with-hover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Edit, Check, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { AvatarPicker } from "@/components/profile/AvatarPicker";

export default function Profile() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: user?.user_metadata?.full_name || "",
    school_name: user?.user_metadata?.school_name || "",
    display_name: user?.user_metadata?.display_name || "",
    avatar_url: user?.user_metadata?.avatar_url || "",
    avatar_bg: user?.user_metadata?.avatar_bg || "#F2FCE2",
  });
  const { toast } = useToast();

  const handleAvatarChange = async ({ avatarUrl, bgColor }: { avatarUrl: string; bgColor: string }) => {
    try {
      await handleSave({
        avatar_url: avatarUrl,
        avatar_bg: bgColor,
      });

      toast({
        title: "Avatar updated",
        description: "Your avatar has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your avatar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (additionalData = {}) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          ...editData,
          ...additionalData,
        }
      });

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <CardWithHover>
          <div className="flex flex-col items-center">
            {!isEditing ? (
              <Button variant="ghost" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="space-x-2">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleSave}
                  className="bg-[#b2ec5d] hover:bg-[#b2ec5d]/90 text-black"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}

            <div className="relative group">
              <Avatar 
                className="h-24 w-24 mb-4" 
                style={{ 
                  backgroundColor: user?.user_metadata?.avatar_bg || "#F2FCE2"
                }}
              >
                {user?.user_metadata?.avatar_url ? (
                  <AvatarImage src={user.user_metadata.avatar_url} alt="Profile" />
                ) : (
                  <AvatarFallback className="text-black text-2xl">
                    {(user?.user_metadata?.display_name || user?.user_metadata?.full_name || 'U')[0].toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              {isEditing && (
                <AvatarPicker 
                  onSelect={handleAvatarChange}
                  currentBgColor={user?.user_metadata?.avatar_bg || "#F2FCE2"}
                />
              )}
            </div>
            
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-500">Display Name</label>
                {isEditing ? (
                  <Input
                    value={editData.display_name}
                    onChange={(e) => setEditData(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="Enter display name"
                  />
                ) : (
                  <div className="text-lg font-semibold">
                    {user?.user_metadata?.display_name || user?.user_metadata?.full_name || "User"}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500">Full Name</label>
                {isEditing ? (
                  <Input
                    value={editData.full_name}
                    onChange={(e) => setEditData(prev => ({ ...prev, full_name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                ) : (
                  <div>{user?.user_metadata?.full_name}</div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500">Email</label>
                <div>{user?.email}</div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-500">School</label>
                {isEditing ? (
                  <Input
                    value={editData.school_name}
                    onChange={(e) => setEditData(prev => ({ ...prev, school_name: e.target.value }))}
                    placeholder="Enter school name"
                  />
                ) : (
                  <div>{user?.user_metadata?.school_name || "Not specified"}</div>
                )}
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="mt-8" 
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </CardWithHover>
      </div>
    </PageContainer>
  );
}
