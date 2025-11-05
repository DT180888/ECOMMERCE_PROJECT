import { Button } from "@shared/ui/Button";

export type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
};

export default function ProductCard({ id, name, price, image }: ProductCardProps) {
  return (
    <div className="rounded-xl border bg-white p-3 transition-shadow hover:shadow-md">
      <a href={`/catalog/${id}`} className="block overflow-hidden rounded-md">
        <img src={image} alt={name} className="h-40 w-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
      </a>
      <div className="mt-3 space-y-1">
        <a href={`/catalog/${id}`} className="line-clamp-1 font-medium hover:underline">{name}</a>
        <p className="text-sm text-gray-600">{price.toLocaleString("vi-VN")}₫</p>
      </div>
      <div className="mt-3">
        <Button className="w-full" onClick={() => alert(`Thêm ${name} vào giỏ (demo)`)}>Thêm vào giỏ</Button>
      </div>
    </div>
  );
}
