import DeleteConfirm from '@/components/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Calendar, Edit, FileText, Image, MapPin, Tag, User } from 'lucide-react';

export default function ArtifactShow() {
    const { artifact, images, documents } = usePage().props as any;

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
                        <Link href={route('artifacts.edit', artifact.id)}>
                            <Button>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </Link>
                        <DeleteConfirm deleteRoute={route(`artifacts.destroy`, artifact.id)} itemType={'artifact'} itemName={artifact.title} />
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
