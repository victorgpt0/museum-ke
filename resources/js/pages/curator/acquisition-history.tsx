import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

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

interface PaginatedProposals {
    data: ArtifactProposal[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Props {
    proposals: PaginatedProposals;
}

const AcquisitionHistory: React.FC<Props> = ({ proposals }) => {
    const [selectedFilter, setSelectedFilter] = useState<string>('all');

    // Filter proposals based on status
    const filteredProposals =
        selectedFilter === 'all' ? proposals.data : proposals.data.filter((proposal) => proposal.proposal_status === selectedFilter);

    // Count proposals by status
    const statusCounts = {
        all: proposals.data.length,
        pending: proposals.data.filter((p) => p.proposal_status === 'pending').length,
        approved: proposals.data.filter((p) => p.proposal_status === 'approved').length,
        rejected: proposals.data.filter((p) => p.proposal_status === 'rejected').length,
        under_review: proposals.data.filter((p) => p.proposal_status === 'under_review').length,
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium';
        switch (status) {
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
            case 'under_review':
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const handleStatusUpdate = (proposalId: number, status: string) => {
        router.patch(
            `/curator/acquisition-history/${proposalId}/status`,
            {
                status: status,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional: Show success message
                },
            },
        );
    };

    const handleApprove = (proposalId: number) => {
        router.post(
            `/acquisition/${proposalId}/approve`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Proposal approved successfully!');
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

    const handleReject = (proposalId: number) => {
        router.post(
            `/acquisition/${proposalId}/reject`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Proposal rejected successfully!');
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

    const handleViewDetails = (proposalId: number) => {
        router.visit(`/curator/acquisition-history/${proposalId}`);
    };

    const handleDownloadImage = (imageUrl: string, fileName: string) => {
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName || 'artifact-image.jpg';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAllImages = (proposal: ArtifactProposal) => {
        if (!proposal.media || proposal.media.length === 0) {
            toast.error('No images available for download');
            return;
        }

        // Download each image
        proposal.media.forEach((image, index) => {
            setTimeout(() => {
                const fileName = `${proposal.title.replace(/[^a-zA-Z0-9]/g, '_')}_image_${index + 1}.jpg`;
                handleDownloadImage(image.original_url, fileName);
            }, index * 500); // Stagger downloads by 500ms
        });

        toast.success(`Downloading ${proposal.media.length} image(s)...`);
    };

    return (
        <AppLayout>
            <Head title="Acquisition History - Nairobi National Museum" />

            <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Acquisition History</h1>
                        <p className="text-gray-600 dark:text-gray-400">Track all artifact proposals submitted to Nairobi National Museum</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="-mb-px flex space-x-8 overflow-x-auto">
                                {[
                                    { key: 'all', label: 'All Proposals', count: statusCounts.all },
                                    { key: 'pending', label: 'Pending', count: statusCounts.pending },
                                    { key: 'under_review', label: 'Under Review', count: statusCounts.under_review },
                                    { key: 'approved', label: 'Approved', count: statusCounts.approved },
                                    { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setSelectedFilter(tab.key)}
                                        className={`${
                                            selectedFilter === tab.key
                                                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300'
                                        } border-b-2 px-1 py-2 text-sm font-medium whitespace-nowrap transition-colors`}
                                    >
                                        {tab.label} ({tab.count})
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Proposals List */}
                    <div className="space-y-6">
                        {filteredProposals.map((proposal) => (
                            <div
                                key={proposal.id}
                                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                            >
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">{proposal.title}</h3>
                                        <span className={getStatusBadge(proposal.proposal_status)}>
                                            {proposal.proposal_status.charAt(0).toUpperCase() + proposal.proposal_status.slice(1).replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                                        Submitted: {formatDate(proposal.created_at)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    {/* Images */}
                                    <div className="lg:col-span-1">
                                        <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Images</h4>
                                        {proposal.media && proposal.media.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {proposal.media.map((image, index) => (
                                                    <div key={image.id} className="aspect-square overflow-hidden rounded-lg">
                                                        <img
                                                            src={image.original_url}
                                                            alt={`${proposal.title} - Image ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = '/images/placeholder.jpg';
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400 dark:bg-gray-700 dark:text-gray-500">
                                                No images uploaded
                                            </div>
                                        )}

                                        {/* Download Button */}
                                        {proposal.media && proposal.media.length > 0 && (
                                            <div className="mt-3">
                                                <button
                                                    onClick={() => handleDownloadAllImages(proposal)}
                                                    className="flex w-full items-center justify-center space-x-2 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-blue-400"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                    <span>Download All Images</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-4 lg:col-span-2">
                                        <div>
                                            <h4 className="mb-1 font-medium text-gray-900 dark:text-white">Description</h4>
                                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{proposal.description}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <h4 className="mb-1 font-medium text-gray-900 dark:text-white">Source</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{proposal.source}</p>
                                            </div>

                                            <div>
                                                <h4 className="mb-1 font-medium text-gray-900 dark:text-white">Donor Information</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {proposal.donor.fullname}
                                                    <br />
                                                    <a
                                                        href={`mailto:${proposal.donor.email}`}
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        {proposal.donor.email}
                                                    </a>
                                                    <br />
                                                    <span className="text-gray-500 dark:text-gray-400">{proposal.donor.contact}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Next of Kin Information (if available) */}
                                        {proposal.donor.next_of_kin_fullname && (
                                            <div>
                                                <h4 className="mb-1 font-medium text-gray-900 dark:text-white">Next of Kin</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {proposal.donor.next_of_kin_fullname}
                                                    {proposal.donor.next_of_kin_email && (
                                                        <>
                                                            <br />
                                                            <a
                                                                href={`mailto:${proposal.donor.next_of_kin_email}`}
                                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                {proposal.donor.next_of_kin_email}
                                                            </a>
                                                        </>
                                                    )}
                                                    {proposal.donor.next_of_kin_contact && (
                                                        <>
                                                            <br />
                                                            <span className="text-gray-500 dark:text-gray-400">
                                                                {proposal.donor.next_of_kin_contact}
                                                            </span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex justify-end space-x-3 border-t border-gray-100 pt-4 dark:border-gray-700">
                                    <button
                                        onClick={() => handleViewDetails(proposal.id)}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-blue-400"
                                    >
                                        View Details
                                    </button>

                                    {proposal.proposal_status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(proposal.id, 'under_review')}
                                                className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                            >
                                                Review
                                            </button>
                                            <button
                                                onClick={() => handleApprove(proposal.id)}
                                                className="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(proposal.id)}
                                                className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    {proposal.proposal_status === 'under_review' && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(proposal.id)}
                                                className="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(proposal.id)}
                                                className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {proposals.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing {(proposals.current_page - 1) * proposals.per_page + 1} to{' '}
                                {Math.min(proposals.current_page * proposals.per_page, proposals.total)} of {proposals.total} results
                            </div>
                            <div className="flex space-x-2">
                                {proposals.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                  ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                                  : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {filteredProposals.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="mb-4 text-gray-400 dark:text-gray-500">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">No proposals found</h3>
                            <p className="text-gray-500 dark:text-gray-400">No artifact proposals match the selected filter criteria.</p>
                        </div>
                    )}
                </div>
            </div>
            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 4000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </AppLayout>
    );
};

export default AcquisitionHistory;
