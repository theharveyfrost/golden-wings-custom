<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Garage extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'address',
        'city',
        'phone',
        'email',
        'description',
        'image',
    ];
    
    /**
     * Get the appointments for the garage.
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}