/** Shape returned by the backend. DECIMAL columns arrive as strings ("250.00"). */
export type Fish = {
  id: number;
  name: string;
  image: string | null;
  price: string | number;
  discountPrice: string | number | null;
  createdAt: string;
  updatedAt: string;
};

export const formatPrice = (value: string | number) => `₹${Number(value)}`;

/** next/image only optimises hosts listed in next.config; anything else is served as-is. */
export const isOptimizableImage = (src: string) =>
  src.startsWith("/") || src.startsWith("https://res.cloudinary.com/");
