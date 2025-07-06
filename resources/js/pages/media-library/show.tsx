import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import MediaLibraryLayout from '@/layouts/media-library/layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Calendar,
    Download,
    Edit,
    FileText,
    HardDrive,
    Image,
    Music,
    Share2,
    Trash2,
    Video,
    Archive,
    Copy,
    ExternalLink,
    Info,
    Tag,
    FolderOpen,
    Clock,
    User
} from 'lucide-react';
import { useState } from 'react';
import can from '@/lib/can';
import { relativeRoute } from '@/lib/relative_route';

export default function MediaLibraryShow() {
    const { media, conversions, relatedMedia } = usePage().props as any;
    const [activeTab, setActiveTab] = useState<'details' | 'conversions' | 'related'>('details');

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return Image;
        if (mimeType.startsWith('video/')) return Video;
        if (mimeType.startsWith('audio/')) return Music;
        if (mimeType.startsWith('application/')) return FileText;
        return Archive;
    };

    const getFileTypeColor = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        if (mimeType.startsWith('video/')) return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
        if (mimeType.startsWith('audio/')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        if (mimeType.startsWith('application/')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Media Library',
            href: '/media-library',
        },
        {
            title: media.name,
            href: `/media-library/${media.id}`,
        },
    ];

    const FileIcon = getFileIcon(media.mime_type);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${media.name} - Media Library`} />

            <MediaLibraryLayout>
                <div className="p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{media.name}</h1>
                                <p className="text-muted-foreground">
                                    {media.collection_name || 'No Collection'} • {formatFileSize(media.size)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {can('media.edit') && (
                                <Button variant="outline" asChild>
                                    <Link href={`/media-library/${media.id}/edit`}>
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit
                                    </Link>
                                </Button>
                            )}
                            <Button variant="outline" asChild>
                                <Link href={`/media-library/${media.id}/download`}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                </Link>
                            </Button>
                            {can('media.delete') && (
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this media item?')) {
                                            router.delete(`/media-library/${media.id}`);
                                        }
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Media Preview */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileIcon className="h-5 w-5" />
                                        Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                                        {media.mime_type.startsWith('image/') ? (
                                            <img
                                                src={media.original_url}
                                                alt={media.name}
                                                className="max-w-full max-h-full object-contain rounded-lg"
                                            />
                                        ) : media.mime_type.startsWith('video/') ? (
                                            <video
                                                controls
                                                className="max-w-full max-h-full rounded-lg"
                                                src={media.original_url}
                                            >
                                                Your browser does not support the video tag.
                                            </video>
                                        ) : media.mime_type.startsWith('audio/') ? (
                                            <audio
                                                controls
                                                className="w-full"
                                                src={media.original_url}
                                            >
                                                Your browser does not support the audio tag.
                                            </audio>
                                        ) : (
                                            <div className="text-center">
                                                <FileIcon className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                                                <p className="text-muted-foreground">
                                                    Preview not available for this file type
                                                </p>
                                                <Button asChild className="mt-4">
                                                    <Link href={`/media-library/${media.id}/download`}>
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Download to View
                                                    </Link>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Media Info */}
                        <div className="space-y-6 mb-8">
                            {/* Quick Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-5 w-5" />
                                        Quick Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Type</span>
                                        <Badge variant="secondary" className={getFileTypeColor(media.mime_type)}>
                                            {media.mime_type}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Size</span>
                                        <span className="text-sm font-medium">{formatFileSize(media.size)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Collection</span>
                                        <span className="text-sm font-medium">
                                            {media.collection_name || 'No Collection'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Uploaded</span>
                                        <span className="text-sm font-medium">
                                            {formatDate(media.created_at)}
                                        </span>
                                    </div>
                                    {media.model && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-muted-foreground">Attached to</span>
                                            <span className="text-sm font-medium">
                                                {media.model_type} #{media.model_id}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <Link href={`/media-library/${media.id}/download`}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Download Original
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => copyToClipboard(media.original_url)}
                                    >
                                        <Copy className="h-4 w-4 mr-2" />
                                        Copy URL
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start" asChild>
                                        <a href={media.original_url} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="h-4 w-4 mr-2" />
                                            Open in New Tab
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Tabs */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant={activeTab === 'details' ? 'default' : 'ghost'}
                                    onClick={() => setActiveTab('details')}
                                >
                                    Details
                                </Button>
                                {conversions.length > 0 && (
                                    <Button
                                        variant={activeTab === 'conversions' ? 'default' : 'ghost'}
                                        onClick={() => setActiveTab('conversions')}
                                    >
                                        Conversions ({conversions.length})
                                    </Button>
                                )}
                                {relatedMedia.length > 0 && (
                                    <Button
                                        variant={activeTab === 'related' ? 'default' : 'ghost'}
                                        onClick={() => setActiveTab('related')}
                                    >
                                        Related Media ({relatedMedia.length})
                                    </Button>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            {activeTab === 'details' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">File Information</h3>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">File Name</label>
                                                <p className="text-sm">{media.file_name}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">MIME Type</label>
                                                <p className="text-sm">{media.mime_type}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Disk</label>
                                                <p className="text-sm">{media.disk}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Path</label>
                                                <p className="text-sm font-mono text-xs">{relativeRoute(media.original_url)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {media.custom_properties && Object.keys(media.custom_properties).length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold mb-4">Custom Properties</h3>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                {Object.entries(media.custom_properties).map(([key, value]) => (
                                                    <div key={key}>
                                                        <label className="text-sm font-medium text-muted-foreground capitalize">
                                                            {key.replace('_', ' ')}
                                                        </label>
                                                        <p className="text-sm">{String(value)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Timestamps</h3>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Created</label>
                                                <p className="text-sm">{formatDate(media.created_at)}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-muted-foreground">Updated</label>
                                                <p className="text-sm">{formatDate(media.updated_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'conversions' && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Available Conversions</h3>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {conversions.map((conversion: string) => (
                                            <Card key={conversion}>
                                                <CardContent className="p-4">
                                                    <div className="text-center">
                                                        <h4 className="font-medium mb-2">{conversion}</h4>
                                                        <Button size="sm" asChild>
                                                            <Link href={`/media-library/${media.id}/conversion/${conversion}`}>
                                                                <Download className="h-4 w-4 mr-2" />
                                                                Download
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'related' && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Related Media</h3>
                                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {relatedMedia.map((item: any) => {
                                            const RelatedFileIcon = getFileIcon(item.mime_type);
                                            return (
                                                <Card key={item.id} className="hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                                                            {item.mime_type.startsWith('image/') ? (
                                                                <img
                                                                    src={item.original_url}
                                                                    alt={item.name}
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                />
                                                            ) : (
                                                                <RelatedFileIcon className="h-8 w-8 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <h4 className="font-medium text-sm truncate mb-2">{item.name}</h4>
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                            <Badge variant="secondary" className={getFileTypeColor(item.mime_type)}>
                                                                {item.mime_type.split('/')[1]?.toUpperCase()}
                                                            </Badge>
                                                            <span>{formatFileSize(item.size)}</span>
                                                        </div>
                                                        <Button size="sm" className="w-full mt-3" asChild>
                                                            <Link href={`/media-library/${item.id}`}>
                                                                View Details
                                                            </Link>
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </MediaLibraryLayout>
        </AppLayout>
    );
}
