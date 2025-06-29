
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { useCollection } from "@/contexts/CollectionContext";
import { Printer } from "lucide-react";

interface CategoryValuationHomeReportProps {
  open: boolean;
  onClose: () => void;
}

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
}

const formatCurrency = (value: number | undefined) =>
  value !== undefined
    ? "$" + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "";

// Recursively get all descendant category IDs for a given parent
function getAllDescendantCategoryIds(categories: Category[], parentId: string): string[] {
  const directChildren = categories.filter(cat => cat.parentId === parentId);
  let ids = directChildren.map(cat => cat.id);
  for (const child of directChildren) {
    ids = ids.concat(getAllDescendantCategoryIds(categories, child.id));
  }
  return ids;
}

const HOME_CATEGORY_NAME = "Vintage Star Wars - The Original Trilogy";
const SUBCATEGORY_NAME = "The Original Trilogy - collection";

const CategoryValuationHomeReport: React.FC<CategoryValuationHomeReportProps> = ({ open, onClose }) => {
  const { categories, items } = useCollection();

  // Find the home top-level category
  const homeCategory = categories.find(
    cat => cat.name?.toLowerCase().trim() === HOME_CATEGORY_NAME.toLowerCase().trim() && !cat.parentId
  );

  // Find the subcategory as a direct child of homeCategory
  const subCategory = homeCategory
    ? categories.find(cat =>
        cat.name?.toLowerCase().trim() === SUBCATEGORY_NAME.toLowerCase().trim() &&
        cat.parentId === homeCategory.id
      )
    : undefined;

  // Prepare descendant lists for both
  const homeDescendantIds = homeCategory ? getAllDescendantCategoryIds(categories, homeCategory.id) : [];
  const subDescendantIds = subCategory ? getAllDescendantCategoryIds(categories, subCategory.id) : [];

  // All IDs for home category (itself + descendants)
  const allIncludedCategoryIds = homeCategory ? [homeCategory.id, ...homeDescendantIds] : [];

  // All IDs for the subcategory (itself + descendants)
  const subcategoryIds = subCategory ? [subCategory.id, ...subDescendantIds] : [];

  // Items for each
  const itemsInHome = homeCategory
    ? items.filter(item => allIncludedCategoryIds.includes(item.categoryId))
    : [];
  const itemsInSub = subCategory
    ? items.filter(item => subcategoryIds.includes(item.categoryId))
    : [];

  // Totals
  const totalHomeValue = itemsInHome.reduce((sum, item) => sum + (item.valuation || 0), 0);
  const totalHomeCount = itemsInHome.length;

  const totalSubValue = itemsInSub.reduce((sum, item) => sum + (item.valuation || 0), 0);
  const totalSubCount = itemsInSub.length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={state => !state && onClose()}>
      <DialogContent className="max-w-2xl bg-white border border-slate-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex flex-row items-center justify-between">
            <span>
              Category Valuation
              <span className="text-base font-normal ml-6 text-slate-700">Total Items:</span>
              <span className="font-bold text-indigo-700 ml-2 text-lg">{totalHomeCount}</span>
              <span className="text-base font-normal ml-6 text-slate-700">Total Value:</span>
              <span className="font-bold text-indigo-700 ml-2 text-lg">{formatCurrency(totalHomeValue)}</span>
            </span>
            <Button variant="ghost" size="icon" onClick={handlePrint} className="ml-3 print:hidden" aria-label="Print report">
              <Printer className="w-5 h-5" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[60vh] border rounded bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-base font-semibold text-slate-800 w-1/2">Subcategory</TableHead>
                <TableHead className="text-base font-semibold text-slate-800 text-right w-1/4"># Items</TableHead>
                <TableHead className="text-base font-semibold text-slate-800 text-right w-1/4">Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Home category row */}
              <TableRow>
                <TableCell className="text-slate-800 text-base">{HOME_CATEGORY_NAME}</TableCell>
                <TableCell className="text-right text-slate-700 text-base">{totalHomeCount}</TableCell>
                <TableCell className="text-right text-slate-700 text-base font-medium">{formatCurrency(totalHomeValue)}</TableCell>
              </TableRow>
              {/* Subcategory row */}
              <TableRow>
                <TableCell className="text-slate-800 text-base pl-8">{SUBCATEGORY_NAME}</TableCell>
                <TableCell className="text-right text-slate-700 text-base">
                  {subCategory ? totalSubCount : <span className="italic text-slate-400">Not found</span>}
                </TableCell>
                <TableCell className="text-right text-slate-700 text-base font-medium">
                  {subCategory ? formatCurrency(totalSubValue) : <span className="italic text-slate-400">Not found</span>}
                </TableCell>
              </TableRow>
              {/* No items at all */}
              {totalHomeCount === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-slate-500 py-6">
                    No items found in this category.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end gap-3 mt-6 print:hidden">
          <Button onClick={handlePrint} variant="outline" className="border border-slate-600">
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button onClick={onClose} variant="default">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryValuationHomeReport;
