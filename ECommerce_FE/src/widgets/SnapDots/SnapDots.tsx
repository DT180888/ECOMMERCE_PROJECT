import { useEffect, useState } from "react";

type Props = { ids: string[] };

export default function SnapDots({ ids }: Props) {
  const [active, setActive] = useState<string>(ids[0]);

  useEffect(() => {
    const sections = ids
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            setActive(e.target.id);
            // cập nhật hash (tuỳ chọn)
            history.replaceState(null, "", `#${e.target.id}`);
          }
        });
      },
      { threshold: [0.6] }
    );

    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [ids]);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-2">
      {ids.map(id => (
        <a
          key={id}
          href={`#${id}`}
          className={[
            "h-2.5 w-2.5 rounded-full transition",
            active === id ? "bg-gray-900" : "bg-gray-300 hover:bg-gray-400"
          ].join(" ")}
          aria-label={`Go to ${id}`}
        />
      ))}
    </div>
  );
}
