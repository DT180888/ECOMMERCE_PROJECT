import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams, NavLink, useLocation } from "react-router-dom";
import { useAuthUser, useLogout } from "@entities/auth/hooks";
import { getAccessToken } from "@my-project/shared-utils";
import { useSmartCart } from "@features/client/cart/useSmartCart";
import { 
  ShoppingCartIcon, 
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

import { ThemeToggle } from "@my-project/ui";
import { Button } from "@my-project/ui";
import { Input } from "@my-project/ui";

const HeaderSearch = React.memo(({ isTransparent }: { isTransparent: boolean }) => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchExpanded, setSearchExpanded] = useState(false);

  useEffect(() => {
    setSearchTerm(searchParams.get("keyword") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      nav(`/catalog?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setSearchExpanded(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center transition-all duration-500 ease-out h-9 ${
      searchExpanded 
        ? 'w-full' 
        : 'w-9 lg:w-full max-w-[240px]'
    }`}>
      <Button
        type="submit" 
        variant="ghost"
        size="icon"
        className={`absolute left-0 lg:left-0 flex items-center justify-center w-9 h-9 z-10 transition-all duration-500 ease-out outline-none rounded-gallery hover:bg-transparent ${
          isTransparent ? 'text-foreground hover:text-foreground' : 'text-foreground/50 hover:text-foreground'
        }`}
      >
        <MagnifyingGlassIcon className="w-[18px] h-[18px] stroke-2" />
      </Button>
      <Input
        type="text"
        placeholder="TÌM KIẾM..."
        className={`w-full h-full text-[10px] font-mono tracking-[0.2em] uppercase rounded-gallery pl-9 lg:pl-10 pr-4 transition-all duration-300 outline-none ${
          isTransparent
            ? "bg-foreground/10 backdrop-blur-md text-foreground placeholder:text-foreground/80 focus:bg-foreground/50 shadow-none focus:shadow-none"
            : "bg-background/20 text-foreground placeholder:text-muted focus:border-accent border border-foreground/10 shadow-neo-inset"
        } ${
          !searchExpanded 
            ? 'cursor-pointer opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto' 
            : 'cursor-text opacity-100 pointer-events-auto'
        }`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setSearchExpanded(true)}
        onBlur={() => !searchTerm && setSearchExpanded(false)}
      />
    </form>
  );
});
HeaderSearch.displayName = "HeaderSearch";

const MobileMenu = React.memo(({ 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  me, 
  logout, 
  getNavLinkClass 
}: { 
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  me: any;
  logout: any;
  getNavLinkClass: (isMobile?: boolean) => ({ isActive }: { isActive: boolean }) => string;
}) => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSearchTerm(searchParams.get("keyword") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      nav(`/catalog?keyword=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  if (!mobileMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setMobileMenuOpen(false)} />
      <div className="absolute top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-background/95 backdrop-blur-2xl border-l border-foreground/5 shadow-neo animate-in slide-in-from-right duration-500 flex flex-col p-6">
        
        <div className="flex items-center justify-between mb-10">
           <div className="flex flex-col justify-center leading-none">
             <span className="text-[14px] font-display tracking-[0.3em] font-black uppercase text-foreground">
               Minimalism
             </span>
             <span className="text-[7.5px] font-mono tracking-[0.35em] font-bold uppercase text-muted mt-1.5">
               Quiet Luxury
             </span>
           </div>
           <Button
             variant="ghost"
             size="icon"
             onClick={() => setMobileMenuOpen(false)}
             aria-label="Đóng menu"
             className="w-10 h-10 rounded-gallery border border-foreground/5 shadow-neo-sm hover:-translate-y-[1px] hover:shadow-neo-hover active:translate-y-[0.5px] active:shadow-neo-inset-sm transition-all duration-300 text-foreground/60 focus:outline-none"
           >
              <XMarkIcon className="w-6 h-6 stroke-[1.5]" />
           </Button>
        </div>
        
        <form onSubmit={handleSearch} className="relative mb-8">
            <Button type="submit" variant="ghost" size="icon" className="absolute left-1 top-1/2 -translate-y-1/2 w-9 h-9 text-foreground/50 hover:text-foreground hover:bg-transparent rounded-gallery z-10">
                <MagnifyingGlassIcon className="w-5 h-5 stroke-[1.5]" />
            </Button>
            <Input
                type="text"
                placeholder="TÌM KIẾM..."
                className="w-full h-11 text-[11px] font-mono tracking-[0.2em] uppercase rounded-gallery pl-11 pr-4 bg-background text-foreground placeholder:text-muted focus:border-accent border border-foreground/10 shadow-neo-inset"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </form>

        <nav className="flex flex-col gap-6 flex-1">
            <span className="text-[9px] font-mono font-bold text-muted uppercase tracking-[0.3em]">Menu</span>
            <NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={getNavLinkClass(true)}>
              {({ isActive }) => (
                <span className="flex items-center justify-between w-full">
                  <span>Trang chủ</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-none bg-accent" />}
                </span>
              )}
            </NavLink>
            <NavLink to="/catalog" onClick={() => setMobileMenuOpen(false)} className={getNavLinkClass(true)}>
              {({ isActive }) => (
                <span className="flex items-center justify-between w-full">
                  <span>Sản phẩm</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-none bg-accent" />}
                </span>
              )}
            </NavLink>
            <NavLink to="/wishlist" onClick={() => setMobileMenuOpen(false)} className={getNavLinkClass(true)}>
              {({ isActive }) => (
                <span className="flex items-center justify-between w-full">
                  <span>Yêu thích</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-none bg-accent" />}
                </span>
              )}
            </NavLink>
         </nav>

         <div className="pt-8 border-t border-foreground/5 mt-auto space-y-6">
             <div className="flex items-center justify-between">
                 <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-foreground/60">Giao diện</span>
                 <ThemeToggle className="w-10 h-10 rounded-gallery border border-foreground/5 shadow-neo-sm hover:-translate-y-[1px] hover:shadow-neo-hover active:translate-y-[0.5px] active:shadow-neo-inset-sm transition-all duration-300 text-foreground/60" />
             </div>
             {me ? (
                 <div className="space-y-4">
                     <NavLink to="/account" onClick={() => setMobileMenuOpen(false)} className={getNavLinkClass(true)}>
                         {({ isActive }) => (
                           <div className="flex items-center justify-between w-full">
                             <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-[0.2em]">
                                 <UserIcon className="w-5 h-5 stroke-[1.5]" />
                                 <span>Hồ sơ</span>
                             </div>
                             {isActive && <span className="w-1.5 h-1.5 rounded-none bg-accent" />}
                           </div>
                         )}
                     </NavLink>
                     <button 
                         onClick={() => { logout.mutate(); setMobileMenuOpen(false); }} 
                         className="w-full flex items-center gap-4 px-4 py-3 md:px-6 md:py-5 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-red-500 hover:text-red-600 transition-colors bg-transparent border-none focus:outline-none rounded-gallery hover:bg-red-500/10"
                     >
                         <ArrowRightOnRectangleIcon className="w-5 h-5 stroke-[1.5]" />
                         Đăng xuất
                     </button>
                 </div>
             ) : (
                 <NavLink to="/auth/login" onClick={() => setMobileMenuOpen(false)} className={getNavLinkClass(true)}>
                     {({ isActive }) => (
                       <div className="flex items-center justify-between w-full">
                         <div className="flex items-center gap-4 text-[11px] font-mono uppercase tracking-[0.2em]">
                             <UserIcon className="w-5 h-5 stroke-[1.5]" />
                             <span>Đăng nhập</span>
                         </div>
                         {isActive && <span className="w-1.5 h-1.5 rounded-none bg-accent" />}
                       </div>
                     )}
                 </NavLink>
             )}
         </div>

      </div>
    </div>
  );
});
MobileMenu.displayName = "MobileMenu";

export default function AppHeader() {
  const logout = useLogout();
  const hasToken = !!getAccessToken();
  const { data: me } = useAuthUser({ enabled: hasToken });
  const { cart } = useSmartCart();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCount = useMemo(() => {
    return cart?.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  }, [cart?.items]);

  const getBtnClass = useCallback((isActive = false) => {
    if (isTransparent) {
      return `rounded-gallery border border-foreground/20 bg-foreground/10 text-foreground/90 hover:bg-foreground/5 hover:text-foreground shadow-none transition-all duration-300 ${
        isActive ? "bg-foreground text-mute-foreground" : ""
      }`;
    }
    return `rounded-gallery border border-foreground/5 bg-transparent shadow-neo-sm hover:-translate-y-[1px] hover:shadow-neo-hover active:translate-y-[0.5px] active:shadow-neo-inset-sm transition-all duration-300 ${
      isActive ? "bg-surface shadow-neo-inset-sm text-accent" : "text-foreground"
    }`;
  }, [isTransparent]);

  const getNavLinkClass = useCallback((isMobile = false) => {
    return ({ isActive }: { isActive: boolean }) => {
      const base = "font-display text-[11px] tracking-[0.2em] uppercase transition-all duration-300 ease-out focus-visible:outline-none relative pb-1 rounded-gallery";
      if (isMobile) {
        return `${base} w-full text-left px-4 py-3 md:px-6 md:py-5 block bg-transparent ${
          isActive
            ? "text-accent font-medium bg-foreground/5"
            : "text-foreground/70 hover:text-accent hover:bg-foreground/5 font-normal"
        }`;
      }
      if (isTransparent) {
        return `${base} px-2 py-2 mx-2 ${
          isActive
            ? "text-foreground font-medium"
            : "text-foreground hover:text-foreground font-normal"
        }`;
      }
      return `${base} px-2 py-2 mx-2 ${
        isActive
          ? "text-accent font-medium"
          : "text-foreground/60 hover:text-accent font-normal"
      }`;
    };
  }, [isTransparent]);

  return (
    <>
      {/* Top Scrim Mask for transparent header contrast */}
      <div 
        className="fixed inset-x-0 top-0 h-32 pointer-events-none bg-gradient-to-b from-background/40 to-transparent transition-opacity duration-500 z-[45]" 
        style={{ opacity: isTransparent ? 1 : 0 }} 
      />

      {/* FULL-WIDTH GLASS HEADER */}
      <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled 
          ? "top-0 glass-panel h-14 md:h-16" 
          : "top-0 bg-transparent h-16 md:h-20"
      }`}>
        <div className="client-page-container w-full h-full">
          <div className="flex justify-between items-center w-full h-full">  

            {/* --- LEFT: LOGO --- */}
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-3.5 group focus-visible:outline-none">
                <div className="flex items-center justify-center">
                  <span className={`font-serif text-2xl font-black italic transition-colors duration-300 ${
                    isTransparent ? "text-muted" : "text-foreground"
                  }`}>E</span>
                </div>
                <div className="hidden md:flex flex-col justify-center leading-none mt-0.5">
                  <span className={`text-[12px] font-display tracking-[0.3em] font-black uppercase transition-colors duration-300 ${
                    isTransparent ? "text-muted" : "text-foreground"
                  }`}>
                    Minimalism
                  </span>
                  <span className={`text-[7px] font-mono tracking-[0.35em] font-bold uppercase mt-1.5 transition-colors duration-300 ${
                    isTransparent ? "text-muted" : "text-muted"
                  }`}>
                    Quiet Luxury
                  </span>
                </div>
              </Link>

              {/* Nav Links (Desktop) */}
              <nav className="hidden lg:flex items-center gap-1">
                <NavLink to="/" className={getNavLinkClass(false)}>
                  {({ isActive }) => (
                    <>
                      Trang chủ
                      <span className={`absolute left-0 bottom-0 w-full h-[1px] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100 ${
                        isTransparent ? "bg-foreground" : "bg-accent"
                      } ${isActive ? "scale-x-100" : ""}`} />
                    </>
                  )}
                </NavLink>
                <NavLink to="/catalog" className={getNavLinkClass(false)}>
                  {({ isActive }) => (
                    <>
                      Sản phẩm
                      <span className={`absolute left-0 bottom-0 w-full h-[1px] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100 ${
                        isTransparent ? "bg-foreground" : "bg-accent"
                      } ${isActive ? "scale-x-100" : ""}`} />
                    </>
                  )}
                </NavLink>
              </nav>
            </div>

            {/* --- CENTER: SEARCH --- */}
            <div className="hidden lg:flex flex-1 justify-center max-w-xl px-2 sm:px-6">
               <HeaderSearch isTransparent={isTransparent} />
            </div>

            {/* --- RIGHT: ACTIONS --- */}
            <div className="flex items-center gap-1 sm:gap-2">
              
              {/* Theme Toggle */}
              <div className="hidden lg:flex items-center justify-center">
                <ThemeToggle className={getBtnClass()} />
              </div>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={`hidden lg:inline-flex ${getBtnClass(location.pathname === "/wishlist")}`}
              >
                <Link to="/wishlist" aria-label="Danh sách yêu thích">
                   <HeartIcon className="w-5 h-5 stroke-[1.5]" />
                </Link>
              </Button>

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className={`relative ${getBtnClass(location.pathname === "/cart")}`}
              >
                <Link to="/cart" aria-label={`Giỏ hàng${cartCount > 0 ? ` (${cartCount} sản phẩm)` : ''}`}>
                  <ShoppingCartIcon className="w-5 h-5 stroke-[1.5]"/>
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] px-1 items-center justify-center rounded-gallery bg-accent text-accent-foreground text-[9px] font-bold shadow-none font-sans">
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Vertical divider */}
              <div className="h-4 w-px mx-2 hidden lg:block bg-foreground/20"></div>
              
              {/* User Menu */}
              {me ? (
                <div className="hidden lg:block relative" ref={userMenuRef}>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                    className={`${getBtnClass(userMenuOpen)} !p-0.5`}
                  >
                    <div className="h-[26px] w-[26px] rounded-gallery bg-foreground text-background flex items-center justify-center font-display text-[10px] font-bold">
                       {me.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </Button>

                  {userMenuOpen && (
                    <div className="absolute right-0 z-50 mt-3 w-56 origin-top-right rounded-gallery glass-panel border border-foreground/5 p-2 focus:outline-none overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 shadow-neo">
                      <div className="px-3 py-3 rounded-gallery mb-2 border-b border-foreground/5">
                        <p className="text-[9px] text-muted uppercase font-bold tracking-[0.2em] leading-none">Tài khoản</p>
                        <p className="text-[11px] font-mono text-foreground font-bold truncate mt-2 tracking-wide">{me.email}</p>
                      </div>
                      
                      <div className="space-y-0.5">
                        <Link
                          to="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] rounded-gallery font-bold transition-all text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                        >
                          <UserIcon className="w-3 h-3 md:w-4 md:h-4 stroke-[1.5]" /> Hồ sơ
                        </Link>
                        <Link
                          to="/account/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] rounded-gallery font-bold transition-all text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                        >
                          <ClipboardDocumentListIcon className="w-3 h-3 md:w-4 md:h-4 stroke-[1.5]" /> Đơn hàng
                        </Link>
                      </div>
                      
                      <div className="mt-2 pt-1 border-t border-foreground/5">
                        <button
                          onClick={() => {
                            logout.mutate();
                            setUserMenuOpen(false);
                          }}
                          className="flex w-full items-center gap-3 px-3 py-2.5 text-[10px] font-mono uppercase tracking-[0.2em] rounded-gallery font-bold transition-all text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <ArrowRightOnRectangleIcon className="w-3 h-3 md:w-4 md:h-4 stroke-[1.5]" />
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button variant="ghost" size="icon" asChild className={`hidden lg:inline-flex ml-1 ${getBtnClass(location.pathname === "/auth/login")}`}>
                  <Link to="/auth/login" className="flex items-center justify-center">
                      <UserIcon className="w-5 h-5 stroke-[1.5]" />
                  </Link>
                </Button>
              )}

              {/* Mobile Hamburger */}
              <Button
                variant="ghost"
                size="icon"
                aria-label="Mở menu điều hướng"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                className={`lg:hidden ml-1 ${getBtnClass(mobileMenuOpen)}`}
                onClick={() => setMobileMenuOpen(true)}
              >
                <Bars3Icon className="w-5 h-5 stroke-[1.5]" />
              </Button>
            </div>

          </div>
        </div>
      </header>

      {/* --- MOBILE OVERLAY MENU --- */}
      <MobileMenu 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        me={me} 
        logout={logout} 
        getNavLinkClass={getNavLinkClass} 
      />
    </>
  );
}
