// src/widgets/Address/AddressPicker.tsx
import { useEffect, useMemo, useState } from "react";
import { useAddressList } from "@entities/address/hooks";
import { AddressId } from "@entities/address/types";
import AddressBook from "./AddressBook";
import { Button } from "@my-project/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@my-project/ui";

type AddressPickerProps = {
  selectedId?: AddressId | null;
  onChange?: (id: AddressId) => void;
  pageSize?: number;
  title?: string;
};

export default function AddressPicker({
  selectedId,
  onChange,
  pageSize = 2,
  title = "Äá»‹a chá»‰",
}: AddressPickerProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useAddressList({ page: 1, size: pageSize });
  const items = data?.items ?? [];

  const current = useMemo(() => {
    if (!items.length) return null;
    if (selectedId) {
      const byId = items.find((a) => a.addressId === selectedId);
      if (byId) return byId;
    }
    const def = items.find((a) => a.isDefault);
    if (def) return def;
    return items[0];
  }, [items, selectedId]);

  useEffect(() => {
    if (!selectedId && current && onChange) {
      onChange(current.addressId);
    }
  }, [selectedId, current, onChange]);

  const handlePickDone = (id: AddressId) => {
    onChange?.(id);
    setModalOpen(false);
  };

  return (
    <div className="space-y-2">
      {/* Khá»‘i hiá»ƒn thá»‹ Ä‘á»‹a chá»‰ hiá»‡n táº¡i */}
      <div className="flex items-start justify-between gap-4 p-6 bg-background rounded-card shadow-neo text-foreground transition-all duration-300">
        <div className="flex-1 text-sm space-y-2 min-w-0">
          <div className="font-extrabold text-base text-foreground font-display tracking-tight">
            {title}
          </div>

          {isLoading ? (
            <div className="text-xs font-bold text-muted uppercase tracking-widest animate-pulse">
              Äang táº£i Ä‘á»‹a chá»‰â€¦
            </div>
          ) : !current ? (
            <div className="text-xs font-bold text-muted uppercase tracking-wider">
              ChÆ°a cÃ³ Ä‘á»‹a chá»‰ nÃ o. HÃ£y thÃªm má»™t Ä‘á»‹a chá»‰ má»›i.
            </div>
          ) : (
            <div className="text-xs text-muted leading-relaxed space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-primary text-sm font-display tracking-tight">
                  {current.label || "Äá»‹a chá»‰"}
                </span>
                {current.isDefault && (
                  <span className="text-[9px] font-bold uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-full tracking-wider shadow-neo-sm">
                    Máº·c Ä‘á»‹nh
                  </span>
                )}
              </div>
              <div>
                <span className="font-bold text-foreground">NgÆ°á»i nháº­n:</span> {current.recipientName}
              </div>
              <div>
                <span className="font-bold text-foreground">Sá»‘ Ä‘iá»‡n thoáº¡i:</span> <span className="font-mono text-muted">{current.phone}</span>
              </div>
              <div className="mt-2 text-foreground">
                <span className="font-bold">Äá»‹a chá»‰:</span> {current.line1}
                {current.line2 && `, ${current.line2}`}, {current.city},{" "}
                {current.state}
                {current.postalCode && ` (${current.postalCode})`},{" "}
                {current.country}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0">
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="text-xs"
          >
            {current ? "Thay Ä‘á»•i" : "ThÃªm Ä‘á»‹a chá»‰"}
          </Button>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-8 py-5 border-b border-muted/5 flex flex-row items-center justify-between">
            <DialogTitle className="font-extrabold text-base text-foreground font-display uppercase tracking-wider">
              Chá»n Ä‘á»‹a chá»‰
            </DialogTitle>
          </DialogHeader>

          <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
            <AddressBook
              mode="manage"
              pageSize={5}
              selectedId={current?.addressId ?? undefined}
              onSelect={(id) => handlePickDone(id)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

