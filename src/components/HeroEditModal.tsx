import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useHero, HeroSettings } from "../contexts/HeroContext";
import { useToast } from "@/hooks/use-toast";

interface HeroEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HeroEditModal: React.FC<HeroEditModalProps> = ({ isOpen, onClose }) => {
  const { heroSettings, updateHeroSettings } = useHero();
  const { toast } = useToast();
  const [formData, setFormData] = useState<HeroSettings>(heroSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateHeroSettings(formData);
      toast({
        title: "Hero Section Updated",
        description: "Your changes have been saved to the database.",
      });
      onClose();
    } catch (error) {
      // Handle error silently
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(heroSettings); // Reset to original
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      if (field.startsWith("heading.")) {
        const headingKey = field.split(".")[1];
        return {
          ...prev,
          heading: {
            ...prev.heading,
            [headingKey]: value,
          },
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
    });
  };

  // Update form data when hero settings change
  React.useEffect(() => {
    setFormData(heroSettings);
  }, [heroSettings]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-slate-900 border-slate-700 text-white max-w-2xl'>
        <DialogHeader>
          <DialogTitle className='text-white'>Edit Hero Section</DialogTitle>
          <DialogDescription className='text-slate-300'>
            Customize your hero section heading and description.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Heading Section */}
          <div>
            <Label className='text-sm font-medium text-white mb-3 block'>Heading</Label>
            <div className='space-y-3'>
              <div>
                <Label htmlFor='heading1' className='text-sm text-slate-300'>
                  First Line
                </Label>
                <Input
                  id='heading1'
                  value={formData.heading.line1}
                  onChange={(e) => handleInputChange("heading.line1", e.target.value)}
                  placeholder='e.g. Star Wars'
                  className='bg-slate-800 border-slate-600 text-white'
                />
              </div>
              <div>
                <Label htmlFor='heading2' className='text-sm text-slate-300'>
                  Second Line
                </Label>
                <Input
                  id='heading2'
                  value={formData.heading.line2}
                  onChange={(e) => handleInputChange("heading.line2", e.target.value)}
                  placeholder='e.g. Memorabilia'
                  className='bg-slate-800 border-slate-600 text-white'
                />
              </div>
            </div>
          </div>

          {/* Paragraph Section */}
          <div>
            <Label htmlFor='paragraph' className='text-sm font-medium text-white mb-3 block'>
              Description
            </Label>
            <Textarea
              id='paragraph'
              value={formData.paragraph}
              onChange={(e) => handleInputChange("paragraph", e.target.value)}
              placeholder='Enter your hero section description...'
              rows={4}
              className='bg-slate-800 border-slate-600 text-white'
            />
          </div>

          {/* Buttons */}
          <div className='flex justify-end gap-3 pt-4'>
            <Button
              variant='outline'
              onClick={handleCancel}
              disabled={saving}
              className='bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className='bg-blue-600 hover:bg-blue-700 text-white'>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HeroEditModal;
