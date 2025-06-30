import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useManufacturers = () => {
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const loadManufacturers = async () => {
    try {
      const { data, error } = await supabase
        .from("items")
        .select("manufacturer")
        .not("manufacturer", "is", null)
        .not("manufacturer", "eq", "");

      if (error) throw error;

      const uniqueManufacturers = [...new Set(data.map((item) => item.manufacturer).filter(Boolean))].sort();

      setManufacturers(uniqueManufacturers);
    } catch {
      setError("Failed to load manufacturers");
    }
  };

  const addManufacturer = (manufacturerName: string) => {
    if (manufacturers.some((m) => m.toLowerCase() === manufacturerName.toLowerCase())) {
      toast({
        title: "Duplicate Manufacturer",
        description: "This manufacturer already exists",
        variant: "destructive",
      });
      return false;
    }

    setManufacturers((prev) => [...prev, manufacturerName].sort());
    toast({
      title: "Manufacturer Added",
      description: "The manufacturer will be saved when you save the item",
    });
    return true;
  };

  const editManufacturer = (oldName: string, newName: string) => {
    const editIndex = manufacturers.indexOf(oldName);
    if (editIndex === -1) return false;

    if (manufacturers.some((m, i) => m.toLowerCase() === newName.toLowerCase() && i !== editIndex)) {
      toast({
        title: "Duplicate Manufacturer",
        description: "This manufacturer name already exists",
        variant: "destructive",
      });
      return false;
    }

    const updated = [...manufacturers];
    updated[editIndex] = newName;
    setManufacturers(updated.sort());

    toast({
      title: "Manufacturer Updated",
      description: "The change will be saved when you save the item",
    });
    return true;
  };

  useEffect(() => {
    loadManufacturers();
  }, []);

  return {
    manufacturers,
    loading,
    setLoading,
    addManufacturer,
    editManufacturer,
    error,
  };
};
