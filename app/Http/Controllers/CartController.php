<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddToCartRequest;
use App\Http\Requests\UpdateCartItemRequest;
use App\Jobs\LowStockNotification;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $cart = auth()->user()->cart()->with('items.product')->first();

        if (!$cart) {
            $cart = null;
        }

        return Inertia::render('cart/index', [
            'cart' => $cart,
        ]);
    }

    public function store(AddToCartRequest $request): RedirectResponse
    {
        $user = auth()->user();
        $product = Product::findOrFail($request->product_id);

        if ($request->quantity > $product->stock_quantity) {
            return back()->withErrors(['quantity' => 'Not enough stock available. Only '.$product->stock_quantity.' items in stock.']);
        }

        $cart = $user->cart;

        if (!$cart) {
            $cart = Cart::create(['user_id' => $user->id]);
        }

        $existingItem = $cart->items()->where('product_id', $product->id)->first();

        if ($existingItem) {
            $newQuantity = $existingItem->quantity + $request->quantity;

            if ($newQuantity > $product->stock_quantity) {
                return back()->withErrors(['quantity' => 'Not enough stock available. Only '.$product->stock_quantity.' items in stock.']);
            }

            $existingItem->update(['quantity' => $newQuantity]);
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $request->quantity,
            ]);
        }

        if ($product->stock_quantity < 10) {
            LowStockNotification::dispatch($product);
        }

        return to_route('cart.index');
    }

    public function update(UpdateCartItemRequest $request, CartItem $cartItem): RedirectResponse
    {
        Gate::authorize('update', $cartItem);

        if ($request->quantity == 0) {
            $cartItem->delete();

            return to_route('cart.index');
        }

        if ($request->quantity > $cartItem->product->stock_quantity) {
            return back()->withErrors(['quantity' => 'Not enough stock available. Only '.$cartItem->product->stock_quantity.' items in stock.']);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        return to_route('cart.index');
    }

    public function destroy(CartItem $cartItem): RedirectResponse
    {
        Gate::authorize('delete', $cartItem);

        $cartItem->delete();

        return to_route('cart.index');
    }
}
