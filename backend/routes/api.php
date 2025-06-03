<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication Routes
Route::post('/register', [App\Http\Controllers\Auth\AuthController::class, 'register']);
Route::post('/login', [App\Http\Controllers\Auth\AuthController::class, 'login']);
Route::post('/logout', [App\Http\Controllers\Auth\AuthController::class, 'logout'])->middleware('auth:sanctum');

// Appointment Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('appointments', App\Http\Controllers\AppointmentController::class);
});

// Garage Routes
Route::get('/garages', [App\Http\Controllers\GarageController::class, 'index']);

// Service Routes
Route::get('/services', [App\Http\Controllers\ServiceController::class, 'index']);

// Artwork Routes
Route::apiResource('artworks', App\Http\Controllers\ArtworkController::class);
Route::get('/artworks/featured', [App\Http\Controllers\ArtworkController::class, 'featured']);