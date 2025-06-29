import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useCollection } from "@/contexts/CollectionContext";
import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";

interface Top10ReportProps {
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number | undefined) =>
  value !== undefined
    ? "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "";

const Top10Report: React.FC<Top10ReportProps> = ({ open, onClose }) => {
  const { items } = useCollection();
  const router = useRouter();

  // Get top 10 items by valuation, sorted by value descending
  const top10Items = [...items]
    .filter((item) => item.valuation && item.valuation > 0)
    .sort((a, b) => (b.valuation || 0) - (a.valuation || 0))
    .slice(0, 10);

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
          <DialogTitle className='text-2xl font-bold flex flex-row items-center justify-between'>
            <span>
              Top 10 Most Valuable Items
              <span className='text-base font-normal ml-6 text-slate-700'>Total Items:</span>
              <span className='font-bold text-indigo-700 ml-2 text-lg'>{top10Items.length}</span>
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
                <TableHead className='text-base font-semibold text-slate-800'>Stock Status</TableHead>
                <TableHead className='text-base font-semibold text-slate-800'>Manufacturer</TableHead>
                <TableHead className='text-base font-semibold text-slate-800 text-right'>Estimated Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top10Items.map((item) => {
                const imageSrc = item.images && item.images.length > 0 ? item.images[0] : item.image;
                return (
                  <TableRow key={item.id} className='even:bg-slate-50 odd:bg-white'>
                    <TableCell className='text-slate-700 text-base font-medium'>
                      {imageSrc && (
                        <img
                          src={imageSrc}
                          alt={item.name}
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
                    <TableCell className='text-slate-700 text-base'>{item.stockStatus}</TableCell>
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

export default Top10Report;
