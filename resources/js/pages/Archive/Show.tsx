import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Download, Edit, FileText, Image, User, Eye, Tag } from 'lucide-react';
import can from '@/lib/can';

export default function ArchiveShow() {
    const { archive, documents, images } = usePage().props as any;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Archives',
            href: '/archives',
        },
        {
            title: archive.title,
            href: `/archives/${archive.id}`,
        },
    ];

    const getCategoryBadge = (category: string) => {
        const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
        switch (category) {
            case 'research':
                return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300`;
            case 'context':
                return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300`;
            case 'documentation':
                return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300`;
            case 'historical':
                return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300`;
            case 'cultural':
                return `${baseClasses} bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-300`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/archives">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Archives
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{archive.title}</h1>
                            <div className="mt-2 flex items-center gap-2">
                                <Badge className={getCategoryBadge(archive.category)}>
                                    {archive.category.charAt(0).toUpperCase() + archive.category.slice(1)}
                                </Badge>
                                <span className="text-gray-600">by {archive.author}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {can('archives.edit') && (
                            <Link href={`/archives/${archive.id}/edit`}>
                                <Button>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                        {can('archives.view') && (
                            <Button variant="outline" asChild>
                                <a href={`/archives/${archive.id}/download`}>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Archive Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Archive Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Author:</span>
                                        <span className="text-gray-600">{archive.author}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Created:</span>
                                        <span className="text-gray-600">{formatDate(archive.created_at)}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Updated:</span>
                                        <span className="text-gray-600">{formatDate(archive.updated_at)}</span>
                                    </div>

                                    {archive.user && (
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span className="font-medium">Uploaded by:</span>
                                            <span className="text-gray-600">{archive.user.name}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        {documents && documents.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Documents
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {documents.map((doc: any) => (
                                            <div key={doc.id} className="flex items-center justify-between rounded-lg border p-3">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="h-5 w-5 text-gray-500" />
                                                    <span className="font-medium">{doc.file_name}</span>
                                                </div>
                                                <a
                                                    href={doc.original_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="font-medium text-blue-600 hover:text-blue-800"
                                                >
                                                    View
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Images */}
                        {images && images.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Image className="h-5 w-5" />
                                        Images
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                        {images.map((img: any) => (
                                            <div key={img.id} className="aspect-square overflow-hidden rounded-lg border">
                                                <img
                                                    src={img.original_url}
                                                    alt={img.file_name}
                                                    className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                                                    onClick={() => window.open(img.original_url, '_blank')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Related Artifacts */}
                        {archive.artifacts && archive.artifacts.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Tag className="h-5 w-5" />
                                        Related Artifacts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {archive.artifacts.map((artifact: any) => (
                                            <div key={artifact.id} className="flex items-center justify-between rounded-lg border p-3">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{artifact.title}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        Relationship: {artifact.pivot.relationship_type.replace('_', ' ')}
                                                    </p>
                                                    {artifact.pivot.notes && (
                                                        <p className="text-sm text-gray-500 mt-1">{artifact.pivot.notes}</p>
                                                    )}
                                                </div>
                                                <Button size="sm" variant="ghost" asChild>
                                                    <Link href={`/artifacts/${artifact.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {can('archives.edit') && (
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href={`/archives/${archive.id}/edit`}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            Edit Archive
                                        </Link>
                                    </Button>
                                )}
                                {can('archives.view') && (
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <a href={`/archives/${archive.id}/download`}>
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Files
                                        </a>
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">ID:</span>
                                    <span className="font-mono">{archive.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Category:</span>
                                    <span className="capitalize">{archive.category}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created:</span>
                                    <span>{formatDate(archive.created_at)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Updated:</span>
                                    <span>{formatDate(archive.updated_at)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 