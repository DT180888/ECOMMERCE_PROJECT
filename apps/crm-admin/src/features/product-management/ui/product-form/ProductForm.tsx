import { FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@my-project/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@my-project/ui";
import {
    ArrowLeftIcon, 
    CubeIcon,
    ListBulletIcon,
    TagIcon,
    PhotoIcon
} from "@heroicons/react/24/outline";

// Sub-components
import { ProductBasicInfo } from "./ProductBasicInfo";
import { ProductImages } from "./ProductImages";
import { ProductAttributes } from "./ProductAttributes";
import { ProductSkus } from "./ProductSkus";

// Hook
import { useProductFormManager } from "../../model/useProductFormManager";

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
      <div className="p-8 text-center text-muted-foreground bg-card border border-neo-bevel rounded-card shadow-none">
        Bạn không có quyền {isCreate ? "tạo mới" : "chỉnh sửa"} sản phẩm.
      </div>
    );
  }

  if (!isCreate && isLoading) return <div className="p-8 text-center text-muted animate-pulse">Đang tải dữ liệu sản phẩm...</div>;

  return (
    <div className="flex flex-col gap-4 md:gap-6 w-full rounded-card">
      {/* --- 1. HEADER SECTION --- */}
      <div className="sticky top-0 z-10 flex flex-col md:flex-row justify-between items-start glass-panel p-4 rounded-card shrink-0 gap-4">
         <div className="flex items-center gap-3">
            <Link to="/admin/product">
                <Button variant="ghost" size="icon" className="text-muted hover:text-foreground hover:bg-foreground/10 rounded-full h-10 w-10">
                    <ArrowLeftIcon className="w-5 h-5" />
                </Button>
            </Link>
            <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                    {isCreate ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
                </h1>
                <p className="text-xs text-muted mt-0.5 ml-1">
                    {isCreate ? "Điền đầy đủ thông tin bên dưới" : `Đang chỉnh sửa #${id}`}
                </p>
            </div>
         </div>
         
         <div className="flex gap-3">
              <Button variant="outline" onClick={() => nav("/admin/product")} className="border-foreground/[0.08] dark:border-white/[0.08] text-foreground hover:bg-foreground/5">
                Hủy bỏ
             </Button>
             <Button 
                onClick={async (e) => {
                  if (isCreate && currentStep < 4) {
                    e.preventDefault();
                    let fieldsToValidate: any[] = [];
                    if (currentStep === 1) fieldsToValidate = ["name", "slug", "brandId", "categoryIds"];
                    if (currentStep === 2) fieldsToValidate = ["attributes"];
                    if (currentStep === 3) fieldsToValidate = ["images"];
                    
                    const isValid = await trigger(fieldsToValidate as any);
                    if (isValid) {
                      setCurrentStep(prev => Math.min(4, prev + 1));
                    }
                  } else {
                    handleSubmit(onSubmit)();
                  }
                }} 
                disabled={isSubmitting || isLoading}
                variant="default"
                className="px-6"
             >
                {isSubmitting ? "Đang lưu..." : (isCreate ? (currentStep === 4 ? "Tạo sản phẩm" : "Tiếp theo") : "Lưu thay đổi")}
             </Button>
         </div>
      </div>

      {/* --- 2. MAIN CONTENT (SCROLLABLE TABS / WIZARD STEPPER) --- */}
         <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col gap-4 md:gap-6 h-full rounded-card">
            
            {/* Wizard Stepper when isCreate, otherwise standard Tabs List */}
            {isCreate ? (
              <div className="p-4 md:p-6 bg-card border border-neo-bevel shadow-none rounded-card shrink-0">
                <div className="flex items-center justify-between max-w-3xl mx-auto">
                  {[
                    { step: 1, label: "Thông tin chung", icon: CubeIcon, hasError: hasBasicErrors },
                    { step: 2, label: "Thuộc tính", icon: TagIcon, hasError: hasAttrErrors },
                    { step: 3, label: "Hình ảnh chung", icon: PhotoIcon, hasError: hasImageErrors },
                    { step: 4, label: "Biến thể (SKU)", icon: ListBulletIcon, hasError: hasSkuErrors },
                  ].map((item, index) => {
                    const isCompleted = currentStep > item.step;
                    const isActive = currentStep === item.step;
                    return (
                      <div key={item.step} className="flex items-center flex-1 last:flex-initial">
                        <button
                          type="button"
                          onClick={async () => {
                            if (item.step < currentStep) {
                              setCurrentStep(item.step);
                            } else if (item.step > currentStep) {
                              let canGo = true;
                              for (let s = currentStep; s < item.step; s++) {
                                let fieldsToValidate: any[] = [];
                                if (s === 1) fieldsToValidate = ["name", "slug", "brandId", "categoryIds"];
                                if (s === 2) fieldsToValidate = ["attributes"];
                                if (s === 3) fieldsToValidate = ["images"];
                                const ok = await trigger(fieldsToValidate as any);
                                if (!ok) {
                                  canGo = false;
                                  break;
                                }
                              }
                              if (canGo) {
                                setCurrentStep(item.step);
                              }
                            }
                          }}
                          className="flex flex-col items-center gap-2 outline-none group"
                        >
                          <div
                            className={`w-8 h-8 flex items-center justify-center text-xs font-bold transition-all rounded-button ${
                              isCompleted
                                ? "bg-foreground/5 text-foreground border border-neo-bevel"
                                : isActive
                                ? "bg-foreground/10 text-foreground border border-neo-bevel shadow-neo-sm"
                                : "bg-transparent text-muted border border-neo-bevel"
                            } ${item.hasError ? "text-error border-error/50" : ""}`}
                          >
                            {isCompleted ? "✓" : item.step}
                          </div>
                          <span
                            className={`text-[10px] md:text-xs font-medium hidden sm:inline ${
                              isActive ? "text-accent font-semibold" : "text-muted"
                            }`}
                          >
                            {item.label}
                          </span>
                        </button>
                        {index < 3 && (
                          <div
                            className={`h-0.5 flex-1 mx-2 md:mx-4 rounded-full transition-colors ${
                              isCompleted ? "bg-success" : "bg-muted/50"
                            }`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 md:p-6 bg-card border border-neo-bevel shadow-none rounded-card shrink-0">
                  <TabsList className=" p-1 rounded-card inline-flex h-auto">
                      <TabsTrigger value="basic" className="flex items-center gap-1 text-xs font-medium rounded-button transition-all ">
                          <CubeIcon className="w-3 h-3"/> Thông tin chung {hasBasicErrors && <span className="w-1.5 h-1.5 rounded-full bg-error" />}
                      </TabsTrigger>
                      <TabsTrigger value="images" className="flex items-center gap-1 text-xs font-medium rounded-button transition-all ">
                          <PhotoIcon className="w-3 h-3"/> Hình ảnh {hasImageErrors && <span className="w-1.5 h-1.5 rounded-full bg-error" />}
                      </TabsTrigger>
                      <TabsTrigger value="attrs" className="flex items-center gap-1 text-xs font-medium rounded-button transition-all ">
                          <TagIcon className="w-3 h-3"/> Thuộc tính {hasAttrErrors && <span className="w-1.5 h-1.5 rounded-full bg-error" />}
                      </TabsTrigger>
                      <TabsTrigger value="skus" className="flex items-center gap-1 text-xs font-medium rounded-button transition-all ">
                          <ListBulletIcon className="w-3 h-3"/> Biến thể (SKU) {hasSkuErrors && <span className="w-1.5 h-1.5 rounded-full bg-error" />}
                      </TabsTrigger>
                  </TabsList>
              </div>
            )}

            {/* Scrollable Form Area */}
            <div className="bg-card border border-neo-bevel shadow-none rounded-card flex flex-col overflow-hidden relative p-4 md:p-6">
                <FormProvider {...methods}>
                    <form id="product-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                        
                        <TabsContent value="basic" className="m-0 space-y-6 animate-in fade-in duration-300 focus-visible:outline-none">
                            <ProductBasicInfo 
                                brandOptions={brandOptions}
                                categoryOptions={categoryOptions}
                                collectionOptions={collectionOptions}
                            />
                        </TabsContent>

                        <TabsContent value="images" className="m-0 space-y-6 animate-in fade-in duration-300 focus-visible:outline-none">
                            <ProductImages />
                        </TabsContent>

                        <TabsContent value="attrs" className="m-0 space-y-6 animate-in fade-in duration-300 focus-visible:outline-none">
                            <ProductAttributes 
                                attrOptions={attrOptions}
                                attrAll={attrAll}
                            />
                        </TabsContent>

                        <TabsContent value="skus" className="m-0 space-y-6 animate-in fade-in duration-300 focus-visible:outline-none">
                            <ProductSkus 
                                isCreate={isCreate}
                                variantOptions={variantOptions}
                                attrAll={attrAll}
                                toast={toast}
                            />
                        </TabsContent>

                        {/* Step Navigation Buttons for Wizard Mode */}
                        {isCreate && (
                          <div className="flex justify-between items-center pt-6 border-t border-foreground/[0.04] dark:border-white/[0.05] mt-6">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                              disabled={currentStep === 1}
                              className="border-foreground/[0.08] dark:border-white/[0.08] text-foreground hover:bg-foreground/5"
                            >
                              Quay lại
                            </Button>
                            
                            {currentStep < 4 ? (
                              <Button
                                type="button"
                                variant="default"
                                onClick={async () => {
                                  let fieldsToValidate: any[] = [];
                                  if (currentStep === 1) fieldsToValidate = ["name", "slug", "brandId", "categoryIds"];
                                  if (currentStep === 2) fieldsToValidate = ["attributes"];
                                  if (currentStep === 3) fieldsToValidate = ["images"];
                                  
                                  const isValid = await trigger(fieldsToValidate as any);
                                  if (isValid) {
                                    setCurrentStep(prev => Math.min(4, prev + 1));
                                  }
                                }}
                                className="px-6"
                              >
                                Tiếp theo
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                onClick={handleSubmit(onSubmit)}
                                disabled={isSubmitting || isLoading}
                                variant="default"
                                className="px-6"
                              >
                                {isSubmitting ? "Đang tạo..." : "Hoàn tất & Tạo sản phẩm"}
                              </Button>
                            )}
                          </div>
                        )}

                    </form>
                </FormProvider>
             </div>
          </Tabs>
     </div>
   );
}
