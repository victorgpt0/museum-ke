import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head, Link, router, useForm } from '@inertiajs/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast, { Toaster } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

import {
  Calendar,
  Users,
  Target,
  TrendingUp,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  Edit,
  Trash2,
  FileText,
  BarChart3,
  Settings,
  ArrowRight,
  FolderOpen,
  Star,
  DollarSign,
  TrendingDown,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import can from '@/lib/can';

interface Proposal {
    id: number;
    title: string;
    description: string;
    user_id: number;
    user_name?: string;
    all_image_urls?: string[];
    all_documents_urls?: any[];
    // Add other proposal fields as needed
}

interface Milestone {
    id: number;
    title: string;
    description: string;
    due_date: string;
    performance_indicator?: number;
    completion?: number;
    budgets?: any[]; // Assuming budgets are of type any[]
}

interface Goal {
    id: number;
    title: string;
    description: string;
    performance: number | null;
    comments: string | null;
    completed: boolean;
    milestone: {
        id: number;
        title: string;
    };
}

interface Project {
    id: number;
    title: string;
    description: string;
    duration: string;
    start_date: string;
    created_at: string;
    updated_at: string;
    proposal: Proposal;
    milestones: Milestone[];
    goals: Goal[];
    milestones_count: number;
    goals_count: number;
    completed_goals_count: number;
    project_progress: number;
    findings: any[]; // Assuming findings are of type any[]
    findings_count?: number;
    team_members_count: number;
    team_members: any[]; // Assuming team_members are of type any[]
    completed: boolean;
    creator_name?: string;
}

interface ProjectDashboardProps {
    project: Project | null;
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ project }) => {
    const [showAddMember, setShowAddMember] = useState(false);
    const [openBudgetDropdowns, setOpenBudgetDropdowns] = useState<{ [key: number]: boolean }>({});
    const [showFullDescription, setShowFullDescription] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        position: '',
        phone_number: '',
    });

    const toggleBudgetDropdown = (milestoneId: number) => {
        setOpenBudgetDropdowns(prev => ({
            ...prev,
            [milestoneId]: !prev[milestoneId]
        }));
    };

    // Function to count words in text
    const countWords = (text: string) => {
        return text.trim().split(/\s+/).length;
    };

    // Function to truncate text to word limit
    const truncateToWordLimit = (text: string, limit: number) => {
        const words = text.trim().split(/\s+/);
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(' ') + '...';
    };

    // Function to parse and format project description
    const parseProjectDescription = (description: string) => {
        const sections: { [key: string]: string[] } = {
            overview: [],
            objectives: [],
            milestones: [],
            budgetBreakdown: [],
            teamMembers: []
        };

        const lines = description.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        let currentSection = 'overview';

        for (const line of lines) {
            if (line.toLowerCase().includes('objectives')) {
                currentSection = 'objectives';
                continue;
            } else if (line.toLowerCase().includes('milestones')) {
                currentSection = 'milestones';
                continue;
            } else if (line.toLowerCase().includes('budget breakdown')) {
                currentSection = 'budgetBreakdown';
                continue;
            } else if (line.toLowerCase().includes('team members')) {
                currentSection = 'teamMembers';
                continue;
            }

            if (line.length > 0) {
                sections[currentSection].push(line);
            }
        }

        return sections;
    };

    const handleAddMember = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!project) return;
        try {
            const response = await fetch(`/projects/${project.id}/team-members`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    fullname: data.name,
                    email_address: data.email,
                    position: data.position,
                    phone_number: data.phone_number || '',
                }),
            });
            if (response.ok) {
                toast.success('Team member added successfully!');
                reset();
                setShowAddMember(false);
            } else {
                const errorData = await response.json();
                if (errorData.errors) {
                    Object.values(errorData.errors).forEach((msg: any) => toast.error(String(msg)));
                } else {
                    toast.error('Failed to add team member.');
                }
            }
        } catch (err) {
            toast.error('An error occurred while saving the team member.');
        }
    };

    // Handler for marking project as complete
    const handleMarkComplete = () => {
        if (!project) return;
        router.post(
            `/project/${project.id}/complete`,
            {},
            {
                onSuccess: () => {
                    toast.success('Project marked as complete!');
                    setTimeout(() => window.location.reload(), 1000);
                },
                onError: () => {
                    toast.error('Failed to mark project as complete.');
                },
            },
        );
    };

    const handleDownloadPDF = async () => {
        if (!project) return;
        const doc = new jsPDF();
        let y = 10;

        // Project Info
        doc.setFontSize(18);
        doc.text(project.title, 10, y);
        y += 8;
        if (project.creator_name) {
            doc.text(`Created by: ${project.creator_name}`, 10, y);
            y += 8;
        }
        doc.setFontSize(12);
        doc.text(doc.splitTextToSize(`Description: ${project.description}`, 180), 10, y);
        y += 8 + Math.ceil(doc.getTextDimensions(doc.splitTextToSize(`Description: ${project.description}`, 180)).h);
        doc.text(`Duration: ${project.duration}`, 10, y);
        y += 8;
        doc.text(`Start Date: ${new Date(project.start_date).toLocaleDateString()}`, 10, y);
        y += 8;
        doc.text(`Project Progress: ${project.project_progress}%`, 10, y);
        y += 8;
        doc.text(`Proposal: ${project.proposal.title}`, 10, y);
        y += 8;
        doc.text(doc.splitTextToSize(`Proposal Description: ${project.proposal.description}`, 180), 10, y);
        y += 12 + Math.ceil(doc.getTextDimensions(doc.splitTextToSize(`Proposal Description: ${project.proposal.description}`, 180)).h);

        // Team Members
        doc.setFontSize(14);
        doc.text('Team Members', 10, y);
        y += 4;
        autoTable(doc, {
            startY: y,
            head: [['Name', 'Email', 'Position', 'Phone']],
            body: (project.team_members || []).map((m: any) => [m.fullname, m.email_address, m.position, m.phone_number]),
            theme: 'grid',
            styles: { fontSize: 10, cellWidth: 'wrap' },
            columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 50 }, 2: { cellWidth: 40 }, 3: { cellWidth: 40 } },
        });
        y = (doc as any).lastAutoTable.finalY + 8;

        // Milestones with Performance and Completion
        doc.setFontSize(14);
        doc.text('Milestones', 10, y);
        y += 4;
        autoTable(doc, {
            startY: y,
            head: [['Title', 'Description', 'Due Date', 'Performance', 'Completion']],
            body: (project.milestones || []).map((m: any) => [
                m.title,
                m.description,
                m.due_date ? new Date(m.due_date).toLocaleDateString() : '',
                m.performance_indicator ? `${m.performance_indicator}/10` : 'N/A',
                m.completion ? `${Math.round(m.completion * 100)}%` : '0%',
            ]),
            theme: 'grid',
            styles: { fontSize: 10, cellWidth: 'wrap' },
            columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 60 }, 2: { cellWidth: 30 }, 3: { cellWidth: 25 }, 4: { cellWidth: 25 } },
        });
        y = (doc as any).lastAutoTable.finalY + 8;

    // Budget Items with Detailed Financial Analysis
    doc.setFontSize(14);
    doc.text('Budget Items', 10, y);
    y += 4;

    // Collect all budget items from all milestones
    const allBudgetItems: any[] = [];
    let totalBudget = 0;
    let totalSpent = 0;

    (project.milestones || []).forEach((milestone: any) => {
      if (milestone.budgets && milestone.budgets.length > 0) {
        milestone.budgets.forEach((budget: any) => {
          const budgetAmount = budget.amount ? parseFloat(budget.amount) : 0;
          const spentAmount = budget.amount_spent ? parseFloat(budget.amount_spent) : 0;
          totalBudget += budgetAmount;
          totalSpent += spentAmount;
          
          const consumption = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
          allBudgetItems.push([
            budget.title,
            budget.description,
            `Ksh ${budgetAmount.toLocaleString()}`,
            `Ksh ${spentAmount.toLocaleString()}`,
            `${consumption.toFixed(1)}%`,
            milestone.title
          ]);
        });
      }
    });

    if (allBudgetItems.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Title', 'Description', 'Budgeted', 'Spent', 'Consumption', 'Milestone']],
        body: allBudgetItems,
        theme: 'grid',
        styles: { fontSize: 9, cellWidth: 'wrap' },
        columnStyles: { 
          0: { cellWidth: 25 }, 
          1: { cellWidth: 40 }, 
          2: { cellWidth: 20 }, 
          3: { cellWidth: 20 }, 
          4: { cellWidth: 20 },
          5: { cellWidth: 25 }
        },
      });
      y = (doc as any).lastAutoTable.finalY + 8;
      
      // Add comprehensive financial summary
      doc.setFontSize(12);
      doc.text('Financial Summary:', 10, y);
      y += 6;
      doc.setFontSize(10);
      doc.text(`Total Budget: Ksh ${totalBudget.toLocaleString()}`, 10, y);
      y += 5;
      doc.text(`Total Spent: Ksh ${totalSpent.toLocaleString()}`, 10, y);
      y += 5;
      doc.text(`Remaining: Ksh ${(totalBudget - totalSpent).toLocaleString()}`, 10, y);
      y += 5;
      const consumption = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
      doc.text(`Budget Consumption: ${consumption.toFixed(1)}%`, 10, y);
      y += 5;
      const efficiency = totalBudget > 0 ? ((totalBudget - totalSpent) / totalBudget) * 100 : 100;
      doc.text(`Financial Efficiency: ${efficiency.toFixed(1)}%`, 10, y);
      y += 8;
    } else {
      doc.setFontSize(10);
      doc.text('No budget items recorded.', 10, y);
      y += 6;
    }

        // Goals with Performance and Comments
        doc.setFontSize(14);
        doc.text('Goals', 10, y);
        y += 4;
        
        if (project.goals && project.goals.length > 0) {
            // Sort goals by completion status and performance
            const sortedGoals = [...project.goals].sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? -1 : 1;
                }
                return (b.performance || 0) - (a.performance || 0);
            });

            autoTable(doc, {
                startY: y,
                head: [['Title', 'Description', 'Performance', 'Status', 'Milestone']],
                body: sortedGoals.map((g: any) => [
                    g.title,
                    g.description || 'No description',
                    g.performance !== null ? `${Math.round(g.performance * 10)}%` : 'N/A',
                    g.completed ? '✅ Completed' : '⏳ In Progress',
                    g.milestone?.title || 'N/A',
                ]),
                theme: 'grid',
                styles: { fontSize: 9, cellWidth: 'wrap' },
                columnStyles: {
                    0: { cellWidth: 30 },
                    1: { cellWidth: 50 },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 25 },
                    4: { cellWidth: 35 },
                },
            });
            y = (doc as any).lastAutoTable.finalY + 8;

            // Add detailed goal comments section
            const goalsWithComments = sortedGoals.filter((g: any) => g.comments && g.comments.trim());
            if (goalsWithComments.length > 0) {
                doc.setFontSize(12);
                doc.text('Goal Comments & Notes:', 10, y);
                y += 6;
                doc.setFontSize(10);
                
                goalsWithComments.forEach((goal: any) => {
                    doc.setFontSize(11);
                    doc.text(`• ${goal.title}:`, 10, y);
                    y += 4;
                    doc.setFontSize(9);
                    const commentLines = doc.splitTextToSize(goal.comments, 180);
                    doc.text(commentLines, 15, y);
                    y += commentLines.length * 4 + 2;
                    
                    // Check if we need a new page
                    if (y > 250) {
                        doc.addPage();
                        y = 10;
                    }
                });
                y += 4;
            }

            // Add goals summary
            const completedGoals = sortedGoals.filter((g: any) => g.completed);
            const totalGoals = sortedGoals.length;
            const completionRate = totalGoals > 0 ? (completedGoals.length / totalGoals) * 100 : 0;
            
            doc.setFontSize(11);
            doc.text('Goals Summary:', 10, y);
            y += 5;
            doc.setFontSize(10);
            doc.text(`Total Goals: ${totalGoals}`, 10, y);
            y += 4;
            doc.text(`Completed: ${completedGoals.length}`, 10, y);
            y += 4;
            doc.text(`Completion Rate: ${completionRate.toFixed(1)}%`, 10, y);
            y += 8;
        } else {
            doc.setFontSize(10);
            doc.text('No goals defined for this project.', 10, y);
            y += 6;
        }

        // Findings with Images
        doc.setFontSize(14);
        doc.text('Key Findings', 10, y);
        y += 6;
        
        if (project.findings && project.findings.length > 0) {
            for (const f of project.findings) {
                // Title
                doc.setFontSize(12);
                doc.text(f.title, 10, y);
                y += 6;
                
                // Description
                const descLines = doc.splitTextToSize(f.description || '', 180);
                doc.setFontSize(10);
                doc.text(descLines, 10, y);
                y += descLines.length * 5 + 2;
                
                // Documents
                if (f.all_documents_urls && f.all_documents_urls.length > 0) {
                    doc.setFontSize(10);
                    doc.text('Documents: ' + f.all_documents_urls.map((d: any) => d.file_name || d.name).join(', '), 10, y);
                    y += 6;
                }
                
                // If near bottom, add new page
                if (y > 260) {
                    doc.addPage();
                    y = 10;
                }
            }
        } else {
            doc.setFontSize(10);
            doc.text('No findings recorded.', 10, y);
            y += 6;
        }

        // Project Images Section
        doc.setFontSize(14);
        doc.text('Project Images & Media', 10, y);
        y += 8;

        // Collect all images from findings
        const allImages: { url: string; title: string; finding?: string }[] = [];
        
        if (project.findings && project.findings.length > 0) {
            for (const f of project.findings) {
                if (f.all_image_urls && f.all_image_urls.length > 0) {
                    f.all_image_urls.forEach((imgUrl: string) => {
                        allImages.push({
                            url: imgUrl,
                            title: f.title,
                            finding: f.title
                        });
                    });
                }
            }
        }

        // Add images from project proposal if available
        if (project.proposal && (project.proposal as any).all_image_urls) {
            (project.proposal as any).all_image_urls.forEach((imgUrl: string) => {
                allImages.push({
                    url: imgUrl,
                    title: 'Project Proposal',
                    finding: 'Proposal Document'
                });
            });
        }

        if (allImages.length > 0) {
            doc.setFontSize(11);
            doc.text(`Total Images: ${allImages.length}`, 10, y);
            y += 6;

            // Process images in batches to avoid memory issues
            const batchSize = 4; // Number of images per row
            for (let i = 0; i < allImages.length; i += batchSize) {
                const batch = allImages.slice(i, i + batchSize);
                
                // Check if we need a new page
                if (y > 200) {
                    doc.addPage();
                    y = 10;
                }

                // Add batch title
                doc.setFontSize(10);
                doc.text(`Images ${i + 1}-${Math.min(i + batchSize, allImages.length)}:`, 10, y);
                y += 4;

                // Process each image in the batch
                for (let j = 0; j < batch.length; j++) {
                    const img = batch[j];
                    const xPos = 10 + (j * 45); // 45mm spacing between images
                    
                    try {
                        // Fetch image and convert to base64
                        const imgData = await fetch(img.url)
                            .then((res) => res.blob())
                            .then(
                                (blob) =>
                                    new Promise<string>((resolve, reject) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => resolve(reader.result as string);
                                        reader.onerror = reject;
                                        reader.readAsDataURL(blob);
                                    }),
                            );
                        
                        // Add image (40x40 mm)
                        doc.addImage(imgData, 'JPEG', xPos, y, 40, 40, undefined, 'FAST');
                        
                        // Add image caption
                        doc.setFontSize(8);
                        const caption = img.finding ? `${img.finding}` : 'Project Image';
                        const captionLines = doc.splitTextToSize(caption, 35);
                        doc.text(captionLines, xPos, y + 42);
                        
                    } catch (e) {
                        // If image fails to load, add placeholder
                        doc.setFontSize(8);
                        doc.text('[Image Error]', xPos, y + 20);
                        doc.text(img.finding || 'Project Image', xPos, y + 42);
                    }
                }
                
                y += 60; // Space for image + caption
                
                // Add new page if we have more images
                if (i + batchSize < allImages.length && y > 200) {
                    doc.addPage();
                    y = 10;
                }
            }
        } else {
            doc.setFontSize(10);
            doc.text('No images available for this project.', 10, y);
            y += 6;
        }

        doc.save(`${project.title.replace(/[^a-z0-9]/gi, '_')}_details.pdf`);
    };

  const MetricCard = ({
    title,
    value,
    icon: Icon,
    color,
    actionText,
    actionLink,
    isEmpty = false
  }: {
    title: string;
    value: string | number;
    icon: any;
    color: string;
    actionText: string;
    actionLink: string;
    isEmpty?: boolean;
  }) => (
    <div className={`museum-gradient rounded-xl border border-border p-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      {(isEmpty || actionLink.startsWith('#')) && (
        actionLink.startsWith('#') ? (
          <button
            onClick={() => {
              const element = document.querySelector(actionLink);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium"
          >
            {actionText}
            <ArrowRight className="h-4 w-4 ml-1" />
          </button>
        ) : (
          <Link
            href={actionLink}
            className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium"
          >
            {actionText}
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        )
      )}
    </div>
  );

  const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionText,
    actionLink
  }: {
    icon: any;
    title: string;
    description: string;
    actionText: string;
    actionLink: string;
  }) => (
    <div className="text-center py-8">
      <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button asChild>
        <Link href={actionLink}>
          <Plus className="h-4 w-4 mr-2" />
          {actionText}
        </Link>
      </Button>
    </div>
  );

  // Financial data processing
  const processFinancialData = () => {
    if (!project?.milestones) return null;

    const milestoneData = project.milestones.map((milestone: any) => {
      const totalBudget = milestone.budgets?.reduce((sum: number, budget: any) => sum + (budget.amount ? parseFloat(budget.amount) : 0), 0) || 0;
      const totalSpent = milestone.budgets?.reduce((sum: number, budget: any) => sum + (budget.amount_spent ? parseFloat(budget.amount_spent) : 0), 0) || 0;

      return {
        milestone: milestone.title,
        budget: totalBudget,
        spent: totalSpent,
        consumption: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
      };
    });

    const overallBudget = milestoneData.reduce((sum, item) => sum + item.budget, 0);
    const overallSpent = milestoneData.reduce((sum, item) => sum + item.spent, 0);
    const overallConsumption = overallBudget > 0 ? (overallSpent / overallBudget) * 100 : 0;

    return {
      milestoneData,
      overallBudget,
      overallSpent,
      overallConsumption
    };
  };

  const financialData = processFinancialData();

  // Chart configuration
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
        }
      },
      title: {
        display: true,
        text: 'Budget vs Expenditure by Milestone (Log Scale)',
        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
      },
    },
    scales: {
      y: {
        type: 'logarithmic' as const,
        beginAtZero: false,
        min: 1, // Start from 1 to avoid log(0) issues
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
          callback: function(value: any) {
            if (value === 0) return 'Ksh 0';
            return 'Ksh ' + value.toLocaleString();
          }
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        }
      },
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'
        }
      }
    }
  };

  const efficiencyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
        }
      },
      title: {
        display: true,
        text: 'Financial Efficiency Overview',
        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151'
      },
    }
  };

    // Show message if no project found
    if (!project) {
        return (
            <>
                <Head title="Project Dashboard" />
                <div className="min-h-screen bg-gray-50 py-8">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="rounded-lg bg-white p-8 shadow-md">
                            <EmptyState
                                icon={FolderOpen}
                                title="No Project Found"
                                description="You don't have any active projects yet. Create a proposal to get started."
                                actionText="Create Proposal"
                                actionLink="/proposals/create"
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <AppLayout>
            <Head title={`${project.title} - Dashboard`} />

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
                    loading: {
                        style: {
                            background: '#eff6ff',
                            color: '#1e40af',
                            border: '1px solid #bfdbfe',
                        },
                    },
                }}
            />

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
                <div className="mx-auto max-w-7xl w-full">
                    {/* Project Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-bold text-foreground">{project.title}</h1>
                            <Button
                                onClick={handleDownloadPDF}
                                type="button"
                            >
                                <FileText className="mr-2 h-4 w-4" />
                                Download Project PDF
                            </Button>
                        </div>

                        {/* Structured Project Description - Full Width */}
                        <div className="w-full">
                            {(() => {
                                const descriptionSections = parseProjectDescription(project.description);

                                return (
                                    <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-foreground mb-4">Project Details</h3>
                                        <div className="space-y-6">
                                            {/* Overview Section */}
                                            {descriptionSections.overview.length > 0 && (
                                                <div>
                                                    <h4 className="text-md font-medium text-foreground mb-2">Overview</h4>
                                                    <div className="space-y-2">
                                                        {descriptionSections.overview.map((line, index) => {
                                                            const wordCount = countWords(line);
                                                            const displayText = showFullDescription ? line : truncateToWordLimit(line, 100);

                                                            return (
                                                                <div key={index}>
                                                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                                                        {displayText}
                                                                    </p>
                                                                    {wordCount > 100 && (
                                                                        <Button
                                                                            onClick={() => setShowFullDescription(!showFullDescription)}
                                                                            variant="link"
                                                                            className="text-primary text-sm mt-1 p-0 h-auto"
                                                                            type="button"
                                                                        >
                                                                            {showFullDescription ? 'Show Less' : 'Show More'}
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Objectives Section */}
                                            {descriptionSections.objectives.length > 0 && (
                                                <div>
                                                    <h4 className="text-md font-medium text-foreground mb-2">Objectives</h4>
                                                    <div className="space-y-2">
                                                        {descriptionSections.objectives.map((line, index) => (
                                                            <div key={index} className="flex items-start space-x-2">
                                                                <span className="text-primary font-medium text-sm min-w-0 flex-shrink-0">
                                                                    {line.split(':')[0]}:
                                                                </span>
                                                                <span className="text-muted-foreground text-sm">
                                                                    {line.split(':').slice(1).join(':').trim()}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Milestones Section */}
                                            {descriptionSections.milestones.length > 0 && (
                                                <div>
                                                    <h4 className="text-md font-medium text-foreground mb-2">Milestones</h4>
                                                    <div className="space-y-2">
                                                        {descriptionSections.milestones.map((line, index) => (
                                                            <div key={index} className="flex items-start space-x-2">
                                                                <span className="text-green-600 dark:text-green-400 font-medium text-sm min-w-0 flex-shrink-0">
                                                                    {line.split(':')[0]}:
                                                                </span>
                                                                <span className="text-muted-foreground text-sm">
                                                                    {line.split(':').slice(1).join(':').trim()}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Budget Breakdown Section */}
                                            {descriptionSections.budgetBreakdown.length > 0 && (
                                                <div>
                                                    <h4 className="text-md font-medium text-foreground mb-2">Budget Breakdown</h4>
                                                    <div className="space-y-2">
                                                        {descriptionSections.budgetBreakdown.map((line, index) => (
                                                            <div key={index} className="flex items-center justify-between">
                                                                <span className="text-muted-foreground text-sm">
                                                                    {line.split('–')[0].trim()}
                                                                </span>
                                                                <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                                                                    {line.split('–')[1]?.trim() || ''}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Team Members Section */}
                                            {descriptionSections.teamMembers.length > 0 && (
                                                <div>
                                                    <h4 className="text-md font-medium text-foreground mb-2">Team Members</h4>
                                                    <div className="space-y-2">
                                                        {descriptionSections.teamMembers.map((line, index) => (
                                                            <div key={index} className="flex items-start space-x-2">
                                                                <span className="text-orange-600 dark:text-orange-400 font-medium text-sm min-w-0 flex-shrink-0">
                                                                    {line.split('(')[0].trim()}:
                                                                </span>
                                                                <span className="text-muted-foreground text-sm">
                                                                    {line.includes('(') ? line.split('(')[1].split(')')[0] : ''}
                                                                </span>
                                                                {line.includes('–') && (
                                                                    <span className="text-primary text-sm">
                                                                        – {line.split('–')[1].trim()}
                                                                    </span>
                                                                )}
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

                        <div className="mt-4 flex items-center space-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center">
                                <Calendar className="mr-1 h-4 w-4" />
                                Started: {new Date(project.start_date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-1 h-4 w-4" />
                                Duration: {project.duration}
                            </div>
                        </div>
                    </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <MetricCard
              title="Milestones"
              value={project.milestones_count || 0}
              icon={Target}
              color="border-green-500"
              actionText="Add Milestones"
              actionLink={`/projects/${project.id}/addmilestone`}
              isEmpty={!project.milestones_count || project.milestones_count === 0}
            />
            <MetricCard
              title="Goals"
              value={project.goals_count || 0}
              icon={BarChart3}
              color="border-blue-500"
              actionText="Set Goals"
              actionLink={`/projects/${project.id}/goals`}
              isEmpty={!project.goals_count || project.goals_count === 0}
            />
            <MetricCard
              title="Findings"
              value={project.findings_count || 0}
              icon={FileText}
              color="border-purple-500"
              actionText="Add Findings"
              actionLink={`/projects/${project.id}/findings/create`}
              isEmpty={!project.findings_count || project.findings_count === 0}
            />
            <MetricCard
              title="Team Members"
              value={project.team_members_count || 0}
              icon={Users}
              color="border-orange-500"
              actionText="Add Team"
              actionLink={`/projects/${project.id}/team-members/create`}
              isEmpty={!project.team_members_count || project.team_members_count === 0}
            />
            {financialData && (
              <MetricCard
                title="Budget Consumption"
                value={`${financialData.overallConsumption.toFixed(1)}%`}
                icon={DollarSign}
                color="border-emerald-500"
                actionText="View Details"
                actionLink="#financial-section"
                isEmpty={false}
              />
            )}
          </div>

          {/* Progress Overview */}
          <div className="museum-gradient rounded-xl border border-border p-6 shadow-sm mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4">Project Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">Overall Completion</span>
                  <span className="text-sm font-medium text-foreground">
                    {project.project_progress}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.project_progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {project.completed_goals_count} of {project.goals_count} goals completed
                  {project.goals_count === 0 && ' - Set up goals and milestones to track progress'}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Overview */}
          {financialData && (
            <div id="financial-section" className="museum-gradient rounded-xl border border-border p-6 shadow-sm mb-12">
              <h3 className="text-lg font-semibold text-foreground mb-8">Financial Overview</h3>
              {/* Financial Statistics Cards */}
              <div className="flex flex-wrap gap-6 mb-10">
                <div className="flex-1 min-w-[220px] max-w-xs bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-5 flex flex-col justify-between shadow-sm">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Total Budget</p>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">Ksh</span>
                    <span className="text-3xl font-bold text-blue-900 dark:text-blue-100 break-all">{financialData.overallBudget.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-[220px] max-w-xs bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-5 flex flex-col justify-between shadow-sm">
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">Total Spent</p>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-semibold text-orange-900 dark:text-orange-100">Ksh</span>
                    <span className="text-3xl font-bold text-orange-900 dark:text-orange-100 break-all">{financialData.overallSpent.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-[220px] max-w-xs bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-5 flex flex-col justify-between shadow-sm">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">Remaining</p>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-semibold text-green-900 dark:text-green-100">Ksh</span>
                    <span className="text-3xl font-bold text-green-900 dark:text-green-100 break-all">{(financialData.overallBudget - financialData.overallSpent).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-[220px] max-w-xs bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-5 flex flex-col justify-between shadow-sm">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">Consumption</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-purple-900 dark:text-purple-100">{financialData.overallConsumption.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
                {/* Budget vs Expenditure Chart */}
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Budget vs Expenditure by Milestone</h4>
                  {financialData.milestoneData.length > 0 ? (
                    <Bar
                      data={{
                        labels: financialData.milestoneData.map(item => item.milestone),
                        datasets: [
                          {
                            label: 'Budgeted Amount',
                            data: financialData.milestoneData.map(item => item.budget),
                            backgroundColor: 'rgba(59, 130, 246, 0.8)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1,
                          },
                          {
                            label: 'Amount Spent',
                            data: financialData.milestoneData.map(item => item.spent),
                            backgroundColor: 'rgba(249, 115, 22, 0.8)',
                            borderColor: 'rgba(249, 115, 22, 1)',
                            borderWidth: 1,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400 text-center">
                      No budget data available
                    </div>
                  )}
                </div>
                {/* Efficiency Chart */}
                <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Financial Efficiency</h4>
                  {financialData.overallBudget > 0 ? (
                    <Doughnut
                      data={{
                        labels: ['Spent', 'Remaining'],
                        datasets: [
                          {
                            data: [financialData.overallSpent, financialData.overallBudget - financialData.overallSpent],
                            backgroundColor: [
                              'rgba(249, 115, 22, 0.8)',
                              'rgba(34, 197, 94, 0.8)',
                            ],
                            borderColor: [
                              'rgba(249, 115, 22, 1)',
                              'rgba(34, 197, 94, 1)',
                            ],
                            borderWidth: 2,
                          },
                        ],
                      }}
                      options={efficiencyChartOptions}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400 text-center">
                      No budget data available
                    </div>
                  )}
                </div>
              </div>
              {/* Detailed Budget Table */}
              {financialData.milestoneData.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">Detailed Budget Breakdown</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Milestone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Budgeted</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Spent</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Remaining</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">Consumption</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {financialData.milestoneData.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.milestone}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Ksh {item.budget.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Ksh {item.spent.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Ksh {(item.budget - item.spent).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                item.consumption <= 20 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                item.consumption <= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {item.consumption.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

                    <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Team Members Section */}
                        <div
                            id="team-section"
                            className="max-h-100 overflow-y-auto museum-gradient rounded-xl border border-border p-6 shadow-sm"
                        >
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-foreground">Team Members</h3>
                                {can('projects.edit') && (
                                    <Button
                                        asChild
                                        disabled={project.completed}
                                    >
                                        <Link href={`/projects/${project.id}/team-members/create`}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Member
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {!project.team_members || project.team_members.length === 0 ? (
                                <EmptyState
                                    icon={Users}
                                    title="No Team Members Yet"
                                    description="Add team members to collaborate on this project"
                                    actionText="Add First Member"
                                    actionLink={`/projects/${project.id}/team-members/create`}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {project.team_members.map((member: any) => (
                                        <div
                                            key={member.id}
                                            className="rounded-lg border border-blue-200 bg-blue-50 p-4 transition-shadow hover:shadow-sm dark:border-blue-700 dark:bg-blue-900/20"
                                        >
                                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <h4 className="mb-1 font-medium text-gray-900 dark:text-white">{member.fullname}</h4>
                                                    <div className="mb-1 text-sm text-gray-600 dark:text-gray-300">{member.position}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Email: {member.email_address}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">Phone: {member.phone_number}</div>
                                                </div>
                                                <span className="mt-1 ml-4 text-xs text-gray-400 dark:text-gray-500">
                                                    {member.created_at ? new Date(member.created_at).toLocaleDateString() : ''}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Goals Section */}
                        <div className="max-h-100 overflow-y-auto museum-gradient rounded-xl border border-border p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-foreground">Goals</h3>
                                {can('projects.edit') && (
                                    <Button
                                        asChild
                                        disabled={project.completed}
                                    >
                                        <Link href={`/projects/${project.id}/goals`}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Goal
                                        </Link>
                                    </Button>
                                )}
                            </div>

                            {!project.goals || project.goals.length === 0 ? (
                                <EmptyState
                                    icon={BarChart3}
                                    title="No Goals Defined"
                                    description="Set specific goals to track your project's success"
                                    actionText="Define Goals"
                                    actionLink={`/projects/${project.id}/goals`}
                                />
                            ) : (
                                <div className="space-y-4">
                                    {project.goals
                                        .sort((a, b) => {
                                            // Sort completed goals first, then by performance (descending)
                                            if (a.completed !== b.completed) {
                                                return a.completed ? -1 : 1;
                                            }
                                            return (b.performance || 0) - (a.performance || 0);
                                        })
                                        .map((goal) => (
                                            <div
                                                key={goal.id}
                                                className={`rounded-lg border p-4 transition-shadow hover:shadow-sm ${
                                                    goal.completed
                                                        ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20'
                                                        : 'border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="mb-1 flex items-center gap-2">
                                                            <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                                                            {goal.completed && (
                                                                <Badge variant="default" className="bg-green-600 text-xs text-white">
                                                                    Completed
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {goal.description && (
                                                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{goal.description}</p>
                                                        )}
                                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                            <Target className="mr-1 h-4 w-4" />
                                                            <span>Milestone: {goal.milestone.title}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center space-x-4">
                                                        {goal.performance !== null && (
                                                            <div className="flex items-center text-sm">
                                                                <BarChart3 className="mr-1 h-4 w-4 text-blue-500" />
                                                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                                                    {goal.performance * 10}%
                                                                </span>
                                                            </div>
                                                        )}
                                                        {goal.completed && (
                                                            <div className="flex items-center text-sm">
                                                                <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                                                                <span className="text-gray-700 dark:text-gray-300">Completed</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {goal.comments && (
                                                    <div className="mt-3 rounded-md bg-gray-50 p-3 dark:bg-gray-600">
                                                        <p className="text-sm text-gray-700 dark:text-gray-200">{goal.comments}</p>
                                                    </div>
                                                )}

                                                <div className="mt-3 flex justify-end">
                                                    <Link
                                                        href={`/projects/${project.id}/milestones/${goal.milestone.id}`}
                                                        className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                                        style={project.completed ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                                        tabIndex={project.completed ? -1 : 0}
                                                        aria-disabled={project.completed}
                                                    >
                                                        View Milestone
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Milestones Section - Full Width */}
                    <div className="mb-8 museum-gradient rounded-xl border border-border p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">Milestones</h3>
                            {can('projects.edit') && (
                                <Button
                                    asChild
                                    disabled={project.completed}
                                >
                                    <Link href={`/projects/${project.id}/milestones/create`}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Milestone
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {project.milestones.length === 0 ? (
                            <EmptyState
                                icon={Target}
                                title="No Milestones Set"
                                description="Break down your project into manageable milestones"
                                actionText="Create Milestone"
                                actionLink={`/projects/${project.id}/milestones/create`}
                            />
                        ) : (
                            <div className="space-y-4">
                                {project.milestones.map((milestone) => (
                                    <div
                                        key={milestone.id}
                                        className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-sm dark:border-gray-600 dark:bg-gray-700"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white">{milestone.title}</h4>
                                                {milestone.description && (
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{milestone.description}</p>
                                                )}
                                            </div>
                                            {milestone.due_date && (
                                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                    <Calendar className="mr-1 h-4 w-4" />
                                                    {new Date(milestone.due_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Additional milestone details */}
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                {milestone.performance_indicator && (
                                                    <div className="flex items-center text-sm">
                                                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {milestone.performance_indicator}/10
                                                        </span>
                                                    </div>
                                                )}
                                                {milestone.completion && (
                                                    <div className="flex items-center text-sm">
                                                        <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                                                        <span className="text-gray-700 dark:text-gray-300">
                                                            {milestone.completion * 10}% complete
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                {/* Budget Dropdown Toggle */}
                                                {milestone.budgets && milestone.budgets.length > 0 && (
                                                    <Button
                                                        onClick={() => toggleBudgetDropdown(milestone.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-sm text-muted-foreground hover:text-foreground"
                                                        type="button"
                                                    >
                                                        <DollarSign className="mr-1 h-4 w-4" />
                                                        Budget Details
                                                        {openBudgetDropdowns[milestone.id] ? (
                                                            <ChevronUp className="ml-1 h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="ml-1 h-4 w-4" />
                                                        )}
                                                    </Button>
                                                )}

                                                <Link
                                                    href={`/projects/${project.id}/milestones/${milestone.id}`}
                                                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                                                    style={project.completed ? { pointerEvents: 'none', opacity: 0.5 } : {}}
                                                    tabIndex={project.completed ? -1 : 0}
                                                    aria-disabled={project.completed}
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Budget Information - Collapsible */}
                                        {milestone.budgets && milestone.budgets.length > 0 && (
                                            <div className={`mt-4 border-t border-gray-200 pt-4 dark:border-gray-600 transition-all duration-200 ${
                                                openBudgetDropdowns[milestone.id] ? 'block' : 'hidden'
                                            }`}>
                                                <h5 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">Budget Items:</h5>
                                                <div className="space-y-2">
                                                    {milestone.budgets.map((budget: any) => (
                                                        <div
                                                            key={budget.id}
                                                            className="flex items-center justify-between rounded bg-white p-2 text-sm dark:bg-gray-600"
                                                        >
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-white">{budget.title}</p>
                                                                <p className="text-gray-600 dark:text-gray-300">{budget.description}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-medium text-green-600 dark:text-green-400">
                                                                    Ksh {budget.amount}
                                                                </p>
                                                                {budget.amount_spent > 0 && (
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                        Spent: Ksh {budget.amount_spent}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Findings Section */}
                    <div className="mb-8 museum-gradient rounded-xl border border-border p-6 shadow-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-foreground">Key Findings</h3>
                            {can('projects.edit') && (
                                <Button
                                    asChild
                                    disabled={project.completed}
                                >
                                    <Link href={`/projects/${project.id}/findings/create`}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Add Finding
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {!project.findings || project.findings.length === 0 ? (
                            <EmptyState
                                icon={FileText}
                                title="No Findings Recorded"
                                description="Document important discoveries and insights from your project"
                                actionText="Record Finding"
                                actionLink={`/projects/${project.id}/findings/create`}
                            />
                        ) : (
                            <div className="space-y-4">
                                {project.findings.map((finding: any) => (
                                    <div
                                        key={finding.id}
                                        className="rounded-lg border border-purple-200 bg-purple-50 p-4 transition-shadow hover:shadow-sm dark:border-purple-700 dark:bg-purple-900/20"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="mb-1 font-medium text-gray-900 dark:text-white">{finding.title}</h4>
                                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{finding.description}</p>
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {finding.all_documents_urls &&
                                                        finding.all_documents_urls.length > 0 &&
                                                        finding.all_documents_urls.map((doc: any, idx: number) => (
                                                            <a
                                                                key={'doc-' + idx}
                                                                href={doc.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-50 dark:border-gray-600 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-blue-900"
                                                                download
                                                            >
                                                                <FileText className="mr-1 h-4 w-4 text-blue-500" />
                                                                <span className="max-w-xs truncate">{doc.file_name || doc.name}</span>
                                                            </a>
                                                        ))}
                                                    {finding.all_image_urls &&
                                                        finding.all_image_urls.length > 0 &&
                                                        finding.all_image_urls.map((imgUrl: string, idx: number) => {
                                                            // Try to extract filename from URL
                                                            const fileName = imgUrl.split('/').pop()?.split('?')[0] || `image_${idx + 1}`;
                                                            return (
                                                                <a
                                                                    key={'img-' + idx}
                                                                    href={imgUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-green-700 transition-colors hover:bg-green-50 dark:border-gray-600 dark:bg-gray-800 dark:text-green-300 dark:hover:bg-green-900"
                                                                    download
                                                                >
                                                                    <img
                                                                        src={imgUrl}
                                                                        alt="Finding Image"
                                                                        className="mr-1 h-4 w-4 rounded object-cover"
                                                                        style={{ minWidth: '1rem' }}
                                                                    />
                                                                    <span className="max-w-xs truncate">{fileName}</span>
                                                                </a>
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                            <span className="mt-1 ml-4 text-xs text-gray-400 dark:text-gray-500">
                                                {finding.created_at ? new Date(finding.created_at).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {/* Project Proposal Section */}
                <div className="mb-8 museum-gradient rounded-xl border border-border p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Project Proposal</h3>
                        <Button asChild>
                            <Link href={`/proposals/${project.proposal.id}`}>
                                <FileText className="mr-2 h-4 w-4" />
                                View Full Proposal
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="mb-2 text-md font-medium text-foreground">{project.proposal.title}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {project.proposal.description.length > 300
                                    ? `${project.proposal.description.substring(0, 300)}...`
                                    : project.proposal.description
                                }
                            </p>
                            {project.proposal.description.length > 300 && (
                                <Link
                                    href={`/proposals/${project.proposal.id}`}
                                    className="inline-flex items-center text-sm text-primary hover:underline mt-2"
                                >
                                    Read more
                                    <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            )}
                        </div>


                    </div>
                </div>

                {/* Mark Project as Complete Button */}
                {!project.completed && can('projects.edit') && (
                    <Button
                        onClick={handleMarkComplete}
                        variant="default"
                        className="mr-2 bg-green-600 hover:bg-green-700"
                        type="button"
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Mark Project as Complete
                    </Button>
                )}
                {project.completed && (
                    <Badge variant="secondary" className="ml-2">
                        Completed
                    </Badge>
                )}
            </div>
        </AppLayout>
    );
};

export default ProjectDashboard;
