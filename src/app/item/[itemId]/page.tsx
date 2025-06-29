"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCollection } from "@/contexts/CollectionContext";
import { useAuth } from "@/contexts/AuthContext";
import ItemBasicInfo from "@/components/ItemBasicInfo";
import ItemDescription from "@/components/ItemDescription";
import ItemFinancialInfo from "@/components/ItemFinancialInfo";
import ItemImageGallery from "@/components/ItemImageGallery";
import ItemZoomModal from "@/components/ItemZoomModal";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Item } from "@/types";

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { items, categories } = useCollection();

  const itemId = params?.itemId as string;
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [currentGroup, setCurrentGroup] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<{ image: string; alt: string } | null>(null);

  useEffect(() => {
    if (itemId) {
      const item = items.find((item) => item.id === itemId);
      setCurrentItem(item || null);

      if (item) {
        const category = categories.find((cat) => cat.id === item.categoryId);
        setCurrentCategory(category?.name || "");

        // Find the group (parent category)
        if (category?.parentId) {
          const group = categories.find((cat) => cat.id === category.parentId);
          setCurrentGroup(group?.name || "");
        } else {
          setCurrentGroup(category?.name || "");
        }
      }
    }
  }, [itemId, items, categories]);

  const handleBackNavigation = () => {
    if (currentItem?.categoryId) {
      router.push(`/category/${currentItem.categoryId}`);
    } else {
      router.push("/");
    }
  };

  const handleBackToHome = () => {
    router.push("/");
  };

  const handleImageClick = (src: string, alt: string) => {
    setZoomedImage({ image: src, alt });
  };

  const handleNextImage = () => {
    if (currentItem?.images && currentItem.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === currentItem.images!.length - 1 ? 0 : prev + 1));
    }
  };

  const handlePrevImage = () => {
    if (currentItem?.images && currentItem.images.length > 0) {
      setCurrentImageIndex((prev) => (prev === 0 ? currentItem.images!.length - 1 : prev - 1));
    }
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleCloseZoomModal = () => {
    setZoomedImage(null);
  };

  if (!currentItem) {
    return <div>Loading...</div>;
  }

  // Get images array
  const images =
    currentItem.images && currentItem.images.length > 0
      ? currentItem.images
      : currentItem.image
      ? [currentItem.image]
      : [];

  return (
    <div className='min-h-screen bg-slate-900'>
      {/* Header */}
      <div className='relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700'>
        <div className='container mx-auto px-6 py-8'>
          <div className='flex items-center gap-4 mb-6'>
            <Button
              variant='outline'
              onClick={handleBackNavigation}
              className='bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Category
            </Button>
            <Button
              variant='outline'
              onClick={handleBackToHome}
              className='bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
            >
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Home
            </Button>
          </div>

          <div className='flex flex-col md:flex-row md:items-center gap-6'>
            {currentItem.image && (
              <img
                src={currentItem.image}
                alt={currentItem.name}
                className='w-32 h-32 object-cover rounded-lg border-2 border-blue-500/30'
              />
            )}
            <div>
              <h1 className='text-4xl font-bold text-white mb-2'>{currentItem.name}</h1>
              {currentCategory && <p className='text-slate-300 text-lg'>Category: {currentCategory}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='container mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column */}
          <div className='space-y-8'>
            <ItemBasicInfo item={currentItem} group={currentGroup} category={currentCategory} />
            <ItemDescription description={currentItem.description} />
            <ItemFinancialInfo item={currentItem} user={user} />
          </div>

          {/* Right Column */}
          <div>
            <ItemImageGallery
              images={images}
              currentImageIndex={currentImageIndex}
              itemName={currentItem.name}
              onImageClick={handleImageClick}
              onNextImage={handleNextImage}
              onPrevImage={handlePrevImage}
              onThumbnailClick={handleThumbnailClick}
            />
          </div>
        </div>
      </div>

      <ItemZoomModal zoomedImage={zoomedImage} onClose={handleCloseZoomModal} />
    </div>
  );
}
