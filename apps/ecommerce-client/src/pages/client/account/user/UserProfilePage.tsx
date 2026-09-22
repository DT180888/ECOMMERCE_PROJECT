import { useSearchParams, Link } from "react-router-dom";
import AddressBook from "@widgets/client/Address/AddressBook";
import ProfileInfoSection from "./components/ProfileInfoSection";
import ChangePasswordSection from "./components/ChangePasswordSection";
import { useMyProfile } from "@entities/user/hooks";
import { Button } from "@my-project/ui";
import { User, MapPin } from "lucide-react";

export default function UserProfilePage() {
  const { data: profile, isLoading, error } = useMyProfile();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get("tab") === "address" ? "address" : "info";

  const setActiveTab = (tab: "info" | "address") => {
    setSearchParams({ tab });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-muted/10 rounded-button w-48" />
        <div className="h-12 bg-muted/10 rounded-button w-72" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 h-64 bg-muted/10 rounded-card" />
          <div className="lg:col-span-5 h-64 bg-muted/10 rounded-card" />
        </div>
      </div>
    );
  }

  if (error) return <div className="text-error font-bold">Lá»—i táº£i dá»¯ liá»‡u</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Back button & Title Section */}
      <div className="flex flex-col gap-4 pb-4 border-b border-muted/10">
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-wider bg-background px-3.5 py-2 rounded-button shadow-neo-sm hover:shadow-neo hover:text-foreground hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-neo-inset-sm transition-all w-fit"
        >
          â† Quay láº¡i báº£ng Ä‘iá»u khiá»ƒn
        </Link>
        <div>
          <h1 className="responsive-h3 text-foreground tracking-tight uppercase font-display">Há»“ sÆ¡ cá»§a tÃ´i</h1>
          <p className="text-muted text-xs mt-0.5">
            Quáº£n lÃ½ thÃ´ng tin cÃ¡ nhÃ¢n vÃ  báº£o máº­t tÃ i khoáº£n cá»§a báº¡n
          </p>
        </div>
      </div>

      {/* Local Tab Switcher */}
      <div className="flex bg-background p-1.5 rounded-card shadow-neo-inset-sm w-fit gap-2">
        <Button
          onClick={() => setActiveTab("info")}
          variant={activeTab === "info" ? "secondary" : "ghost"}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        >
          <User size={14} className={activeTab === "info" ? "text-primary" : "text-muted"} />
          ThÃ´ng tin & Báº£o máº­t
        </Button>
        <Button
          onClick={() => setActiveTab("address")}
          variant={activeTab === "address" ? "secondary" : "ghost"}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        >
          <MapPin size={14} className={activeTab === "address" ? "text-primary" : "text-muted"} />
          Sá»• Ä‘á»‹a chá»‰ nháº­n hÃ ng
        </Button>
      </div>

      {/* Tab Contents */}
      {activeTab === "info" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="lg:col-span-7">
            <ProfileInfoSection user={profile} />
          </div>
          <div className="lg:col-span-5">
            <ChangePasswordSection />
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <AddressBook mode="manage" pageSize={5} />
        </div>
      )}
    </div>
  );
}

