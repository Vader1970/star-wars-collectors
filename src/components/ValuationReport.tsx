import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useCollection } from "@/contexts/CollectionContext";
import { useRouter } from "next/navigation";
import { Printer } from "lucide-react";

interface ValuationReportProps {
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number | undefined) =>
  value !== undefined
    ? "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "";

const formatPercentage = (value: number) => value.toFixed(1) + "%";

const ValuationReport: React.FC<ValuationReportProps> = ({ open, onClose }) => {
  const { items, categories } = useCollection();
  const router = useRouter();

  // Filter items that are In Stock and have both boughtFor and valuation values
  const itemsWithData = items.filter(
    (item) =>
      item.stockStatus === "In Stock" &&
      item.boughtFor !== undefined &&
      item.valuation !== undefined &&
      item.boughtFor > 0 &&
      item.valuation > 0
  );

  // Calculate totals
  const totalPurchases = itemsWithData.reduce((acc, item) => acc + (item.boughtFor || 0), 0);
  const totalValuation = itemsWithData.reduce((acc, item) => acc + (item.valuation || 0), 0);
  const totalProfit = totalValuation - totalPurchases;
  const totalProfitPercentage = totalPurchases > 0 ? (totalProfit / totalPurchases) * 100 : 0;

  // Group items by category
  const groupedItems = itemsWithData.reduce(
    (groups, item) => {
      const category = categories.find((cat) => cat.id === item.categoryId);
      const categoryName = category?.name || "Uncategorized";

      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }

      const boughtFor = item.boughtFor || 0;
      const valuation = item.valuation || 0;
      const profit = valuation - boughtFor;
      const profitPercentage = boughtFor > 0 ? (profit / boughtFor) * 100 : 0;

      groups[categoryName].push({
        id: item.id,
        name: item.name,
        boughtFor,
        valuation,
        profit,
        profitPercentage,
      });

      return groups;
    },
    {} as Record<
      string,
      Array<{
        id: string;
        name: string;
        boughtFor: number;
        valuation: number;
        profit: number;
        profitPercentage: number;
      }>
    >
  );

  // Sort items within each group by profit percentage descending
  Object.keys(groupedItems).forEach((categoryName) => {
    groupedItems[categoryName].sort((a, b) => b.profitPercentage - a.profitPercentage);
  });

  // Sort categories by their total valuation (descending)
  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    const totalA = groupedItems[a].reduce((sum, item) => sum + item.valuation, 0);
    const totalB = groupedItems[b].reduce((sum, item) => sum + item.valuation, 0);
    return totalB - totalA;
  });

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
          <DialogDescription className='sr-only'>Valuation Report</DialogDescription>
          <DialogTitle className='text-2xl font-bold flex flex-row items-center justify-between'>
            <span>
              Valuation Report
              <span className='text-base font-normal ml-6 text-slate-700'>Total Items:</span>
              <span className='font-bold text-indigo-700 ml-2 text-lg'>{itemsWithData.length}</span>
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

        {/* Summary Section */}
        <div className='bg-slate-50 p-4 rounded-lg border mb-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <div className='text-sm text-slate-600 mb-1'>Total Purchases</div>
              <div className='text-lg font-bold text-slate-800'>{formatCurrency(totalPurchases)}</div>
            </div>
            <div className='text-center'>
              <div className='text-sm text-slate-600 mb-1'>Valuation</div>
              <div className='text-lg font-bold text-blue-700'>{formatCurrency(totalValuation)}</div>
            </div>
            <div className='text-center'>
              <div className='text-sm text-slate-600 mb-1'>Total Profit</div>
              <div className={`text-lg font-bold ${totalProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(totalProfit)}
              </div>
            </div>
            <div className='text-center'>
              <div className='text-sm text-slate-600 mb-1'>Profit %</div>
              <div className={`text-lg font-bold ${totalProfitPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatPercentage(totalProfitPercentage)}
              </div>
            </div>
          </div>
        </div>

        {/* Grouped Items */}
        <div className='overflow-auto max-h-[50vh] space-y-6'>
          {sortedCategories.map((categoryName) => {
            const categoryItems = groupedItems[categoryName];
            const categoryTotal = categoryItems.reduce((sum, item) => sum + item.valuation, 0);

            return (
              <div key={categoryName} className='border rounded bg-white'>
                <div className='bg-slate-100 px-4 py-3 border-b'>
                  <h3 className='text-lg font-semibold text-slate-800 flex justify-between items-center'>
                    <span>{categoryName}</span>
                    <span className='text-blue-700'>{formatCurrency(categoryTotal)}</span>
                  </h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-base font-semibold text-slate-800'>Item Name</TableHead>
                      <TableHead className='text-base font-semibold text-slate-800 text-right'>Bought For</TableHead>
                      <TableHead className='text-base font-semibold text-slate-800 text-right'>Valuation</TableHead>
                      <TableHead className='text-base font-semibold text-slate-800 text-right'>Profit</TableHead>
                      <TableHead className='text-base font-semibold text-slate-800 text-right'>Profit %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryItems.map((item, index) => (
                      <TableRow key={index} className='even:bg-slate-50 odd:bg-white'>
                        <TableCell className='text-slate-800 text-base'>
                          <button
                            onClick={() => handleItemClick(item.id)}
                            className='text-left text-blue-600 hover:text-blue-800 underline cursor-pointer font-medium print:text-slate-800 print:no-underline'
                          >
                            {item.name}
                          </button>
                        </TableCell>
                        <TableCell className='text-right text-slate-700 text-base'>
                          {formatCurrency(item.boughtFor)}
                        </TableCell>
                        <TableCell className='text-right text-blue-700 text-base font-medium'>
                          {formatCurrency(item.valuation)}
                        </TableCell>
                        <TableCell
                          className={`text-right text-base font-medium ${item.profit >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          {formatCurrency(item.profit)}
                        </TableCell>
                        <TableCell
                          className={`text-right text-base font-bold ${item.profitPercentage >= 0 ? "text-green-600" : "text-red-600"
                            }`}
                        >
                          {formatPercentage(item.profitPercentage)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            );
          })}
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

export default ValuationReport;
