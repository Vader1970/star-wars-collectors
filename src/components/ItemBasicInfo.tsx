import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { Item } from "../types";

interface ItemBasicInfoProps {
  item: Item;
  group: string;
  category: string;
}

const ItemBasicInfo: React.FC<ItemBasicInfoProps> = ({ item, group, category }) => {
  const buildEbaySearchUrl = (category: string, name: string, year?: number) => {
    const yearString = year ? year.toString() : "";
    const query = `Star Wars ${category} ${name} ${yearString}`.trim().replace(/\s+/g, "+");
    return `https://www.ebay.com/sch/i.html?_nkw=${query}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-gray-800'>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-600'>Group</label>
            <p className='text-gray-800'>{group}</p>
          </div>
          <div>
            <label className='text-sm font-medium text-gray-600'>Category</label>
            <p className='text-gray-800'>{category}</p>
          </div>
        </div>

        {item.variations && (
          <div>
            <label className='text-sm font-medium text-gray-600'>Variations</label>
            <p className='text-gray-800'>{item.variations || "N/A"}</p>
          </div>
        )}

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-600'>Manufacturer</label>
            <p className='text-gray-800'>{item.manufacturer || "N/A"}</p>
          </div>
          <div>
            <label className='text-sm font-medium text-gray-600'>Year Manufactured</label>
            <p className='text-gray-800'>{item.yearManufactured || "N/A"}</p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-600'>Rating</label>
            <p className='text-gray-800'>{item.rating || "N/A"}</p>
          </div>
          <div>
            <label className='text-sm font-medium text-gray-600'>Stock Status</label>
            <p className={`font-medium ${item.stockStatus === "In Stock" ? "text-green-600" : "text-red-600"}`}>
              {item.stockStatus}
            </p>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-600'>AFA Number</label>
            <p className='text-gray-800'>{item.afaNumber || "N/A"}</p>
          </div>
          <div>
            <label className='text-sm font-medium text-gray-600'>AFA Grade</label>
            <p className='text-gray-800'>{item.afaGrade || "N/A"}</p>
          </div>
        </div>

        {/* eBay Search Link */}
        <div className='pt-4 border-t border-gray-200'>
          <a
            href={buildEbaySearchUrl(category, item.name, item.yearManufactured)}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
          >
            <ExternalLink className='w-4 h-4' />
            Search on eBay for valuation
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemBasicInfo;
