<?php

namespace App\Jobs;

use App\Mail\DailySalesReportMail;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class DailySalesReport implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $salesData = Order::today()
            ->with('items.product')
            ->get()
            ->flatMap(fn ($order) => $order->items)
            ->groupBy('product_id')
            ->map(function ($items) {
                $product = $items->first()->product;

                return (object) [
                    'product' => $product,
                    'total_quantity' => $items->sum('quantity'),
                    'total_sales' => $items->sum(fn ($item) => $item->quantity * $item->price),
                ];
            });

        if ($salesData->isNotEmpty()) {
            Mail::to('admin@example.com')->send(new DailySalesReportMail($salesData));
        }
    }
}
