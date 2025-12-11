<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    protected $fillable = ['user_id', 'title', 'description', 'done'];

    protected $casts = [
        'done' => 'boolean',
    ];

    /**
     * Get the user that owns the todo
     * This defines: A Todo belongs to a User
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
