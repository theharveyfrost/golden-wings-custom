<?php

namespace App\Http\Controllers\Api;

use App\Models\Artwork;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ArtworkController extends ResourceController
{
    protected $modelClass = Artwork::class;
    protected $resourceName = 'artwork';

    protected function storeRules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|max:2048',
            'artist_name' => 'required|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'is_featured' => 'boolean'
        ];
    }
    public function store(Request $request)
    {
        $validator = $this->validateRequest($request, $this->storeRules());

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $data = $request->all();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('artworks', 'public');
            $data['image'] = $path;
        }

        $artwork = Artwork::create($data);
        return $this->success($artwork, 'Artwork created successfully', 201);
    }

    public function update(Request $request, $id)
    {
        $artwork = Artwork::find($id);

        if (!$artwork) {
            return $this->notFound('Artwork not found');
        }

        $validator = $this->validateRequest($request, $this->updateRules());

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $data = $request->all();

        if ($request->hasFile('image')) {
            // Delete old image
            if ($artwork->image) {
                Storage::disk('public')->delete($artwork->image);
            }
            $path = $request->file('image')->store('artworks', 'public');
            $data['image'] = $path;
        }

        $artwork->update($data);
        return $this->success($artwork, 'Artwork updated successfully');
    }

    public function destroy($id)
    {
        $artwork = Artwork::find($id);

        if (!$artwork) {
            return $this->notFound('Artwork not found');
        }

        if ($artwork->image) {
            Storage::disk('public')->delete($artwork->image);
        }
        
        $artwork->delete();
        return $this->success(null, 'Artwork deleted successfully');
    }

    /**
     * Get featured artworks
     *
     * @return JsonResponse
     */
    public function featured()
    {
        $featuredArtworks = Artwork::where('is_featured', true)
            ->inRandomOrder()
            ->take(6) // Adjust the number of featured artworks as needed
            ->get();
            
        return $this->success($featuredArtworks);
    }
}
