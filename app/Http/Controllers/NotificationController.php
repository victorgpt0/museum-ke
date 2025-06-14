<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications();
        return Inertia::render('notifications/index',[
            'notifications_index' => $notifications->latest()->get()->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->data['title'] ?? 'New notification',
                    'message' => $notification->data['message'] ?? 'New notification',
                    'url' => $notification->data['url'] ?? null,
                    'read' => $notification->read_at !== null,
                    'timestamp' => $notification->created_at->diffForHumans(),
                    'notif_type' => $notification->data['type'] ?? 'info',
                ];
            }),
            'unreadCount_index' => $request->user()->unreadNotifications->count(),
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
