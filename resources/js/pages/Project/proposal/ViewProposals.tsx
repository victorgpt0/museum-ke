import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';

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

export default function ViewProposals({ proposals }: Props) {
  const [filteredProposals, setFilteredProposals] = useState<ProjectProposal[]>(proposals.data);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Sync filteredProposals with proposals.data and statusFilter
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredProposals(proposals.data);
    } else {
      setFilteredProposals(proposals.data.filter(proposal => proposal.status === statusFilter));
    }
  }, [proposals.data, statusFilter]);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate text to 50 words
  const truncateText = (text: string, maxWords: number = 50) => {
    const words = text.split(' ');
    if (words.length <= maxWords) {
      return { text: text, truncated: false };
    }
    return {
      text: words.slice(0, maxWords).join(' ') + '...',
      truncated: true
    };
  };

  // Get status badge styling
  const getStatusBadge = (status: string | undefined) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
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
    router.post('/project/proposal/approve', {
      id: proposalId,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload({ only: ['proposals'] });
      },
      onError: (errors) => {
        console.error('Failed to approve proposal:', errors);
      }
    });
  };

  // Handle reject proposal
  const handleReject = (proposalId: number) => {
    router.post(`/project/proposal/reject`, {
      id: proposalId
    }, {
      preserveScroll: true,
      onSuccess: () => {
        // Refresh the page data
        router.reload({ only: ['proposals'] });
      },
      onError: (errors) => {
        console.error('Failed to reject proposal:', errors);
      }
    });
  };

  // Handle review status (if you want to keep this)
  const handleReview = (proposalId: number) => {
    router.post(`/project/proposal/review`, {
      id: proposalId
    }, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload({ only: ['proposals'] });
      },
      onError: (errors) => {
        console.error('Failed to update proposal to review:', errors);
      }
    });
  };

  // Handle view details
  const handleViewDetails = (proposalId: number) => {
    router.visit(`/proposals/${proposalId}`);
  };

  return (
    <AppLayout>
      <Head title="Project Proposals" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Proposals</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Manage and review submitted project proposals
                </p>
              </div>
              <button
                onClick={() => router.visit('/project/new-proposal')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Create New Proposal
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'under_review', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilter(status)}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
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
              <div key={proposal.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {proposal.title}
                    </h3>
                    <span className={getStatusBadge(proposal.status)}>
                      {formatStatusText(proposal.status)}
                    </span>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Uploaded by: <span className="font-medium text-gray-700 dark:text-gray-200">{proposal.user_name || 'Unknown'}</span></div>
                  </div>
                  <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                    Submitted: {formatDate(proposal.submitted_at || proposal.created_at)}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Images */}
                  <div className="lg:col-span-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Images</h4>
                    {proposal.all_image_urls && proposal.all_image_urls.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {proposal.all_image_urls.map((image: string, index) => (
                          <div key={index} className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={image || `https://placehold.co/600x400?text=Proposal`}
                              alt={`${proposal.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/600x400?text=Proposal';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                        No images uploaded
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">Description</h4>
                      {(() => {
                        const { text, truncated } = truncateText(proposal.description);
                        return (
                          <div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                              {text}
                            </p>
                            {truncated && (
                              <button
                                onClick={() => handleViewDetails(proposal.id)}
                                className="mt-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
                              >
                                Read more →
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {proposal.duration && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Duration</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{proposal.duration}</p>
                        </div>
                      )}

                      {proposal.approved_at && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Approved Date</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm">{formatDate(proposal.approved_at)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                  <button
                    onClick={() => handleViewDetails(proposal.id)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                  >
                    View Details
                  </button>

                  {proposal.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReview(proposal.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        Review
                      </button>
                      <button
                        onClick={() => handleApprove(proposal.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(proposal.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {proposal.status === 'under_review' && (
                    <>
                      <button
                        onClick={() => handleApprove(proposal.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(proposal.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
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
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No proposals found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {statusFilter === 'all' ? 'No project proposals have been submitted yet.' : `No proposals with status "${statusFilter.replace('_', ' ')}" found.`}
              </p>
            </div>
          )}

          {/* Pagination */}
          {proposals.last_page > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((proposals.current_page - 1) * proposals.per_page) + 1} to{' '}
                {Math.min(proposals.current_page * proposals.per_page, proposals.total)} of{' '}
                {proposals.total} results
              </div>
              <div className="flex space-x-2">
                {proposals.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => link.url && router.visit(link.url)}
                    disabled={!link.url}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      link.active
                        ? 'bg-blue-600 text-white'
                        : link.url
                        ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        : 'text-gray-400 bg-gray-100 cursor-not-allowed'
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
