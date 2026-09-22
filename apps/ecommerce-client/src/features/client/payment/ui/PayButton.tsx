import { useCreatePaymentUrl } from "@entities/payment/hooks";
import { Button } from "@my-project/ui";
import { useToast } from "@my-project/ui";

interface PayButtonProps {
  orderId: number;
  // ThÃªm cÃ¡c props tÃ¹y chá»n Ä‘á»ƒ custom tá»« bÃªn ngoÃ i
  className?: string;
  children?: React.ReactNode;
}

export const PayButton = ({ orderId, className, children }: PayButtonProps) => {
  const { mutate, isPending } = useCreatePaymentUrl();
  const toast = useToast();

  const handlePayment = () => {
    // Sá»­a láº¡i returnUrl cho Ä‘Ãºng route checkout/result
    const returnUrl = `${window.location.origin}/checkout/result`;

    mutate(
      { orderId, returnUrl },
      {
        onSuccess: (data: { paymentUrl?: string }) => {
          // âŒ CÅ©: if (data.url) ... window.location.href = data.url;
          // âœ… Má»šI: Äá»•i thÃ nh paymentUrl
          if (data.paymentUrl) {
            toast.info("Äang chuyá»ƒn hÆ°á»›ng...", 2000);
           let finalUrl = data.paymentUrl;

            // Kiá»ƒm tra náº¿u URL chá»©a IP cá»§a Android Emulator thÃ¬ Ä‘á»•i thÃ nh localhost
            if (finalUrl.includes("10.0.2.2")) {
                finalUrl = finalUrl.replace("10.0.2.2", "localhost");
            }

            // Redirect sang URL Ä‘Ã£ sá»­a
            window.location.href = finalUrl;
          } else {
            toast.error("Lá»—i: KhÃ´ng cÃ³ link thanh toÃ¡n.");
          }
        },
        // ...
      }
    );
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isPending}
      // Æ¯u tiÃªn className truyá»n vÃ o, náº¿u khÃ´ng cÃ³ thÃ¬ dÃ¹ng máº·c Ä‘á»‹nh
      className={
        className ||
        "w-full font-bold py-3"
      }
    >
      {/* Náº¿u cÃ³ children thÃ¬ hiá»ƒn thá»‹, khÃ´ng thÃ¬ hiá»ƒn thá»‹ máº·c Ä‘á»‹nh */}
      {isPending ? "Äang xá»­ lÃ½..." : children || "Thanh toÃ¡n ngay (Mock)"}
    </Button>
  );
};

export default PayButton;


