import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface ManufacturerInputProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder: string;
  loading: boolean;
}

export const ManufacturerInput: React.FC<ManufacturerInputProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder,
  loading,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && value.trim() && !loading) {
      onSave();
    }
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className='flex gap-2 items-center mt-1'>
      <Input
        id='manufacturer-input'
        name='manufacturer-input'
        autoComplete='off'
        autoFocus
        value={value}
        placeholder={placeholder}
        className='flex-1 bg-white border-gray-300 text-black'
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <Button type='button' className='px-2' disabled={!value.trim() || loading} onClick={onSave}>
        <Check className='w-4 h-4' />
      </Button>
      <Button type='button' className='px-2' variant='ghost' onClick={onCancel} disabled={loading}>
        <X className='w-4 h-4' />
      </Button>
    </div>
  );
};
