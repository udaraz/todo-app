<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\V1\TodoController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class,'login']);
Route::post('register', [AuthController::class,'register']);

Route::group(['prefix'=>'v1', 'as'=>'api.','middleware' => ['auth:sanctum']], function () {
    Route::apiResource('todos' , TodoController::class);
    Route::patch('/{id}/done', [TodoController::class,'toggleDone']);
});
