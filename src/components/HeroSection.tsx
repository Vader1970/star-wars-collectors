import React from "react";
import { Button } from "@/components/ui/button";
import { Edit3, Plus } from "lucide-react";
import { useHero } from "../contexts/HeroContext";
import { useAuth } from "../contexts/AuthContext";
import Image from "next/image";

interface HeroSectionProps {
  onEditHero: () => void;
  onAddCategory: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onEditHero, onAddCategory }) => {
  const { heroSettings } = useHero();
  const { user } = useAuth();

  return (
    <div className='relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700'>
      <video
        className='absolute inset-0 w-full h-full object-cover opacity-40 z-0'
        src='/mp4/hero-light-speed.mp4'
        autoPlay
        muted
        playsInline
      />

      {/* Edit Hero Button - Only show to authenticated users */}
      {user && (
        <div className='absolute top-4 right-4 z-10'>
          <Button
            onClick={onEditHero}
            variant='outline'
            size='sm'
            className='bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700/80'
          >
            <Edit3 className='w-4 h-4 mr-2' />
            Edit Hero Section
          </Button>
        </div>
      )}

      <div className='relative container mx-auto px-6 py-20'>
        <div className='text-center max-w-4xl mx-auto'>
          <div className='flex justify-center mb-6'>
            <div className='flex items-center gap-16'>
              <Image src='/icons/imperial-star-destroyer.png' alt='Imperial Star Destroyer' width={64} height={64} />
              <Image src='/icons/death-star-2.png' alt='Death Star' width={64} height={64} />
              <Image src='/icons/imperial-tie-fighter.png' alt='TIE Fighter' width={64} height={64} />
            </div>
          </div>
          <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight'>
            {heroSettings.heading.line1}
            <span className='block text-blue-400 mt-2'>{heroSettings.heading.line2}</span>
          </h1>
          <p className='text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed'>{heroSettings.paragraph}</p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            {/* Add New Category Button - Only show to authenticated users */}
            {user && (
              <Button
                onClick={onAddCategory}
                size='lg'
                className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg'
              >
                <Plus className='w-5 h-5 mr-2' />
                Add New Category
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
