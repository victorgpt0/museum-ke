import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, PageProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface ProjectProposal {
    id: number;
    title: string;
    description: string;
    duration?: string;
    status?: 'pending' | 'under_review' | 'approved' | 'rejected';
    created_at: string;
    submitted_at?: string;
    approved_at?: string;
    all_image_urls?: string[];
    user_name?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProposals {
    data: ProjectProposal[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface Props extends PageProps {
    proposals: PaginatedProposals;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Project Proposals',
        href: '/project/viewproposals',
    },
];

export default function ViewProposals({ proposals }: Props) {
    const [filteredProposals, setFilteredProposals] = useState<ProjectProposal[]>(proposals.data);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Sync filteredProposals with proposals.data and statusFilter
    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredProposals(proposals.data);
        } else {
            setFilteredProposals(proposals.data.filter((proposal) => proposal.status === statusFilter));
        }
    }, [proposals.data, statusFilter]);

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Get status badge styling
    const getStatusBadge = (status: string | undefined) => {
        const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
        if (!status) return `${baseClasses} bg-gray-100 text-gray-800`;

        switch (status) {
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'under_review':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            case 'approved':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'rejected':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    // Format status text safely
    const formatStatusText = (status: string | undefined) => {
        if (!status) return 'Unknown';
        return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    };

    // Handle status filter
    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
    };

    // Handle approve proposal
    const handleApprove = (proposalId: number) => {
        router.post(
            '/project/proposal/approve',
            {
                id: proposalId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['proposals'] });
                },
                onError: (errors) => {
                    console.error('Failed to approve proposal:', errors);
                },
            },
        );
    };

    // Handle reject proposal
    const handleReject = (proposalId: number) => {
        router.post(
            `/project/proposal/reject`,
            {
                id: proposalId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Refresh the page data
                    router.reload({ only: ['proposals'] });
                },
                onError: (errors) => {
                    console.error('Failed to reject proposal:', errors);
                },
            },
        );
    };

    // Handle review status (if you want to keep this)
    const handleReview = (proposalId: number) => {
        router.post(
            `/project/proposal/review`,
            {
                id: proposalId,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    router.reload({ only: ['proposals'] });
                },
                onError: (errors) => {
                    console.error('Failed to update proposal to review:', errors);
                },
            },
        );
    };

    // Handle view details
    const handleViewDetails = (proposalId: number) => {
        router.visit(`/proposals/${proposalId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Project Proposals" />

            <div className="min-h-screen bg-gray-50 py-8 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className={`flex items-center justify-between`}>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Proposals</h1>
                            <Button variant={`default`}>
                                <Link href="/project/new-proposal">Create New Proposal</Link>
                            </Button>
                        </div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage and review submitted project proposals</p>
                    </div>

                    {/* Status Filter */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            {['all', 'pending', 'under_review', 'approved', 'rejected'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => handleStatusFilter(status)}
                                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                                        statusFilter === status
                                            ? 'bg-blue-600 text-white'
                                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                                </button>
                            ))}
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
                                        <span className={getStatusBadge(proposal.status)}>{formatStatusText(proposal.status)}</span>
                                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Uploaded by:{' '}
                                            <span className="font-medium text-gray-700 dark:text-gray-200">{proposal.user_name || 'Unknown'}</span>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                                        Submitted: {formatDate(proposal.submitted_at || proposal.created_at)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                                    {/* Images */}
                                    <div className="lg:col-span-1">
                                        <h4 className="mb-2 font-medium text-gray-900 dark:text-white">Images</h4>
                                        {proposal.all_image_urls && proposal.all_image_urls.length > 0 ? (
                                            <div className="grid grid-cols-2 gap-2">
                                                {proposal.all_image_urls.map((image: string, index) => (
                                                    <div key={index} className="aspect-square overflow-hidden rounded-lg">
                                                        <img
                                                            src={image || `https://placehold.co/600x400?text=Proposal`}
                                                            alt={`${proposal.title} - Image ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = 'https://placehold.co/600x400?text=Proposal';
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
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-4 lg:col-span-2">
                                        <div>
                                            <h4 className="mb-1 font-medium text-gray-900 dark:text-white">Description</h4>
                                            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">{proposal.description}</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {proposal.duration && (
                                                <div>
                                                    <h4 className="mb-1 font-medium text-gray-900 dark:text-white">Duration</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{proposal.duration}</p>
                                                </div>
                                            )}

                                            {proposal.approved_at && (
                                                <div>
                                                    <h4 className="mb-1 font-medium text-gray-900 dark:text-white">Approved Date</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">{formatDate(proposal.approved_at)}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-6 flex justify-end space-x-3 border-t border-gray-100 pt-4">
                                    <button
                                        onClick={() => handleViewDetails(proposal.id)}
                                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:focus:ring-blue-400"
                                    >
                                        View Details
                                    </button>

                                    {proposal.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleReview(proposal.id)}
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

                                    {proposal.status === 'under_review' && (
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

                    {/* Empty State */}
                    {filteredProposals.length === 0 && (
                        <div className="py-12 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No proposals found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {statusFilter === 'all'
                                    ? 'No project proposals have been submitted yet.'
                                    : `No proposals with status "${statusFilter.replace('_', ' ')}" found.`}
                            </p>
                        </div>
                    )}

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
                </div>
            </div>
        </AppLayout>
    );
}
