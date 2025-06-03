<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'garage_id',
        'service_id',
        'appointment_date',
        'status',
        'notes',
    ];
    
    protected $casts = [
        'appointment_date' => 'datetime',
    ];
    
    /**
     * Get the user that owns the appointment.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the garage that the appointment is for.
     */
    public function garage()
    {
        return $this->belongsTo(Garage::class);
    }
    
    /**
     * Get the service that the appointment is for.
     */
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}