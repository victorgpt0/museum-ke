import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewArtifact({ categories }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        category_id: '', // Changed from category to category_id
        condition: 'good',
        location: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('artifacts.store'));
    };

    return (
        <>
            <Head title="New Artifact" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold mb-6">Add New Artifact</h1>
                    
                    <Card>
                        <CardHeader>
                            <CardTitle>Artifact Details</CardTitle>
                            <CardDescription>
                                Enter information about the artifact for the collection
                            </CardDescription>
                        </CardHeader>
                        
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="title">Title</Label>
                                    <Input 
                                        id="title"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        required
                                    />
                                    {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
                                </div>
                                
                                <div className="space-y-1">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea 
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        rows={4}
                                    />
                                    {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="category">Category</Label>
                                        <Select 
                                            value={data.category_id} 
                                            onValueChange={(value) => setData('category_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.category_id && <div className="text-red-500 text-sm">{errors.category_id}</div>}
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <Label htmlFor="condition">Condition</Label>
                                        <Select 
                                            value={data.condition} 
                                            onValueChange={(value) => setData('condition', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select condition" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="good">Good</SelectItem>
                                                <SelectItem value="poor">Poor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.condition && <div className="text-red-500 text-sm">{errors.condition}</div>}
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <Label htmlFor="location">Location</Label>
                                        <Input 
                                            id="location"
                                            value={data.location}
                                            onChange={e => setData('location', e.target.value)}
                                        />
                                        {errors.location && <div className="text-red-500 text-sm">{errors.location}</div>}
                                    </div>
                                </div>
                            </CardContent>
                            
                            <CardFooter className="flex justify-end space-x-2">
                                <Button variant="outline" type="button" onClick={() => window.history.back()}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Artifact'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}