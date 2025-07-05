import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Palette, User } from 'lucide-react';

// Define breadcrumbs
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'New Artifact',
        href: '/artifacts/create',
    },
];

export default function NewArtifact({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category_id: '',
        condition: 'good',
        location: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('artifacts.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="New Artifact" />

            {/* Navigation Bar */}
            <div className="fixed top-0 right-0 left-0 z-50 border-b border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo on the left */}
                        <div className="flex items-center">
                            <a href="#logo-section" className="flex items-center space-x-2">
                                <AppLogo className="h-8 w-8" />
                                <span className="text-xl font-bold text-gray-900 dark:text-white">Museum KE</span>
                            </a>
                        </div>

                        {/* Navigation links on the right */}
                        <nav className="flex items-center space-x-6">
                            <a
                                href="#art-culture-section"
                                className="flex items-center space-x-2 px-3 py-2 text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                            >
                                <Palette className="h-5 w-5" />
                                <span>Art & Culture</span>
                            </a>
                            <a
                                href="#profile-section"
                                className="flex items-center space-x-2 px-3 py-2 text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                            >
                                <User className="h-5 w-5" />
                                <span>Profile</span>
                            </a>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main content with top padding to account for fixed navbar */}
            <div className="pt-20 pb-6">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <h1 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">Add New Artifact</h1>

                    <Card className="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
                        <CardHeader>
                            <CardTitle className="text-gray-900 dark:text-white">Artifact Details</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-300">
                                Enter information about the artifact for the collection
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="title" className="text-gray-700 dark:text-gray-300">
                                        Title
                                    </Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                        className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    />
                                    {errors.title && <div className="text-sm text-red-500">{errors.title}</div>}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="description" className="text-gray-700 dark:text-gray-300">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={4}
                                        className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                    />
                                    {errors.description && <div className="text-sm text-red-500">{errors.description}</div>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
                                            Category
                                        </Label>
                                        <Select value={data.category_id} onValueChange={(value) => setData('category_id', value)}>
                                            <SelectTrigger className="border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700">
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && <div className="text-sm text-red-500">{errors.category_id}</div>}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="condition" className="text-gray-700 dark:text-gray-300">
                                            Condition
                                        </Label>
                                        <Select value={data.condition} onValueChange={(value) => setData('condition', value)}>
                                            <SelectTrigger className="border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                                                <SelectValue placeholder="Select condition" />
                                            </SelectTrigger>
                                            <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700">
                                                <SelectItem value="good">Good</SelectItem>
                                                <SelectItem value="poor">Poor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.condition && <div className="text-sm text-red-500">{errors.condition}</div>}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
                                            Location
                                        </Label>
                                        <Input
                                            id="location"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            className="border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                                        />
                                        {errors.location && <div className="text-sm text-red-500">{errors.location}</div>}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                                >
                                    {processing ? 'Saving...' : 'Save Artifact'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
