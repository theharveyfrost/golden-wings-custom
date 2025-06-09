<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

abstract class ResourceController extends ApiController
{
    /**
     * The model class name this controller manages
     */
    protected $modelClass;

    /**
     * The resource name for responses
     */
    protected $resourceName = 'resource';

    /**
     * Validation rules for storing a new resource
     */
    protected abstract function storeRules(): array;

    /**
     * Validation rules for updating an existing resource
     */
    protected function updateRules(): array
    {
        return $this->storeRules();
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $items = $this->modelClass::all();
        return $this->success($items);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->storeRules());

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $item = $this->modelClass::create($request->all());
        return $this->success($item, ucfirst($this->resourceName) . ' created successfully', 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $item = $this->modelClass::find($id);

        if (!$item) {
            return $this->notFound(ucfirst($this->resourceName) . ' not found');
        }

        return $this->success($item);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $item = $this->modelClass::find($id);

        if (!$item) {
            return $this->notFound(ucfirst($this->resourceName) . ' not found');
        }

        $validator = Validator::make($request->all(), $this->updateRules());

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $item->update($request->all());
        return $this->success($item, ucfirst($this->resourceName) . ' updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $item = $this->modelClass::find($id);

        if (!$item) {
            return $this->notFound(ucfirst($this->resourceName) . ' not found');
        }

        $item->delete();
        return $this->success(null, ucfirst($this->resourceName) . ' deleted successfully');
    }
}
