
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item } from '../types';

interface User {
  id: string;
  email?: string;
}

interface ItemFinancialInfoProps {
  item: Item;
  user: User | null;
}

const ItemFinancialInfo: React.FC<ItemFinancialInfoProps> = ({
  item,
  user
}) => {
  if (!user) return null;

  const profit = item.valuation && item.boughtFor ? item.valuation - item.boughtFor : 0;
  const profitPercentage = item.boughtFor && item.boughtFor > 0 && item.valuation 
    ? ((item.valuation - item.boughtFor) / item.boughtFor * 100).toFixed(2) 
    : '0';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-800">Financial Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Valuation Price</label>
            <p className="text-lg font-semibold text-gray-800">
              ${item.valuation?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Bought For</label>
            <p className="text-lg font-semibold text-gray-800">
              ${item.boughtFor?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Profit</label>
            <p className={`text-lg font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${profit.toFixed(2)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Profit %</label>
            <p className={`text-lg font-semibold ${parseFloat(profitPercentage) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitPercentage}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemFinancialInfo;
