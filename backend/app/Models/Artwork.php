<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Artwork extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image',
        'artist_name',
        'price',
        'is_featured'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean'
    ];
}
