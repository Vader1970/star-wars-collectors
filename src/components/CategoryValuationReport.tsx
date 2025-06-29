import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useCollection } from "@/contexts/CollectionContext";
import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";

interface CategoryValuationReportProps {
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number | undefined) =>
  value !== undefined
    ? "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "";

const CategoryValuationReport: React.FC<CategoryValuationReportProps> = ({ open, onClose }) => {
  const { categories, items } = useCollection();
  const router = useRouter();

  // Calculate sum for each category: only include items In Stock
  const categorySums = categories
    .map((cat) => {
      const sum = items
        .filter((item) => item.categoryId === cat.id && !!item.valuation && item.stockStatus === "In Stock")
        .reduce((acc, item) => acc + (item.valuation || 0), 0);
      return {
        id: cat.id,
        name: cat.name,
        sum,
      };
    })
    .filter((cat) => cat.sum > 0);

  // Sort descending by valuation
  categorySums.sort((a, b) => b.sum - a.sum);

  // Entire Stock Valuation
  const totalValuation = categorySums.reduce((acc, cat) => acc + cat.sum, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleCategoryClick = (categoryId: string) => {
    onClose();
    router.push(`/category/${categoryId}`);
  };

  return (
    <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
      <DialogContent className='max-w-2xl bg-white border border-slate-300'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold flex flex-row items-center justify-between'>
            <span>
              Category SUMS
              <span className='text-base font-normal ml-6 text-slate-700'>Entire Stock Valuation:</span>
              <span className='font-bold text-indigo-700 ml-2 text-lg'>{formatCurrency(totalValuation)}</span>
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
                <TableHead className='text-base font-semibold text-slate-800 w-3/5'>Category</TableHead>
                <TableHead className='text-base font-semibold text-slate-800 text-right w-2/5'>
                  Total Estimated Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorySums.map(({ id, name, sum }) => (
                <TableRow key={name} className='even:bg-slate-50 odd:bg-white'>
                  <TableCell className='text-slate-800 text-base'>
                    <button
                      onClick={() => handleCategoryClick(id)}
                      className='text-blue-600 hover:text-blue-800 underline cursor-pointer font-medium print:text-slate-800 print:no-underline'
                    >
                      {name}
                    </button>
                  </TableCell>
                  <TableCell className='text-right text-slate-700 text-base font-medium'>
                    {formatCurrency(sum)}
                  </TableCell>
                </TableRow>
              ))}
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

export default CategoryValuationReport;
