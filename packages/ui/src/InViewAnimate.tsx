import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";
import { cn } from "./utils";

type Props = {
  children: ReactNode;
  delay?: number; // Độ trễ animation (ms)
};

export default function InViewAnimate({ children, delay = 0 }: Props) {
  const { ref, inView } = useInView({
    triggerOnce: true, // Chỉ chạy 1 lần
    threshold: 0.1,    // Hiện 20% là chạy
  });

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out transform h-full",
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      )}
    >
      {children}
    </div>
  );
}