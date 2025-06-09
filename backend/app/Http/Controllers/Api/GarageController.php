<?php

namespace App\Http\Controllers\Api;

use App\Models\Garage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GarageController extends ResourceController
{
    protected $modelClass = Garage::class;
    protected $resourceName = 'garage';

    protected function storeRules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|max:2048',
            'max_appointments_per_day' => 'integer|min:1|max:10'
        ];
    }
    public function store(Request $request)
    {
        $validator = $this->validateRequest($request, $this->storeRules());

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $data = $request->all();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('garages', 'public');
            $data['image'] = $path;
        }

        $garage = Garage::create($data);
        return $this->success($garage, 'Garage created successfully', 201);
    }
    
    public function availableSlots(Garage $garage, $date)
    {
        $availableSlots = $garage->getAvailableTimeSlots($date);
        return $this->success([
            'garage' => $garage,
            'date' => $date,
            'available_slots' => $availableSlots
        ]);
    }
}
