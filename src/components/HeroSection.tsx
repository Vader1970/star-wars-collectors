import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit3, Plus, LogIn, LogOut, User } from "lucide-react";
import { useHero } from "../contexts/HeroContext";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import AdminSheet from "./AdminSheet";
// import Image from "next/image";

interface HeroSectionProps {
  onEditHero: () => void;
  onAddCategory: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onEditHero, onAddCategory }) => {
  const { heroSettings } = useHero();
  const { user, signOut, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className='relative h-svh overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-center'>
      <video
        className='absolute inset-0 w-full h-full object-cover opacity-50 z-0'
        src='/mp4/stormtrooper.mp4'
        autoPlay
        muted
        loop
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

      <div className='relative container mx-auto px-6 z-10'>
        <div className='text-center max-w-4xl mx-auto'>
          {/* <div className='flex justify-center mb-6'>
            <div className='flex items-center gap-10 sm:gap-16'>
              <Image src='/icons/imperial-star-destroyer.png' alt='Imperial Star Destroyer' width={64} height={64} />
              <Image src='/icons/death-star-2.png' alt='Death Star' width={64} height={64} />
              <Image src='/icons/imperial-tie-fighter.png' alt='TIE Fighter' width={64} height={64} />
            </div>
          </div> */}
          <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight'>
            {heroSettings.heading.line1}
            <span className='block text-blue-400 mt-2'>{heroSettings.heading.line2}</span>
          </h1>
          <p className='text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed'>{heroSettings.paragraph}</p>

          {/* Authentication Section */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center mb-8'>
            {loading ? (
              <span className='text-white text-sm'>Loading...</span>
            ) : user ? (
              <>
                <div className='flex items-center gap-2 text-white text-sm'>
                  <User className='w-4 h-4' />
                  <span className='hidden sm:inline'>{user.email}</span>
                </div>
                <Button
                  className='bg-gray-900 hover:bg-gray-700 border border-slate-500 text-white text-sm px-4 py-2 h-auto rounded'
                  size='sm'
                  onClick={() => setAdminOpen(true)}
                  type='button'
                >
                  Admin
                </Button>
                <Button
                  className='bg-red-600 hover:bg-red-700 border border-red-500 text-white text-sm px-4 py-2 h-auto rounded'
                  size='sm'
                  onClick={handleSignOut}
                  type='button'
                >
                  <LogOut className='w-4 h-4 mr-1' />
                  Sign Out
                </Button>
              </>
            ) : (
              <Button
                className='bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white text-sm px-6 py-2 h-auto rounded'
                size='sm'
                onClick={() => setAuthModalOpen(true)}
                type='button'
              >
                <LogIn className='w-4 h-4 mr-1' />
                Sign In
              </Button>
            )}
          </div>

          {/* Add New Category Button - Only show to authenticated users */}
          {user && (
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Button
                onClick={onAddCategory}
                size='lg'
                className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg'
              >
                <Plus className='w-5 h-5 mr-2' />
                Add New Category
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      {user && <AdminSheet open={adminOpen} onOpenChange={setAdminOpen} />}
    </div>
  );
};

export default HeroSection;
