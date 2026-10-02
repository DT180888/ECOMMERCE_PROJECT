import { Link } from "react-router-dom";
import { ProductCard as ProductCardType } from "@my-project/api";
import { buildImgSrc } from "@my-project/shared-utils";
import { DEFAULT_PRODUCT_IMAGE_URL } from "@my-project/shared-utils";
import { EditorialProductCard } from "@my-project/ui";

type Props = {
  item: ProductCardType;
  onAddToCart?: (productId: number) => void;
  onToggleWishlist?: (productId: number) => void;
  isWishlisted?: boolean;
};

export default function ProductCard({ item, onAddToCart, onToggleWishlist, isWishlisted }: Props) {
  const to = `/product/${item.slug}-${item.productId}`;
  const serverImg = buildImgSrc(item.thumbnailUrl ?? undefined);
  const finalSrc = serverImg || DEFAULT_PRODUCT_IMAGE_URL;
  const isOutOfStock = item.skuCount === 0;

  return (
    <EditorialProductCard
      id={item.productId}
      name={item.name}
      price={item.minPriceMinor}
      imageUrl={finalSrc}
      brandName={item.brandName || "Luxury Collection"}
      variantsText="Tuyển chọn hữu cơ"
      detailUrl={to}
      isOutOfStock={isOutOfStock}
      isWishlisted={isWishlisted}
      quickBuyLabel="CHỌN SIZE"
      onQuickBuy={onAddToCart ? () => onAddToCart(item.productId) : undefined}
      onToggleWishlist={onToggleWishlist ? () => onToggleWishlist(item.productId) : undefined}
      renderLink={({ to: linkTo, className, children }) => (
        <Link to={linkTo} className={className}>
          {children}
        </Link>
      )}
    />
  );
}
