
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const bgColors = {
  green: "#F2FCE2",
  orange: "#FEC6A1",
  yellow: "#FEF7CD",
  "light-red": "#FFDEE2",
  "light-blue": "#D3E4FD",
};

interface AvatarPickerProps {
  onSelect: (data: { avatarUrl: string; bgColor: string }) => void;
  currentBgColor?: string;
}

export function AvatarPicker({ onSelect, currentBgColor }: AvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(currentBgColor || "green");

  const avatars = [
    "/Kais/girl profile1.png",
    "/Kais/girl profile2.png",
    "/Kais/girl profile3.png",
    "/Kais/boy profile1.png",
    "/Kais/boy profile2.png",
    "/Kais/boy profile3.png",
  ];

  const handleSave = () => {
    if (selectedAvatar) {
      onSelect({
        avatarUrl: selectedAvatar,
        bgColor: bgColors[selectedColor as keyof typeof bgColors],
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
          <UserRound className="h-8 w-8 text-white" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your avatar</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {avatars.map((avatar) => (
              <div
                key={avatar}
                className={`relative cursor-pointer p-2 rounded-lg ${
                  selectedAvatar === avatar ? "ring-2 ring-kelvi-green" : ""
                }`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <Avatar className="h-16 w-16" style={{ backgroundColor: bgColors[selectedColor as keyof typeof bgColors] }}>
                  <AvatarImage src={avatar} alt="Avatar" />
                </Avatar>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Label>Background Color</Label>
            <RadioGroup
              defaultValue={selectedColor}
              onValueChange={setSelectedColor}
              className="grid grid-cols-5 gap-2"
            >
              {Object.entries(bgColors).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={key}
                    id={key}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={key}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-2 hover:border-accent cursor-pointer peer-data-[state=checked]:border-kelvi-green"
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: value }}
                    />
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-kelvi-green hover:bg-kelvi-green/90 text-black"
            disabled={!selectedAvatar}
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
