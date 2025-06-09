<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Garage extends Model
{
    protected $fillable = [
        'name',
        'description',
        'image',
        'max_appointments_per_day'
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function getAvailableTimeSlots($date)
    {
        // Define working hours (9 AM to 5 PM)
        $startTime = strtotime('09:00');
        $endTime = strtotime('17:00');
        $interval = 60 * 60; // 1 hour interval
        
        // Get booked time slots for the given date
        $bookedSlots = $this->appointments()
            ->whereDate('appointment_date', $date)
            ->pluck('appointment_time')
            ->map(function ($time) {
                return strtotime($time);
            })
            ->toArray();

        // Generate all possible time slots
        $allSlots = [];
        for ($time = $startTime; $time < $endTime; $time += $interval) {
            $allSlots[] = $time;
        }

        // Filter out booked slots
        $availableSlots = array_diff($allSlots, $bookedSlots);
        
        // Format the available slots
        return array_map(function ($time) {
            return date('H:i', $time);
        }, $availableSlots);
    }
}
