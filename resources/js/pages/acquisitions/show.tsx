import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Calendar, CheckCircle, Clock, Eye, FileText, Image as ImageIcon, Mail, Phone, User, XCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import can from '@/lib/can';

interface Media {
    id: number;
    original_url: string;
    name: string;
}

interface Donor {
    id: number;
    fullname: string;
    email: string;
    contact: string;
    next_of_kin_fullname?: string;
    next_of_kin_email?: string;
    next_of_kin_contact?: string;
}

interface ArtifactProposal {
    id: number;
    title: string;
    description: string;
    source: string;
    proposal_status: 'approved' | 'rejected' | 'pending' | 'under_review';
    created_at: string;
    updated_at: string;
    donor: Donor;
    media: Media[];
}

interface Props {
    proposal: ArtifactProposal;
}

export default function AcquisitionShow({ proposal }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Acquisitions', href: '/acquisitions' },
        { title: proposal.title, href: `/acquisitions/${proposal.id}` },
    ];

    const getStatusBadge = (status: string) => {
        const baseClasses = 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';
        switch (status) {
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300`;
            case 'under_review':
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="h-4 w-4" />;
            case 'rejected':
                return <XCircle className="h-4 w-4" />;
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'under_review':
                return <Eye className="h-4 w-4" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleApprove = () => {
        router.post(
            route('acquisitions.approve', proposal.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Proposal approved successfully!');
                    setTimeout(() => window.location.reload(), 1000);
                },
                onError: (errors) => {
                    if (errors.error) {
                        toast.error(errors.error);
                    } else {
                        toast.error('Failed to approve proposal.');
                    }
                },
            },
        );
    };

    const handleReject = () => {
        router.post(
            route('acquisitions.reject', proposal.id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Proposal rejected successfully!');
                    setTimeout(() => window.location.reload(), 1000);
                },
                onError: (errors) => {
                    if (errors.error) {
                        toast.error(errors.error);
                    } else {
                        toast.error('Failed to reject proposal.');
                    }
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Acquisition: ${proposal.title}`} />
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: '8px',
                        padding: '12px 16px',
                    },
                    success: {
                        style: {
                            background: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #bbf7d0',
                        },
                        iconTheme: {
                            primary: '#16a34a',
                            secondary: '#f0fdf4',
                        },
                    },
                    error: {
                        style: {
                            background: '#fef2f2',
                            color: '#991b1b',
                            border: '1px solid #fecaca',
                        },
                        iconTheme: {
                            primary: '#dc2626',
                            secondary: '#fef2f2',
                        },
                    },
                }}
            />

            <div className="bg-gray-50 py-8 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{proposal.title}</h1>
                                    <div className="mt-2 flex items-center space-x-2">
                                        <Badge className={getStatusBadge(proposal.proposal_status)}>
                                            {getStatusIcon(proposal.proposal_status)}
                                            <span className="ml-1">
                                                {proposal.proposal_status.charAt(0).toUpperCase() +
                                                    proposal.proposal_status.slice(1).replace('_', ' ')}
                                            </span>
                                        </Badge>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Submitted: {formatDate(proposal.created_at)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {proposal.proposal_status === 'pending' && (
                                <div className="flex space-x-2">
                                    {can('acquisitions.approve') && (
                                        <Button onClick={handleApprove} className="bg-green-600 text-white hover:bg-green-700">
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Approve
                                        </Button>
                                    )}
                                    {can('acquisitions.reject') && (
                                        <Button onClick={handleReject} variant="destructive">
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Reject
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Artifact Information */}
                            <Card className="border border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                                        <FileText className="h-5 w-5" />
                                        <span>Artifact Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Description</h3>
                                        <p className="leading-relaxed text-gray-700 dark:text-gray-300">{proposal.description}</p>
                                    </div>
                                    <div>
                                        <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Source/Origin</h3>
                                        <p className="text-gray-700 dark:text-gray-300">{proposal.source}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Images */}
                            {proposal.media && proposal.media.length > 0 && (
                                <Card className="border border-gray-200 dark:border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                                            <ImageIcon className="h-5 w-5" />
                                            <span>Images ({proposal.media.length})</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                            {proposal.media.map((image, index) => (
                                                <div
                                                    key={image.id}
                                                    className="aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
                                                >
                                                    <img
                                                        src={image.original_url}
                                                        alt={`${proposal.title} - Image ${index + 1}`}
                                                        className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/images/placeholder.jpg';
                                                        }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Donor Information */}
                            <Card className="border border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                                        <User className="h-5 w-5" />
                                        <span>Donor Information</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Contact Details</h3>
                                        <div className="space-y-2">
                                            <div className="flex min-w-0 items-start space-x-2 text-gray-700 dark:text-gray-300">
                                                <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                                                <span className="min-w-0 flex-1 overflow-hidden break-words">{proposal.donor.fullname}</span>
                                            </div>
                                            <div className="flex min-w-0 items-start space-x-2 text-gray-700 dark:text-gray-300">
                                                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                                                <span className="min-w-0 flex-1 overflow-hidden break-words">
                                                    <a href={`mailto:${proposal.donor.email}`} className="text-blue-600 hover:text-blue-800">
                                                        {proposal.donor.email}
                                                    </a>
                                                </span>
                                            </div>
                                            <div className="flex min-w-0 items-start space-x-2 text-gray-700 dark:text-gray-300">
                                                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                                                <span className="min-w-0 flex-1 overflow-hidden break-words">{proposal.donor.contact}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next of Kin Information */}
                                    {(proposal.donor.next_of_kin_fullname ||
                                        proposal.donor.next_of_kin_email ||
                                        proposal.donor.next_of_kin_contact) && (
                                        <div>
                                            <h3 className="mb-2 font-medium text-gray-900 dark:text-white">Next of Kin</h3>
                                            <div className="space-y-2">
                                                {proposal.donor.next_of_kin_fullname && (
                                                    <div className="flex min-w-0 items-start space-x-2 text-gray-700 dark:text-gray-300">
                                                        <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                                                        <span className="min-w-0 flex-1 overflow-hidden break-words">
                                                            {proposal.donor.next_of_kin_fullname}
                                                        </span>
                                                    </div>
                                                )}
                                                {proposal.donor.next_of_kin_email && (
                                                    <div className="flex min-w-0 items-start space-x-2 text-gray-700 dark:text-gray-300">
                                                        <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                                                        <span className="min-w-0 flex-1 overflow-hidden break-words">
                                                            <a
                                                                href={`mailto:${proposal.donor.next_of_kin_email}`}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                {proposal.donor.next_of_kin_email}
                                                            </a>
                                                        </span>
                                                    </div>
                                                )}
                                                {proposal.donor.next_of_kin_contact && (
                                                    <div className="flex min-w-0 items-start space-x-2 text-gray-700 dark:text-gray-300">
                                                        <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                                                        <span className="min-w-0 flex-1 overflow-hidden break-words">
                                                            {proposal.donor.next_of_kin_contact}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Timeline Information */}
                            <Card className="border border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                                        <Calendar className="h-5 w-5" />
                                        <span>Timeline</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Submitted</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(proposal.created_at)}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated</p>
                                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(proposal.updated_at)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
