import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCollection } from "@/contexts/CollectionContext";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ItemSearchDropdownProps {
  placeholder?: string;
  className?: string;
}

const ItemSearchDropdown: React.FC<ItemSearchDropdownProps> = ({ placeholder = "Search items...", className = "" }) => {
  const { items } = useCollection();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<typeof items>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems([]);
      return;
    }

    const filtered = items
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.manufacturer && item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .slice(0, 10); // Limit to 10 results

    setFilteredItems(filtered);
  }, [searchTerm, items]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleItemClick = (itemId: string) => {
    setSearchTerm("");
    setIsOpen(false);
    router.push(`/item/${itemId}`);
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilteredItems([]);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
        <Input
          type='text'
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className='pl-10 pr-10'
        />
        {searchTerm && (
          <Button
            variant='ghost'
            size='sm'
            onClick={handleClear}
            className='absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0'
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>

      {isOpen && filteredItems.length > 0 && (
        <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto'>
          {filteredItems.map((item) => {
            const imageSrc = item.images && item.images.length > 0 ? item.images[0] : item.image;
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className='flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0'
              >
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt={item.name}
                    className='w-8 h-8 rounded object-cover border border-gray-200 flex-shrink-0'
                  />
                )}
                <div className='min-w-0'>
                  <div className='font-medium text-gray-900'>{item.name}</div>
                  {item.manufacturer && <div className='text-sm text-gray-500'>Manufacturer: {item.manufacturer}</div>}
                  {item.description && <div className='text-sm text-gray-500 truncate'>{item.description}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isOpen && searchTerm && filteredItems.length === 0 && (
        <div className='absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg'>
          <div className='px-4 py-2 text-gray-500'>No items found</div>
        </div>
      )}
    </div>
  );
};

export default ItemSearchDropdown;
