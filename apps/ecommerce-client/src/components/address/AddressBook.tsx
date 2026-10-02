import { useEffect, useMemo, useState } from "react";
import { useAddressList, useCreateAddress, useUpdateAddress, useDeleteAddress, useSetDefaultAddress } from "@hooks/useAddress";
import type { Address, AddressUpsertReq, AddressId } from "@my-project/api";
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
    if (!f.recipientName.trim()) errs.push("Tên người nhận là bắt buộc.");
    if (!f.phone.trim()) errs.push("Số điện thoại là bắt buộc.");
    if (!f.line1.trim()) errs.push("Địa chỉ chi tiết là bắt buộc.");
    if (!f.city.trim()) errs.push("Thành phố là bắt buộc.");
    if (!f.state.trim()) errs.push("Tỉnh/Quận là bắt buộc.");
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate(form);
    if (errs.length) {
      toast.error(errs.join("\n"));
      return;
    }

    const payload: AddressUpsertReq = {
      label: form.label.trim() || "Địa chỉ",
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
        toast.success("Đã cập nhật địa chỉ!");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Đã thêm địa chỉ mới!");
      }
      setFormOpen(false);
      setForm(createEmptyForm());
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra khi lưu địa chỉ.");
    }
  };

  const handleDelete = async (id: AddressId) => {
    toast.confirm("Bạn chắc chắn muốn xoá địa chỉ này?", async () => {
      try {
        await deleteMut.mutateAsync(id);
        toast.success("Đã xoá địa chỉ!");
      } catch (error: any) {
        toast.error(error?.message || "Có lỗi xảy ra khi xoá địa chỉ.");
      }
    }, "Xoá ngay");
  };

  const handleSetDefault = async (id: AddressId) => {
    try {
      await setDefaultMut.mutateAsync(id);
      toast.success("Đã đặt làm địa chỉ mặc định!");
    } catch (error: any) {
      toast.error(error?.message || "Không thể đặt làm địa chỉ mặc định.");
    }
  };

  return (
    <section className="bg-background rounded-card p-6 shadow-neo-inset transition-all duration-300 space-y-6">
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-xs font-bold text-muted uppercase tracking-widest animate-pulse">
            Đang tải địa chỉ...
          </div>
        ) : items.length === 0 ? (
          <div className="text-xs font-bold text-muted uppercase tracking-wider text-center p-8 bg-background rounded-inner shadow-neo-inset-sm">
            Chưa có địa chỉ nào.
            {mode === "manage"
              ? " Hãy thêm một địa chỉ mới bên dưới."
              : " Hãy thêm địa chỉ trong trang quản lý địa chỉ."}
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
                        {addr.label || "Địa chỉ"}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[9px] font-bold uppercase bg-primary text-primary-foreground px-2.5 py-0.5 rounded-full tracking-wider shadow-neo-sm">
                          Mặc định
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
                          Đặt mặc định
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="edit"
                        onClick={() => startEdit(addr)}
                        className="text-xs"
                      >
                        Sửa
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={deleteMut.isPending}
                        onClick={() => handleDelete(addr.addressId)}
                        className="text-xs"
                      >
                        Xoá
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

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
                Trước
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

      {mode === "manage" && (
        <div
          className={`rounded-inner p-6 space-y-4 bg-background transition-all duration-300 ${
            formOpen ? "shadow-neo-inset" : "shadow-neo"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="text-sm font-extrabold text-foreground font-display uppercase tracking-wider">
              {form.id ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
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
                "Đóng"
              ) : (
                <>
                  <PlusIcon className="w-3 h-3 md:w-4 md:h-4 mr-1.5" /> Thêm mới
                </>
              )}
            </Button>
          </div>

          {formOpen && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Nhãn (VD: Nhà riêng, Công ty)"
                  value={form.label}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      label: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Tên người nhận *"
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
                  placeholder="Số điện thoại *"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      phone: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Quốc gia"
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
                placeholder="Địa chỉ chi tiết (Số nhà, tên đường...) *"
                value={form.line1}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    line1: e.target.value,
                  }))
                }
              />

              <Input
                placeholder="Địa chỉ bổ sung (Tòa nhà, Phường/Xã...)"
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
                  placeholder="Thành phố *"
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      city: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Tỉnh/Quận *"
                  value={form.state}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      state: e.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Mã bưu điện"
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
                  Đặt làm địa chỉ mặc định
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
                  Hủy bỏ
                </Button>
                <Button
                  variant="default"
                  onClick={handleSubmit}
                  disabled={createMut.isPending || updateMut.isPending}
                  className="min-w-[100px] text-xs"
                >
                  {form.id
                    ? updateMut.isPending
                      ? "Đang lưu..."
                      : "Cập nhật"
                    : createMut.isPending
                    ? "Đang tạo..."
                    : "Lưu địa chỉ"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
