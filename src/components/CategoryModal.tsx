import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { Category } from "../types";
import { uploadImageToCloudflare } from "../services/cloudflareImages";
import { useToast } from "@/hooks/use-toast";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => void;
  category?: Category | null;
  parentId?: string;
}

const CategoryModal = ({ isOpen, onClose, onSave, category, parentId }: CategoryModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    parentId: parentId || "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        image: category.image || "",
        parentId: category.parentId || parentId || "",
      });
      setImagePreview(category.image || "");
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        description: "",
        image: "",
        parentId: parentId || "",
      });
      setImagePreview("");
      setImageFile(null);
    }
  }, [category, parentId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
    setIsUploading(true);

    try {
      const cloudflareUrl = await uploadImageToCloudflare(file);
      setFormData((prev) => ({ ...prev, image: cloudflareUrl }));

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      // Handle upload error
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      image: formData.image || undefined,
      parentId: formData.parentId || undefined,
    });

    setFormData({ name: "", description: "", image: "", parentId: "" });
    setImageFile(null);
    setImagePreview("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-slate-900 border-slate-700 text-white max-w-md'>
        <DialogHeader>
          <DialogTitle className='text-xl font-bold text-blue-400'>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name' className='text-slate-300'>
              Category Name
            </Label>
            <Input
              id='name'
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className='bg-slate-800 border-slate-600 text-white focus:border-blue-500'
              placeholder='Enter category name'
              required
            />
          </div>

          <div>
            <Label htmlFor='description' className='text-slate-300'>
              Description (Optional)
            </Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className='bg-slate-800 border-slate-600 text-white focus:border-blue-500 resize-none'
              placeholder='Enter category description'
              rows={3}
            />
          </div>

          <div>
            <Label className='text-slate-300'>Category Image (Optional)</Label>
            <div className='mt-2'>
              {imagePreview ? (
                <div className='relative'>
                  <img
                    src={imagePreview}
                    alt='Category preview'
                    className='w-full h-32 object-cover rounded-lg border border-slate-600'
                  />
                  {isUploading && (
                    <div className='absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg'>
                      <Loader2 className='w-6 h-6 animate-spin text-blue-400' />
                    </div>
                  )}
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={removeImage}
                    disabled={isUploading}
                    className='absolute top-2 right-2 bg-red-600/80 border-red-500 text-white hover:bg-red-700'
                  >
                    <X className='w-4 h-4' />
                  </Button>
                </div>
              ) : (
                <div className='relative'>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                    id='image-upload'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    disabled={isUploading}
                    className='w-full bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white border-dashed h-24'
                    asChild
                  >
                    <label
                      htmlFor='image-upload'
                      className='cursor-pointer flex flex-col items-center justify-center gap-2'
                    >
                      {isUploading ? <Loader2 className='w-6 h-6 animate-spin' /> : <Upload className='w-6 h-6' />}
                      <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
                    </label>
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className='flex gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onClose}
              className='border-slate-600 text-slate-300 hover:bg-slate-800'
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isUploading} className='bg-blue-600 hover:bg-blue-700 text-white'>
              {category ? "Update" : "Create"} Category
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
