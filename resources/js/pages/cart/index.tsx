import AppLayout from '@/layouts/app-layout';
import type { Cart, SharedData } from '@/types';
import { Head, Link, Form } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { index as shop } from '@/routes/shop';
import { update, destroy } from '@/routes/cart';
import { store as checkout } from '@/routes/checkout';
import InputError from '@/components/input-error';

export default function Index({
    cart,
}: SharedData & {
    cart: Cart | null;
}) {
    if (!cart || cart.items.length === 0) {
        return (
            <>
                <Head title="Shopping Cart" />

                <div className="text-center py-12">
                    <h1 className="text-3xl font-bold tracking-tight mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-6">
                        Start adding some products to your cart
                    </p>
                    <Link href={shop()}>
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Shopping Cart" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
                    <Link href={shop()}>
                        <Button variant="outline">Continue Shopping</Button>
                    </Link>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => {
                            console.log("item", item, item.subtotal);
                            const imageUrl =
                                item.product.image_url ||
                                `https://placehold.co/200x200/png?text=${encodeURIComponent(item.product.name)}`;

                            return (
                                <Card key={item.id}>
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <img
                                                src={imageUrl}
                                                alt={item.product.name}
                                                className="size-24 rounded-md object-cover"
                                            />

                                            <div className="flex-1 space-y-2">
                                                <h3 className="font-semibold">{item.product.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    ${item.product.price.toFixed(2)} each
                                                </p>

                                                <div className="flex items-center gap-2">
                                                    <Form action={update(item.id)}>
                                                        {({ processing, errors }) => (
                                                            <div className="flex items-center gap-2">
                                                                <Input
                                                                    type="number"
                                                                    name="quantity"
                                                                    min="0"
                                                                    max={item.product.stock_quantity}
                                                                    defaultValue={item.quantity}
                                                                    className="w-20"
                                                                    onBlur={(e) => {
                                                                        if (
                                                                            parseInt(e.target.value) !==
                                                                            item.quantity
                                                                        ) {
                                                                            e.target.form?.requestSubmit();
                                                                        }
                                                                    }}
                                                                    disabled={processing}
                                                                />
                                                                {errors.quantity && (
                                                                    <InputError message={errors.quantity} />
                                                                )}
                                                            </div>
                                                        )}
                                                    </Form>

                                                    <Form action={destroy(item.id)}>
                                                        {({ processing }) => (
                                                            <Button
                                                                type="submit"
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={processing}
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        )}
                                                    </Form>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    ${item.subtotal.toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div>
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${cart.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>${cart.total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Form {...checkout.form()}>
                                    {({ processing }) => (
                                        <Button type="submit" className="w-full" disabled={processing}>
                                            {processing ? 'Processing...' : 'Checkout'}
                                        </Button>
                                    )}
                                </Form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
