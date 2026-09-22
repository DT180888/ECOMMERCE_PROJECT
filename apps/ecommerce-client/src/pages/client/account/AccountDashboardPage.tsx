import { Link } from "react-router-dom";
import { User, Package, MapPin, Shield, LogOut, ChevronRight, Ticket } from "lucide-react";
import { useMyProfile } from "@entities/user/hooks";
import { useMyOrders } from "@entities/order/hooks";
import { useAddressList } from "@entities/address/hooks";
import { useLogout } from "@entities/auth/hooks";
import { getOrderStatusConfig } from "@my-project/shared-utils";
import { Button } from "@my-project/ui";

const formatVND = (minor?: number | null) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    (minor ?? 0)
  );

export default function AccountDashboardPage() {
  const { data: profile, isLoading: isProfileLoading } = useMyProfile();
  const { data: ordersData, isLoading: isOrdersLoading } = useMyOrders({ page: 1, size: 1 });
  const { data: addressesData, isLoading: isAddressesLoading } = useAddressList({ page: 1, size: 5 });
  const logout = useLogout();

  const recentOrder = ordersData?.items?.[0] ?? null;
  const defaultAddress = addressesData?.items?.find((a) => a.isDefault) ?? addressesData?.items?.[0] ?? null;
  const displayName = profile?.fullName ?? profile?.email ?? "Thành viên";

  const isLoading = isProfileLoading || isOrdersLoading || isAddressesLoading;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 bg-muted/10 rounded-button w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-48 bg-muted/10 rounded-card lg:col-span-1" />
          <div className="h-48 bg-muted/10 rounded-card lg:col-span-2" />
          <div className="h-48 bg-muted/10 rounded-card lg:col-span-1" />
          <div className="h-48 bg-muted/10 rounded-card lg:col-span-1" />
          <div className="h-48 bg-muted/10 rounded-card lg:col-span-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="responsive-h2 text-foreground tracking-tight">Trung tâm tài khoản</h1>
        <p className="text-muted text-sm mt-1">
          Quản lý thông tin cá nhân, theo dõi đơn hàng và tùy chỉnh cài đặt của bạn
        </p>
      </div>

      {/* Grid Dashboard Widgets Container */}
      <section className="bg-background rounded-card p-6 md:p-8 shadow-neo-inset transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Widget 1: Hồ sơ cá nhân (1 cột) */}
          <div className="bg-background rounded-card shadow-neo p-6 flex flex-col justify-between hover:shadow-neo-hover transition-all duration-300 group lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-inner bg-background shadow-neo-inset text-primary">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider font-display">
                    Hồ sơ cá nhân
                  </h2>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Thông tin tài khoản</p>
                </div>
              </div>
              
              <div className="pt-2 text-sm space-y-1 text-muted">
                <div className="font-bold text-foreground truncate">{displayName}</div>
                <div className="truncate text-xs">{profile?.email}</div>
                {profile?.phone && <div className="font-mono text-xs">{profile.phone}</div>}
              </div>
            </div>

            <div className="pt-6 mt-4 flex justify-end">
              <Button asChild variant="outline" size="sm" className="gap-2 text-xs uppercase tracking-wider text-primary border-primary/20 hover:bg-primary/5">
                <Link to="profile?tab=info">
                  Chi tiết <ChevronRight size={14} />
                </Link>
              </Button>
            </div>
          </div>

          {/* Widget 2: Đơn hàng gần nhất (2 cột trên màn hình lớn) */}
          <div className="bg-background rounded-card shadow-neo p-6 flex flex-col justify-between hover:shadow-neo-hover transition-all duration-300 group lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-inner bg-background shadow-neo-inset text-success">
                  <Package size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider font-display">
                    Đơn hàng gần đây
                  </h2>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Lịch sử mua sắm</p>
                </div>
              </div>

              {recentOrder ? (
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-inner shadow-neo-inset-sm">
                  <div>
                    <div className="text-xs text-muted mb-1">Mã đơn hàng</div>
                    <div className="font-mono font-bold text-primary">{recentOrder.orderNumber}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted mb-1">Tổng thanh toán</div>
                    <div className="font-extrabold text-foreground">{formatVND(recentOrder.totalMinor)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted mb-1">Trạng thái</div>
                    {(() => {
                      const statusConfig = getOrderStatusConfig(recentOrder.status);
                      return (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-neo-inset-sm ${statusConfig.colorClass}`}>
                          <span>{statusConfig.icon}</span>
                          <span>{statusConfig.label}</span>
                        </span>
                      );
                    })()}
                  </div>
                </div>
              ) : (
                <div className="pt-2 text-sm text-muted italic p-4 rounded-inner shadow-neo-inset-sm">
                  Bạn chưa có đơn đặt hàng nào.
                </div>
              )}
            </div>

            <div className="pt-6 mt-4 flex justify-end">
              <Button asChild variant="outline" size="sm" className="gap-2 text-xs uppercase tracking-wider text-success border-success/20 hover:bg-success/5">
                <Link to="orders">
                  Xem tất cả <ChevronRight size={14} />
                </Link>
              </Button>
            </div>
          </div>

          {/* Widget 3: Kho Voucher */}
          <div className="bg-background rounded-card shadow-neo p-6 flex flex-col justify-between hover:shadow-neo-hover transition-all duration-300 group lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-inner bg-background shadow-neo-inset text-accent">
                  <Ticket size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider font-display">
                    Kho Voucher
                  </h2>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Mã giảm giá</p>
                </div>
              </div>

              <div className="pt-2 text-sm text-muted">
                Quản lý các mã giảm giá và ưu đãi đặc quyền bạn đã lưu.
              </div>
            </div>

            <div className="pt-6 mt-4 flex justify-end">
              <Button asChild variant="outline" size="sm" className="gap-2 text-xs uppercase tracking-wider text-accent border-accent/20 hover:bg-accent/5">
                <Link to="vouchers">
                  Tới kho <ChevronRight size={14} />
                </Link>
              </Button>
            </div>
          </div>

          {/* Widget 4: Sổ địa chỉ */}
          <div className="bg-background rounded-card shadow-neo p-6 flex flex-col justify-between hover:shadow-neo-hover transition-all duration-300 group lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-inner bg-background shadow-neo-inset text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider font-display">
                    Sổ địa chỉ
                  </h2>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Địa chỉ giao hàng</p>
                </div>
              </div>

              {defaultAddress ? (
                <div className="pt-2 text-xs space-y-1.5 text-muted">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm">{defaultAddress.recipientName}</span>
                    {defaultAddress.isDefault && (
                      <span className="text-[9px] font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                        Mặc định
                      </span>
                    )}
                  </div>
                  <div className="font-mono">{defaultAddress.phone}</div>
                  <div className="truncate text-foreground/80">{defaultAddress.line1}, {defaultAddress.city}</div>
                </div>
              ) : (
                <div className="pt-2 text-sm text-muted italic">
                  Chưa thiết lập địa chỉ mặc định.
                </div>
              )}
            </div>

            <div className="pt-6 mt-4 flex justify-end">
              <Button asChild variant="outline" size="sm" className="gap-2 text-xs uppercase tracking-wider text-primary border-primary/20 hover:bg-primary/5">
                <Link to="profile?tab=address">
                  Quản lý <ChevronRight size={14} />
                </Link>
              </Button>
            </div>
          </div>

          {/* Widget 5: Bảo mật & Hệ thống */}
          <div className="bg-background rounded-card shadow-neo p-6 flex flex-col justify-between hover:shadow-neo-hover transition-all duration-300 group lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-inner bg-background shadow-neo-inset text-primary">
                  <Shield size={24} />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-foreground uppercase tracking-wider font-display">
                    Bảo mật
                  </h2>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-wider">Thiết lập tài khoản</p>
                </div>
              </div>

              <div className="pt-2 text-sm text-muted">
                Đổi mật khẩu bảo mật và đăng xuất khỏi thiết bị của bạn.
              </div>
            </div>

            <div className="pt-6 mt-4 flex gap-2 justify-end">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => logout.mutate()}
                disabled={logout.isPending}
                className="gap-2 text-xs uppercase tracking-wider text-error border-error/20 hover:bg-error/5"
              >
                <LogOut size={14} /> Thoát
              </Button>
              <Button asChild variant="outline" size="sm" className="gap-2 text-xs uppercase tracking-wider text-primary border-primary/20 hover:bg-primary/5">
                <Link to="profile?tab=info">
                  Bảo mật <ChevronRight size={14} />
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
