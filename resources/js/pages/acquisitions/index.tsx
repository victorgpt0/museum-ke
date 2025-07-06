import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Acquisitions',
        href: '/acquisitions',
    },
];

const Index: React.FC<Props> = ({ proposals }) => {
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
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'under_review':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
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

    const handleApprove = (id) => {
        router.post(
            route('acquisitions.approve', id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Proposal approved successfully!');
                    router.reload({only: ['proposals']});
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

    const handleReject = (id) => {
        router.post(
            route('acquisitions.reject', id),
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Proposal rejected successfully!');
                    router.reload({only: ['proposals']});
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
            <Head title="Acquisition History" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="mb-2 text-3xl font-bold text-gray-900">Acquisition History</h1>
                        <p className="text-gray-600">Track all artifact proposals submitted to the Museum</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
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
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                        } border-b-2 px-1 py-2 text-sm font-medium whitespace-nowrap`}
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
                            <div key={proposal.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                                <div className="mb-4 flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900">{proposal.title}</h3>
                                        <span className={getStatusBadge(proposal.proposal_status)}>
                                            {proposal.proposal_status.charAt(0).toUpperCase() + proposal.proposal_status.slice(1).replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="text-right text-sm text-gray-500">Submitted: {formatDate(proposal.created_at)}</div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    {/* Images */}
                                    <div className="lg:col-span-1">
                                        <h4 className="mb-2 font-medium text-gray-900">Images</h4>
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
                                            <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100 text-sm text-gray-400">
                                                No images uploaded
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-4 lg:col-span-2">
                                        <div>
                                            <h4 className="mb-1 font-medium text-gray-900">Description</h4>
                                            <p className="text-sm leading-relaxed text-gray-600">{proposal.description}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <h4 className="mb-1 font-medium text-gray-900">Source</h4>
                                                <p className="text-sm text-gray-600">{proposal.source}</p>
                                            </div>

                                            <div>
                                                <h4 className="mb-1 font-medium text-gray-900">Donor Information</h4>
                                                <p className="text-sm text-gray-600">
                                                    {proposal.donor.fullname}
                                                    <br />
                                                    <a href={`mailto:${proposal.donor.email}`} className="text-blue-600 hover:text-blue-800">
                                                        {proposal.donor.email}
                                                    </a>
                                                    <br />
                                                    <span className="text-gray-500">{proposal.donor.contact}</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Next of Kin Information (if available) */}
                                        {proposal.donor.next_of_kin_fullname && (
                                            <div>
                                                <h4 className="mb-1 font-medium text-gray-900">Next of Kin</h4>
                                                <p className="text-sm text-gray-600">
                                                    {proposal.donor.next_of_kin_fullname}
                                                    {proposal.donor.next_of_kin_email && (
                                                        <>
                                                            <br />
                                                            <a
                                                                href={`mailto:${proposal.donor.next_of_kin_email}`}
                                                                className="text-blue-600 hover:text-blue-800"
                                                            >
                                                                {proposal.donor.next_of_kin_email}
                                                            </a>
                                                        </>
                                                    )}
                                                    {proposal.donor.next_of_kin_contact && (
                                                        <>
                                                            <br />
                                                            <span className="text-gray-500">{proposal.donor.next_of_kin_contact}</span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex justify-end space-x-3 border-t border-gray-100 pt-4">
                                    {can('acquisitions.view') && (
                                        <Link href={route('acquisitions.show', proposal.id)}>
                                            <Button variant="outline" className="px-4 py-2 text-sm font-medium">
                                                View Details
                                            </Button>
                                        </Link>
                                    )}

                                    {proposal.proposal_status === 'pending' && (
                                        <>
                                            {can('acquisitions.edit') && (
                                                <button
                                                    onClick={() => handleStatusUpdate(proposal.id, 'under_review')}
                                                    className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                >
                                                    Review
                                                </button>
                                            )}
                                            {can('acquisitions.approve') && (
                                                <button
                                                    onClick={() => handleApprove(proposal.id)}
                                                    className="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {can('acquisitions.reject') && (
                                                <button
                                                    onClick={() => handleReject(proposal.id)}
                                                    className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {proposal.proposal_status === 'under_review' && (
                                        <>
                                            {can('acquisitions.approve') && (
                                                <button
                                                    onClick={() => handleStatusUpdate(proposal.id, 'approved')}
                                                    className="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                                                >
                                                    Approve
                                                </button>
                                            )}
                                            {can('acquisitions.reject') && (
                                                <button
                                                    onClick={() => handleStatusUpdate(proposal.id, 'rejected')}
                                                    className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
                                                >
                                                    Reject
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {proposals.last_page > 1 && (
                        <div className="mt-8 flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {(proposals.current_page - 1) * proposals.per_page + 1} to{' '}
                                {Math.min(proposals.current_page * proposals.per_page, proposals.total)} of {proposals.total} results
                            </div>
                            <div className="flex space-x-2">
                                {proposals.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => link.url && router.visit(link.url)}
                                        disabled={!link.url}
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                  ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                  : 'cursor-not-allowed bg-gray-100 text-gray-400'
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
                            <div className="mb-4 text-gray-400">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-lg font-medium text-gray-900">No proposals found</h3>
                            <p className="text-gray-500">No artifact proposals match the selected filter criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
