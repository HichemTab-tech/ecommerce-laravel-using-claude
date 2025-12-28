import AppLayout from '@/layouts/app-layout';
import ProductCard from '@/components/product-card';
import type { Product, SharedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export default function Index({
    products,
}: SharedData & {
    products: PaginatedProducts;
}) {
    console.log("products :", products);
    return (
        <>
            <Head title="Shop" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
                    <p className="text-muted-foreground">
                        Browse our collection of products
                    </p>
                </div>

                {products.data.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            No products available
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {products.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                {products.links[0].url && (
                                    <Link href={products.links[0].url}>
                                        <Button variant="outline" size="sm">
                                            <ChevronLeft className="size-4" />
                                            Previous
                                        </Button>
                                    </Link>
                                )}

                                <span className="text-sm text-muted-foreground">
                                    Page {products.current_page} of {products.last_page}
                                </span>

                                {products.links[products.links.length - 1].url && (
                                    <Link
                                        href={products.links[products.links.length - 1].url??undefined}
                                    >
                                        <Button variant="outline" size="sm">
                                            Next
                                            <ChevronRight className="size-4" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
