<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            [
                'name' => 'General Visit/Consultation',
                'slug' => 'visit',
                'description' => 'Initial consultation to discuss your vehicle customization needs.',
                'price' => 0.00,
                'duration' => 60,
            ],
            [
                'name' => 'Part Replacement',
                'slug' => 'part-replacement',
                'description' => 'Replace parts with custom or performance alternatives.',
                'price' => 500.00,
                'duration' => 180,
            ],
            [
                'name' => 'Customization',
                'slug' => 'customization',
                'description' => 'Full vehicle customization services.',
                'price' => 2000.00,
                'duration' => 480,
            ],
            [
                'name' => 'Painting',
                'slug' => 'painting',
                'description' => 'Custom paint jobs and finishes.',
                'price' => 1500.00,
                'duration' => 360,
            ],
            [
                'name' => 'Interior Work',
                'slug' => 'interior-work',
                'description' => 'Custom interior modifications and upgrades.',
                'price' => 1200.00,
                'duration' => 300,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}