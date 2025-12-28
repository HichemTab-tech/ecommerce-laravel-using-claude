import AppLayout from '@/layouts/app-layout';
import type { Product, SharedData } from '@/types';
import { Head, Form } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import { store } from '@/routes/cart';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function Show({
    product,
    auth,
}: SharedData & {
    product: Product;
}) {
    const [quantity, setQuantity] = useState(1);
    const imageUrl = product.image_url || `https://placehold.co/600x400/png?text=${encodeURIComponent(product.name)}`;

    return (
        <>
            <Head title={product.name} />

            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full rounded-lg object-cover"
                    />
                </div>

                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
                        <p className="mt-2 text-3xl font-bold">${product.price.toFixed(2)}</p>
                    </div>

                    <div>
                        {product.stock_quantity > 0 ? (
                            <Badge variant="default">{product.stock_quantity} in stock</Badge>
                        ) : (
                            <Badge variant="destructive">Out of stock</Badge>
                        )}
                    </div>

                    <p className="text-muted-foreground">{product.description}</p>

                    {auth?.user ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Add to Cart</CardTitle>
                                <CardDescription>
                                    {product.stock_quantity > 0
                                        ? 'Select quantity to add to your cart'
                                        : 'This product is currently out of stock'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...store.form()}>
                                    {({ processing, errors }) => (
                                        <div className="space-y-4">
                                            <input type="hidden" name="product_id" value={product.id} />

                                            <div className="space-y-2">
                                                <Label htmlFor="quantity">Quantity</Label>
                                                <Input
                                                    id="quantity"
                                                    name="quantity"
                                                    type="number"
                                                    min="1"
                                                    max={product.stock_quantity}
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                    disabled={product.stock_quantity === 0 || processing}
                                                />
                                                <InputError message={errors.quantity} />
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={product.stock_quantity === 0 || processing}
                                                className="w-full"
                                            >
                                                <ShoppingCart className="mr-2 size-4" />
                                                {processing ? 'Adding...' : 'Add to Cart'}
                                            </Button>
                                        </div>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">
                                    Please log in to add items to your cart
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

Show.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
