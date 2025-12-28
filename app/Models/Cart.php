<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    /** @use HasFactory<\Database\Factories\CartFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
    ];

    protected $appends = ['total', 'item_count'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    protected function total(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->items->sum(fn ($item) => $item->product->price * $item->quantity),
        );
    }

    protected function itemCount(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->items->sum('quantity'),
        );
    }
}
