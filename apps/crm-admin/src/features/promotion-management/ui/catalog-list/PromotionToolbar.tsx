import { Button, Input } from "@my-project/ui";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

export interface PromotionToolbarProps {
  search: string;
  setSearch: (v: string) => void;
  apply: () => void;
  onAdd: () => void;
}

export function PromotionSearchActions(props: PromotionToolbarProps) {
  return (
    <div className="flex items-start gap-3 sm:gap-2 w-full justify-between">
      {/* Search Input */}
      <div className="flex items-center gap-2 w-auto">
        <div className="w-64 md:w-72 lg:w-80 relative group">
          <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
          <Input
            value={props.search}
            onChange={(e) => props.setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && props.apply()}
            placeholder="Tìm kiếm theo tên, mã..."
            className="pl-8 h-8 text-xs hover:border-border focus:bg-transparent shadow-none w-full"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-1.5 w-auto shrink-0 justify-end">
        {props.search && (
          <Button
            onClick={() => {
              props.setSearch("");
              setTimeout(props.apply, 0);
            }}
            variant="ghost"
            className="h-8 px-2.5 text-[11px] font-medium text-muted-foreground border border-muted/20 bg-foreground/10 hover:text-foreground hover:bg-foreground/5 shadow-none"
          >
            Xóa bộ lọc
          </Button>
        )}
        <Button
          onClick={props.onAdd}
          className="h-8 px-3 flex items-center gap-1.5 text-xs font-semibold shadow-none whitespace-nowrap"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          Thêm mới
        </Button>
      </div>
    </div>
  );
}
