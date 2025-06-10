<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\StaticDataService;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Routing\Controllers\Middleware;

class UserController extends Controller implements HasMiddleware
{

    /**
     * Describe permissions for this Resource.
     */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:users.view', only: ['index', 'show']),
            new Middleware('permission:users.create', only: ['create', 'store']),
            new Middleware('permission:users.edit', only: ['edit', 'update']),
            new Middleware('permission:users.delete', only: ['destroy']),
            ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('users/index',[
            'users' => User::query()
                ->with('roles')
                ->when(request('search'), fn ($query, $search) =>
                $query->where('name', 'like', "%{$search}%")
                )
                ->paginate(request('perPage', 10))
                ->withQueryString(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('users/create',[
            'roles' => StaticDataService::getRoles()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'role' => ['required', 'exists:roles,name']
        ]);

        if ($validator->fails()) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors($validator);
        }

        try {
            $user = User::create(
                $request->only('name','email')
                + ['password' => Hash::make('password')]
            );

            $user->syncRoles([$request->role]);

            return to_route('users.index')->with('success','User Created Successfully');
        } catch (\Exception $exception){
            Log::error('User Create Error:',[$exception]);
            return redirect()->back()->with('error','Something went wrong');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $user = User::find($id);
        return Inertia::render('users/show',[
            'user' => $user,
            'userRole' => $user->getRoleNames()
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $user = User::find($id);
        return Inertia::render('users/edit',[
            'user' => $user,
            'userRoles' => $user->roles->pluck('name')->first(),
            'roles' => StaticDataService::getRoles()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::find($id);

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['nullable', 'exists:roles,name']
        ]);

        if ($validator->fails()) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors($validator);
        }


        $user->name = $request->name;
        $user->email = $request->email;

        $user->save();

        $user->syncRoles([$request->role]);

        return to_route('users.index')->with('success','User Updated Successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $request->validate([
            'password' => ['nullable', 'current_password']
        ]);

        User::destroy($id);

        return to_route('users.index')->with('success','User Deleted Successfully');
    }
}
