import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { cn } from "@my-project/ui";

interface BreadcrumbSegment {
  label: string;
  path?: string;
  isCurrent?: boolean;
}

const ROUTE_MAP: Record<string, { group: string; label: string; basePath: string }> = {
  "/admin/dashboard": { group: "Tổng quan", label: "Tổng quan", basePath: "/admin/dashboard" },
  "/admin/reports": { group: "Tổng quan", label: "Báo cáo & Phân tích", basePath: "/admin/reports" },
  "/admin/orders": { group: "Kinh doanh", label: "Đơn hàng", basePath: "/admin/orders" },
  "/admin/abandoned-carts": { group: "Kinh doanh", label: "Giỏ hàng bỏ quên", basePath: "/admin/abandoned-carts" },
  "/admin/reviews": { group: "Kinh doanh", label: "Đánh giá", basePath: "/admin/reviews" },
  "/admin/customers/rfm-segments": { group: "Kinh doanh", label: "Phân cụm RFM", basePath: "/admin/customers/rfm-segments" },
  "/admin/automation/triggers": { group: "Kinh doanh", label: "Tự động hóa", basePath: "/admin/automation/triggers" },
  "/admin/promotion": { group: "Kinh doanh", label: "Khuyến mãi", basePath: "/admin/promotion" },
  "/admin/collection": { group: "Kinh doanh", label: "Bộ sưu tập", basePath: "/admin/collection" },
  "/admin/hero-slides": { group: "Kinh doanh", label: "Banner Slides", basePath: "/admin/hero-slides" },
  "/admin/product": { group: "Sản phẩm & Danh mục", label: "Sản phẩm", basePath: "/admin/product" },
  "/admin/skus": { group: "Sản phẩm & Danh mục", label: "Quản lý SKU", basePath: "/admin/skus" },
  "/admin/category": { group: "Sản phẩm & Danh mục", label: "Danh mục", basePath: "/admin/category" },
  "/admin/brand": { group: "Sản phẩm & Danh mục", label: "Thương hiệu", basePath: "/admin/brand" },
  "/admin/attribute": { group: "Sản phẩm & Danh mục", label: "Thuộc tính", basePath: "/admin/attribute" },
  "/admin/users": { group: "Hệ thống", label: "Người dùng", basePath: "/admin/users" },
  "/admin/listUsers": { group: "Hệ thống", label: "Người dùng", basePath: "/admin/users" },
  "/admin/security": { group: "Hệ thống", label: "Bảo mật", basePath: "/admin/security" },
};

export interface AdminBreadcrumbProps {
  /** If true, force breadcrumb to render even on root routes (used in Topbar mode) */
  forceShow?: boolean;
  className?: string;
}

/**
 * AdminBreadcrumb - Smart Context Breadcrumb (Phương án A)
 * - Tự động ẩn ở trang cấp 1 (root catalog pages) để tránh lặp tiêu đề với PageHeader & Sidebar.
 * - Tự động hiển thị khi vào trang sâu (new / detail / edit) kèm nút Back nhanh về danh mục cha.
 */
export function AdminBreadcrumb({ forceShow = false, className }: AdminBreadcrumbProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

  // Tìm base route khớp
  let matchedBase: { group: string; label: string; basePath: string } | null = null;

  for (const [route, config] of Object.entries(ROUTE_MAP)) {
    if (pathname === route || pathname.startsWith(route + "/")) {
      matchedBase = config;
      break;
    }
  }

  const isExactBase = matchedBase ? pathname === matchedBase.basePath : pathname === "/admin/dashboard";
  const isDeep = !isExactBase;

  // Nếu ở trang cấp 1 và không bị ép buộc hiển thị -> Ẩn hoàn toàn để giữ Header thoáng đãng
  if (!isDeep && !forceShow) {
    return null;
  }

  const items: BreadcrumbSegment[] = [];

  if (matchedBase) {
    if (isExactBase) {
      items.push({ label: matchedBase.label, isCurrent: true });
    } else {
      items.push({ label: matchedBase.label, path: matchedBase.basePath });

      const subPaths = pathname.slice(matchedBase.basePath.length).split("/").filter(Boolean);
      subPaths.forEach((sub, idx) => {
        const isLast = idx === subPaths.length - 1;
        let subLabel = sub;
        if (sub === "new") subLabel = "Thêm mới";
        else if (sub === "detail") subLabel = "Chi tiết";
        else if (sub === "edit") subLabel = "Chỉnh sửa";
        else if (/^\d+$/.test(sub)) subLabel = `#${sub}`;

        items.push({
          label: subLabel,
          isCurrent: isLast,
          path: isLast ? undefined : `${matchedBase!.basePath}/${sub}`,
        });
      });
    }
  } else {
    items.push({ label: "Quản trị", path: "/admin/dashboard" });
    const segments = pathname.split("/").filter((s) => s && s !== "admin");
    segments.forEach((seg, idx) => {
      items.push({
        label: seg,
        isCurrent: idx === segments.length - 1,
      });
    });
  }

  return (
    <nav
      aria-label="Breadcrumb điều hướng"
      className={cn(
        "flex items-center gap-2 text-xs font-sans select-none min-w-0 transition-all animate-in fade-in duration-150",
        className
      )}
    >
      {/* Nút Quay lại nhanh khi ở trang sâu */}
      {isDeep && (
        <button
          type="button"
          onClick={() => {
            if (matchedBase) {
              navigate(matchedBase.basePath);
            } else {
              navigate(-1);
            }
          }}
          className="h-6 px-2 rounded-md border border-border bg-card hover:bg-surface-hover text-foreground flex items-center gap-1 text-[11px] font-medium transition-all shadow-sm cursor-pointer mr-1 shrink-0"
          title="Quay lại danh sách"
          aria-label="Quay lại danh sách"
        >
          <ArrowLeftIcon className="w-3 h-3 stroke-[2]" />
          <span className="hidden sm:inline">Quay lại</span>
        </button>
      )}

      {/* Danh sách các nấc Breadcrumb */}
      <div className="flex items-center gap-1.5 min-w-0">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5 min-w-0">
            {index > 0 && (
              <ChevronRightIcon className="w-3 h-3 text-muted-foreground/50 stroke-[1.5] shrink-0" />
            )}
            {item.isCurrent || !item.path ? (
              <span
                className={cn(
                  "truncate font-sans",
                  item.isCurrent
                    ? "font-medium text-foreground"
                    : "text-muted-foreground/80 font-normal"
                )}
                title={item.label}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="text-muted-foreground hover:text-primary transition-colors truncate font-normal"
                title={item.label}
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}

export default AdminBreadcrumb;
