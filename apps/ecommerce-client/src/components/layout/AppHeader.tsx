import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useSearchParams, NavLink, useLocation } from "react-router-dom";
import { useAuthUser, useLogout } from "@hooks/useAuth";
import { getAccessToken } from "@my-project/shared-utils";
import { useSmartCart } from "@hooks/useSmartCart";
import { 
  ShoppingCartIcon, 
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';
import { ThemeToggle } from "@my-project/ui";

export default function AppHeader() {
  const nav = useNavigate();
  const location = useLocation();
  const logout = useLogout();
  const [searchParams] = useSearchParams();
  const hasToken = !!getAccessToken();
  const { data: me } = useAuthUser({ enabled: hasToken });
  const { cart } = useSmartCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setSearchTerm(searchParams.get("keyword") || "");
  }, [searchParams]);

  // Click outside listener for user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      nav(`/catalog?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchExpanded(false);
      setMobileSearchOpen(false);
    }
  };

  const cartCount = useMemo(() => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  }, [cart?.items]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-xs font-display uppercase tracking-[0.2em] transition-colors duration-200 py-1 border-b ${
      isActive
        ? "text-foreground border-foreground font-semibold"
        : "text-muted-foreground border-transparent hover:text-foreground"
    }`;

  const iconActionClass = "p-2 text-foreground hover:text-muted-foreground focus:outline-none transition-colors duration-200";

  return (
    <header className="sticky top-0 left-0 right-0 z-50 w-full bg-background/85 backdrop-blur-md border-b border-border/60 transition-colors duration-300">
      <div className="w-full px-4 sm:px-6 lg:px-10 2xl:px-16 h-16 flex items-center justify-between">
        
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-4 lg:gap-8">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden  text-foreground hover:text-muted-foreground focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6 stroke-[1.25]" />
            ) : (
              <Bars3Icon className="w-6 h-6 stroke-[1.25]" />
            )}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="font-display font-medium text-base sm:text-lg uppercase tracking-[0.25em] text-foreground transition-opacity group-hover:opacity-80">
              MINIMALISM
            </span>
            <span className="hidden sm:inline-block text-[10px] font-display uppercase tracking-[0.2em] text-muted-foreground border-l border-border/60 pl-2.5">
              Quiet Luxury
            </span>
          </Link>
        </div>

        {/* Center: Primary Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/" className={navLinkClass}>Trang Chủ</NavLink>
          <NavLink to="/catalog" className={navLinkClass}>Sản Phẩm</NavLink>
          <NavLink to="/catalog?sort=newest" className={navLinkClass}>Bộ Sưu Tập</NavLink>
          <NavLink to="/catalog?onSale=true" className={navLinkClass}>Khuyến Mãi</NavLink>
        </nav>

        {/* Right: Actions (Search Expand, Wishlist, Cart, Account, Theme) */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Desktop Search: Hover/Focus Expand */}
          <div 
            className="hidden lg:relative lg:flex items-center"
            onMouseEnter={() => setSearchExpanded(true)}
            onMouseLeave={() => !searchTerm && setSearchExpanded(false)}
          >
            <form 
              onSubmit={handleSearchSubmit}
              className={`flex items-center transition-all duration-300 ${
                searchExpanded 
                  ? "w-56" 
                  : "w-9"
              }`}
            >
              <button
                type="submit"
                className="w-9 h-9 flex items-center justify-center shrink-0 text-foreground hover:text-muted-foreground focus:outline-none focus:ring-0"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-5 h-5 stroke-[1.25]" />
              </button>

              <input
                ref={searchInputRef}
                type="text"
                placeholder="TÌM KIẾM..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchExpanded(true)}
                className={`bg-transparent border-none text-xs font-display uppercase tracking-wider outline-none focus:outline-none focus:ring-0 focus:border-transparent pr-3 w-full transition-opacity duration-200 text-foreground placeholder:text-muted-foreground border-b border-foreground ${
                  searchExpanded ? "opacity-100 block" : "border-none opacity-0 hidden"
                }`}
              />
            </form>
          </div>

          {/* Mobile Search Trigger Icon */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className={`lg:hidden ${iconActionClass}`}
            aria-label="Tìm kiếm"
          >
            <MagnifyingGlassIcon className="w-5 h-5 stroke-[1.25]" />
          </button>

          {/* Wishlist Link */}
          <Link
            to="/account/wishlist"
            className={iconActionClass}
            aria-label="Wishlist"
          >
            <HeartIcon className="w-5 h-5 stroke-[1.25]" />
          </Link>

          {/* Cart Icon & Counter Badge */}
          <Link
            to="/cart"
            className={`relative flex items-center ${iconActionClass}`}
            aria-label="Cart"
          >
            <ShoppingCartIcon className="w-5 h-5 stroke-[1.25]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[9px] font-display font-medium w-4 h-4 flex items-center justify-center bg-foreground text-background border border-background tabular-nums">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative" ref={userMenuRef}>
            {hasToken && me ? (
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-1.5 border border-border/80 hover:border-foreground text-xs font-display uppercase text-foreground transition-colors rounded-[2px]"
              >
                <UserIcon className="w-4 h-4 stroke-[1.25]" />
                <span className="hidden sm:inline-block max-w-[80px] truncate">
                  {me.email?.split("@")[0] || "Tài khoản"}
                </span>
              </button>
            ) : (
              <Link
                to="/auth/login"
                className={`flex items-center gap-1.5 text-xs font-display uppercase tracking-wider ${iconActionClass}`}
              >
                <UserIcon className="w-5 h-5 stroke-[1.25]" />
              </Link>
            )}

            {/* Dropdown Menu (Flat Hairline Geometry - Zero Drop Shadow) */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border/80 py-1.5 z-50 text-foreground shadow-none">
                <div className="px-4 py-2 border-b border-border/60 text-[11px] font-display text-muted-foreground truncate">
                  {me?.email}
                </div>
                <Link
                  to="/account/profile"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-display uppercase text-foreground hover:bg-surface transition-colors"
                >
                  <UserIcon className="w-4 h-4 stroke-[1.25]" />
                  Tài khoản
                </Link>
                <Link
                  to="/account/orders"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-display uppercase text-foreground hover:bg-surface transition-colors"
                >
                  <ClipboardDocumentListIcon className="w-4 h-4 stroke-[1.25]" />
                  Đơn hàng
                </Link>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout.mutate();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-display uppercase text-error hover:bg-surface border-t border-border/60 text-left transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 stroke-[1.25]" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <div className="text-foreground flex items-center pl-1">
            <ThemeToggle />
          </div>

        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {mobileSearchOpen && (
        <div className="lg:hidden border-b border-border/60 bg-card p-3 animate-in fade-in duration-200">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="TÌM KIẾM SẢN PHẨM..."
              value={searchTerm}
              autoFocus
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-background text-xs font-display uppercase tracking-wider text-foreground placeholder:text-muted-foreground border border-border/80 p-2.5 outline-none focus:outline-none focus:ring-0 focus:border-foreground"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-foreground text-background font-display text-xs uppercase font-medium"
            >
              Tìm
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-background border-b border-border/80 p-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-200">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Trang Chủ</NavLink>
          <NavLink to="/catalog" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Sản Phẩm</NavLink>
          <NavLink to="/catalog?sort=newest" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Bộ Sưu Tập</NavLink>
          <NavLink to="/catalog?onSale=true" onClick={() => setMobileMenuOpen(false)} className={navLinkClass}>Khuyến Mãi</NavLink>
        </div>
      )}

    </header>
  );
}
