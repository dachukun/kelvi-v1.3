
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const bgColors = [
  { value: "#F2FCE2", label: "Mint" },
  { value: "#FFE8D6", label: "Peach" },
  { value: "#E3F4F4", label: "Sky" },
  { value: "#FFE5F1", label: "Pink" },
  { value: "#FFF4E0", label: "Yellow" },
];

interface AvatarPickerProps {
  onSelect: (data: { avatarUrl: string; bgColor: string }) => void;
  currentBgColor?: string;
}

export function AvatarPicker({ onSelect, currentBgColor }: AvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("0");

  const avatars = [
    "/Kais/profile boy1.png",
    "/Kais/profile boy2.png",
    "/Kais/profile boy3.png",
    "/Kais/profile girl1.png",
    "/Kais/profile girl2.png",
    "/Kais/profile girl3.png",
  ];

  const handleSave = () => {
    if (selectedAvatar) {
      onSelect({
        avatarUrl: selectedAvatar,
        bgColor: bgColors[parseInt(selectedColor)].value,
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
                <Avatar className="h-16 w-16" style={{ backgroundColor: bgColors[parseInt(selectedColor)].value }}>
                  <AvatarImage src={avatar} alt="Avatar" />
                </Avatar>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Label>Background Color</Label>
            <RadioGroup
              defaultValue="0"
              onValueChange={setSelectedColor}
              className="grid grid-cols-5 gap-2"
            >
              {bgColors.map((color, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={index.toString()}
                    id={index.toString()}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={index.toString()}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-2 hover:border-accent cursor-pointer peer-data-[state=checked]:border-kelvi-green"
                  >
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color.value }}
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
