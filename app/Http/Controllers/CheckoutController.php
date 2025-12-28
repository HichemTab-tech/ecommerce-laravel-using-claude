<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\RedirectResponse;

class CheckoutController extends Controller
{
    public function store(): RedirectResponse
    {
        $user = auth()->user();
        $cart = $user->cart()->with('items.product')->first();

        if (!$cart || $cart->items->isEmpty()) {
            return back()->withErrors(['cart' => 'Your cart is empty.']);
        }

        $order = Order::create([
            'user_id' => $user->id,
            'total' => $cart->total,
            'status' => 'completed',
        ]);

        foreach ($cart->items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->product->price,
            ]);
        }

        $cart->items()->delete();

        return to_route('cart.index')->with('success', 'Order placed successfully!');
    }
}
