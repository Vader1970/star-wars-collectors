
import React from 'react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

interface ManufacturerDropdownProps {
  value: string;
  onChange: (value: string) => void;
  manufacturers: string[];
  onEdit: (manufacturer: string, index: number) => void;
  onAddNew: () => void;
  loading: boolean;
}

export const ManufacturerDropdown: React.FC<ManufacturerDropdownProps> = ({
  value,
  onChange,
  manufacturers,
  onEdit,
  onAddNew,
  loading
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-white border-gray-300 text-black">
        <SelectValue placeholder="Select manufacturer" />
      </SelectTrigger>
      <SelectContent className="bg-white max-h-60 overflow-y-auto z-[60]">
        {manufacturers.map((manufacturer, idx) => (
          <div key={manufacturer} className="flex items-center w-full group">
            <SelectItem value={manufacturer} className="flex-1">
              {manufacturer}
            </SelectItem>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              tabIndex={-1}
              className="p-1 ml-1 text-gray-400 hover:text-blue-600"
              onClick={e => {
                e.stopPropagation();
                onEdit(manufacturer, idx);
              }}
            >
              <Pencil className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <div className="px-2 py-1">
          <Button
            type="button"
            className="w-full text-blue-600 justify-start px-2 py-1"
            variant="ghost"
            onClick={onAddNew}
            disabled={loading}
          >
            + Add Manufacturer
          </Button>
        </div>
      </SelectContent>
    </Select>
  );
};
