
import React, { useState } from "react";
import { useManufacturers } from "@/hooks/useManufacturers";
import { ManufacturerInput } from "./ManufacturerInput";
import { ManufacturerDropdown } from "./ManufacturerDropdown";

interface ManufacturerSelectProps {
  value: string;
  onChange: (val: string) => void;
  initialManufacturers?: string[];
}

export default function ManufacturerSelect({
  value,
  onChange,
  initialManufacturers = [],
}: ManufacturerSelectProps) {
  const { manufacturers, loading, setLoading, addManufacturer, editManufacturer } = useManufacturers();
  const [mode, setMode] = useState<"select" | "add" | "edit">("select");
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAdd = async () => {
    if (!inputValue.trim()) return;

    const manufacturerName = inputValue.trim();
    const success = addManufacturer(manufacturerName);
    
    if (success) {
      onChange(manufacturerName);
      setInputValue("");
      setMode("select");
    }
  };

  const handleEdit = async () => {
    if (editIndex === null || !inputValue.trim()) return;

    const oldName = manufacturers[editIndex];
    const newName = inputValue.trim();
    const success = editManufacturer(oldName, newName);

    if (success) {
      onChange(newName);
      setInputValue("");
      setEditIndex(null);
      setMode("select");
    }
  };

  const handleCancel = () => {
    setInputValue("");
    setMode("select");
    setEditIndex(null);
  };

  const handleEditManufacturer = (manufacturer: string, index: number) => {
    setMode("edit");
    setEditIndex(index);
    setInputValue(manufacturer);
  };

  const handleAddNew = () => {
    setInputValue("");
    setMode("add");
    setEditIndex(null);
  };

  if (mode === "add") {
    return (
      <ManufacturerInput
        value={inputValue}
        onChange={setInputValue}
        onSave={handleAdd}
        onCancel={handleCancel}
        placeholder="Manufacturer name"
        loading={loading}
      />
    );
  }

  if (mode === "edit" && editIndex !== null) {
    return (
      <ManufacturerInput
        value={inputValue}
        onChange={setInputValue}
        onSave={handleEdit}
        onCancel={handleCancel}
        placeholder="Manufacturer name"
        loading={loading}
      />
    );
  }

  return (
    <div>
      <ManufacturerDropdown
        value={value}
        onChange={onChange}
        manufacturers={manufacturers}
        onEdit={handleEditManufacturer}
        onAddNew={handleAddNew}
        loading={loading}
      />
    </div>
  );
}
