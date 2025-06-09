<?php

namespace Database\Seeders;

use App\Models\Garage;
use Illuminate\Database\Seeder;

class GarageSeeder extends Seeder
{
    public function run()
    {
        $garages = [
            [
                'name' => 'Part Replacement',
                'description' => 'Replacement of damaged vehicle parts',
                'max_appointments_per_day' => 4,
            ],
            [
                'name' => 'Customization',
                'description' => 'Providing new parts and visual upgrades',
                'max_appointments_per_day' => 4,
            ],
            [
                'name' => 'Painting',
                'description' => 'Professional painting and color changes',
                'max_appointments_per_day' => 4,
            ],
            [
                'name' => 'Interior Work',
                'description' => 'Interior repairs and custom upholstery',
                'max_appointments_per_day' => 4,
            ],
        ];

        foreach ($garages as $garage) {
            Garage::create($garage);
        }
    }
}
