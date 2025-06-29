
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AuthModal from "./AuthModal";
import AdminSheet from "./AdminSheet";

interface TopStatsBarProps {
  totalPublished: number;
  totalInStock: number;
}

const TopStatsBar: React.FC<TopStatsBarProps> = ({
  totalPublished,
  totalInStock,
}) => {
  const { user, signOut, loading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="w-full bg-black text-white flex items-center justify-center px-4 py-2 border-b border-slate-700">
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-black text-white flex flex-col md:flex-row md:items-center md:justify-between px-4 py-2 gap-2 md:gap-4 border-b border-slate-700">
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
        <span className="text-sm font-bold flex items-center">
          <span className="bg-red-700 px-2 py-1 rounded mr-1">{totalPublished}</span>
          Items published
        </span>
        <span className="text-sm font-bold flex items-center">
          <span className="bg-orange-600 px-2 py-1 rounded mr-1">{totalInStock}</span>
          items in stock and growing
        </span>
      </div>
      
      <div className="flex gap-2">
        {user ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{user.email}</span>
            </div>
            <Button
              className="bg-gray-900 hover:bg-gray-700 border border-slate-500 text-white text-sm px-4 py-1 h-auto rounded"
              size="sm"
              onClick={() => setAdminOpen(true)}
              type="button"
            >
              Admin
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 border border-red-500 text-white text-sm px-4 py-1 h-auto rounded"
              size="sm"
              onClick={handleSignOut}
              type="button"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Sign Out
            </Button>
          </>
        ) : (
          <Button
            className="bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white text-sm px-4 py-1 h-auto rounded"
            size="sm"
            onClick={() => setAuthModalOpen(true)}
            type="button"
          >
            <LogIn className="w-4 h-4 mr-1" />
            Sign In
          </Button>
        )}
      </div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      {user && <AdminSheet open={adminOpen} onOpenChange={setAdminOpen} />}
    </div>
  );
};

export default TopStatsBar;
