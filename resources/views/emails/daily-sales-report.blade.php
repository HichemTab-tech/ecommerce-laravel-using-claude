<x-mail::message>
# Daily Sales Report - {{ today()->format('F j, Y') }}

## Sales Summary

@foreach($salesData as $item)
- **{{ $item->product->name }}**: {{ $item->total_quantity }} units sold - ${{ number_format($item->total_sales, 2) }}
@endforeach

---

**Total Sales:** ${{ number_format($salesData->sum('total_sales'), 2) }}

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
