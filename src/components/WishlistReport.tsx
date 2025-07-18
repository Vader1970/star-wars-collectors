import React from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useCollection } from "@/contexts/CollectionContext";
import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";

interface WishlistReportProps {
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number | undefined) =>
  value !== undefined
    ? "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "";

const WishlistReport: React.FC<WishlistReportProps> = ({ open, onClose }) => {
  const { items, categories } = useCollection();
  const router = useRouter();

  // Get all Out of Stock items, sorted by value descending
  const wishlistItems = [...items]
    .filter((item) => item.stockStatus === "Out of Stock")
    .sort((a, b) => (b.valuation || 0) - (a.valuation || 0));

  // Helper to find category
  const getCategory = (categoryId: string) => categories.find((cat) => cat.id === categoryId);

  const handlePrint = () => {
    window.print();
  };

  const handleItemClick = (itemId: string) => {
    onClose();
    router.push(`/item/${itemId}`);
  };

  return (
    <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
      <DialogContent className='max-w-4xl bg-white border border-slate-300'>
        <DialogHeader>
          <DialogDescription className='sr-only'>Wishlist Report</DialogDescription>
          <DialogTitle className='text-2xl font-bold flex flex-row items-center justify-between'>
            <span>
              Wishlist Report
              <span className='text-base font-normal ml-6 text-slate-700'>Total Items:</span>
              <span className='font-bold text-indigo-700 ml-2 text-lg'>{wishlistItems.length}</span>
            </span>
            <Button
              variant='ghost'
              size='icon'
              onClick={handlePrint}
              className='ml-3 print:hidden'
              aria-label='Print report'
            >
              <Printer className='w-5 h-5' />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className='overflow-auto max-h-[60vh] border rounded bg-white'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='text-base font-semibold text-slate-800'>Image</TableHead>
                <TableHead className='text-base font-semibold text-slate-800'>Item Name</TableHead>
                <TableHead className='text-base font-semibold text-slate-800'>Category</TableHead>
                <TableHead className='text-base font-semibold text-slate-800'>Manufacturer</TableHead>
                <TableHead className='text-base font-semibold text-slate-800 text-right'>Estimated Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wishlistItems.map((item) => {
                const category = getCategory(item.categoryId);
                const imageSrc = item.images && item.images.length > 0 ? item.images[0] : item.image;
                return (
                  <TableRow key={item.id} className='even:bg-slate-50 odd:bg-white'>
                    <TableCell className='text-slate-700 text-base font-medium'>
                      {imageSrc && (
                        <Image
                          src={imageSrc}
                          alt={item.name}
                          width={40}
                          height={40}
                          className='w-10 h-10 rounded object-cover border border-gray-200'
                        />
                      )}
                    </TableCell>
                    <TableCell className='text-slate-800 text-base'>
                      <button
                        onClick={() => handleItemClick(item.id)}
                        className='text-blue-600 hover:text-blue-800 underline cursor-pointer font-medium print:text-slate-800 print:no-underline'
                      >
                        {item.name}
                      </button>
                    </TableCell>
                    <TableCell className='text-slate-700 text-base'>{category?.name || "Unknown"}</TableCell>
                    <TableCell className='text-slate-700 text-base'>{item.manufacturer || "Unknown"}</TableCell>
                    <TableCell className='text-right text-slate-700 text-base font-medium'>
                      {formatCurrency(item.valuation)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className='flex justify-end gap-3 mt-6 print:hidden'>
          <Button onClick={handlePrint} variant='outline' className='border border-slate-600'>
            <Printer className='w-4 h-4 mr-2' />
            Print
          </Button>
          <Button onClick={onClose} variant='default'>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistReport;
