import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import MediaLibraryLayout from '@/layouts/media-library/layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Archive,
    Calendar,
    Download,
    Edit,
    Eye,
    FileText,
    Filter,
    Grid,
    Image,
    List,
    Music,
    Search,
    Trash2,
    Video,
    X,
    BarChart3,
    FolderOpen,
    HardDrive,
    Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';
import can from '@/lib/can';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Media Library',
        href: '/media-library',
    },
];

export default function MediaLibraryIndex() {
    const { media, collections, mediaTypes, stats, filters } = usePage().props as any;
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

    const handleFilter = (key: string, value: string) => {
        router.get('/media-library', { ...filters, [key]: value }, { preserveState: true });
    };

    const handleBulkAction = (action: string) => {
        if (selectedItems.length === 0) return;

        if (action === 'delete') {
            if (confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
                router.post('/media-library/bulk-action', {
                    action: 'delete',
                    media_ids: selectedItems
                });
            }
        } else if (action === 'download') {
            router.post('/media-library/bulk-action', {
                action: 'download',
                media_ids: selectedItems
            });
        }
    };

    const toggleSelection = (id: number) => {
        setSelectedItems(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const selectAll = () => {
        setSelectedItems(media.data.map((item: any) => item.id));
    };

    const clearSelection = () => {
        setSelectedItems([]);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Media Library" />

            <MediaLibraryLayout>
                <div className="p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Media Library</h1>
                            <p className="text-muted-foreground">
                                Manage and organize your museum's digital assets
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => setViewMode('grid')}>
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setViewMode('list')}>
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4 mt-4">
                        <Card>
                            <CardContent className="p-6 flex flex-col items-center">
                                <Archive className="h-8 w-8 mb-2 text-primary" />
                                <div className="text-sm text-muted-foreground">Total</div>
                                <div className="text-2xl font-bold">{stats.total}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex flex-col items-center">
                                <Image className="h-8 w-8 mb-2 text-blue-600" />
                                <div className="text-sm text-muted-foreground">Images</div>
                                <div className="text-2xl font-bold">{stats.images}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex flex-col items-center">
                                <Video className="h-8 w-8 mb-2 text-purple-600" />
                                <div className="text-sm text-muted-foreground">Videos</div>
                                <div className="text-2xl font-bold">{stats.videos}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex flex-col items-center">
                                <FileText className="h-8 w-8 mb-2 text-orange-600" />
                                <div className="text-sm text-muted-foreground">Documents</div>
                                <div className="text-2xl font-bold">{stats.documents}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex flex-col items-center">
                                <Music className="h-8 w-8 mb-2 text-green-600" />
                                <div className="text-sm text-muted-foreground">Audio</div>
                                <div className="text-2xl font-bold">{stats.audio}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6 flex flex-col items-center">
                                <HardDrive className="h-8 w-8 mb-2 text-gray-600" />
                                <div className="text-sm text-muted-foreground">Total Size</div>
                                <div className="text-xl font-bold">{formatFileSize(stats.total_size)}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters and Search */}
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Search media files..."
                                        value={filters.search || ''}
                                        onChange={(e) => handleFilter('search', e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <Select value={filters.collection || ''} onValueChange={(value) => handleFilter('collection', value)}>
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="All Collections" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="null">All Collections</SelectItem>
                                        {collections.map((collection: string) => (
                                            <SelectItem key={collection} value={collection}>
                                                {collection}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={filters.type || ''} onValueChange={(value) => handleFilter('type', value)}>
                                    <SelectTrigger className="w-full sm:w-48">
                                        <SelectValue placeholder="All Types" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="null">All Types</SelectItem>
                                        {mediaTypes.map((type: string) => (
                                            <SelectItem key={type} value={type}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button variant="outline" onClick={() => router.get('/media-library')}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bulk Actions */}
                    {selectedItems.length > 0 && (
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground">
                                            {selectedItems.length} items selected
                                        </span>
                                        <Button variant="outline" size="sm" onClick={selectAll}>
                                            Select All
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={clearSelection}>
                                            Clear
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleBulkAction('download')}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleBulkAction('delete')}
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Media Grid/List */}
                    {viewMode === 'grid' ? (
                        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                            {media.data.map((item: any) => {
                                const FileIcon = getFileIcon(item.mime_type);
                                return (
                                    <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="relative">
                                                {/* Checkbox */}
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => toggleSelection(item.id)}
                                                    className="absolute top-2 left-2 z-10"
                                                />

                                                {/* Media Preview */}
                                                <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center">
                                                    {item.mime_type.startsWith('image/') ? (
                                                        <img
                                                            src={item.original_url || 'https://placehold.co/600x400?text=img'}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <FileIcon className="h-12 w-12 text-muted-foreground" />
                                                    )}
                                                </div>

                                                {/* File Info */}
                                                <div className="space-y-2">
                                                    <h3 className="font-medium text-sm truncate" title={item.name}>
                                                        {item.name}
                                                    </h3>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <Badge variant="secondary" className={getFileTypeColor(item.mime_type)}>
                                                            {item.mime_type.split('/')[1]?.toUpperCase()}
                                                        </Badge>
                                                        <span>{formatFileSize(item.size)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                        <span>{item.collection_name || 'No Collection'}</span>
                                                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">

                                                        {can('media.view') && (
                                                            <Button size="sm" variant="ghost" asChild>
                                                            <Link href={`/media-library/${item.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        )}
                                                        {can('media.edit') && (
                                                        <Button size="sm" variant="ghost" asChild>
                                                            <Link href={`/media-library/${item.id}/edit`}>
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        )}
                                                        {can('media.view') && (
                                                        <Button size="sm" variant="ghost" asChild>
                                                            <Link href={`/media-library/${item.id}/download`}>
                                                                <Download className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {media.data.map((item: any) => {
                                const FileIcon = getFileIcon(item.mime_type);
                                return (
                                    <Card key={item.id} className="group hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedItems.includes(item.id)}
                                                    onChange={() => toggleSelection(item.id)}
                                                />
                                                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                                    {item.mime_type.startsWith('image/') ? (
                                                        <img
                                                            src={item.original_url || 'https://placehold.co/600x400?text=img'}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <FileIcon className="h-6 w-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium truncate">{item.name}</h3>
                                                    <p className="text-sm text-muted-foreground truncate">
                                                        {item.collection_name || 'No Collection'} • {formatFileSize(item.size)}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className={getFileTypeColor(item.mime_type)}>
                                                        {item.mime_type.split('/')[1]?.toUpperCase()}
                                                    </Badge>
                                                    <span className="text-sm text-muted-foreground">
                                                        {new Date(item.created_at).toLocaleDateString()}
                                                    </span>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button size="sm" variant="ghost" asChild>
                                                            <Link href={`/media-library/${item.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button size="sm" variant="ghost" asChild>
                                                            <Link href={`/media-library/${item.id}/edit`}>
                                                                <Edit className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button size="sm" variant="ghost" asChild>
                                                            <Link href={`/media-library/${item.id}/download`}>
                                                                <Download className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {media.links && media.links.length > 3 && (
                        <div className="flex justify-center">
                            <nav className="flex items-center gap-2">
                                {media.links.map((link: any, index: number) => (
                                    <Link
                                        key={index}
                                        href={link.url}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            link.active
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </MediaLibraryLayout>
        </AppLayout>
    );
}
