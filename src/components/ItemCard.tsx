import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { Item } from "../types";

interface ItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
  showActions?: boolean;
}

const MIN_CARD_HEIGHT = "h-[415px]"; // Adjust based on your tallest card needs.

const ItemCard = ({ item, onEdit, onDelete, onViewDetails, showActions = true }: ItemCardProps) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  return (
    <Card
      className={`bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 group cursor-pointer flex flex-col ${MIN_CARD_HEIGHT}`}
    >
      <CardContent className='p-0 flex flex-col flex-1 h-full'>
        <div className='relative'>
          {item.image ? (
            <img src={item.image} alt={item.name} className='w-full h-48 object-cover rounded-t-lg' />
          ) : (
            <div className='w-full h-48 bg-gray-100 rounded-t-lg flex items-center justify-center'>
              <span className='text-gray-400 text-sm'>No image</span>
            </div>
          )}

          {/* Action buttons overlay - Only show to authenticated users */}
          {showActions && (
            <div className='absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
              <Button
                variant='outline'
                size='sm'
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className='h-8 w-8 p-0 bg-white/90 hover:bg-white'
                aria-label='Edit'
              >
                <Edit className='w-4 h-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className='h-8 w-8 p-0 bg-white/90  border-red-200 text-red-600 hover:bg-red-50'
                aria-label='Delete'
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </div>
          )}
        </div>

        {/* Content above button row gets a fixed min-h (flex-1 ensures it stretches, justify-between for good measure) */}
        <div className='p-4 flex flex-col flex-1 justify-between min-h-[180px]'>
          <div>
            <h3 className='font-semibold text-gray-800 mb-3 text-lg line-clamp-2 min-h-[2.4em]'>{item.name}</h3>
            <div className='flex flex-col gap-1 mb-4 min-h-[4.5em]'>
              <div
                className={`text-sm font-medium ${item.stockStatus === "In Stock" ? "text-green-600" : "text-red-600"}`}
              >
                {item.stockStatus}
              </div>
              <div className='text-sm text-gray-600'>
                {item.rating ? <>Rating: {item.rating}</> : <span className='opacity-0'>empty</span>}
              </div>
              <div className='text-sm'>
                {item.valuation ? (
                  <div className='flex items-center gap-1'>
                    <span className='text-black font-medium'>Value:</span>
                    <span className='text-red-600 font-bold'>{formatCurrency(item.valuation)}</span>
                  </div>
                ) : (
                  <span className='opacity-0'>empty</span>
                )}
              </div>
            </div>
          </div>
          {/* Action row (ALWAYS at absolute bottom thanks to flex-1 on parent) */}
          <div className='flex gap-2 mt-auto'>
            <Button
              variant='outline'
              size='sm'
              className='flex-1 justify-center text-blue-700 border-blue-200 hover:bg-blue-50'
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(item.id);
              }}
              aria-label='View'
            >
              <Eye className='w-4 h-4 mr-1' />
              View
            </Button>
            {/* Action buttons - Only show to authenticated users */}
            {showActions && (
              <>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className='h-9 w-9 p-0 bg-white/90 hover:bg-gray-100'
                  aria-label='Edit'
                >
                  <Edit className='w-4 h-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  className='h-9 w-9 p-0 bg-white/90 hover:bg-red-50 border-red-200 text-red-600'
                  aria-label='Delete'
                >
                  <Trash2 className='w-4 h-4' />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
