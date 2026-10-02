import { Input, Button } from "@my-project/ui";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

interface AttributeToolbarProps {
  keyword: string;
  setKeyword: (val: string) => void;
  applyKeyword: () => void;
}

export function AttributeToolbar({ keyword, setKeyword, applyKeyword }: AttributeToolbarProps) {
  return (
    <>
      <div className="relative group w-full md:w-72">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
        <Input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyKeyword()}
          placeholder="Tìm theo tên, mã slug..."
          className="pl-9 text-sm w-full"
        />
      </div>
      <Link to="/admin/attribute/new" className="shrink-0">
        <Button variant="default" className="text-xs">
          <PlusIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5" /> Thêm mới
        </Button>
      </Link>
    </>
  );
}
