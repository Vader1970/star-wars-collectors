import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Star, List, Heart, Coins, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import WishlistReport from "./WishlistReport";
import Top10Report from "./Top10Report";
import CategoryValuationReport from "./CategoryValuationReport";
import LeastValueReport from "./LeastValueReport";
import ValuationReport from "./ValuationReport";

const categories = [
  {
    label: "Top 10",
    icon: Star,
    link: "#top-10",
  },
  {
    label: "Least Value Items",
    icon: List,
    link: "#least-value",
  },
  {
    label: "Wishlist",
    icon: Heart,
    link: "#wishlist",
  },
  {
    label: "Group Valuation",
    icon: Coins,
    link: "#group-valuation",
  },
  {
    label: "Valuation Report",
    icon: TrendingUp,
    link: "#valuation-report",
  },
];

interface AdminSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminSheet: React.FC<AdminSheetProps> = ({ open, onOpenChange }) => {
  const [groupReportOpen, setGroupReportOpen] = useState(false);
  const [wishlistReportOpen, setWishlistReportOpen] = useState(false);
  const [top10ReportOpen, setTop10ReportOpen] = useState(false);
  const [leastValueReportOpen, setLeastValueReportOpen] = useState(false);
  const [valuationReportOpen, setValuationReportOpen] = useState(false);

  const handleCategoryClick = (cat: (typeof categories)[number]) => {
    if (cat.label === "Group Valuation") {
      setGroupReportOpen(true);
    } else if (cat.label === "Wishlist") {
      setWishlistReportOpen(true);
    } else if (cat.label === "Top 10") {
      setTop10ReportOpen(true);
    } else if (cat.label === "Least Value Items") {
      setLeastValueReportOpen(true);
    } else if (cat.label === "Valuation Report") {
      setValuationReportOpen(true);
    } else {
      onOpenChange(false);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side='right'
          className='max-w-md w-full bg-background border-l border-slate-700 px-0 flex flex-col'
        >
          <SheetHeader className='px-4 flex-shrink-0'>
            <SheetTitle className='text-center text-2xl font-bold'>Admin</SheetTitle>
            <SheetDescription className='text-center mb-4 text-base text-slate-400'>
              Choose an admin report or quick overview.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className='flex-1 px-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4'>
              {categories.map((cat) => (
                <button
                  type='button'
                  key={cat.label}
                  onClick={() => handleCategoryClick(cat)}
                  className='group bg-slate-800/95 border border-slate-600 rounded-lg flex flex-col items-center py-8 px-4 hover:bg-blue-950 hover:border-blue-500 transition-all shadow cursor-pointer focus:outline-none'
                >
                  <cat.icon className='w-10 h-10 text-blue-400 mb-3 group-hover:scale-110 transition-transform' />
                  <span className='font-semibold text-lg text-white text-center group-hover:text-blue-300'>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className='px-4 pb-4 flex-shrink-0'>
            <SheetClose asChild>
              <Button className='w-full bg-slate-900 hover:bg-slate-800 border border-slate-600 text-white'>
                Close
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
      <Top10Report
        open={top10ReportOpen}
        onClose={() => {
          setTop10ReportOpen(false);
          onOpenChange(false);
        }}
      />
      <WishlistReport
        open={wishlistReportOpen}
        onClose={() => {
          setWishlistReportOpen(false);
          onOpenChange(false);
        }}
      />
      <CategoryValuationReport
        open={groupReportOpen}
        onClose={() => {
          setGroupReportOpen(false);
          onOpenChange(false);
        }}
      />
      <LeastValueReport
        open={leastValueReportOpen}
        onClose={() => {
          setLeastValueReportOpen(false);
          onOpenChange(false);
        }}
      />
      <ValuationReport
        open={valuationReportOpen}
        onClose={() => {
          setValuationReportOpen(false);
          onOpenChange(false);
        }}
      />
    </>
  );
};

export default AdminSheet;
