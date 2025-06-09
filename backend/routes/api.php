<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\ArtworkController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GarageController;
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

// Public routes
Route::get('/garages', [GarageController::class, 'index']);
Route::get('/garages/{garage}', [GarageController::class, 'show']);
Route::get('/garages/{garage}/available-slots/{date}', [GarageController::class, 'availableSlots']);

Route::get('/artworks', [ArtworkController::class, 'index']);
Route::get('/artworks/featured', [ArtworkController::class, 'featured']);
Route::get('/artworks/{artwork}', [ArtworkController::class, 'show']);

// Authentication routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // User routes
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Appointments
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments/{appointment}', [AppointmentController::class, 'show']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);
    Route::post('/appointments/{appointment}/cancel', [AppointmentController::class, 'cancel']);
    
    // User's appointments
    Route::get('/my-appointments', [AppointmentController::class, 'myAppointments']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    // Artworks management
    Route::post('/artworks', [ArtworkController::class, 'store']);
    Route::put('/artworks/{artwork}', [ArtworkController::class, 'update']);
    Route::delete('/artworks/{artwork}', [ArtworkController::class, 'destroy']);
    
    // Garages management
    Route::post('/garages', [GarageController::class, 'store']);
    Route::put('/garages/{garage}', [GarageController::class, 'update']);
    Route::delete('/garages/{garage}', [GarageController::class, 'destroy']);
    
    // Appointments management
    Route::get('/appointments', [AppointmentController::class, 'all']);
    Route::put('/appointments/{appointment}/status', [AppointmentController::class, 'updateStatus']);
});
