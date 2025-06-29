
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface EmptyStateProps {
  onAddCategory: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddCategory }) => {
  const { user } = useAuth();

  return (
    <div className="text-center py-20">
      <div className="text-slate-400 mb-8">
        <div className="w-32 h-32 mx-auto mb-6 bg-slate-800 rounded-full flex items-center justify-center">
          <Shield className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-semibold mb-4 text-white">Start Your Collection</h3>
        <p className="text-lg text-slate-500 mb-8 max-w-md mx-auto">
          Begin organizing your Star Wars memorabilia by creating your first category.
        </p>
      </div>
      {/* Create First Category Button - Only show to authenticated users */}
      {user && (
        <Button
          onClick={onAddCategory}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create First Category
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
