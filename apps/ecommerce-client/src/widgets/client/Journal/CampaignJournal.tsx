import { useState } from "react";
import { InViewAnimate } from "@my-project/ui";
import { Mail, ArrowRight, Loader2, Check, AlertCircle } from "lucide-react";

export default function CampaignJournal() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setEmail("");
      
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error("Subscription error:", err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <div className="w-full bg-background overflow-hidden select-none">
      <InViewAnimate>
        <div className="client-page-container">
          
          {/* Header Section */}
          <div className="space-y-3 mb-8 md:mb-16 pb-4 md:pb-6 border-b border-foreground/5">
            <span className="text-[10px] md:text-xs font-mono text-muted tracking-[0.5em] uppercase block font-medium">
              04 / JOURNAL / THE WORLD OF BRAND
            </span>
            <h2 className="responsive-h2 text-foreground uppercase font-serif tracking-[-0.03em] leading-[1.1]">
              THƯƠNG HIỆU &
              <span className="italic font-light text-muted"> CẢM HỨNG</span>
            </h2>
          </div>

          {/* Tier 1: Triangular Editorial Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-start mb-10 md:mb-20">
            
            {/* Top-Left: Large Featured Article Showcase */}
            <div className="lg:col-span-7 space-y-6 group cursor-pointer">
              <div className="w-full aspect-[16/10] overflow-hidden rounded-gallery bg-foreground/[0.02] relative">
                <img
                  src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
                  alt="Craftsmanship details"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] scale-100 group-hover:scale-[1.02] filter contrast-[0.95] sepia-[0.1] hover:sepia-0"
                />
                <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono bg-foreground/5 px-2 py-0.5 rounded-button text-muted tracking-wider uppercase font-semibold">
                    FEATURED STORY
                  </span>
                  <span className="text-[10px] font-mono text-muted tracking-widest uppercase font-bold">
                    Material & Sourcing
                  </span>
                </div>
                <h3 className="responsive-h3 text-foreground font-serif uppercase tracking-tight leading-snug">
                  CHRONICLES OF NATURAL COTTON & PREMIUM LINEN
                </h3>
                <p className="font-body text-sm text-muted leading-relaxed max-w-2xl">
                  Tracing our sourcing journey from organic farms to clean-energy spinning mills. Every thread is selected to create a breathable, soft clay texture.
                </p>
              </div>
            </div>

            {/* Right Side (Completing the Triangle) */}
            <div className="lg:col-span-5 flex flex-col gap-8 md:gap-12 lg:pl-4">
              
              {/* Top-Right: Monospace Index Directory */}
              <div className="space-y-6">
                <span className="text-[10px] font-mono text-muted tracking-[0.3em] uppercase block font-medium">
                  04 / JOURNAL INDEX
                </span>
                <div className="space-y-4">
                  {[
                    { date: "30.05.2026", title: "Natural Cotton Chronicles", time: "4 min read" },
                    { date: "24.05.2026", title: "Architectural Tailoring Study", time: "6 min read" },
                    { date: "15.05.2026", title: "Monochrome & Pastels Tone", time: "3 min read" },
                    { date: "08.05.2026", title: "Tactile Minimalist Workspace", time: "5 min read" },
                  ].map((item, index) => (
                    <div key={index} className="group/item py-2 cursor-pointer border-b border-foreground/5 last:border-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-[9px] font-mono text-muted">
                          {item.date}
                        </span>
                        <span className="text-[9px] font-mono text-muted">
                          {item.time}
                        </span>
                      </div>
                      <span className="text-xs font-display font-medium text-foreground group-hover/item:text-accent transition-colors duration-300 block leading-tight">
                        {item.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom-Right: Brand Philosophy Quote & Border Detail */}
              <div className="border-t border-foreground/5 pt-8 space-y-4">
                <span className="text-[9px] font-mono text-muted tracking-[0.3em] uppercase block font-medium">
                  04 / PHILOSOPHY
                </span>
                <p className="font-serif text-sm italic text-muted leading-relaxed">
                  "Sự tinh tế không nằm ở sự phô trương, mà ẩn mình trong những chi tiết đơn giản nhất. Mỗi câu chuyện là một hành trình tìm kiếm chất liệu tự nhiên thuần bản."
                </p>
              </div>

            </div>

          </div>

          {/* Tier 2: Newsletter Postcard (Apex / Base Center) */}
          <div className="w-full border-t border-foreground/5 pt-12">
            <div className="bg-background glass-panel border border-foreground/5 p-8 md:p-12 rounded-card shadow-neo-sm relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 max-w-4xl mx-auto">
              
              {/* Left Postcard Details */}
              <div className="flex flex-col justify-between h-full space-y-6 md:max-w-md">
                <div className="flex justify-between items-start w-full">
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-muted tracking-widest uppercase font-bold block">
                      SUBSCRIBE CARD
                    </span>
                    <h4 className="font-serif text-xl md:text-2xl text-foreground uppercase tracking-tight leading-tight">
                      THE AUTUMN<br />
                      JOURNAL '26
                    </h4>
                  </div>
                </div>

                <p className="font-body text-xs text-muted leading-relaxed">
                  Đăng ký nhận bản tin để cập nhật những bài viết thời trang mới nhất, thông tin bộ sưu tập độc quyền và nhận ưu đãi đặc quyền sớm.
                </p>
                
                <span className="text-[8px] font-mono text-muted uppercase tracking-widest block">
                  Unsubscribe at any time.
                </span>
              </div>

              {/* Right stamp and form */}
              <div className="w-full md:w-80 flex flex-col gap-6 relative">
                
                {/* Vintage Postage Stamp Detail */}
                <div className="absolute -top-16 right-0 w-12 h-16 border border-dashed border-muted/40 flex flex-col items-center justify-center p-1 select-none bg-background/50 backdrop-blur-sm transition-transform duration-500 hover:rotate-3">
                  <span className="text-[8px] font-mono text-muted/60 uppercase tracking-widest leading-none">POST</span>
                  <span className="text-[8px] font-mono text-muted/60 uppercase tracking-widest leading-none mt-1">STAMP</span>
                  <span className="text-[7px] font-mono text-muted/40 mt-2">EST. 2026</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 w-full mt-4">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      disabled={status === 'loading' || status === 'success'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Địa chỉ email của bạn..."
                      aria-label="Địa chỉ email"
                      className={`w-full rounded-button bg-background shadow-neo-inset px-4 py-3 text-xs text-foreground placeholder-muted/60 outline-none transition-all duration-300 disabled:opacity-50 border ${
                        status === 'error' 
                          ? 'border-error/40 focus:border-error ring-1 ring-error/20' 
                          : status === 'success'
                          ? 'border-success/40'
                          : 'border-foreground/8 focus:border-accent focus:ring-2 focus:ring-accent/30'
                      }`}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    aria-label="Đăng ký bản tin"
                    className={`w-full rounded-button text-[9px] font-mono tracking-widest font-bold py-3 transition-all duration-300 ease-out flex items-center justify-center gap-2 uppercase border ${
                      status === 'success'
                        ? 'text-success border-success/30 bg-success/10 shadow-none'
                        : 'bg-foreground text-background border-transparent shadow-neo-sm hover:-translate-y-[1px] hover:shadow-neo-hover active:translate-y-[0.5px] active:shadow-neo-inset-sm'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : status === 'success' ? (
                      <>
                        <span>SUBSCRIBED</span>
                        <Check className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>SUBSCRIBE NOW</span>
                        <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  {/* Message Indicator with Fade In */}
                  <div className="h-4 flex items-center px-1">
                    {status === 'error' && (
                      <div className="flex items-center gap-1.5 text-error animate-[fadeIn_0.3s_ease-out_both]">
                        <AlertCircle className="w-3 h-3" />
                        <p className="text-[9px] font-mono uppercase tracking-wider">Lỗi. Vui lòng thử lại.</p>
                      </div>
                    )}
                    {status === 'success' && (
                      <div className="flex items-center gap-1.5 text-success animate-[fadeIn_0.3s_ease-out_both]">
                        <Check className="w-3 h-3" />
                        <p className="text-[9px] font-mono uppercase tracking-wider">Đăng ký thành công!</p>
                      </div>
                    )}
                  </div>
                </form>
              </div>

            </div>
          </div>

        </div>
      </InViewAnimate>
    </div>
  );
}