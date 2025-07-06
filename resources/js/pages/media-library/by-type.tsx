import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import MediaLibraryLayout from '@/layouts/media-library/layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Download,
    Edit,
    Eye,
    Filter,
    Grid,
    List,
    Search,
    Trash2,
    X,
    Image,
    Video,
    Music,
    FileText,
    Archive,
    Play,
    Pause,
    Volume2,
    FileImage,
    FileVideo,
    FileAudio,
    FileArchive
} from 'lucide-react';
import { useEffect, useState } from 'react';
import can from '@/lib/can';

export default function MediaLibraryByType() {
    const { media, type, collections, filters } = usePage().props as any;
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [playingVideo, setPlayingVideo] = useState<number | null>(null);

    const getTypeConfig = (type: string) => {
        const configs = {
            images: {
                title: 'Images',
                icon: Image,
                color: 'text-blue-600',
                bgColor: 'bg-blue-500/10',
                description: 'Photographs, illustrations, and visual content',
                fileIcon: FileImage,
            },
            videos: {
                title: 'Videos',
                icon: Video,
                color: 'text-purple-600',
                bgColor: 'bg-purple-500/10',
                description: 'Video recordings and multimedia content',
                fileIcon: FileVideo,
            },
            documents: {
                title: 'Documents',
                icon: FileText,
                color: 'text-orange-600',
                bgColor: 'bg-orange-500/10',
                description: 'PDFs, Word documents, and text files',
                fileIcon: FileText,
            },
            audio: {
                title: 'Audio',
                icon: Music,
                color: 'text-green-600',
                bgColor: 'bg-green-500/10',
                description: 'Audio recordings and music files',
                fileIcon: FileAudio,
            },
            archives: {
                title: 'Archives',
                icon: Archive,
                color: 'text-gray-600',
                bgColor: 'bg-gray-500/10',
                description: 'Compressed files and archives',
                fileIcon: FileArchive,
            },
        };
        return configs[type as keyof typeof configs] || configs.images;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFilter = (key: string, value: string) => {
        router.get(`/media-library/type/${type}`, { ...filters, [key]: value }, { preserveState: true });
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

    const handleVideoPlay = (id: number) => {
        setPlayingVideo(playingVideo === id ? null : id);
    };

    const typeConfig = getTypeConfig(type);
    const TypeIcon = typeConfig.icon;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Media Library',
            href: '/media-library',
        },
        {
            title: typeConfig.title,
            href: `/media-library/type/${type}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${typeConfig.title} - Media Library`} />

            <MediaLibraryLayout>
                <div className="p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${typeConfig.bgColor}`}>
                                <TypeIcon className={`h-8 w-8 ${typeConfig.color}`} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{typeConfig.title}</h1>
                                <p className="text-muted-foreground">{typeConfig.description}</p>
                            </div>
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

                    {/* Filters and Search */}
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        placeholder={`Search ${typeConfig.title.toLowerCase()}...`}
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
                                <Button variant="outline" onClick={() => router.get(`/media-library/type/${type}`)}>
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
                                const FileIcon = typeConfig.fileIcon;
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
                                                <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                                                    {type === 'images' ? (
                                                        <img
                                                            src={item.original_url}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : type === 'videos' ? (
                                                        <div className="relative w-full h-full">
                                                            <video
                                                                className="w-full h-full object-cover rounded-lg"
                                                                src={item.original_url}
                                                                onPlay={() => handleVideoPlay(item.id)}
                                                                onPause={() => setPlayingVideo(null)}
                                                            />
                                                            {playingVideo !== item.id && (
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="secondary"
                                                                        onClick={() => handleVideoPlay(item.id)}
                                                                    >
                                                                        <Play className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : type === 'audio' ? (
                                                        <div className="text-center">
                                                            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                                            <audio
                                                                controls
                                                                className="w-full"
                                                                src={item.original_url}
                                                            >
                                                                Your browser does not support the audio tag.
                                                            </audio>
                                                        </div>
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
                                                        <Badge variant="secondary" className={`${typeConfig.bgColor} ${typeConfig.color}`}>
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
                                                        <Button size="sm" variant="ghost" asChild>
                                                            <Link href={`/media-library/${item.id}`}>
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        {can('media.edit') && (
                                                            <Button size="sm" variant="ghost" asChild>
                                                                <Link href={`/media-library/${item.id}/edit`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        )}
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
                    ) : (
                        <div className="space-y-2">
                            {media.data.map((item: any) => {
                                const FileIcon = typeConfig.fileIcon;
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
                                                    {type === 'images' ? (
                                                        <img
                                                            src={item.original_url}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    ) : type === 'videos' ? (
                                                        <div className="relative w-full h-full">
                                                            <video
                                                                className="w-full h-full object-cover rounded-lg"
                                                                src={item.original_url}
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <Play className="h-4 w-4 text-white" />
                                                            </div>
                                                        </div>
                                                    ) : type === 'audio' ? (
                                                        <Music className="h-6 w-6 text-muted-foreground" />
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
                                                    <Badge variant="secondary" className={`${typeConfig.bgColor} ${typeConfig.color}`}>
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
                                                        {can('media.edit') && (
                                                            <Button size="sm" variant="ghost" asChild>
                                                                <Link href={`/media-library/${item.id}/edit`}>
                                                                    <Edit className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                        )}
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
