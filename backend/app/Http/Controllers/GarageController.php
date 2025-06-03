<?php

namespace App\Http\Controllers;

use App\Models\Garage;
use Illuminate\Http\Request;

class GarageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $garages = Garage::all();
        
        return response()->json($garages);
    }
}