<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Resources\Json\JsonResource;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $products = Product::query()
            ->orderBy('created_at', 'desc')
            ->paginate(12);

        return Inertia::render('shop/index', [
            'products' => JsonResource::collection($products),
        ]);
    }

    public function show(Product $product): Response
    {
        return Inertia::render('shop/show', [
            'product' => $product,
        ]);
    }
}
