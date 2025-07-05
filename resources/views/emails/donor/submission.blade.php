<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Artifact Donation Submission Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #1e40af;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f8fafc;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .section {
            margin-bottom: 25px;
            padding: 15px;
            background-color: white;
            border-radius: 6px;
            border-left: 4px solid #1e40af;
        }
        .section h3 {
            margin-top: 0;
            color: #1e40af;
        }
        .info-row {
            display: flex;
            margin-bottom: 8px;
        }
        .label {
            font-weight: bold;
            min-width: 120px;
            color: #4b5563;
        }
        .value {
            flex: 1;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .status-badge {
            display: inline-block;
            background-color: #fbbf24;
            color: #92400e;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Museum</h1>
        <p>Artifact Donation Submission Confirmation</p>
    </div>

    <div class="content">
        <p>Dear {{ $donor->fullname }},</p>

        <p>Thank you for your interest in donating to the Museum. We have successfully received your artifact donation proposal and it is currently under review.</p>

        <div class="section">
            <h3>Submission Details</h3>
            <div class="info-row">
                <span class="label">Proposal ID:</span>
                <span class="value">#{{ $artifactProposal->id }}</span>
            </div>
            <div class="info-row">
                <span class="label">Status:</span>
                <span class="value">
                    <span class="status-badge">{{ ucfirst(str_replace('_', ' ', $artifactProposal->proposal_status)) }}</span>
                </span>
            </div>
            <div class="info-row">
                <span class="label">Submitted:</span>
                <span class="value">{{ $artifactProposal->created_at->format('F j, Y \a\t g:i A') }}</span>
            </div>
        </div>

        <div class="section">
            <h3>Artifact Information</h3>
            <div class="info-row">
                <span class="label">Title:</span>
                <span class="value">{{ $artifactProposal->title }}</span>
            </div>
            <div class="info-row">
                <span class="label">Description:</span>
                <span class="value">{{ $artifactProposal->description }}</span>
            </div>
            <div class="info-row">
                <span class="label">Source/Origin:</span>
                <span class="value">{{ $artifactProposal->source }}</span>
            </div>
        </div>

        <div class="section">
            <h3>Donor Information</h3>
            <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">{{ $donor->fullname }}</span>
            </div>
            <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">{{ $donor->email }}</span>
            </div>
            <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">{{ $donor->contact }}</span>
            </div>
            @if($donor->next_of_kin_fullname)
            <div class="info-row">
                <span class="label">Next of Kin:</span>
                <span class="value">{{ $donor->next_of_kin_fullname }}</span>
            </div>
            @endif
        </div>

        <div class="section">
            <h3>What Happens Next?</h3>
            <p>Our curatorial team will review your submission and may contact you for additional information or clarification. The review process typically takes 2-4 weeks.</p>

            <p>You will receive an email notification once your proposal has been reviewed and a decision has been made.</p>
        </div>

        <div class="section">
            <h3>Contact Information</h3>
            <p>If you have any questions about your submission, please contact us:</p>
            <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">acquisitions@museum.ke</span>
            </div>
            <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">+254 20 374 2131</span>
            </div>
        </div>

        <p>Thank you for your contribution to preserving Kenya's cultural heritage.</p>

        <p>Best regards,<br>
        <strong>Acquisitions Team</strong><br>
        Museum</p>
    </div>

    <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>Museum | Museum Hill, Nairobi, Kenya</p>
    </div>
</body>
</html>
