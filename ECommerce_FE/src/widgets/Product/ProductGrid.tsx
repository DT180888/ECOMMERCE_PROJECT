import ProductCard, { ProductCardProps } from "./ProductCard";

export type ProductGridProps = {
  products: ProductCardProps[];
  isLoading?: boolean;
};

export default function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border bg-white p-3">
            <div className="h-40 w-full rounded-md bg-gray-200" />
            <div className="mt-3 h-4 w-2/3 rounded bg-gray-200" />
            <div className="mt-2 h-4 w-1/3 rounded bg-gray-200" />
            <div className="mt-4 h-9 w-full rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map(p => <ProductCard key={p.id} {...p} />)}
    </div>
  );
}
