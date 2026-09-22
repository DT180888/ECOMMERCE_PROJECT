import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@my-project/ui";
import { AdminPageShell } from "@shared/ui";
import { BrandList } from "@features/brand-management/ui";
import { AttributeList } from "@features/attribute-management/ui";
import { CategoryList } from "@features/category-management/ui";
import { TagIcon, SwatchIcon, QueueListIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

export function CatalogSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get("tab") || "brand";

  const handleTabChange = (value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", value);
        next.delete("page");
        next.delete("size");
        next.delete("keyword");
        return next;
      },
      { replace: true }
    );
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange} className="flex flex-col h-full w-full">
      <AdminPageShell
        icon={Cog6ToothIcon}
        title="Cấu hình Catalog"
        noCard={true}
        actions={
          <div className="w-full overflow-x-auto custom-scrollbar flex xl:justify-end">
            <TabsList className="sm:h-10 flex items-center bg-foreground/[0.03] dark:bg-white/[0.03] p-1 gap-1 w-max border border-neo-bevel">
              <TabsTrigger
                value="brand"
                className="px-3 sm:px-4 py-1.5 text-xs font-semibold transition-all duration-300 rounded-full"
              >
                <TagIcon className="w-3.5 h-3.5 mr-1.5 inline-block" /> Thương hiệu
              </TabsTrigger>
              
              <TabsTrigger
                value="attribute"
                className="px-3 sm:px-4 py-1.5 text-xs font-semibold transition-all duration-300 rounded-full"
              >
                <SwatchIcon className="w-3.5 h-3.5 mr-1.5 inline-block" /> Thuộc tính
              </TabsTrigger>
              
              <TabsTrigger
                value="category"
                className="px-3 sm:px-4 py-1.5 text-xs font-semibold transition-all duration-300 rounded-full "
              >
                <QueueListIcon className="w-3.5 h-3.5 mr-1.5 inline-block" /> Danh mục
              </TabsTrigger>
            </TabsList>
          </div>
        }
      >
        {/* --- TABS CONTENT AREA --- */}
        <div className="flex-1 lg:overflow-hidden relative">
          <TabsContent value="brand" keepMounted className="lg:h-full m-0 p-0 outline-none ring-0 data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 duration-200">
            <BrandList  />
          </TabsContent>

          <TabsContent value="attribute" keepMounted className="lg:h-full m-0 p-0 outline-none ring-0 data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 duration-200">
            <AttributeList  />
          </TabsContent>

          <TabsContent value="category" keepMounted className="lg:h-full m-0 p-0 outline-none ring-0 data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 duration-200">
            <CategoryList  />
          </TabsContent>
        </div>
      </AdminPageShell>
    </Tabs>
  );
}

