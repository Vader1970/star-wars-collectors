import { supabase } from "@/integrations/supabase/client";

export interface CloudflareUploadResponse {
  success: boolean;
  imageUrl?: string;
  cloudflareId?: string;
  error?: string;
}

export interface CloudflareDeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const uploadImageToCloudflare = async (file: File): Promise<{ imageUrl: string; cloudflareId: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  // Use Supabase Edge Function instead of direct Cloudflare API call
  const { data, error } = await supabase.functions.invoke("upload-to-cloudflare", {
    body: formData,
  });

  if (error) {
    throw new Error("Supabase function error");
  }

  if (!data.success) {
    if (data.error) {
      throw new Error(data.error);
    }
    throw new Error("Failed to upload image");
  }

  return {
    imageUrl: data.imageUrl,
    cloudflareId: data.cloudflareId,
  };
};

export const deleteImageFromCloudflare = async (cloudflareId: string): Promise<void> => {
  if (!cloudflareId) {
    return; // No image to delete
  }

  try {
    const { data, error } = await supabase.functions.invoke("delete-from-cloudflare", {
      body: { imageId: cloudflareId },
    });

    if (error) {
      console.error("Failed to delete image from Cloudflare:", error);
      // Don't throw error to avoid breaking the main operation
      return;
    }

    if (!data.success) {
      console.error("Failed to delete image from Cloudflare:", data.error);
      return;
    }
  } catch (error) {
    console.error("Error deleting image from Cloudflare:", error);
    // Don't throw error to avoid breaking the main operation
  }
};

export const convertBase64ToFile = (base64String: string, filename: string): File => {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
};
