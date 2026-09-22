import { useState, useRef, useEffect } from "react";
import { Button } from "@my-project/ui";
import { Input } from "@my-project/ui";
import { useUpdateAdminInventory } from "@entities/inventory/admin";
import { useAdminInventory } from "@entities/inventory/admin";
import { CheckIcon, XMarkIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useToast } from "@my-project/ui";

export function InventoryCell({ skuId }: { skuId: number }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const { data: inv, isLoading } = useAdminInventory(skuId);
  const updateMut = useUpdateAdminInventory();

  useEffect(() => {
    if (editing && inv) {
      setVal(inv.quantityOnHand ?? 0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [editing, inv]);

  if (isLoading) return <div className="animate-pulse w-8 h-4 bg-muted/50 rounded"></div>;
  if (!inv) return <span className="text-muted-foreground text-xs italic">N/A</span>;

  const currentQty = inv.quantityOnHand ?? 0;
  const reorderPoint = inv.reorderPoint ?? 10;
  const isLow = currentQty <= reorderPoint;

  const handleSave = () => {
    updateMut.mutate(
      {
        skuId,
        quantityOnHand: val,
        quantityReserved: inv.quantityReserved ?? 0,
        reorderPoint: inv.reorderPoint ?? 0,
      },
      {
        onSuccess: () => {
          toast.success("Cập nhật kho thành công");
          setEditing(false);
        },
        onError: (error: any) => toast.error(error?.message || "Cập nhật kho thất bại"),
      }
    );
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          type="number"
          min={0}
          value={val}
          onChange={(e) => setVal(Number(e.target.value))}
          className="w-20 h-8 text-xs text-right"
        />
        <Button
          variant="default"
          size="icon"
          onClick={handleSave}
          disabled={updateMut.isPending}
          className="h-8 w-8 rounded-inner"
        >
          {updateMut.isPending ? <ArrowPathIcon className="w-3.5 h-3.5 animate-spin" /> : <CheckIcon className="w-3.5 h-3.5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditing(false)}
          className="h-8 w-8 rounded-inner"
        >
          <XMarkIcon className="w-3.5 h-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div
      onClick={() => setEditing(true)}
      className="inline-flex items-center gap-2 cursor-pointer group px-2 py-1 -ml-2 rounded-inner hover:bg-muted/50 transition-colors"
      title="Click để sửa tồn kho"
    >
      <span className={`font-mono text-sm font-semibold ${isLow && currentQty > 0 ? "text-yellow-500" : currentQty === 0 ? "text-destructive" : "text-foreground"}`}>
        {currentQty}
      </span>
      {isLow && currentQty > 0 && (
        <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-500 px-1.5 py-0.5 rounded uppercase tracking-wider">
          Sắp hết
        </span>
      )}
      {currentQty === 0 && (
        <span className="text-[10px] font-bold bg-destructive/10 text-destructive px-1.5 py-0.5 rounded uppercase tracking-wider">
          Hết hàng
        </span>
      )}
    </div>
  );
}

