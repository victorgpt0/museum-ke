import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

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
  const filteredProposals = selectedFilter === 'all' 
    ? proposals.data 
    : proposals.data.filter(proposal => proposal.proposal_status === selectedFilter);

  // Count proposals by status
  const statusCounts = {
    all: proposals.data.length,
    pending: proposals.data.filter(p => p.proposal_status === 'pending').length,
    approved: proposals.data.filter(p => p.proposal_status === 'approved').length,
    rejected: proposals.data.filter(p => p.proposal_status === 'rejected').length,
    under_review: proposals.data.filter(p => p.proposal_status === 'under_review').length,
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
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
      year: 'numeric'
    });
  };

  const handleStatusUpdate = (proposalId: number, status: string) => {
    router.patch(`/curator/acquisition-history/${proposalId}/status`, {
      status: status
    }, {
      preserveScroll: true,
      onSuccess: () => {
        // Optional: Show success message
      }
    });
  };

  const handleViewDetails = (proposalId: number) => {
    router.visit(`/curator/acquisition-history/${proposalId}`);
  };

  return (
    <AppLayout>
      <Head title="Acquisition History - Nairobi National Museum" />
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Acquisition History
            </h1>
            <p className="text-gray-600">
              Track all artifact proposals submitted to Nairobi National Museum
            </p>
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
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
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
              <div key={proposal.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {proposal.title}
                    </h3>
                    <span className={getStatusBadge(proposal.proposal_status)}>
                      {proposal.proposal_status.charAt(0).toUpperCase() + 
                       proposal.proposal_status.slice(1).replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    Submitted: {formatDate(proposal.created_at)}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Images */}
                  <div className="lg:col-span-1">
                    <h4 className="font-medium text-gray-900 mb-2">Images</h4>
                    {proposal.media && proposal.media.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {proposal.media.map((image, index) => (
                          <div key={image.id} className="aspect-square rounded-lg overflow-hidden">
                            <img
                              src={image.original_url}
                              alt={`${proposal.title} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/images/placeholder.jpg';
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                        No images uploaded
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Description</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {proposal.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Source</h4>
                        <p className="text-gray-600 text-sm">{proposal.source}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Donor Information</h4>
                        <p className="text-gray-600 text-sm">
                          {proposal.donor.fullname}
                          <br />
                          <a 
                            href={`mailto:${proposal.donor.email}`} 
                            className="text-blue-600 hover:text-blue-800"
                          >
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
                        <h4 className="font-medium text-gray-900 mb-1">Next of Kin</h4>
                        <p className="text-gray-600 text-sm">
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
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                  <button 
                    onClick={() => handleViewDetails(proposal.id)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View Details
                  </button>
                  
                  {proposal.proposal_status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(proposal.id, 'under_review')}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Review
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(proposal.id, 'approved')}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(proposal.id, 'rejected')}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {proposal.proposal_status === 'under_review' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(proposal.id, 'approved')}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(proposal.id, 'rejected')}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
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

          {/* Empty State */}
          {filteredProposals.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals found</h3>
              <p className="text-gray-500">
                No artifact proposals match the selected filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AcquisitionHistory;