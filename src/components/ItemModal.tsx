import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import { Item } from "../types";
import { uploadImageToCloudflare, deleteImageFromCloudflare } from "../services/cloudflareImages";
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

  const [imagePairs, setImagePairs] = useState<{ url: string; cloudflareId: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [imageDeleted, setImageDeleted] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{ show: boolean; index: number | null }>({
    show: false,
    index: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (item) {
      // Pair up images and cloudflareIds by index
      const pairs = (item.images || []).map((url: string, i: number) => ({
        url,
        cloudflareId: (item.cloudflareIds || [])[i] || "",
      }));
      setImagePairs(pairs);
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
    } else {
      setImagePairs([]);
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
    }
    setImageDeleted(false);
    setShowDeleteConfirm({ show: false, index: null });
    setIsDeleting(false);
  }, [item, isOpen]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const remainingSlots = 4 - imagePairs.length;
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
          const { imageUrl, cloudflareId } = await uploadImageToCloudflare(file);
          return { url: imageUrl, cloudflareId };
        } catch {
          toast({
            title: "Upload Error",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          });
          return null;
        }
      });
      const uploadedResults = await Promise.all(uploadPromises);
      const successfulPairs = uploadedResults.filter((result) => result !== null) as {
        url: string;
        cloudflareId: string;
      }[];
      if (successfulPairs.length > 0) {
        setImagePairs((prev) => [...prev, ...successfulPairs]);
        toast({
          title: "Upload Successful",
          description: `${successfulPairs.length} image(s) uploaded successfully`,
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

  const handleRemoveImage = (index: number) => {
    setShowDeleteConfirm({ show: true, index });
  };

  const confirmRemoveImage = async () => {
    if (showDeleteConfirm.index === null) return;
    setIsDeleting(true);
    try {
      const pair = imagePairs[showDeleteConfirm.index];
      if (pair?.cloudflareId) {
        await deleteImageFromCloudflare(pair.cloudflareId);
      }
      setImagePairs((prev) => prev.filter((_, i) => i !== showDeleteConfirm.index));
      setImageDeleted(true);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm({ show: false, index: null });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const itemData = {
      name: formData.name,
      categoryId,
      stockStatus: formData.stockStatus,
      rating: formData.rating || undefined,
      valuation: formData.valuation ? parseFloat(formData.valuation) : undefined,
      image: imagePairs[0]?.url || undefined,
      cloudflareId: imagePairs[0]?.cloudflareId || undefined,
      images: imagePairs.map((p) => p.url),
      cloudflareIds: imagePairs.map((p) => p.cloudflareId),
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
                  disabled={imagePairs.length >= 4 || uploading}
                />
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => document.getElementById("image-upload")?.click()}
                  className='w-full bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                  disabled={imagePairs.length >= 4 || uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className='w-4 h-4 mr-2' />
                      {imagePairs.length >= 4 ? "Maximum 4 Images Reached" : `Upload Images (${imagePairs.length}/4)`}
                    </>
                  )}
                </Button>
              </div>

              {/* Image Preview Grid */}
              {imagePairs.length > 0 && (
                <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                  {imagePairs.map((pair, index) => (
                    <div key={index} className='relative group'>
                      <img
                        src={pair.url}
                        alt={`Preview ${index + 1}`}
                        className='w-full h-24 object-cover rounded-lg border border-gray-300'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => handleRemoveImage(index)}
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
                      {/* Confirmation Dialog for Deletion */}
                      {showDeleteConfirm.show && showDeleteConfirm.index === index && (
                        <div className='absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg z-10'>
                          <div className='bg-white border border-gray-300 rounded-lg p-6 max-w-xs w-full text-center'>
                            <p className='mb-4 text-black'>
                              You are about to delete an image. This action can not be undone. Do you wish to continue?
                            </p>
                            <div className='flex justify-center gap-4'>
                              <Button
                                type='button'
                                variant='outline'
                                className='bg-gray-200 border-gray-400 text-black hover:bg-gray-300'
                                onClick={() => setShowDeleteConfirm({ show: false, index: null })}
                                disabled={isDeleting}
                              >
                                No
                              </Button>
                              <Button
                                type='button'
                                className='bg-red-600 hover:bg-red-700 text-white'
                                onClick={confirmRemoveImage}
                                disabled={isDeleting}
                              >
                                {isDeleting ? <Loader2 className='w-4 h-4 animate-spin inline-block' /> : "Yes"}
                              </Button>
                            </div>
                          </div>
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
            {!imageDeleted && (
              <Button type='button' variant='outline' onClick={onClose} className='flex-1'>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
