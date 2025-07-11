<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Artifact Donation Approved</title>
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
            background-color: #059669;
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
            border-left: 4px solid #059669;
        }
        .section h3 {
            margin-top: 0;
            color: #059669;
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
            background-color: #10b981;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .highlight-box {
            background-color: #ecfdf5;
            border: 1px solid #10b981;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Museum</h1>
        <p>Artifact Donation Approved</p>
    </div>

    <div class="content">
        <p>Dear {{ $donor->fullname }},</p>

        <div class="highlight-box">
            <h3 style="margin-top: 0; color: #059669;">🎉 Congratulations!</h3>
            <p>We are pleased to inform you that your artifact donation proposal has been <strong>APPROVED</strong> by our curatorial team.</p>
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
                    <span class="status-badge">Approved</span>
                </span>
            </div>
            <div class="info-row">
                <span class="label">Approved Date:</span>
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
            <h3>Next Steps</h3>
            <p>Our acquisitions team will contact you within the next 5-7 business days to:</p>
            <ul>
                <li>Schedule a meeting to discuss the donation process</li>
                <li>Arrange for the physical transfer of the artifact</li>
                <li>Complete the necessary documentation</li>
                <li>Discuss any special handling requirements</li>
            </ul>
        </div>

        <div class="section">
            <h3>Important Information</h3>
            <p><strong>Please do not bring the artifact to the museum until we contact you.</strong> We need to ensure proper documentation and handling procedures are in place.</p>

            <p>If you have any questions or need to update your contact information, please contact us immediately.</p>
        </div>

        <div class="section">
            <h3>Contact Information</h3>
            <p>For questions about your approved donation:</p>
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

        <p>Thank you for your generous contribution to the Museum's collection. Your donation will help preserve and share Kenya's rich cultural heritage with future generations.</p>

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
