import { FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@my-project/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@my-project/ui";
import { AdminPageShell } from "@shared/ui";
import {
  ArrowLeftIcon,
  CubeIcon,
  ListBulletIcon,
  TagIcon,
  PhotoIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

// Sub-components
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductImages } from "./ProductImages";
import { ProductAttributes } from "./ProductAttributes";
import { ProductSkus } from "./ProductSkus";

// Hook
import { useProductFormManager } from "../useProductFormManager";

const STEP_TABS = ["basic", "images", "attrs", "skus"] as const;

export function ProductForm() {
  const {
    methods,
    onSubmit,
    hasAccess,
    isCreate,
    id,
    isLoading,
    brandOptions,
    categoryOptions,
    collectionOptions,
    attrAll,
    variantOptions,
    attrOptions,
    currentStep,
    setCurrentStep,
    activeTab,
    setActiveTab,
    hasBasicErrors,
    hasImageErrors,
    hasAttrErrors,
    hasSkuErrors,
    nav,
    toast,
  } = useProductFormManager();

  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting },
  } = methods;

  if (!hasAccess) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-card border border-border/60 rounded-[2px]">
        Bạn không có quyền {isCreate ? "tạo mới" : "chỉnh sửa"} sản phẩm.
      </div>
    );
  }

  if (!isCreate && isLoading) {
    return (
      <div className="p-8 text-center text-xs font-mono text-muted-foreground animate-pulse">
        Đang tải dữ liệu sản phẩm...
      </div>
    );
  }

  // Handle advancing forward step-by-step
  const handleAdvanceStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ["name", "slug", "brandId", "categoryIds"];
    if (currentStep === 2) fieldsToValidate = ["images"];
    if (currentStep === 3) fieldsToValidate = ["attributes"];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(4, prev + 1));
    }
  };

  // Handle direct tab clicks with validation guard
  const handleTabChange = async (targetTab: string) => {
    if (!isCreate) {
      setActiveTab(targetTab);
      return;
    }
    const targetStep = STEP_TABS.indexOf(targetTab as any) + 1;
    if (targetStep <= 0) return;

    if (targetStep <= currentStep) {
      setCurrentStep(targetStep);
    } else {
      let canProceed = true;
      for (let s = currentStep; s < targetStep; s++) {
        let fields: any[] = [];
        if (s === 1) fields = ["name", "slug", "brandId", "categoryIds"];
        if (s === 2) fields = ["images"];
        if (s === 3) fields = ["attributes"];
        const ok = await trigger(fields as any);
        if (!ok) {
          canProceed = false;
          break;
        }
      }
      if (canProceed) {
        setCurrentStep(targetStep);
      }
    }
  };

  const nextStepNames: Record<number, string> = {
    1: "Hình ảnh sản phẩm",
    2: "Thông số kỹ thuật",
    3: "Biến thể & Giá (SKU)",
  };

  return (
    <AdminPageShell>
      {/* ── 1. HORIZON TOOLBAR (Continuous Atelier Sticky Header - Locked to h-11 baseline) ── */}
      <AdminPageShell.Header
        title={isCreate ? "Tạo sản phẩm mới" : "Chỉnh sửa sản phẩm"}
        badge={!isCreate && id ? `#${id}` : undefined}
        actions={
          <div className="flex items-center gap-2">
            <Link to="/admin/product">
              <Button
                variant="outline"
                size="default"
                className="h-8 px-3 text-xs rounded-[2px] border-border/60 text-muted-foreground hover:text-foreground shadow-none"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5 mr-1 stroke-[1.25]" />
                <span className="hidden sm:inline">Quay lại danh mục</span>
                <span className="sm:hidden">Hủy</span>
              </Button>
            </Link>

            <Button
              size="default"
              onClick={async (e) => {
                if (isCreate && currentStep < 4) {
                  e.preventDefault();
                  await handleAdvanceStep();
                } else {
                  handleSubmit(onSubmit)();
                }
              }}
              disabled={isSubmitting || isLoading}
              className="h-8 px-4 text-xs font-semibold tracking-wider uppercase rounded-[2px] shadow-none gap-1"
            >
              {isSubmitting ? (
                "Đang lưu..."
              ) : isCreate ? (
                currentStep === 4 ? (
                  <>
                    <CheckIcon className="w-3.5 h-3.5 stroke-[1.5]" /> Tạo sản phẩm
                  </>
                ) : (
                  "Tiếp theo"
                )
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        }
      />

      <AdminPageShell.Body>
        {/* ── 2. UNIFIED SEGMENTED DOCK TABS ── */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col gap-4 md:gap-6 h-full">
        <div className="p-1 bg-surface border border-border/60 rounded-[2px] shrink-0 shadow-none">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="basic" icon={<CubeIcon className="w-3.5 h-3.5" />}>
              1. Thông tin chung
              {hasBasicErrors && <span className="w-1 h-1 rounded-[0.5px] bg-destructive ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="images" icon={<PhotoIcon className="w-3.5 h-3.5" />}>
              2. Hình ảnh
              {hasImageErrors && <span className="w-1 h-1 rounded-[0.5px] bg-destructive ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="attrs" icon={<TagIcon className="w-3.5 h-3.5" />}>
              3. Thông số kỹ thuật
              {hasAttrErrors && <span className="w-1 h-1 rounded-[0.5px] bg-destructive ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="skus" icon={<ListBulletIcon className="w-3.5 h-3.5" />}>
              4. Biến thể (SKU)
              {hasSkuErrors && <span className="w-1 h-1 rounded-[0.5px] bg-destructive ml-1" />}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── 3. FORM WORKSPACE ── */}
        <div className="flex flex-col overflow-hidden relative">
          <FormProvider {...methods}>
            <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
              <TabsContent value="basic" className="m-0 focus-visible:outline-none">
                <ProductBasicInfo
                  brandOptions={brandOptions}
                  categoryOptions={categoryOptions}
                  collectionOptions={collectionOptions}
                />
              </TabsContent>

              <TabsContent value="images" className="m-0 focus-visible:outline-none">
                <ProductImages />
              </TabsContent>

              <TabsContent value="attrs" className="m-0 focus-visible:outline-none">
                <ProductAttributes attrOptions={attrOptions} attrAll={attrAll} />
              </TabsContent>

              <TabsContent value="skus" className="m-0 focus-visible:outline-none">
                <ProductSkus
                  isCreate={isCreate}
                  variantOptions={variantOptions}
                  attrAll={attrAll}
                  toast={toast}
                />
              </TabsContent>

              {/* ── 4. STEP NAVIGATION FOOTER (When isCreate mode) ── */}
              {isCreate && (
                <div className="flex justify-between items-center pt-6 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="h-8 text-xs font-semibold rounded-[2px] border-border/60 text-muted-foreground hover:text-foreground shadow-none"
                  >
                    Quay lại
                  </Button>

                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      size="default"
                      onClick={handleAdvanceStep}
                      className="h-8 px-5 text-xs font-semibold tracking-wider uppercase rounded-[2px] shadow-none"
                    >
                      Tiếp theo: {nextStepNames[currentStep]}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      size="default"
                      onClick={handleSubmit(onSubmit)}
                      disabled={isSubmitting || isLoading}
                      className="h-8 px-5 text-xs font-semibold tracking-wider uppercase rounded-[2px] shadow-none gap-1"
                    >
                      <CheckIcon className="w-3.5 h-3.5" />
                      {isSubmitting ? "Đang tạo..." : "Hoàn tất & Tạo sản phẩm"}
                    </Button>
                  )}
                </div>
              )}
            </form>
          </FormProvider>
        </div>
      </Tabs>
      </AdminPageShell.Body>
    </AdminPageShell>
  );
}
