<?php

namespace app\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\TodoRequest;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $page  = (int) $request->query('page', 1);
            $limit = (int) $request->query('limit', 10);

            if ($limit < 1)   $limit = 1;
            if ($limit > 100) $limit = 100;

            $todos = $request->user()
                ->todos()
                ->orderBy('created_at', 'desc')
                ->paginate($limit, ['*'], 'page', $page);;
            return response()->json($todos);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch todos',
//                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TodoRequest $request): JsonResponse
    {
        try {
            $todo = $request->user()->todos()->create($request->validated());

            return response()->json([
                'message' => 'Todo created successfully',
                'data' => $todo
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to create todo',
//                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, string $id)
    {
        try {
            $todo = $request->user()->todos()->findOrFail($id);

            return response()->json([
                'data' => $todo
            ], 200);

        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Todo not found'
            ], 404);

        } catch (\Throwable $e) {
            return response()->json([
                'message' => 'Something went wrong',
//                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TodoRequest $request, string $id): JsonResponse
    {
        try {
            $todo = $request->user()->todos()->findOrFail($id);
            $todo->update($request->validated());

            return response()->json([
                'message' => 'Todo updated successfully',
                'data' => $todo
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Todo not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to update todo',
//                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle the done status of the specified todo.
     */
    public function toggleDone(Request $request,string $id): JsonResponse
    {
        try {
            $todo = $request->user()->todos()->findOrFail($id);
            $todo->done = !$todo->done;
            $todo->save();

            return response()->json([
                'message' => 'Todo status updated successfully',
                'data' => $todo
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Todo not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to update todo status',
//                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id): JsonResponse
    {
        try {
            $todo = $request->user()->todos()->findOrFail($id);
            $todo->delete();

            return response()->json([
                'message' => 'Todo deleted successfully'
            ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Todo not found'
            ], 404);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Failed to delete todo',
//                'error' => $e->getMessage()
            ], 500);
        }
    }
}
