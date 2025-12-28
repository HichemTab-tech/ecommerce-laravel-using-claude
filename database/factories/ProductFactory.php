<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $productNames = [
            'Wireless Headphones',
            'Smart Watch',
            'Laptop Stand',
            'Mechanical Keyboard',
            'USB-C Hub',
            'Monitor Arm',
            'Desk Mat',
            'Webcam',
            'Blue Light Glasses',
            'Ergonomic Mouse',
            'Phone Charger',
            'Portable SSD',
            'Cable Organizer',
            'LED Desk Lamp',
            'Wireless Mouse',
        ];

        $name = fake()->randomElement($productNames).' '.fake()->word();

        return [
            'name' => $name,
            'description' => fake()->paragraph(3),
            'price' => fake()->randomFloat(2, 9.99, 999.99),
            'stock_quantity' => fake()->numberBetween(10, 100),
            'image_url' => 'https://placehold.co/600x400/png?text='.urlencode($name),
        ];
    }

    public function lowStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => fake()->numberBetween(1, 9),
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }
}
