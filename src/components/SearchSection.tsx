import React from "react";
import ItemSearchDropdown from "./ItemSearchDropdown";
import { Category } from "../types";

interface SearchSectionProps {
  groupValuationCategories: Category[];
  selectedValCategory: string;
  onValCategorySelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  groupValuationCategories,
  selectedValCategory,
  onValCategorySelect,
}) => {
  return (
    <div className='bg-slate-900 border-b border-slate-700 py-8'>
      <div className='container mx-auto px-6'>
        <div className='max-w-4xl mx-auto'>
          {/* Heading - only visible on larger screens */}
          <h2 className='text-xl font-semibold text-white text-center mb-6 hidden lg:block'>Search By</h2>

          <div className='flex flex-col lg:flex-row gap-4 items-center justify-center'>
            {/* Item Search - full width on mobile, larger width on desktop */}
            <div className='w-full lg:w-[480px]'>
              <ItemSearchDropdown />
            </div>

            {/* Category Select - full width on mobile, larger width on desktop */}
            <div className='w-full lg:w-[480px]'>
              <label htmlFor='category-select' className='sr-only'>
                Search by category
              </label>
              <select
                id='category-select'
                className='bg-slate-800 text-white rounded px-3 py-2 text-sm w-full border border-slate-600 focus:border-blue-500 focus:outline-none'
                value={selectedValCategory || "__placeholder__"}
                onChange={onValCategorySelect}
                aria-label='Search by category'
              >
                <option value='__placeholder__'>----Search By Category----</option>
                {groupValuationCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
