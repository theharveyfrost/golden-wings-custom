<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Handle user registration
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            // Log the incoming request data for debugging
            \Log::info('Registration attempt', $request->all());

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ]);

            // Create the user
            $user = User::create([
                'name' => $validated['name'],
                'username' => $validated['username'],
                'email' => $validated['email'],
                'password' => bcrypt($validated['password']),
                'is_admin' => false,
            ]);

            // Create a new API token for the user
            $token = $user->createToken('auth_token')->plainTextToken;

            // Log successful registration
            \Log::info('User registered successfully', ['user_id' => $user->id]);

            // Return the token and user data
            return $this->success([
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $user,
            ], 'Registration successful', 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // Log validation errors
            \Log::error('Registration validation failed', ['errors' => $e->errors()]);
            return $this->error('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            // Log any other errors
            \Log::error('Registration error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return $this->error('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Handle user login
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return $this->success([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 'Login successful');
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        
        return $this->success(null, 'Successfully logged out');
    }
}
