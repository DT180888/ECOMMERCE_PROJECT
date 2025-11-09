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
    // Thay đổi chính ở đây
    <div
      className="group rounded-xl p-4
                 bg-white/10 backdrop-blur-md text-white
                 transition hover:bg-white/20 hover:shadow-lg
                 border border-white/20" // Viền nhẹ để tạo cảm giác riêng biệt
    >
      <Link to={to} className="block overflow-hidden rounded-xl bg-white/20 aspect-[4/3] mb-4">
        <img
          src={`https://localhost:7051/${item.primaryImageUrl || "/placeholder.svg"}`}
          alt={item.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="space-y-2"> {/* Tăng nhẹ khoảng cách */}
        <Link to={to} className="line-clamp-2 font-medium hover:underline text-lg"> {/* Tăng font cho tên */}
          {item.name}
        </Link>
        <div className="text-xl font-bold text-gray-100">{formatVND(item.minPriceMinor)}</div> {/* Font lớn hơn, đậm hơn */}

        <div className="pt-3"> {/* Tăng khoảng cách từ giá đến nút */}
          <button
            onClick={() => onAddToCart?.(item.productId)}
            className="w-full rounded-xl bg-white/30 text-white
                       px-4 py-2 text-base font-semibold
                       hover:bg-white/40 active:scale-[0.99] transition"
          >
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}