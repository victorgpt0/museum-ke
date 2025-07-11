import DeleteConfirm from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, useForm, usePage, router } from '@inertiajs/react';
import { Calendar, Edit, FileText, Image, MapPin, Tag, User, Plus, X, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import can from '@/lib/can';

export default function ArtifactShow() {
    const { artifact, images, documents, archivesByType, relationshipTypes } = usePage().props as any;
    
    // All hooks must be called in the same order every time
    const [showLinkForm, setShowLinkForm] = useState(false);
    const [selectedArchive, setSelectedArchive] = useState('');
    const [availableArchives, setAvailableArchives] = useState([]);
    const [loadingArchives, setLoadingArchives] = useState(false);

    const linkForm = useForm({
        archive_id: '',
        relationship_type: 'other',
        notes: '',
        is_primary: false,
    });

    // Pre-calculate permissions to avoid conditional hook calls
    const canEditArtifacts = can('artifacts.edit');
    const canDeleteArtifacts = can('artifacts.delete');
    const canCreateArchives = can('archives.create');
    const canEditArchives = can('archives.edit');
    const canViewArchives = can('archives.view');

    const loadAvailableArchives = async () => {
        setLoadingArchives(true);
        try {
            const response = await fetch(`/artifacts/${artifact.id}/available-archives`);
            const data = await response.json();
            setAvailableArchives(data);
        } catch (error) {
            console.error('Failed to load available archives:', error);
        } finally {
            setLoadingArchives(false);
        }
    };

    const handleShowLinkForm = () => {
        if (!showLinkForm) {
            loadAvailableArchives();
        }
        setShowLinkForm(!showLinkForm);
    };

    const handleLinkArchive = (e: React.FormEvent) => {
        e.preventDefault();
        linkForm.post(`/artifacts/${artifact.id}/link-archive`, {
            onSuccess: () => {
                setShowLinkForm(false);
                linkForm.reset();
            },
        });
    };

    const handleUnlinkArchive = (archiveId: number) => {
        if (confirm('Are you sure you want to unlink this archive?')) {
            router.delete(`/artifacts/${artifact.id}/unlink-archive`, {
                data: { archive_id: archiveId },
            });
        }
    };

    const getRelationshipTypeColor = (type: string) => {
        const colors = {
            conservation_report: 'bg-red-100 text-red-800',
            excavation_notes: 'bg-yellow-100 text-yellow-800',
            research_paper: 'bg-blue-100 text-blue-800',
            exhibition_catalog: 'bg-purple-100 text-purple-800',
            provenance_document: 'bg-green-100 text-green-800',
            condition_assessment: 'bg-orange-100 text-orange-800',
            acquisition_document: 'bg-indigo-100 text-indigo-800',
            photographic_record: 'bg-pink-100 text-pink-800',
            technical_analysis: 'bg-gray-100 text-gray-800',
            other: 'bg-gray-100 text-gray-800',
        };
        return colors[type] || colors.other;
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Artifacts',
            href: route('artifacts.index'),
        },
        {
            title: artifact.title,
            href: route('artifacts.show', artifact.id),
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            case 'on_display':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getConditionColor = (condition: string) => {
        switch (condition) {
            case 'good':
                return 'bg-green-100 text-green-800';
            case 'poor':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="mx-auto max-w-6xl p-6">
                {/* Header */}
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{artifact.title}</h1>
                        <div className="mt-2 flex gap-2">
                            <Badge className={getStatusColor(artifact.status)}>{artifact.status}</Badge>
                            <Badge className={getConditionColor(artifact.condition)}>{artifact.condition}</Badge>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {canEditArtifacts && (
                            <Link href={route('artifacts.edit', artifact.id)}>
                                <Button>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                            </Link>
                        )}
                        {canDeleteArtifacts && (
                            <DeleteConfirm deleteRoute={route(`artifacts.destroy`, artifact.id)} itemType={'artifact'} itemName={artifact.title} />
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">Description</h3>
                                    <p className="mt-1 text-gray-600">{artifact.description || 'No description available.'}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Category:</span>
                                        <span className="text-gray-600">{artifact.category?.title}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Location:</span>
                                        <span className="text-gray-600">{artifact.location || 'Not specified'}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Acquisition Date:</span>
                                        <span className="text-gray-600">
                                            {artifact.acquisition_date ? new Date(artifact.acquisition_date).toLocaleDateString() : 'Not specified'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-gray-500" />
                                        <span className="font-medium">Donor:</span>
                                        <span className="text-gray-600">{artifact.donor?.fullname || 'Not specified'}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tags */}
                        {artifact.tags && artifact.tags.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tags</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {artifact.tags.map((tag: any) => (
                                            <Badge key={tag.id} variant="secondary">
                                                {tag.name}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Images */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Image className="h-5 w-5" />
                                    Images
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {images.length === 0 ? (
                                    <p className="text-gray-500">No images available.</p>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                                        {images.map((img: any) => (
                                            <div key={img.id} className="aspect-square overflow-hidden rounded-lg border">
                                                <img
                                                    src={img.original_url}
                                                    alt=""
                                                    className="h-full w-full cursor-pointer object-cover transition-transform hover:scale-105"
                                                    onClick={() => window.open(img.original_url, '_blank')}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Documents */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Documents
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {documents.length === 0 ? (
                                    <p className="text-gray-500">No documents available.</p>
                                ) : (
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
                                                    Download
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Related Archives */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Related Archives
                                    </div>
                                    {canCreateArchives && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleShowLinkForm}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Link Archive
                                        </Button>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Link Archive Form */}
                                {showLinkForm && (
                                    <div className="mb-6 rounded-lg border border-gray-200 p-4">
                                        <form onSubmit={handleLinkArchive} className="space-y-4">
                                            <div>
                                                <Label htmlFor="archive_id">Select Archive</Label>
                                                <Select
                                                    value={linkForm.data.archive_id}
                                                    onValueChange={(value) => linkForm.setData('archive_id', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Choose an archive..." />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {loadingArchives ? (
                                                            <SelectItem value="null" disabled>Loading archives...</SelectItem>
                                                        ) : availableArchives.length === 0 ? (
                                                            <SelectItem value="null" disabled>No archives available.</SelectItem>
                                                        ) : (
                                                            availableArchives.map((archive: any) => (
                                                                <SelectItem key={archive.id} value={archive.id}>
                                                                    {archive.title}
                                                                </SelectItem>
                                                            ))
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="relationship_type">Relationship Type</Label>
                                                <Select
                                                    value={linkForm.data.relationship_type}
                                                    onValueChange={(value) => linkForm.setData('relationship_type', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(relationshipTypes).map(([key, value]) => (
                                                            <SelectItem key={key} value={key}>
                                                                {value}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div>
                                                <Label htmlFor="notes">Notes</Label>
                                                <Textarea
                                                    value={linkForm.data.notes}
                                                    onChange={(e) => linkForm.setData('notes', e.target.value)}
                                                    placeholder="Additional context about this relationship..."
                                                />
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id="is_primary"
                                                    checked={linkForm.data.is_primary}
                                                    onCheckedChange={(checked) => linkForm.setData('is_primary', checked)}
                                                />
                                                <Label htmlFor="is_primary">Mark as primary document</Label>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button type="submit" disabled={linkForm.processing}>
                                                    {linkForm.processing ? 'Linking...' : 'Link Archive'}
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowLinkForm(false)}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Display Archives by Type */}
                                {Object.keys(archivesByType).length === 0 ? (
                                    <p className="text-gray-500">No related archives found.</p>
                                ) : (
                                    <div className="space-y-6">
                                        {Object.entries(archivesByType).map(([type, archives]) => (
                                            <div key={type}>
                                                <h4 className="mb-3 font-semibold text-gray-900">
                                                    {relationshipTypes[type] || type}
                                                </h4>
                                                <div className="space-y-3">
                                                    {archives.map((archive: any) => (
                                                        <div
                                                            key={archive.id}
                                                            className="rounded-lg border border-gray-200 p-4"
                                                        >
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <h5 className="font-medium text-gray-900">
                                                                            {archive.title}
                                                                        </h5>
                                                                        {archive.pivot.is_primary && (
                                                                            <Badge className="bg-blue-100 text-blue-800">
                                                                                Primary
                                                                            </Badge>
                                                                        )}
                                                                        <Badge className={getRelationshipTypeColor(type)}>
                                                                            {relationshipTypes[type]}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-sm text-gray-600 mb-2">
                                                                        By {archive.author} • {new Date(archive.created_at).toLocaleDateString()}
                                                                    </p>
                                                                    {archive.pivot.notes && (
                                                                        <p className="text-sm text-gray-500 mb-2">
                                                                            {archive.pivot.notes}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        asChild
                                                                    >
                                                                        <Link href={`/archives/${archive.id}`}>
                                                                            <Eye className="h-4 w-4" />
                                                                        </Link>
                                                                    </Button>
                                                                    {canEditArchives && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            asChild
                                                                        >
                                                                            <Link href={`/archives/${archive.id}/edit`}>
                                                                                <Edit className="h-4 w-4" />
                                                                            </Link>
                                                                        </Button>
                                                                    )}
                                                                    {canViewArchives && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            asChild
                                                                        >
                                                                            <a href={`/archives/${archive.id}/download`}>
                                                                                <Download className="h-4 w-4" />
                                                                            </a>
                                                                        </Button>
                                                                    )}
                                                                    {canEditArtifacts && (
                                                                        <Button
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() => handleUnlinkArchive(archive.id)}
                                                                        >
                                                                            <X className="h-4 w-4" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Metadata */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Created:</span>
                                    <span>{new Date(artifact.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last Updated:</span>
                                    <span>{new Date(artifact.updated_at).toLocaleDateString()}</span>
                                </div>
                                {artifact.user && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Created By:</span>
                                        <span>{artifact.user.name}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
