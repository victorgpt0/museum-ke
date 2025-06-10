<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifs = $request->user()->notifications;
        return response()->json([
            'notifications' => $notifs,
            'unreadCount' => $request->user()->unreadNotifications->count(),
//            'pagination' => [
//                'current_page' => $notifs->currentPage(),
//                'last_page' => $notifs->lastPage(),
//                'per_page' => $notifs->perPage(),
//                'total' => $notifs->total(),
//            ]
        ]);
    }

    public function markAsRead(Request $request, string $id)
    {
        $notif = $request->user()->notifications()->findOrFail($id);
        $notif->markAsRead();
        return back();
    }

    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return back();
    }

    public function destroy(Request $request, string $id)
    {
        $notif = $request->user()->notifications()->findOrFail($id);
        $notif->delete();

        return back();
    }
}
