import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, User } from 'lucide-react';
import React from 'react';
import { Button } from '@/components/ui/button';

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
    console.log('Parsing description:', description);
    
    const sections: { [key: string]: string[] } = {
        overview: [],
        objectives: [],
        milestones: [],
        budgetBreakdown: [],
        goals: [],
        teamMembers: []
    };

    // Extract Overview (everything before Objectives)
    const overviewMatch = description.match(/^(.*?)(?=Objectives:|$)/);
    if (overviewMatch && overviewMatch[1].trim()) {
        sections.overview = [overviewMatch[1].trim()];
        console.log('Overview found:', sections.overview);
    }

    // Extract Objectives
    const objectivesMatch = description.match(/Objectives:\s*(.*?)(?=Milestones:|$)/);
    if (objectivesMatch) {
        const objectivesText = objectivesMatch[1].trim();
        console.log('Objectives text:', objectivesText);
        // Split by individual objectives (lines starting with -)
        const objectives = objectivesText.split(/(?=^-)/).filter(obj => obj.trim());
        sections.objectives = objectives.map(obj => obj.trim());
        console.log('Objectives parsed:', sections.objectives);
    }

    // Extract Milestones with their budget breakdowns
    const milestonesMatch = description.match(/Milestones:\s*(.*?)(?=Goals:|$)/);
    if (milestonesMatch) {
        const milestonesText = milestonesMatch[1].trim();
        console.log('Milestones text:', milestonesText);
        
        // Split into individual milestones
        const milestoneBlocks = milestonesText.split(/(?=^-)/).filter(block => block.trim());
        sections.milestones = milestoneBlocks.map(block => block.trim());
        console.log('Milestones parsed:', sections.milestones);
    }

    // Extract Goals
    const goalsMatch = description.match(/Goals:\s*(.*?)(?=Team Members:|$)/);
    if (goalsMatch) {
        const goalsText = goalsMatch[1].trim();
        console.log('Goals text:', goalsText);
        // Split by individual goals (lines starting with -)
        const goals = goalsText.split(/(?=^-)/).filter(goal => goal.trim());
        sections.goals = goals.map(goal => goal.trim());
        console.log('Goals parsed:', sections.goals);
    }

    // Extract Team Members
    const teamMatch = description.match(/Team Members:\s*(.*?)$/);
    if (teamMatch) {
        const teamText = teamMatch[1].trim();
        console.log('Team text:', teamText);
        // Split by individual team members (lines starting with -)
        const teamMembers = teamText.split(/(?=^-)/).filter(member => member.trim());
        sections.teamMembers = teamMembers.map(member => member.trim());
        console.log('Team members parsed:', sections.teamMembers);
    }

    console.log('Final sections:', sections);
    return sections;
}

interface ProposalDetailsProps {
    proposal: Proposal;
}

const SectionCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6 museum-gradient rounded-xl border border-border p-6 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">{title}</h2>
        <div>{children}</div>
    </div>
);

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal }) => {
    const sections = parseProposalDescription(proposal.description);

    return (
        <AppLayout>
            <Head title={`Proposal: ${proposal.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="mx-auto max-w-3xl w-full">
                    <Button variant="ghost" asChild className="mb-8">
                        <Link href="/project/viewproposals">
                    <ArrowLeft className="mr-1 h-4 w-4" /> Back to Proposals
                </Link>
                    </Button>
                <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-foreground">{proposal.title}</h1>
                        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                            <User className="h-5 w-5 text-primary" />
                            <span className="text-sm font-semibold text-primary">
                            {proposal.user_name || `User ID ${proposal.user_id}`}
                        </span>
                    </div>
                </div>
                {/* Structured Project Description - Single Card */}
                <div className="w-full">
                    {(() => {
                        const descriptionSections = parseProposalDescription(proposal.description);
                        console.log('Description sections in component:', descriptionSections);
                        
                        return (
                            <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Proposal Details</h3>
                                <div className="space-y-6">
                                    {/* Overview Section */}
                                    {descriptionSections.overview.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">Overview</h4>
                                            <div className="space-y-3">
                                                {descriptionSections.overview.map((line, index) => (
                                                    <p key={index} className="text-muted-foreground text-base leading-relaxed">
                                                        {line}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Objectives Section */}
                                    {descriptionSections.objectives.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">Objectives</h4>
                                            <div className="space-y-3">
                                                {descriptionSections.objectives.map((line, index) => (
                                                    <div key={index} className="bg-primary/5 rounded-lg p-3 border border-primary/10">
                                                        <div className="flex items-start space-x-3">
                                                            <span className="text-primary font-bold text-base min-w-0 flex-shrink-0">
                                                                {line.split(':')[0]}:
                                                            </span>
                                                            <span className="text-muted-foreground text-base leading-relaxed">
                                                                {line.split(':').slice(1).join(':').trim()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Milestones Section */}
                                    {descriptionSections.milestones.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">Milestones</h4>
                                            <div className="space-y-4">
                                                {descriptionSections.milestones.map((milestone, index) => {
                                                    // Split the milestone block into lines
                                                    const lines = milestone.split(/(?=Budget Breakdown:|$)/);
                                                    const milestoneLine = lines[0];
                                                    const budgetSection = lines[1] || '';
                                                    
                                                    // Extract milestone title, duration, and description
                                                    const milestoneMatch = milestoneLine.match(/^-\s*([^(]+)\s*\(([^)]+)\)\s*:\s*(.+)$/);
                                                    
                                                    if (milestoneMatch) {
                                                        const [, title, duration, description] = milestoneMatch;
                                                        
                                                        // Extract budget items
                                                        const budgetItems = budgetSection
                                                            .split(/(?=^•)/m)
                                                            .filter(item => item.trim() && item.startsWith('•'))
                                                            .map(item => item.trim());
                                                        
                                                        return (
                                                            <div key={index} className="border border-green-200 rounded-lg p-4 bg-green-50 dark:border-green-700 dark:bg-green-900/20 shadow-sm">
                                                                <div className="mb-3">
                                                                    <div className="flex items-start space-x-3">
                                                                        <span className="text-green-600 dark:text-green-400 font-bold text-base min-w-0 flex-shrink-0">
                                                                            {title.trim()} ({duration.trim()}):
                                                                        </span>
                                                                        <span className="text-muted-foreground text-base leading-relaxed">
                                                                            {description.trim()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Budget Breakdown */}
                                                                {budgetItems.length > 0 && (
                                                                    <div className="mt-4 pt-3 border-t border-green-300 dark:border-green-600">
                                                                        <h5 className="text-base font-bold text-green-700 dark:text-green-300 mb-3">Budget Breakdown:</h5>
                                                                        <div className="space-y-2">
                                                                            {budgetItems.map((item, itemIndex) => {
                                                                                // Parse budget item: "• Item: Description - Ksh Amount"
                                                                                const budgetMatch = item.match(/^•\s*([^:]+):\s*(.+?)\s*-\s*Ksh\s*([\d,]+)$/);
                                                                                if (budgetMatch) {
                                                                                    const [, itemTitle, itemDesc, amount] = budgetMatch;
                                                                                                                                                                            return (
                                                                                            <div key={itemIndex} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                                                                                                <div className="flex-1">
                                                                                                    <span className="text-foreground font-semibold text-base">{itemTitle.trim()}:</span>
                                                                                                    <span className="text-muted-foreground text-base ml-2">{itemDesc.trim()}</span>
                                                                                                </div>
                                                                                                <span className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                                                                                                    Ksh {amount}
                                                                                                </span>
                                                                                            </div>
                                                                                        );
                                                                                }
                                                                                return null;
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                    
                                                    // Fallback for non-matching lines
                                                    return (
                                                        <div key={index} className="flex items-start space-x-2">
                                                            <span className="text-green-600 dark:text-green-400 font-medium text-sm min-w-0 flex-shrink-0">
                                                                {milestoneLine.split(':')[0]}:
                                                            </span>
                                                            <span className="text-muted-foreground text-sm">
                                                                {milestoneLine.split(':').slice(1).join(':').trim()}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}



                                    {/* Goals Section */}
                                    {descriptionSections.goals.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">Goals</h4>
                                            <div className="space-y-3">
                                                {descriptionSections.goals.map((line, index) => (
                                                    <div key={index} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                                                        <div className="flex items-start space-x-3">
                                                            <span className="text-blue-600 dark:text-blue-400 font-bold text-base min-w-0 flex-shrink-0">
                                                                {line.split(':')[0]}:
                                                            </span>
                                                            <span className="text-muted-foreground text-base leading-relaxed">
                                                                {line.split(':').slice(1).join(':').trim()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Team Members Section */}
                                    {descriptionSections.teamMembers.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-bold text-foreground mb-3 border-b border-border pb-2">Team Members</h4>
                                            <div className="space-y-3">
                                                {descriptionSections.teamMembers.map((line, index) => (
                                                    <div key={index} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200 dark:border-orange-700">
                                                        <div className="flex items-start space-x-3">
                                                            <span className="text-orange-600 dark:text-orange-400 font-bold text-base min-w-0 flex-shrink-0">
                                                                {line.split('(')[0].trim()}:
                                                            </span>
                                                            <span className="text-muted-foreground text-base leading-relaxed">
                                                                {line.includes('(') ? line.split('(')[1].split(')')[0] : ''}
                                                            </span>
                                                            {line.includes('–') && (
                                                                <span className="text-primary text-base font-medium">
                                                                    – {line.split('–')[1].trim()}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
                
                {/* Fallback: Show raw description if parsing fails */}
                {(() => {
                    const descriptionSections = parseProposalDescription(proposal.description);
                    const hasContent = descriptionSections.overview.length > 0 || 
                                     descriptionSections.objectives.length > 0 || 
                                     descriptionSections.milestones.length > 0 || 
                                     descriptionSections.goals.length > 0 || 
                                     descriptionSections.teamMembers.length > 0;
                    
                    if (!hasContent) {
                        return (
                            <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm mt-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Raw Description</h3>
                                <p className="text-muted-foreground text-sm whitespace-pre-wrap">{proposal.description}</p>
                            </div>
                        );
                    }
                    return null;
                })()}
                {proposal.all_image_urls && proposal.all_image_urls.length > 0 && (
                    <SectionCard title="Attached Images">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                            {proposal.all_image_urls.map((url, idx) => (
                                <div
                                    key={idx}
                                    className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-border bg-muted"
                                >
                                    <img
                                        src={url}
                                        alt={`Proposal Image ${idx + 1}`}
                                        className="h-full w-full object-cover"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/400x400?text=Image';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </SectionCard>
                )}
                {proposal.all_documents_urls && proposal.all_documents_urls.length > 0 && (
                    <SectionCard title="Attached Documents">
                        <div className="flex flex-wrap gap-2">
                            {proposal.all_documents_urls.map((url, idx) => {
                                const fileName = url.split('/').pop()?.split('?')[0] || `Document ${idx + 1}`;
                                return (
                                        <a
                                        key={idx}
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-sm text-primary transition-colors hover:bg-muted"
                                            download
                                        >
                                            <span className="max-w-xs truncate">{fileName}</span>
                                        </a>
                                );
                            })}
                        </div>
                    </SectionCard>
                )}
                </div>
            </div>
        </AppLayout>
    );
};

export default ProposalDetails;
