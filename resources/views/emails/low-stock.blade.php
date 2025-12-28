<x-mail::message>
# Low Stock Alert

**Product:** {{ $product->name }}

**Current Stock:** {{ $product->stock_quantity }} units

**Price:** ${{ number_format($product->price, 2) }}

Please restock this product soon to avoid running out of inventory.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
