import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import MediaLibraryLayout from '@/layouts/media-library/layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    Save,
    X,
    Image,
    Video,
    Music,
    FileText,
    Archive,
    Tag,
    FolderOpen,
    Info
} from 'lucide-react';
import { useState } from 'react';
import can from '@/lib/can';

export default function MediaLibraryEdit() {
    const { media, collections } = usePage().props as any;
    const [customProperties, setCustomProperties] = useState<Record<string, string>>(
        media.custom_properties || {}
    );

    const { data, setData, put, processing, errors } = useForm({
        name: media.name || '',
        collection_name: media.collection_name || '',
        custom_properties: customProperties,
    });

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return Image;
        if (mimeType.startsWith('video/')) return Video;
        if (mimeType.startsWith('audio/')) return Music;
        if (mimeType.startsWith('application/')) return FileText;
        return Archive;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const addCustomProperty = () => {
        const key = `property_${Object.keys(customProperties).length + 1}`;
        setCustomProperties(prev => ({ ...prev, [key]: '' }));
    };

    const removeCustomProperty = (key: string) => {
        const newProperties = { ...customProperties };
        delete newProperties[key];
        setCustomProperties(newProperties);
        setData('custom_properties', newProperties);
    };

    const updateCustomProperty = (key: string, value: string) => {
        const newProperties = { ...customProperties, [key]: value };
        setCustomProperties(newProperties);
        setData('custom_properties', newProperties);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/media-library/${media.id}`);
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
        {
            title: 'Edit',
            href: `/media-library/${media.id}/edit`,
        },
    ];

    const FileIcon = getFileIcon(media.mime_type);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${media.name} - Media Library`} />

            <MediaLibraryLayout>
                <div className="p-4 md:p-6 lg:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Edit Media</h1>
                                <p className="text-muted-foreground">
                                    Update metadata and properties for {media.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                        {/* Media Preview */}
                        <div className="lg:col-span-1">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileIcon className="h-5 w-5" />
                                        Preview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                                        {media.mime_type.startsWith('image/') ? (
                                            <img
                                                src={media.original_url}
                                                alt={media.name}
                                                className="max-w-full max-h-full object-contain rounded-lg"
                                            />
                                        ) : (
                                            <FileIcon className="h-16 w-16 text-muted-foreground" />
                                        )}
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Type:</span>
                                            <span className="font-medium">{media.mime_type}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Size:</span>
                                            <span className="font-medium">{formatFileSize(media.size)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Uploaded:</span>
                                            <span className="font-medium">
                                                {new Date(media.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Edit Form */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-5 w-5" />
                                        Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Enter media name"
                                            className="mt-1"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="collection">Collection</Label>
                                        <Select
                                            value={data.collection_name}
                                            onValueChange={(value) => setData('collection_name', value)}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select a collection" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="null">No Collection</SelectItem>
                                                {collections.map((collection: string) => (
                                                    <SelectItem key={collection} value={collection}>
                                                        {collection}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.collection_name && (
                                            <p className="text-sm text-red-600 mt-1">{errors.collection_name}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Custom Properties */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Tag className="h-5 w-5" />
                                        Custom Properties
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Add custom metadata properties for this media item
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {Object.entries(customProperties).map(([key, value]) => (
                                        <div key={key} className="flex gap-2">
                                            <Input
                                                value={key}
                                                onChange={(e) => {
                                                    const newProperties = { ...customProperties };
                                                    delete newProperties[key];
                                                    newProperties[e.target.value] = value;
                                                    setCustomProperties(newProperties);
                                                    setData('custom_properties', newProperties);
                                                }}
                                                placeholder="Property name"
                                                className="flex-1"
                                            />
                                            <Input
                                                value={value}
                                                onChange={(e) => updateCustomProperty(key, e.target.value)}
                                                placeholder="Property value"
                                                className="flex-1"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeCustomProperty(key)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addCustomProperty}
                                        className="w-full"
                                    >
                                        <Tag className="h-4 w-4 mr-2" />
                                        Add Property
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Museum-Specific Properties */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FolderOpen className="h-5 w-5" />
                                        Museum Metadata
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Additional metadata specific to museum collections
                                    </p>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea
                                            id="description"
                                            value={customProperties.description || ''}
                                            onChange={(e) => updateCustomProperty('description', e.target.value)}
                                            placeholder="Enter detailed description of the media item"
                                            className="mt-1"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <Label htmlFor="artist">Artist/Creator</Label>
                                            <Input
                                                id="artist"
                                                value={customProperties.artist || ''}
                                                onChange={(e) => updateCustomProperty('artist', e.target.value)}
                                                placeholder="Artist or creator name"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="date_created">Date Created</Label>
                                            <Input
                                                id="date_created"
                                                type="date"
                                                value={customProperties.date_created || ''}
                                                onChange={(e) => updateCustomProperty('date_created', e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="location">Location/Origin</Label>
                                            <Input
                                                id="location"
                                                value={customProperties.location || ''}
                                                onChange={(e) => updateCustomProperty('location', e.target.value)}
                                                placeholder="Geographic location or origin"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="medium">Medium</Label>
                                            <Input
                                                id="medium"
                                                value={customProperties.medium || ''}
                                                onChange={(e) => updateCustomProperty('medium', e.target.value)}
                                                placeholder="Artistic medium or material"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="dimensions">Dimensions</Label>
                                            <Input
                                                id="dimensions"
                                                value={customProperties.dimensions || ''}
                                                onChange={(e) => updateCustomProperty('dimensions', e.target.value)}
                                                placeholder="e.g., 24 x 36 inches"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="condition">Condition</Label>
                                            <Select
                                                value={customProperties.condition || ''}
                                                onValueChange={(value) => updateCustomProperty('condition', value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select condition" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="excellent">Excellent</SelectItem>
                                                    <SelectItem value="good">Good</SelectItem>
                                                    <SelectItem value="fair">Fair</SelectItem>
                                                    <SelectItem value="poor">Poor</SelectItem>
                                                    <SelectItem value="damaged">Damaged</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="provenance">Provenance</Label>
                                        <Textarea
                                            id="provenance"
                                            value={customProperties.provenance || ''}
                                            onChange={(e) => updateCustomProperty('provenance', e.target.value)}
                                            placeholder="History of ownership and acquisition"
                                            className="mt-1"
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="exhibition_history">Exhibition History</Label>
                                        <Textarea
                                            id="exhibition_history"
                                            value={customProperties.exhibition_history || ''}
                                            onChange={(e) => updateCustomProperty('exhibition_history', e.target.value)}
                                            placeholder="Previous exhibitions where this item was displayed"
                                            className="mt-1"
                                            rows={2}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Form Actions */}
                            <div className="flex items-center justify-end gap-4">
                                <Button variant="outline" asChild>
                                    <Link href={`/media-library/${media.id}`}>
                                        Cancel
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </MediaLibraryLayout>
        </AppLayout>
    );
}
