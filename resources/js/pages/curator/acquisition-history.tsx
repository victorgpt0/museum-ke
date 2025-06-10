import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface ArtifactProposal {
  id: number;
  title: string;
  description: string;
  source: string;
  images: string[];
  dateSubmitted: string;
  proposalStatus: 'approved' | 'rejected' | 'pending';
  donorName: string;
  donorEmail: string;
}

const AcquisitionHistory: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Mock data for artifact proposals to Nairobi National Museum
  const mockProposals: ArtifactProposal[] = [
    {
      id: 1,
      title: "Kikuyu Traditional Gourd",
      description: "A beautifully crafted traditional water gourd used by the Kikuyu community in the early 1900s. Features intricate geometric patterns and shows signs of daily use.",
      source: "Private Family Collection - Kiambu County",
      images: ["/storage/artifacts/kikuyu-gourd-1.jpg", "/storage/artifacts/kikuyu-gourd-2.jpg"],
      dateSubmitted: "2024-03-15",
      proposalStatus: "approved",
      donorName: "Mary Wanjiku Kamau",
      donorEmail: "mary.kamau@gmail.com"
    },
    {
      id: 2,
      title: "Colonial Era Railway Lantern",
      description: "Original kerosene lantern used during the construction of the Uganda Railway (1896-1901). Made of brass and iron with original glass intact.",
      source: "Mombasa Railway Station Archives",
      images: ["/storage/artifacts/railway-lantern.jpg"],
      dateSubmitted: "2024-04-02",
      proposalStatus: "pending",
      donorName: "James Mwangi Njoroge",
      donorEmail: "j.njoroge@krc.co.ke"
    },
    {
      id: 3,
      title: "Maasai Ceremonial Spear",
      description: "Hand-forged iron spear head with traditional wooden shaft. Used in coming-of-age ceremonies by Maasai warriors in Kajiado region.",
      source: "Kajiado Cultural Center",
      images: ["/storage/artifacts/maasai-spear-1.jpg", "/storage/artifacts/maasai-spear-2.jpg", "/storage/artifacts/maasai-spear-3.jpg"],
      dateSubmitted: "2024-02-28",
      proposalStatus: "rejected",
      donorName: "Ole Sankale Parsitau",
      donorEmail: "sankale.parsitau@yahoo.com"
    },
    {
      id: 4,
      title: "Swahili Poetry Manuscript",
      description: "Handwritten collection of classical Swahili poems dating back to the 18th century. Written in Arabic script on traditional paper.",
      source: "Lamu Cultural Heritage Foundation",
      images: ["/storage/artifacts/swahili-manuscript.jpg"],
      dateSubmitted: "2024-05-10",
      proposalStatus: "approved",
      donorName: "Dr. Fatima Al-Busaidy",
      donorEmail: "f.albusaidy@lamuheritage.org"
    },
    {
      id: 5,
      title: "Stone Age Tools Collection",
      description: "Set of 12 stone tools including hand axes and scrapers discovered in Olorgesailie. Estimated to be 200,000-500,000 years old.",
      source: "Archaeological Excavation - Olorgesailie",
      images: ["/storage/artifacts/stone-tools-1.jpg", "/storage/artifacts/stone-tools-2.jpg"],
      dateSubmitted: "2024-01-20",
      proposalStatus: "pending",
      donorName: "Prof. David Kiprotich",
      donorEmail: "d.kiprotich@archaeology.ac.ke"
    }
  ];

  const filteredProposals = selectedFilter === 'all' 
    ? mockProposals 
    : mockProposals.filter(proposal => proposal.proposalStatus === selectedFilter);

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
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
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'all', label: 'All Proposals', count: mockProposals.length },
                  { key: 'pending', label: 'Pending', count: mockProposals.filter(p => p.proposalStatus === 'pending').length },
                  { key: 'approved', label: 'Approved', count: mockProposals.filter(p => p.proposalStatus === 'approved').length },
                  { key: 'rejected', label: 'Rejected', count: mockProposals.filter(p => p.proposalStatus === 'rejected').length },
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
                    <span className={getStatusBadge(proposal.proposalStatus)}>
                      {proposal.proposalStatus.charAt(0).toUpperCase() + proposal.proposalStatus.slice(1)}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    Submitted: {formatDate(proposal.dateSubmitted)}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Images */}
                  <div className="lg:col-span-1">
                    <h4 className="font-medium text-gray-900 mb-2">Images</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {proposal.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                          {image.split('/').pop()}
                        </div>
                      ))}
                    </div>
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
                          {proposal.donorName}
                          <br />
                          <a href={`mailto:${proposal.donorEmail}`} className="text-blue-600 hover:text-blue-800">
                            {proposal.donorEmail}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    View Details
                  </button>
                  {proposal.proposalStatus === 'pending' && (
                    <>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                        Approve
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
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