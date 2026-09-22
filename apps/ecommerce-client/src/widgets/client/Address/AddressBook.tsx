import { useEffect, useMemo, useState } from "react";
import { useAddressList, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from "@entities/address/hooks";
import { Address, AddressUpsertReq, AddressId } from "@entities/address/types";
import { Button } from "@my-project/ui";
import { Input } from "@my-project/ui";
import { TextArea } from "@my-project/ui";
import { Checkbox } from "@my-project/ui";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useToast } from "@my-project/ui";

type Mode = "select" | "manage";

type AddressBookProps = {
  mode?: Mode;
  pageSize?: number;
  selectedId?: AddressId | null;
  onSelect?: (id: AddressId) => void;
};

type FormState = AddressUpsertReq & { id?: AddressId | null };

const createEmptyForm = (): FormState => ({
  id: null,
  label: "",
  recipientName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "VN",
  isDefault: false,
});

export default function AddressBook({
  mode = "select",
  pageSize = 5,
  selectedId,
  onSelect,
}: AddressBookProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAddressList({ page, size: pageSize });
  const createMut = useCreateAddress();
  const updateMut = useUpdateAddress();
  const deleteMut = useDeleteAddress();
  const setDefaultMut = useSetDefaultAddress();
  const toast = useToast();

  const [form, setForm] = useState<FormState>(createEmptyForm());
  const [formOpen, setFormOpen] = useState(false);

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const autoSelectedId = useMemo(() => {
    if (selectedId) return selectedId;
    const def = items.find((a) => a.isDefault);
    return def?.addressId ?? items[0]?.addressId;
  }, [items, selectedId]);

  useEffect(() => {
    if (!selectedId && autoSelectedId && onSelect && mode === "select") {
      onSelect(autoSelectedId);
    }
  }, [autoSelectedId, selectedId, onSelect, mode]);

  const startCreate = () => {
    setForm(createEmptyForm());
    setFormOpen(true);
  };

  const startEdit = (addr: Address) => {
    setForm({
      id: addr.addressId,
      label: addr.label,
      recipientName: addr.recipientName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 ?? "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode ?? "",
      country: addr.country,
      isDefault: addr.isDefault,
    });
    setFormOpen(true);
  };

  const validate = (f: FormState): string[] => {
    const errs: string[] = [];
    if (!f.recipientName.trim()) errs.push("TÃªn ngÆ°á»i nháº­n lÃ  báº¯t buá»™c.");
    if (!f.phone.trim()) errs.push("Sá»‘ Ä‘iá»‡n thoáº¡i lÃ  báº¯t buá»™c.");
    if (!f.line1.trim()) errs.push("Äá»‹a chá»‰ chi tiáº¿t lÃ  báº¯t buá»™c.");
    if (!f.city.trim()) errs.push("ThÃ nh phá»‘ lÃ  báº¯t buá»™c.");
    if (!f.state.trim()) errs.push("Tá»‰nh/Quáº­n lÃ  báº¯t buá»™c.");
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (errs.length) {
      toast.error(errs.join("\n"));
      return;
    }

    const payload: AddressUpsertReq = {
      label: form.label.trim() || "Äá»‹a chá»‰",
      recipientName: form.recipientName.trim(),
      phone: form.phone.trim(),
      line1: form.line1.trim(),
      line2: form.line2?.trim() || "",
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode?.trim() || "",
      country: form.country.trim() || "VN",
      isDefault: form.isDefault,
    };

    try {
      if (form.id) {
        await updateMut.mutateAsync({ id: form.id, payload });
        toast.success("ÄÃ£ cáº­p nháº­t Ä‘á»‹a chá»‰!");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("ÄÃ£ thÃªm Ä‘á»‹a chá»‰ má»›i!");
      }
      setFormOpen(false);
      setForm(createEmptyForm());
    } catch (error: any) {
            toast.error(error?.message || "CÃ³ lá»—i xáº£y ra khi lÆ°u Ä‘á»‹a chá»‰.");
          }
  };

  const handleDelete = async (id: AddressId) => {
    toast.confirm("Báº¡n cháº¯c cháº¯n muá»‘n xoÃ¡ Ä‘á»‹a chá»‰ nÃ y?", async () => {
      try {
        await deleteMut.mutateAsync(id);
        toast.success("ÄÃ£ xoÃ¡ Ä‘á»‹a chá»‰!");
      } catch (error: any) {
                toast.error(error?.message || "CÃ³ lá»—i xáº£y ra khi xoÃ¡ Ä‘á»‹a chá»‰.");
              }
    }, "XoÃ¡ ngay");
  };

  const handleSetDefault = async (id: AddressId) => {
    try {
      await setDefaultMut.mutateAsync(id);
      toast.success("ÄÃ£ Ä‘áº·t lÃ m Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh!");
    } catch (error: any) {
            toast.error(error?.message || "KhÃ´ng thá»ƒ Ä‘áº·t lÃ m Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh.");
          }
  };

  return (
    <section className="bg-background rounded-card p-6 shadow-neo-inset transition-all duration-300 space-y-6">
      {/* List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-xs font-bold text-muted uppercase tracking-widest animate-pulse">
            Äang táº£i Ä‘á»‹a chá»‰...
          </div>
        ) : items.length === 0 ? (
          <div className="text-xs font-bold text-muted uppercase tracking-wider text-center p-8 bg-background rounded-inner shadow-neo-inset-sm">
            ChÆ°a cÃ³ Ä‘á»‹a chá»‰ nÃ o.
            {mode === "manage"
              ? " HÃ£y thÃªm má»™t Ä‘á»‹a chá»‰ má»›i bÃªn dÆ°á»›i."
              : " HÃ£y thÃªm Ä‘á»‹a chá»‰ trong trang quáº£n lÃ½ Ä‘á»‹a chá»‰."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((addr) => {
              const hasSelector = typeof onSelect === "function";
              const isSelected =
                hasSelector &&
                (selectedId === addr.addressId ||
                  (!selectedId && addr.isDefault));

              return (
                <div
                  key={addr.addressId}
                  className={`flex gap-4 p-5 items-start bg-background rounded-inner transition-all duration-300 ${
                    isSelected
                      ? "shadow-neo-inset"
                      : "shadow-neo hover:shadow-neo-hover hover:-translate-y-0.5"
                  }`}
                >
                  {hasSelector && (
                    <Checkbox
                      className="mt-1 shrink-0"
                      checked={isSelected}
                      onChange={() => onSelect && onSelect(addr.addressId)}
                    />
                  )}
                  <div className="flex-1 text-sm space-y-2 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-foreground text-sm font-display tracking-tight">
                        {addr.label || "Äá»‹a chá»‰"}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold uppercase bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full tracking-wider shadow-neo-sm">
                          Máº·c Ä‘á»‹nh
                        </span>
                      )}
                    </div>
                    <div className="text-muted text-xs leading-relaxed space-y-1">
                      <div className="font-bold text-foreground">
                        {addr.recipientName}{" "}
                        <span className="text-muted/30 mx-1.5 font-normal">|</span>{" "}
                        <span className="font-mono text-muted">{addr.phone}</span>
                      </div>
                      <div>
                        {addr.line1}
                        {addr.line2 && `, ${addr.line2}`}
                      </div>
                      <div>
                        {addr.city}, {addr.state}{" "}
                        {addr.postalCode && `(${addr.postalCode})`},{" "}
                        {addr.country}
                      </div>
                    </div>
                  </div>

                  {mode === "manage" && (
                    <div className="flex flex-col gap-2 shrink-0 self-center">
                      {!addr.isDefault && (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={setDefaultMut.isPending}
                          onClick={() => handleSetDefault(addr.addressId)}
                          className="text-xs"
                        >
                          Äáº·t máº·c Ä‘á»‹nh
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="edit"
                        onClick={() => startEdit(addr)}
                        className="text-xs"
                      >
                        Sá»­a
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deleteMut.isPending}
                        onClick={() => handleDelete(addr.addressId)}
                        className="text-xs"
                      >
                        XoÃ¡
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-xs text-muted pt-4">
            <div>
              Trang <span className="text-foreground font-bold">{page}</span> /{" "}
              {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-3 text-xs"
              >
                TrÆ°á»›c
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 px-3 text-xs"
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Form create / edit: chá»‰ hiá»ƒn thá»‹ khi manage */}
      {mode === "manage" && (
        <div
          className={`rounded-inner p-6 space-y-4 bg-background transition-all duration-300 ${
            formOpen ? "shadow-neo-inset" : "shadow-neo"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold text-foreground font-display uppercase tracking-wider">
              {form.id ? "Chá»‰nh sá»­a Ä‘á»‹a chá»‰" : "ThÃªm Ä‘á»‹a chá»‰ má»›i"}
            </div>
            <Button
              variant={formOpen ? "ghost" : "default"}
              size="sm"
              onClick={() => {
                if (!formOpen) {
                  startCreate();
                } else {
                  setFormOpen(false);
                  setForm(createEmptyForm());
                }
              }}
            >
              {formOpen ? (
                "ÄÃ³ng"
              ) : (
                <>
                  <PlusIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5" /> ThÃªm má»›i
                </>
              )}
            </Button>
          </div>

          {formOpen && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="NhÃ£n (VD: NhÃ  riÃªng, CÃ´ng ty)"
                  value={form.label}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      label: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="TÃªn ngÆ°á»i nháº­n *"
                  value={form.recipientName}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      recipientName: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Sá»‘ Ä‘iá»‡n thoáº¡i *"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      phone: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Quá»‘c gia"
                  value={form.country}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      country: e.target.value,
                    }))
                  }
                />
              </div>

              <TextArea
                rows={2}
                placeholder="Äá»‹a chá»‰ chi tiáº¿t (Sá»‘ nhÃ , tÃªn Ä‘Æ°á»ng...) *"
                value={form.line1}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    line1: e.target.value,
                  }))
                }
              />

              <Input
                placeholder="Äá»‹a chá»‰ bá»• sung (TÃ²a nhÃ , PhÆ°á»ng/XÃ£...)"
                value={form.line2 ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    line2: e.target.value,
                  }))
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="ThÃ nh phá»‘ *"
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      city: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Tá»‰nh/Quáº­n *"
                  value={form.state}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      state: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="MÃ£ bÆ°u Ä‘iá»‡n"
                  value={form.postalCode ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      postalCode: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Checkbox
                  id="isDefault"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      isDefault: e.target.checked,
                    }))
                  }
                />
                <label
                  htmlFor="isDefault"
                  className="text-xs font-bold text-muted cursor-pointer select-none hover:text-foreground transition-colors"
                >
                  Äáº·t lÃ m Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-muted/10">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setForm(createEmptyForm());
                    setFormOpen(false);
                  }}
                  className="text-xs"
                >
                  Há»§y bá»
                </Button>
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  disabled={createMut.isPending || updateMut.isPending}
                  className="min-w-[100px] text-xs"
                >
                  {form.id
                    ? updateMut.isPending
                      ? "Äang lÆ°u..."
                      : "Cáº­p nháº­t"
                    : createMut.isPending
                    ? "Äang táº¡o..."
                    : "LÆ°u Ä‘á»‹a chá»‰"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

