"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface HeroSettings {
  heading: {
    line1: string;
    line2: string;
  };
  paragraph: string;
}

const defaultHeroSettings: HeroSettings = {
  heading: {
    line1: "Star Wars",
    line2: "Memorabilia",
  },
  paragraph:
    "Your ultimate collection management system for a galaxy far, far away. Organize, catalog, and treasure your Star Wars collectibles.",
};

interface HeroContextType {
  heroSettings: HeroSettings;
  updateHeroSettings: (settings: HeroSettings) => Promise<void>;
  loading: boolean;
}

const HeroContext = createContext<HeroContextType | undefined>(undefined);

export const HeroProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(defaultHeroSettings);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load hero settings from Supabase on mount
  useEffect(() => {
    loadHeroSettings();
  }, [user]);

  const loadHeroSettings = async () => {
    try {
      const { data, error } = await supabase.from("hero_settings").select("*").limit(1);

      if (error) {
        setHeroSettings(defaultHeroSettings);
      } else if (data && data.length > 0) {
        const heroData = data[0];
        setHeroSettings({
          heading: {
            line1: heroData.heading_line1,
            line2: heroData.heading_line2,
          },
          paragraph: heroData.paragraph,
        });
      } else {
        // No data exists, use defaults
        setHeroSettings(defaultHeroSettings);
      }
    } catch {
      setHeroSettings(defaultHeroSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateHeroSettings = async (settings: HeroSettings) => {
    if (!user) {
      throw new Error("User must be authenticated to update hero settings");
    }

    // Check if record exists for this user
    const { data: existingData } = await supabase.from("hero_settings").select("id").eq("user_id", user.id).limit(1);

    const updateData = {
      heading_line1: settings.heading.line1,
      heading_line2: settings.heading.line2,
      paragraph: settings.paragraph,
      user_id: user.id,
      updated_at: new Date().toISOString(),
    };

    let result;
    if (existingData && existingData.length > 0) {
      // Update existing record
      result = await supabase.from("hero_settings").update(updateData).eq("id", existingData[0].id);
    } else {
      // Insert new record
      result = await supabase.from("hero_settings").insert([updateData]);
    }

    if (result.error) {
      throw result.error;
    }

    // Update local state
    setHeroSettings(settings);
  };

  return <HeroContext.Provider value={{ heroSettings, updateHeroSettings, loading }}>{children}</HeroContext.Provider>;
};

export const useHero = () => {
  const context = useContext(HeroContext);
  if (context === undefined) {
    throw new Error("useHero must be used within a HeroProvider");
  }
  return context;
};
