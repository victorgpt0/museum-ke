import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, User } from 'lucide-react';

interface Proposal {
  id: number;
  title: string;
  description: string;
  user_id: number;
  user_name?: string;
  all_documents_urls?: string[];
  all_image_urls?: string[];
  // Add other proposal fields as needed
}

// Helper to parse the new structured description into sections
function parseProposalDescription(description: string) {
  const sections: Record<string, string[]> = {
    main: [],
    objectives: [],
    milestones: [],
    goals: [],
    team: [],
  };
  const objIdx = description.indexOf('Objectives:\n');
  const msIdx = description.indexOf('Milestones:\n');
  const goalsIdx = description.indexOf('Goals:\n');
  const teamIdx = description.indexOf('Team Members:\n');
  const firstIdx = [objIdx, msIdx, goalsIdx, teamIdx].filter(i => i !== -1).sort((a, b) => a - b)[0] || description.length;
  sections.main = [description.slice(0, firstIdx).trim()];
  function extractSection(header: string, nextHeaders: string[]) {
    const start = description.indexOf(header);
    if (start === -1) return [];
    let end = description.length;
    for (const nh of nextHeaders) {
      const idx = description.indexOf(nh);
      if (idx !== -1 && idx > start && idx < end) end = idx;
    }
    const content = description.slice(start + header.length, end).trim();
    return content.split(/\n/).map(l => l.replace(/^[-\s]+/, '').trim()).filter(Boolean);
  }
  sections.objectives = extractSection('Objectives:\n', ['Milestones:\n', 'Goals:\n', 'Team Members:\n']);
  sections.milestones = extractSection('Milestones:\n', ['Goals:\n', 'Team Members:\n']);
  sections.goals = extractSection('Goals:\n', ['Team Members:\n']);
  sections.team = extractSection('Team Members:\n', []);
  return sections;
}

interface ProposalDetailsProps {
  proposal: Proposal;
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
    <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
      {title}
    </h2>
    <div>{children}</div>
  </div>
);

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal }) => {
  const sections = parseProposalDescription(proposal.description);

  return (
    <AppLayout>
      <Head title={`Proposal: ${proposal.title}`} />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Link href="/project/viewproposals" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Proposals
        </Link>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{proposal.title}</h1>
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
            <User className="h-5 w-5 text-gray-500 dark:text-gray-300" />
            <span className="text-gray-800 dark:text-gray-200 text-sm font-medium">{proposal.user_name || 'Unknown'}</span>
          </div>
        </div>
        {sections.main[0] && (
          <SectionCard title="Overview">
            <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">{sections.main[0]}</p>
          </SectionCard>
        )}
        {sections.objectives.length > 0 && (
          <SectionCard title="Objectives">
            <ul className="list-disc pl-6 space-y-1">
              {sections.objectives.map((item, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>
              ))}
            </ul>
          </SectionCard>
        )}
        {sections.milestones.length > 0 && (
          <SectionCard title="Milestones">
            <ul className="list-disc pl-6 space-y-1">
              {sections.milestones.map((item, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>
              ))}
            </ul>
          </SectionCard>
        )}
        {sections.goals.length > 0 && (
          <SectionCard title="Goals">
            <ul className="list-disc pl-6 space-y-1">
              {sections.goals.map((item, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>
              ))}
            </ul>
          </SectionCard>
        )}
        {sections.team.length > 0 && (
          <SectionCard title="Team Members">
            <ul className="list-disc pl-6 space-y-1">
              {sections.team.map((item, idx) => (
                <li key={idx} className="text-gray-700 dark:text-gray-300">{item}</li>
              ))}
            </ul>
          </SectionCard>
        )}
        {proposal.all_image_urls && proposal.all_image_urls.length > 0 && (
          <SectionCard title="Attached Images">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {proposal.all_image_urls.map((url, idx) => (
                <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <img
                    src={url}
                    alt={`Proposal Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/400x400?text=Image'; }}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        )}
        {proposal.all_documents_urls && proposal.all_documents_urls.length > 0 && (
          <SectionCard title="Attached Documents">
            <ul className="space-y-2">
              {proposal.all_documents_urls.map((url, idx) => {
                const fileName = url.split('/').pop()?.split('?')[0] || `Document ${idx+1}`;
                return (
                  <li key={idx}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                      download
                    >
                      <span className="truncate max-w-xs">{fileName}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </SectionCard>
        )}
      </div>
    </AppLayout>
  );
};

export default ProposalDetails;
