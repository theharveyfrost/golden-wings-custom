<?php

namespace Database\Seeders;

use App\Models\Garage;
use Illuminate\Database\Seeder;

class GarageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $garages = [
            [
                'name' => 'Golden Wings Casablanca Main',
                'address' => '123 Main Street',
                'city' => 'Casablanca',
                'phone' => '+212-522-123456',
                'email' => 'casablanca@goldenwings.com',
                'description' => 'Our flagship garage in Casablanca offering all services.',
            ],
            [
                'name' => 'Golden Wings Rabat',
                'address' => '456 Avenue Mohammed V',
                'city' => 'Rabat',
                'phone' => '+212-537-789012',
                'email' => 'rabat@goldenwings.com',
                'description' => 'Specialized in custom painting and bodywork.',
            ],
            [
                'name' => 'Golden Wings Marrakech',
                'address' => '789 Rue Majorelle',
                'city' => 'Marrakech',
                'phone' => '+212-524-345678',
                'email' => 'marrakech@goldenwings.com',
                'description' => 'Luxury car customization and maintenance.',
            ],
        ];

        foreach ($garages as $garage) {
            Garage::create($garage);
        }
    }
}