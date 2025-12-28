import type { Product } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { show } from '@/routes/shop';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl =
        product.image_url ||
        `https://placehold.co/400x300/png?text=${encodeURIComponent(product.name)}`;

    return (
        <Link href={show(product.id)}>
            <Card className="overflow-hidden transition-all hover:shadow-lg">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="aspect-[4/3] w-full object-cover"
                />
                <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                        {product.stock_quantity > 0 ? (
                            <Badge variant="secondary" className="shrink-0">
                                In Stock
                            </Badge>
                        ) : (
                            <Badge variant="destructive" className="shrink-0">
                                Out
                            </Badge>
                        )}
                    </div>
                    <CardDescription className="line-clamp-2">
                        {product.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                </CardContent>
            </Card>
        </Link>
    );
}
