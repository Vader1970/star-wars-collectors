
import React, { useRef, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';

const ZOOM_BOX_SIZE = 300;
const ZOOM_SCALE = 2.5;

interface ItemZoomModalProps {
  zoomedImage: { image: string; alt: string } | null;
  onClose: () => void;
}

const ItemZoomModal: React.FC<ItemZoomModalProps> = ({
  zoomedImage,
  onClose
}) => {
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));
    setZoomPosition({ x, y });
  };

  return (
    <Dialog open={!!zoomedImage} onOpenChange={open => !open && onClose()}>
      <DialogContent
        className="max-w-5xl w-full bg-background relative overflow-visible p-0 flex justify-center items-center"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'fixed',
          maxHeight: '95vh',
          maxWidth: '95vw',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <button
          className="absolute right-4 top-4 p-2 rounded-full bg-black/70 hover:bg-black/90 transition-colors z-10"
          aria-label="Close"
          onClick={onClose}
        >
          <X className="w-6 h-6 text-white" />
        </button>
        {zoomedImage && (
          <div
            className="relative flex justify-center items-center bg-white rounded-xl shadow-lg"
            style={{
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              width: 'auto',
              height: 'auto',
              minWidth: 0,
              minHeight: 0,
              margin: 0,
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoomPosition({ x: 0, y: 0 })}
          >
            <img
              ref={imgRef}
              src={zoomedImage.image}
              alt={zoomedImage.alt}
              className="object-contain border rounded-lg max-h-[75vh] max-w-[85vw] bg-white mx-auto"
              style={{
                display: 'block',
                background: '#fff',
                margin: '0',
                maxHeight: '70vh',
                maxWidth: '95vw',
              }}
              draggable={false}
              onLoad={e => {
                const img = e.currentTarget;
                setImgSize({ width: img.naturalWidth, height: img.naturalHeight });
              }}
            />
            {/* Zoom box */}
            {zoomPosition.x !== 0 && zoomPosition.y !== 0 && (
              <div
                style={{
                  position: 'absolute',
                  left: zoomPosition.x - ZOOM_BOX_SIZE / 2,
                  top: zoomPosition.y - ZOOM_BOX_SIZE / 2,
                  width: ZOOM_BOX_SIZE,
                  height: ZOOM_BOX_SIZE,
                  border: '2px solid #3182ce',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  pointerEvents: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  background: '#fff',
                  zIndex: 20,
                }}
                className="zoom-box"
              >
                <img
                  src={zoomedImage.image}
                  alt="Zoom"
                  style={{
                    position: 'absolute',
                    left: -(zoomPosition.x * ZOOM_SCALE - ZOOM_BOX_SIZE / 2),
                    top: -(zoomPosition.y * ZOOM_SCALE - ZOOM_BOX_SIZE / 2),
                    width: `calc(100% * ${ZOOM_SCALE})`,
                    height: 'auto',
                    minWidth: '100%',
                    maxWidth: 'none',
                    pointerEvents: 'none',
                    objectFit: 'cover',
                    userSelect: 'none',
                  }}
                  draggable={false}
                />
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ItemZoomModal;
