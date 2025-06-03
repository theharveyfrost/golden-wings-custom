<?php

namespace App\Http\Controllers;

use App\Models\Artwork;
use Illuminate\Http\Request;

class ArtworkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Artwork::query();
        
        // Filter by category if provided
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }
        
        $artworks = $query->latest()->get();
        
        return response()->json($artworks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
        ]);

        // Handle file upload
        $imagePath = $request->file('image')->store('artworks', 'public');

        $artwork = Artwork::create([
            'title' => $request->title,
            'description' => $request->description,
            'image' => $imagePath,
            'category' => $request->category,
            'is_featured' => $request->is_featured ?? false,
        ]);

        return response()->json($artwork, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Artwork $artwork)
    {
        return response()->json($artwork);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Artwork $artwork)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'category' => 'nullable|string|max:100',
            'is_featured' => 'boolean',
        ]);

        $data = $request->only(['title', 'description', 'category', 'is_featured']);

        // Handle file upload if a new image is provided
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('artworks', 'public');
            $data['image'] = $imagePath;
        }

        $artwork->update($data);

        return response()->json($artwork);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Artwork $artwork)
    {
        $artwork->delete();

        return response()->json(['message' => 'Artwork deleted successfully']);
    }
    
    /**
     * Get featured artworks.
     */
    public function featured()
    {
        $featuredArtworks = Artwork::where('is_featured', true)->latest()->get();
        
        return response()->json($featuredArtworks);
    }
}