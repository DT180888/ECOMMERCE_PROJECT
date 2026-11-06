import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { PhotoIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

import { useCreateHeroSlide, useUpdateHeroSlide, useHeroSlides } from "@hooks/useHeroSlide";
import { uploadTemp } from "@my-project/api";
import type { HeroSlideFormData } from "@my-project/api";
import { buildImgSrc } from "@my-project/shared-utils";

import { AdminPageShell } from "@shared/ui";
import { Button, useToast } from "@my-project/ui";

// Sub-components
import { TypographySection } from "./TypographySection";
import { MediaAssetsSection } from "./MediaAssetsSection";
import { LinkBuilder } from "./LinkBuilder";
import { LivePreviewSection } from "./LivePreviewSection";

const ASSET_KEYS = ["fullscreenDesktop", "fullscreenMobile", "bannerDesktop", "bannerMobile"] as const;

export function HeroSlideForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = Boolean(id);

  const { data: slidesData } = useHeroSlides({ page: 1, size: 100 });
  const items = Array.isArray(slidesData) ? slidesData : slidesData?.items || [];
  const editingSlide = isEdit ? items.find((s) => s.id === Number(id)) : null;

  const createMut = useCreateHeroSlide();
  const updateMut = useUpdateHeroSlide(Number(id));
  const isPending = createMut.isPending || updateMut.isPending;

  const { register, handleSubmit, reset, setValue, watch } = useForm<HeroSlideFormData>({
    defaultValues: {
      brandText: "",
      titleText: "",
      tagText: "",
      priceText: "",
      actionUrl: "",
      sortOrder: 0,
      assets: {
        fullscreenDesktop: { type: "image", url: "" },
        fullscreenMobile: { type: "image", url: "" },
        bannerDesktop: { type: "image", url: "" },
        bannerMobile: { type: "image", url: "" },
      },
    },
  });

  const [files, setFiles] = useState<Record<string, File | null>>({
    fullscreenDesktop: null,
    fullscreenMobile: null,
    bannerDesktop: null,
    bannerMobile: null,
  });

  const [previews, setPreviews] = useState<Record<string, string>>({
    fullscreenDesktop: "",
    fullscreenMobile: "",
    bannerDesktop: "",
    bannerMobile: "",
  });

  const [mobileErrorKey, setMobileErrorKey] = useState<string>("");

  useEffect(() => {
    if (editingSlide) {
      reset({
        brandText: editingSlide.brandText,
        titleText: editingSlide.titleText,
        tagText: editingSlide.tagText || "",
        priceText: editingSlide.priceText || "",
        actionUrl: editingSlide.actionUrl,
        sortOrder: editingSlide.sortOrder,
        assets: editingSlide.assets,
      });
      setPreviews({
        fullscreenDesktop: editingSlide.assets.fullscreenDesktop?.url
          ? buildImgSrc(editingSlide.assets.fullscreenDesktop.url)
          : "",
        fullscreenMobile: editingSlide.assets.fullscreenMobile?.url
          ? buildImgSrc(editingSlide.assets.fullscreenMobile.url)
          : "",
        bannerDesktop: editingSlide.assets.bannerDesktop?.url
          ? buildImgSrc(editingSlide.assets.bannerDesktop.url)
          : "",
        bannerMobile: editingSlide.assets.bannerMobile?.url
          ? buildImgSrc(editingSlide.assets.bannerMobile.url)
          : "",
      });
    }
  }, [editingSlide, reset]);

  const handleFileChange = (key: string, file: File | null) => {
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
      if (mobileErrorKey === key) {
        setMobileErrorKey("");
      }
    }
  };

  const onSubmit = async (data: HeroSlideFormData) => {
    try {
      setMobileErrorKey("");

      // Step 1: Upload files if any are selected
      const finalAssets = { ...data.assets };
      let hasUploadError = false;

      for (const key of ASSET_KEYS) {
        const file = files[key];
        if (file) {
          try {
            const res = await uploadTemp([file]);
            if (res && res.length > 0) {
              const url = res[0].url;
              const type = file.type.startsWith("video/") ? "video" : "image";
              finalAssets[key] = { type, url };
            }
          } catch (err) {
            toast.error(`Lỗi tải lên file cho ${key}`);
            hasUploadError = true;
          }
        }
      }

      if (hasUploadError) return;

      const payload: HeroSlideFormData = {
        ...data,
        assets: finalAssets,
      };

      // Validation Cảnh Báo
      if (!payload.assets.fullscreenDesktop?.url && !payload.assets.bannerDesktop?.url) {
        toast.error("Vui lòng tải lên ít nhất Desktop (Fullscreen hoặc Banner).");
        return;
      }

      // Kiểm tra thiếu mobile assets khi có desktop assets tương ứng
      if (payload.assets.fullscreenDesktop?.url && !payload.assets.fullscreenMobile?.url) {
        setMobileErrorKey("fullscreenMobile");
        toast.error("Cảnh báo: Thiếu ảnh/video cho Fullscreen Mobile!");
        return;
      }

      if (payload.assets.bannerDesktop?.url && !payload.assets.bannerMobile?.url) {
        setMobileErrorKey("bannerMobile");
        toast.error("Cảnh báo: Thiếu ảnh cho Banner Mobile!");
        return;
      }

      if (isEdit) {
        await updateMut.mutateAsync(payload);
        toast.success("Cập nhật banner thành công!");
      } else {
        await createMut.mutateAsync(payload);
        toast.success("Thêm banner thành công!");
      }
      navigate("/admin/hero-slides");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Đã xảy ra lỗi khi lưu.");
    }
  };

  const formData = watch();

  return (
    <AdminPageShell>
      <AdminPageShell.Header
        icon={PhotoIcon}
        title={isEdit ? "Cập nhật Banner" : "Thêm Banner mới"}
        actions={
          <Button
            variant="outline"
            size="default"
            onClick={() => navigate("/admin/hero-slides")}
            className="h-8 text-xs font-semibold rounded-[2px] border-border/60 shadow-none gap-1"
          >
            <ArrowLeftIcon className="w-3.5 h-3.5" />
            Quay lại
          </Button>
        }
      />
      <AdminPageShell.Body>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 h-full min-h-0">
          {/* Left Column: Form Inputs (60%) */}
          <div className="lg:col-span-3 h-full overflow-y-auto pr-3 pb-6 custom-scrollbar">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 md:space-y-8">
              <TypographySection register={register} />

              <MediaAssetsSection
                files={files}
                previews={previews}
                handleFileChange={handleFileChange}
                mobileErrorKey={mobileErrorKey}
              />

              <LinkBuilder setValue={setValue} watch={watch} />

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isPending}
                  size="default"
                  className="min-w-[140px] h-9 text-xs font-semibold tracking-wider uppercase rounded-[2px] shadow-none"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-3.5 w-3.5 text-primary-foreground"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Preview (40%) */}
          <div className="lg:col-span-2 h-full flex flex-col min-h-0">
            <LivePreviewSection formData={formData} previews={previews} />
          </div>
        </div>
      </AdminPageShell.Body>
    </AdminPageShell>
  );
}
