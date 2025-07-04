<?php

namespace App\Mail;

use App\Models\ArtifactProposal;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DonorSubmissionMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $artifactProposal;

    /**
     * Create a new message instance.
     */
    public function __construct(ArtifactProposal $artifactProposal)
    {
        $this->artifactProposal = $artifactProposal;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Artifact Donation Submission Confirmation - Museum',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.donor.submission',
            with: [
                'artifactProposal' => $this->artifactProposal,
                'donor' => $this->artifactProposal->donor,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
