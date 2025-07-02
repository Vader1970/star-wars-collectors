import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Category } from "../types";

interface CategoryHeaderProps {
  currentCategory: Category;
  onBackNavigation: () => void;
  onBackToHome: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ currentCategory, onBackNavigation, onBackToHome }) => {
  return (
    <div className='relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700'>
      <div className='container mx-auto px-6 py-8'>
        <div className='flex items-center gap-4 mb-6'>
          <Button
            variant='outline'
            onClick={onBackNavigation}
            className='bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>
          <Button
            variant='outline'
            onClick={onBackToHome}
            className='bg-slate-800 border-slate-600 text-white hover:bg-slate-700'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back to Home
          </Button>
        </div>

        <div className='flex flex-col md:flex-row md:items-center gap-6'>
          {/* {currentCategory.image && (
            <img
              src={currentCategory.image}
              alt={currentCategory.name}
              className="w-32 h-32 object-cover rounded-lg border-2 border-blue-500/30"
            />
          )} */}
          <div>
            <h1 className='text-4xl font-bold text-white mb-2'>{currentCategory.name}</h1>
            {currentCategory.description && <p className='text-slate-300 text-lg'>{currentCategory.description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;
