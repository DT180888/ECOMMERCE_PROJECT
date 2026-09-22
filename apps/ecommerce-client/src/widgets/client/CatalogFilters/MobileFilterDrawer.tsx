import { FilterChip } from './ActiveFilterChips';
import CatalogFilters from './CatalogFilters';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { Button } from "@my-project/ui";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  brandOptions: any[];
  categoryOptions: any[];
}

export default function MobileFilterDrawer({ isOpen, onClose, brandOptions, categoryOptions }: MobileFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div
        className="absolute inset-0 bg-background/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xs h-full bg-background p-6 shadow-neo-hover flex flex-col animate-in slide-in-from-right duration-300 ease-out">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-muted/10">
          <div className="flex items-center gap-2">
            <AdjustmentsHorizontalIcon className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Bộ lọc
            </h2>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-foreground w-8 h-8 rounded-full bg-background shadow-neo-sm hover:shadow-neo-inset-sm flex items-center justify-center p-0 transition-all duration-300"
          >
            ✕
          </Button>
        </div>
        <div className="flex-1 -mx-4 px-4 overflow-y-auto">
          <CatalogFilters brandOptions={brandOptions} categoryOptions={categoryOptions} layout="vertical" />
        </div>
      </div>
    </div>
  );
}
