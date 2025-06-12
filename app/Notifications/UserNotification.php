<?php

namespace App\Notifications;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserNotification extends Notification implements ShouldBroadcast, ShouldQueue
{
    use Queueable;

    protected $type;
    protected $title;
    protected $message;
    protected $url;
    protected $notifiableId;

    /**
     * Create a new notification instance.
     */
    public function __construct($type = 'info', $title, $message, $url = null, $notifiableId = null)
    {
        $this->type = $type;
        $this->title = $title;
        $this->message = $message;
        $this->url = $url;
        $this->notifiableId = $notifiableId;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'url' => $this->url
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'title' => $this->title,
            'message' => $this->message,
            'type' => $this->type,
            'action_url' => $this->url,
            'created_at' => now()->toISOString(),
        ]);
    }
    public function broadcastAs(): string
    {
        return 'notification.created';
    }
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user-notifications.'. $this->notifiableId)
        ];
    }
}
