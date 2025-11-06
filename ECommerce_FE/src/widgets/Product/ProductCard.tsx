import { Link } from "react-router-dom";
import type { ProductCard as ProductCardType } from "@entities/product/types";

type Props = {
  item: ProductCardType;
  onAddToCart?: (productId: number) => void;
};

const formatVND = (minor: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(minor);

export default function ProductCard({ item, onAddToCart }: Props) {
  const to = `/product/${item.slug}-${item.productId}`;

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
      <Link to={to} className="block overflow-hidden rounded-t-2xl bg-gray-50 aspect-[4/3]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://localhost:7051/${item.primaryImageUrl || "/placeholder.svg"}`}
          alt={item.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="p-3 space-y-1.5">
        <Link to={to} className="line-clamp-2 font-medium hover:underline">
          {item.name}
        </Link>
        <div className="text-lg font-semibold">{formatVND(item.minPriceMinor)}</div>

        <div className="pt-2">
          <button
            onClick={() => onAddToCart?.(item.productId)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50 active:scale-[0.99]"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
