import { Link } from "react-router-dom";
import { Button, Input } from "@my-project/ui";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";

interface BrandToolbarProps {
  q: string;
  setQ: (val: string) => void;
  applySearch: () => void;
}

export function BrandToolbar({ q, setQ, applySearch }: BrandToolbarProps) {
  return (
    <>
      <div className="relative group w-64">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applySearch()}
          placeholder="Tìm kiếm thương hiệu..."
          className="pl-9 pr-12 text-sm w-full"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          <kbd className="opacity-60 text-[9px] px-1 py-0.5">S</kbd>
        </div>
      </div>
      <Link to="/admin/brand/new">
        <Button variant="default" className="text-xs">
          <PlusIcon className="  w-3 h-3 md:w-4 md:h-4 mr-1.5" /> Thêm mới
        </Button>
      </Link>
    </>
  );
}
