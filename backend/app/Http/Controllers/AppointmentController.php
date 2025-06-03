<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $appointments = $request->user()->appointments()
            ->with(['garage', 'service'])
            ->orderBy('appointment_date', 'desc')
            ->get();
            
        return response()->json($appointments);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'garage_id' => 'required|exists:garages,id',
            'service_id' => 'required|exists:services,id',
            'appointment_date' => 'required|date|after:now',
            'notes' => 'nullable|string',
        ]);

        $appointment = $request->user()->appointments()->create([
            'garage_id' => $request->garage_id,
            'service_id' => $request->service_id,
            'appointment_date' => $request->appointment_date,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        return response()->json($appointment->load(['garage', 'service']), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Appointment $appointment)
    {
        // Check if the appointment belongs to the authenticated user
        if ($appointment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($appointment->load(['garage', 'service']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Appointment $appointment)
    {
        // Check if the appointment belongs to the authenticated user
        if ($appointment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'garage_id' => 'sometimes|required|exists:garages,id',
            'service_id' => 'sometimes|required|exists:services,id',
            'appointment_date' => 'sometimes|required|date|after:now',
            'notes' => 'nullable|string',
        ]);

        $appointment->update($request->only([
            'garage_id',
            'service_id',
            'appointment_date',
            'notes',
        ]));

        return response()->json($appointment->load(['garage', 'service']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Appointment $appointment)
    {
        // Check if the appointment belongs to the authenticated user
        if ($appointment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $appointment->delete();

        return response()->json(['message' => 'Appointment deleted successfully']);
    }
}