import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useUpdateProfile } from "@hooks/useUser";
import { Input, Button, useToast } from "@my-project/ui";
import { Phone, Calendar, PenLine, User } from "lucide-react";
import { UpdateProfilePayload } from "@my-project/api";

type UserData = {
  email: string;
  fullName?: string;
  name?: string;
  phone?: string;
  dateOfBirth?: string | Date;
};

type ProfileForm = {
  name: string;
  phone: string;
  dateOfBirth: string;
};

const formatDateForDisplay = (dateString?: string | Date) => {
  if (!dateString) return "Chưa cập nhật";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Chưa cập nhật";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "Chưa cập nhật";
  }
};

export default function ProfileInfoSection({ user }: { user: UserData | undefined | null }) {
  const updateProfile = useUpdateProfile();
  const toast = useToast();
  
  const [isEditing, setIsEditing] = useState(false);

  const getFormValues = (u: UserData | null | undefined): ProfileForm => {
    if (!u) return { name: "", phone: "", dateOfBirth: "" };

    let formattedDob = "";
    if (u.dateOfBirth) {
      try {
        formattedDob = new Date(u.dateOfBirth).toISOString().split("T")[0];
      } catch {
        formattedDob = "";
      }
    }

    return {
      name: u.fullName ?? u.name ?? "",
      phone: u.phone ?? "",
      dateOfBirth: formattedDob,
    };
  };

  const {
    register,
    handleSubmit,
    reset, 
    formState: { isSubmitting, errors },
  } = useForm<ProfileForm>({
    defaultValues: getFormValues(user),
  });

  useEffect(() => {
    if (user) {
      reset(getFormValues(user));
    }
  }, [user, reset]);

  const handleCancel = () => {
    reset(getFormValues(user));
    setIsEditing(false);
  };

  const onSubmit = async (v: ProfileForm) => {
    try {
      const payload: UpdateProfilePayload = {
        fullName: v.name,
        phone: v.phone || undefined,
        dateOfBirth: v.dateOfBirth ? v.dateOfBirth : null,
      };
      await updateProfile.mutateAsync(payload);
      toast.success("Cập nhật hồ sơ thành công!");
      reset(v);
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.message || "Lỗi cập nhật hồ sơ.");
    }
  };

  return (
    <section className="bg-background rounded-card p-6 shadow-neo-inset transition-all duration-300">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-muted/5">
        <h2 className="font-extrabold text-foreground text-sm uppercase tracking-wider flex items-center gap-2">
          <User size={16} className="text-primary" /> Thông tin chung
        </h2>
        
        {!isEditing && (
          <Button 
            size="sm" 
            variant="edit"
            onClick={() => setIsEditing(true)}
            className="text-xs"
          >
            <PenLine size={14} className="mr-1" /> Chỉnh sửa
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email */}
        <div className="gap-1.5 flex flex-col">
          <label className="text-xs font-bold text-muted uppercase tracking-wider pl-1">Email</label>
          {isEditing ? (
            <Input
              value={user?.email ?? ""}
              readOnly
              disabled
              className="opacity-60 cursor-not-allowed select-none bg-background/50"
            />
          ) : (
            <div className="text-sm font-bold text-foreground bg-background rounded-card px-4 py-2.5 shadow-neo select-all">
              {user?.email ?? ""}
            </div>
          )}
        </div>

        {/* Họ tên */}
        <div className="gap-1.5 flex flex-col">
          <label className="text-xs font-bold text-muted uppercase tracking-wider pl-1">Họ tên hiển thị</label>
          {isEditing ? (
            <>
              <Input
                {...register("name", { required: "Vui lòng nhập họ tên" })}
                error={!!errors.name}
              />
              {errors.name && <p className="text-xs text-error">{errors.name.message}</p>}
            </>
          ) : (
            <div className="text-sm font-bold text-foreground bg-background rounded-card px-4 py-2.5 shadow-neo select-all">
              {user?.fullName ?? user?.name ?? "Chưa cập nhật"}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Số điện thoại */}
          <div className="gap-1.5 flex flex-col">
            <label className="text-xs font-bold text-muted uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Phone size={12} className="text-primary" /> Số điện thoại
            </label>
            {isEditing ? (
              <>
                <Input
                  {...register("phone", {
                    pattern: { value: /^[0-9]+$/, message: "Chỉ được nhập số" },
                    minLength: { value: 9, message: "Tối thiểu 9 số" },
                  })}
                  placeholder="Nhập số điện thoại"
                  error={!!errors.phone}
                />
                {errors.phone && <p className="text-xs text-error">{errors.phone.message}</p>}
              </>
            ) : (
              <div className="text-sm font-medium text-foreground bg-background rounded-card px-4 py-2.5 shadow-neo select-all">
                {user?.phone ?? "Chưa cập nhật"}
              </div>
            )}
          </div>

          {/* Ngày sinh */}
          <div className="gap-1.5 flex flex-col">
            <label className="text-xs font-bold text-muted uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Calendar size={12} className="text-primary" /> Ngày sinh
            </label>
            {isEditing ? (
              <Input
                type="date"
                {...register("dateOfBirth")}
              />
            ) : (
              <div className="text-sm font-medium text-foreground bg-background rounded-card px-4 py-2.5 shadow-neo select-all">
                {formatDateForDisplay(user?.dateOfBirth)}
              </div>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-2 flex justify-end gap-3 pt-4 border-t border-muted/5 animate-in fade-in slide-in-from-top-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="text-xs"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="default"
              disabled={isSubmitting}
              className="min-w-[100px] text-xs"
            >
              {isSubmitting ? "Lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        )}
      </form>
    </section>
  );
}
