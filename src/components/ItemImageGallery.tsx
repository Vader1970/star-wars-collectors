
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ItemImageGalleryProps {
  images: string[];
  currentImageIndex: number;
  itemName: string;
  onImageClick: (src: string, alt: string) => void;
  onNextImage: () => void;
  onPrevImage: () => void;
  onThumbnailClick: (index: number) => void;
}

const ItemImageGallery: React.FC<ItemImageGalleryProps> = ({
  images,
  currentImageIndex,
  itemName,
  onImageClick,
  onNextImage,
  onPrevImage,
  onThumbnailClick
}) => {
  if (images.length === 0) return null;

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-4">
        <CardContent className="p-4">
          <div className="relative">
            <img
              src={images[currentImageIndex]}
              alt={`${itemName} - Image ${currentImageIndex + 1}`}
              className="w-full h-auto rounded-lg shadow-sm cursor-zoom-in"
              onClick={() => onImageClick(images[currentImageIndex], `${itemName} - Image ${currentImageIndex + 1}`)}
            />
            
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => onThumbnailClick(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                    index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onImageClick(image, `Thumbnail ${index + 1}`);
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemImageGallery;
