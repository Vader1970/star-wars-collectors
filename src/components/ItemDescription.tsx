
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ItemDescriptionProps {
  description?: string;
}

const ItemDescription: React.FC<ItemDescriptionProps> = ({
  description
}) => {
  if (!description) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-800">Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ItemDescription;
