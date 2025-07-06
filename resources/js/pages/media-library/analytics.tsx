import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import MediaLibraryLayout from '@/layouts/media-library/layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    Download,
    FileText,
    HardDrive,
    Image,
    Music,
    PieChart,
    TrendingUp,
    Video,
    Archive,
    FolderOpen,
    Clock,
    Users,
    Activity,
    Database,
    Layers
} from 'lucide-react';
import { useState } from 'react';

export default function MediaLibraryAnalytics() {
    const { stats } = usePage().props as any;
    const [timeRange, setTimeRange] = useState('12');

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'image': return Image;
            case 'video': return Video;
            case 'audio': return Music;
            case 'application': return FileText;
            default: return Archive;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'image': return 'text-blue-600';
            case 'video': return 'text-purple-600';
            case 'audio': return 'text-green-600';
            case 'application': return 'text-orange-600';
            default: return 'text-gray-600';
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Media Library',
            href: '/media-library',
        },
        {
            title: 'Analytics',
            href: '/media-library/analytics',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Media Library Analytics" />

            <MediaLibraryLayout>
                <div className="p-4 md:p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Media Analytics</h1>
                            <p className="text-muted-foreground">
                                Comprehensive insights into your media collection
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger className="w-48">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7">Last 7 days</SelectItem>
                                <SelectItem value="30">Last 30 days</SelectItem>
                                <SelectItem value="90">Last 90 days</SelectItem>
                                <SelectItem value="12">Last 12 months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center">
                            <Database className="h-8 w-8 mb-2 text-primary" />
                            <div className="text-sm text-muted-foreground">Total Files</div>
                            <div className="text-3xl font-bold">{formatNumber(stats.total)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center">
                            <HardDrive className="h-8 w-8 mb-2 text-blue-600" />
                            <div className="text-sm text-muted-foreground">Total Size</div>
                            <div className="text-3xl font-bold">{formatFileSize(stats.total_size)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center">
                            <FolderOpen className="h-8 w-8 mb-2 text-green-600" />
                            <div className="text-sm text-muted-foreground">Collections</div>
                            <div className="text-3xl font-bold">{stats.by_collection.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6 flex flex-col items-center">
                            <BarChart3 className="h-8 w-8 mb-2 text-purple-600" />
                            <div className="text-sm text-muted-foreground">Avg Size</div>
                            <div className="text-3xl font-bold">{formatFileSize(stats.average_size)}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2 mb-8">
                    {/* Media Types Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5" />
                                Media Types Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.by_type.map((type: any) => {
                                    const TypeIcon = getTypeIcon(type.type);
                                    const percentage = ((type.count / stats.total) * 100).toFixed(1);
                                    return (
                                        <div key={type.type} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <TypeIcon className={`h-5 w-5 ${getTypeColor(type.type)}`} />
                                                <div>
                                                    <p className="font-medium capitalize">{type.type}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {formatNumber(type.count)} files
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{percentage}%</p>
                                                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${getTypeColor(type.type).replace('text-', 'bg-')}`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Collections */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="h-5 w-5" />
                                Top Collections
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.by_collection.slice(0, 8).map((collection: any, index: number) => (
                                    <div key={collection.collection_name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                <span className="text-sm font-medium text-primary">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{collection.collection_name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatNumber(collection.count)} files
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary">
                                            {((collection.count / stats.total) * 100).toFixed(1)}%
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Upload Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Monthly Upload Trends
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {stats.by_month.map((month: any) => (
                                    <div key={month.month} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">
                                                    {new Date(month.month + '-01').toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long'
                                                    })}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatNumber(month.count)} uploads
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary"
                                                style={{
                                                    width: `${(month.count / Math.max(...stats.by_month.map((m: any) => m.count))) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Storage Insights */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <HardDrive className="h-5 w-5" />
                                Storage Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-medium">Storage Usage</span>
                                        <span className="text-sm text-muted-foreground">
                                            {formatFileSize(stats.total_size)}
                                        </span>
                                    </div>
                                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                                            style={{ width: '75%' }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        75% of available storage used
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Average file size</span>
                                        <span className="font-medium">{formatFileSize(stats.average_size)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Largest file type</span>
                                        <span className="font-medium">Video (avg. 45MB)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Most common type</span>
                                        <span className="font-medium">Images (65%)</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Quick Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                                <Link href="/media-library">
                                    <Database className="h-6 w-6" />
                                    <span>Browse All Media</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                                <Link href="/media-library/type/images">
                                    <Image className="h-6 w-6" />
                                    <span>View Images</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                                <Link href="/media-library/type/videos">
                                    <Video className="h-6 w-6" />
                                    <span>View Videos</span>
                                </Link>
                            </Button>
                            <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                                <Link href="/media-library/type/documents">
                                    <FileText className="h-6 w-6" />
                                    <span>View Documents</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                </div>
            </MediaLibraryLayout>
        </AppLayout>
    );
}
