import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import { Item } from "../types";
import { uploadImageToCloudflare, convertBase64ToFile } from "../services/cloudflareImages";
import { useToast } from "@/hooks/use-toast";
import ManufacturerSelect from "./ManufacturerSelect";

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (itemData: Omit<Item, "id" | "createdAt" | "updatedAt">) => void;
  item?: Item | null;
  categoryId: string;
}

const ratingOptions = Array.from({ length: 19 }, (_, i) => {
  const value = (i * 0.5 + 1).toFixed(1).replace(".0", "");
  return `C-${value}`;
});

const afaGradeOptions = Array.from({ length: 17 }, (_, i) => (i * 5 + 20).toString());

const ItemModal = ({ isOpen, onClose, onSave, item, categoryId }: ItemModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    stockStatus: "In Stock" as "In Stock" | "Out of Stock",
    rating: "",
    valuation: "",
    manufacturer: "",
    yearManufactured: "",
    afaNumber: "",
    afaGrade: "",
    description: "",
    boughtFor: "",
    variations: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        stockStatus: item.stockStatus || "In Stock",
        rating: item.rating || "",
        valuation: item.valuation?.toString() || "",
        manufacturer: item.manufacturer || "",
        yearManufactured: item.yearManufactured?.toString() || "",
        afaNumber: item.afaNumber || "",
        afaGrade: item.afaGrade || "",
        description: item.description || "",
        boughtFor: item.boughtFor?.toString() || "",
        variations: item.variations || "",
      });

      // Handle existing images - simplified without blob URL conversion
      if (item.images && item.images.length > 0) {
        setImages(item.images);
      } else if (item.image) {
        setImages([item.image]);
      } else {
        setImages([]);
      }
    } else {
      setFormData({
        name: "",
        stockStatus: "In Stock",
        rating: "",
        valuation: "",
        manufacturer: "",
        yearManufactured: "",
        afaNumber: "",
        afaGrade: "",
        description: "",
        boughtFor: "",
        variations: "",
      });
      setImages([]);
    }
  }, [item]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Limit to 4 total images
    const remainingSlots = 4 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);

    if (files.length > remainingSlots) {
      toast({
        title: "Upload Limit",
        description: `You can only upload ${remainingSlots} more image(s). Maximum of 4 images allowed.`,
        variant: "destructive",
      });
    }

    if (filesToProcess.length === 0) return;

    setUploading(true);

    try {
      const uploadPromises = filesToProcess.map(async (file) => {
        try {
          const imageUrl = await uploadImageToCloudflare(file);
          return imageUrl;
        } catch {
          toast({
            title: "Upload Error",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          });
          return null;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const successfulUploads = uploadedUrls.filter((url) => url !== null) as string[];

      if (successfulUploads.length > 0) {
        setImages((prev) => [...prev, ...successfulUploads]);
        toast({
          title: "Upload Successful",
          description: `${successfulUploads.length} image(s) uploaded successfully`,
        });
      }
    } catch {
      toast({
        title: "Upload Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Handle any remaining base64 images by uploading them to Cloudflare
    const base64Images = images.filter((img) => img.startsWith("data:"));
    let finalImages = images.filter((img) => !img.startsWith("data:"));

    if (base64Images.length > 0) {
      setUploading(true);
      try {
        const uploadPromises = base64Images.map(async (base64, index) => {
          const file = convertBase64ToFile(base64, `${formData.name}-${index}.jpg`);
          return await uploadImageToCloudflare(file);
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        finalImages = [...finalImages, ...uploadedUrls];

        toast({
          title: "Processing Complete",
          description: "All images have been uploaded to cloud storage",
        });
      } catch {
        toast({
          title: "Upload Error",
          description: "Some images failed to upload",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }

    const itemData = {
      name: formData.name,
      categoryId,
      stockStatus: formData.stockStatus,
      rating: formData.rating || undefined,
      valuation: formData.valuation ? parseFloat(formData.valuation) : undefined,
      image: finalImages[0] || undefined,
      images: finalImages.length > 0 ? finalImages : undefined,
      manufacturer: formData.manufacturer || undefined,
      yearManufactured: formData.yearManufactured ? parseInt(formData.yearManufactured) : undefined,
      afaNumber: formData.afaNumber || undefined,
      afaGrade: formData.afaGrade ? formData.afaGrade : undefined,
      description: formData.description || undefined,
      boughtFor: formData.boughtFor ? parseFloat(formData.boughtFor) : undefined,
      variations: formData.variations || undefined,
    };

    onSave(itemData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='bg-white max-w-2xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-black'>{item ? "Edit Item" : "Add New Item"}</DialogTitle>
          <DialogDescription className='sr-only'>Add Item</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name' className='text-black'>
              Item Name *
            </Label>
            <Input
              id='name'
              name='name'
              autoComplete='off'
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
              className='bg-white border-gray-300 text-black'
            />
          </div>

          <div>
            <Label htmlFor='stockStatus' className='text-black'>
              Stock Status
            </Label>
            <Select
              value={formData.stockStatus}
              onValueChange={(value: "In Stock" | "Out of Stock") =>
                setFormData((prev) => ({ ...prev, stockStatus: value }))
              }
            >
              <SelectTrigger id='stockStatus' name='stockStatus' className='bg-white border-gray-300 text-black'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-white'>
                <SelectItem id='stock-in-stock' value='In Stock'>
                  In Stock
                </SelectItem>
                <SelectItem id='stock-out-of-stock' value='Out of Stock'>
                  Out of Stock
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='rating' className='text-black'>
                Rating
              </Label>
              <Select
                value={formData.rating}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, rating: value }))}
              >
                <SelectTrigger className='bg-white border-gray-300 text-black' id='rating' name='rating'>
                  <SelectValue placeholder='Select rating' />
                </SelectTrigger>
                <SelectContent className='bg-white max-h-60 overflow-y-auto'>
                  {ratingOptions.map((option) => (
                    <SelectItem key={option} id={`rating-${option}`} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor='valuation' className='text-black'>
                Valuation ($)
              </Label>
              <Input
                id='valuation'
                name='valuation'
                type='number'
                step='0.01'
                autoComplete='off'
                value={formData.valuation}
                onChange={(e) => setFormData((prev) => ({ ...prev, valuation: e.target.value }))}
                className='bg-white border-gray-300 text-black'
              />
            </div>
          </div>

          <div>
            <Label htmlFor='boughtFor' className='text-black'>
              Bought For ($)
            </Label>
            <Input
              id='boughtFor'
              name='boughtFor'
              type='number'
              step='0.01'
              autoComplete='off'
              value={formData.boughtFor}
              onChange={(e) => setFormData((prev) => ({ ...prev, boughtFor: e.target.value }))}
              className='bg-white border-gray-300 text-black'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='manufacturer' className='text-black'>
                Manufacturer
              </Label>
              <ManufacturerSelect
                value={formData.manufacturer}
                onChange={(val) => setFormData((prev) => ({ ...prev, manufacturer: val }))}
              />
            </div>

            <div>
              <Label htmlFor='yearManufactured' className='text-black'>
                Year
              </Label>
              <Input
                id='yearManufactured'
                name='yearManufactured'
                type='number'
                autoComplete='off'
                value={formData.yearManufactured}
                onChange={(e) => setFormData((prev) => ({ ...prev, yearManufactured: e.target.value }))}
                className='bg-white border-gray-300 text-black'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <Label htmlFor='afaNumber' className='text-black'>
                AFA Number
              </Label>
              <Input
                id='afaNumber'
                name='afaNumber'
                autoComplete='off'
                value={formData.afaNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, afaNumber: e.target.value }))}
                className='bg-white border-gray-300 text-black'
              />
            </div>

            <div>
              <Label htmlFor='afaGrade' className='text-black'>
                AFA Grade
              </Label>
              <Select
                value={formData.afaGrade || "none"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    afaGrade: value === "none" ? "" : value,
                  }))
                }
              >
                <SelectTrigger className='bg-white border-gray-300 text-black' id='afaGrade' name='afaGrade'>
                  <SelectValue placeholder='Select grade' />
                </SelectTrigger>
                <SelectContent className='bg-white max-h-60 overflow-y-auto'>
                  <SelectItem id='afa-grade-none' value='none'>
                    None
                  </SelectItem>
                  {afaGradeOptions.map((option) => (
                    <SelectItem key={option} id={`afa-grade-${option}`} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor='variations' className='text-black'>
              Variations
            </Label>
            <Input
              id='variations'
              name='variations'
              autoComplete='off'
              value={formData.variations}
              onChange={(e) => setFormData((prev) => ({ ...prev, variations: e.target.value }))}
              className='bg-white border-gray-300 text-black'
            />
          </div>

          <div>
            <Label htmlFor='image-upload' className='text-black'>
              Images (Maximum 4)
            </Label>
            <div className='space-y-4 mt-2'>
              {/* Upload Button */}
              <div>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileUpload}
                  className='hidden'
                  id='image-upload'
                  name='images'
                  multiple
                  disabled={images.length >= 4 || uploading}
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className='w-full bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  disabled={images.length >= 4 || uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className='w-4 h-4 mr-2' />
                      {images.length >= 4 ? "Maximum 4 Images Reached" : `Upload Images (${images.length}/4)`}
                    </>
                  )}
                </Button>
              </div>

              {/* Image Preview Grid */}
              {images.length > 0 && (
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                  {images.map((image, index) => (
                    <div key={index} className='relative group'>
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className='w-full h-24 object-cover rounded-lg border border-gray-300'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => removeImage(index)}
                        className='absolute top-1 right-1 bg-red-600/90 border-red-500 text-white hover:bg-red-700 w-6 h-6 p-0'
                        disabled={uploading}
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className='w-3 h-3' />
                      </Button>
                      {index === 0 && (
                        <div className='absolute bottom-1 left-1 bg-blue-600/90 text-white text-xs px-2 py-1 rounded'>
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Success message for cloud storage */}
              <div className='bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800'>
                <p className='font-medium mb-1'>✅ Cloud Storage Active</p>
                <p>
                  Images are automatically uploaded to Cloudflare&apos;s global CDN for optimal performance and
                  reliability.
                </p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor='description' className='text-black'>
              Description
            </Label>
            <Textarea
              id='description'
              name='description'
              autoComplete='off'
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className='bg-white border-gray-300 text-black'
            />
          </div>

          <div className='flex gap-2 pt-4'>
            <Button type='submit' className='flex-1 bg-blue-600 hover:bg-blue-700 text-white' disabled={uploading}>
              {uploading ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Processing...
                </>
              ) : item ? (
                "Update Item"
              ) : (
                "Create Item"
              )}
            </Button>
            <Button type='button' variant='outline' onClick={onClose} className='flex-1'>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
