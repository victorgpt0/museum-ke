<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Artifact Donation Status Update</title>
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
            background-color: #dc2626;
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
            border-left: 4px solid #dc2626;
        }
        .section h3 {
            margin-top: 0;
            color: #dc2626;
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
            background-color: #dc2626;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .highlight-box {
            background-color: #fef2f2;
            border: 1px solid #dc2626;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Museum</h1>
        <p>Artifact Donation Status Update</p>
    </div>

    <div class="content">
        <p>Dear {{ $donor->fullname }},</p>

        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #dc2626;">Status Update</h3>
            <p>After careful review by our curatorial team, we regret to inform you that we are unable to accept your artifact donation proposal at this time.</p>
        </div>

        <div class="section">
            <h3>Proposal Details</h3>
            <div class="info-row">
                <span class="label">Proposal ID:</span>
                <span class="value">#{{ $artifactProposal->id }}</span>
            </div>
            <div class="info-row">
                <span class="label">Status:</span>
                <span class="value">
                    <span class="status-badge">Not Accepted</span>
                </span>
            </div>
            <div class="info-row">
                <span class="label">Review Date:</span>
                <span class="value">{{ now()->format('F j, Y \a\t g:i A') }}</span>
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
            <h3>Why Was This Decision Made?</h3>
            <p>Our curatorial team evaluates each donation proposal based on several criteria including:</p>
            <ul>
                <li>Relevance to our collection and research goals</li>
                <li>Condition and preservation requirements</li>
                <li>Legal and ethical considerations</li>
                <li>Storage and display space availability</li>
                <li>Documentation and provenance completeness</li>
            </ul>
            <p>This decision does not reflect the value or importance of your artifact, but rather our current collection priorities and capacity.</p>
        </div>

        <div class="section">
            <h3>Alternative Options</h3>
            <p>We encourage you to consider:</p>
            <ul>
                <li>Contacting other museums or cultural institutions that may be interested</li>
                <li>Donating to local community museums or cultural centers</li>
                <li>Preserving the artifact in your family for future generations</li>
                <li>Submitting a different artifact that may better align with our collection goals</li>
            </ul>
        </div>

        <div class="section">
            <h3>Contact Information</h3>
            <p>If you have questions about this decision or would like to discuss future donation opportunities:</p>
            <div class="info-row">
                <span class="label">Email:</span>
                <span class="value">acquisitions@museum.ke</span>
            </div>
            <div class="info-row">
                <span class="label">Phone:</span>
                <span class="value">+254 20 374 2131</span>
            </div>
            <div class="info-row">
                <span class="label">Reference:</span>
                <span class="value">Proposal #{{ $artifactProposal->id }}</span>
            </div>
        </div>

        <p>We appreciate your interest in contributing to the Museum and hope you will consider us for future donations that align with our collection goals.</p>

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
