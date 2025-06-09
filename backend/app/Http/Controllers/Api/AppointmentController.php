<?php

namespace App\Http\Controllers\Api;

use App\Models\Appointment;
use App\Models\Garage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AppointmentController extends ResourceController
{
    protected $modelClass = Appointment::class;
    protected $resourceName = 'appointment';

    protected function storeRules(): array
    {
        return [
            'garage_id' => 'required|exists:garages,id',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'notes' => 'nullable|string|max:1000'
        ];
    }

    public function index()
    {
        $user = Auth::user();
        $appointments = $user->appointments()->with('garage')->latest()->get();
        return $this->success($appointments);
    }

    public function store(Request $request)
    {
        $validator = $this->validateRequest($request, $this->storeRules());

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $data = $validator->validated();
        $user = Auth::user();
        
        // Check if the selected time slot is available
        $garage = Garage::findOrFail($data['garage_id']);
        $availableSlots = $garage->getAvailableTimeSlots($data['date']);
        
        if (!in_array($data['time'], $availableSlots)) {
            return $this->error('The selected time slot is not available', 422);
        }

        // Check if user already has an appointment at this time
        $existingAppointment = $user->appointments()
            ->where('date', $data['date'])
            ->where('time', $data['time'])
            ->exists();
            
        if ($existingAppointment) {
            return $this->error('You already have an appointment at this time', 422);
        }

        $appointment = $user->appointments()->create($data);
        return $this->success($appointment->load('garage'), 'Appointment created successfully', 201);
    }

    public function show($id)
    {
        $appointment = Appointment::with('garage')->find($id);
        
        if (!$appointment) {
            return $this->notFound('Appointment not found');
        }
        
        $this->authorize('view', $appointment);
        return $this->success($appointment);
    }

    public function cancel($id)
    {
        $appointment = Appointment::find($id);
        
        if (!$appointment) {
            return $this->notFound('Appointment not found');
        }
        
        $this->authorize('update', $appointment);
        
        if ($appointment->status === 'cancelled') {
            return $this->error('Appointment is already cancelled', 422);
        }
        
        $appointment->update(['status' => 'cancelled']);
        
        return $this->success($appointment, 'Appointment cancelled successfully');
    }
}
