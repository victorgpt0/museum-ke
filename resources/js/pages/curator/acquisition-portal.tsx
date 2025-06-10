import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, ImageIcon } from 'lucide-react';

interface DonationFormData {
    title: string;
    description: string;
    source: string;
    images: File[];
    donor_full_name: string;
    donor_email: string;
    donor_phone: string;
    next_of_kin_name: string;
    next_of_kin_email: string;
    next_of_kin_phone: string;
}

export default function DonationForm() {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm<DonationFormData>({
        title: '',
        description: '',
        source: '',
        images: [],
        donor_full_name: '',
        donor_email: '',
        donor_phone: '',
        next_of_kin_name: '',
        next_of_kin_email: '',
        next_of_kin_phone: ''
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        
        setSelectedImages(prev => [...prev, ...files]);
        setImagePreviews(prev => [...prev, ...previews]);
        setData('images', [...selectedImages, ...files]);
    };

    const removeImage = (index: number) => {
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);
        
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
        setData('images', newImages);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Create FormData for file upload
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (key === 'images') {
                selectedImages.forEach((file) => {
                    formData.append('images[]', file);
                });
            } else {
                formData.append(key, value as string);
            }
        });

        post('/donations', {
            data: formData,
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title="Artifact Donation Form" />
            
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Artifact Donation Form
                        </h1>
                        <p className="text-gray-600">
                            Thank you for your interest in donating to Nairobi National Museum
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Artifact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Artifact Information</CardTitle>
                                <CardDescription>
                                    Please provide details about the artifact you wish to donate
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="title">Artifact Title *</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        placeholder="Enter the name or title of the artifact"
                                        required
                                    />
                                    {errors.title && <div className="text-red-500 text-sm">{errors.title}</div>}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="description">Description *</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Describe the artifact, its history, significance, and any other relevant details"
                                        rows={4}
                                        required
                                    />
                                    {errors.description && <div className="text-red-500 text-sm">{errors.description}</div>}
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="source">Source/Origin *</Label>
                                    <Input
                                        id="source"
                                        value={data.source}
                                        onChange={e => setData('source', e.target.value)}
                                        placeholder="Where did this artifact originate from? (e.g., Family collection, specific location, etc.)"
                                        required
                                    />
                                    {errors.source && <div className="text-red-500 text-sm">{errors.source}</div>}
                                </div>

                                {/* Image Upload Section */}
                                <div className="space-y-2">
                                    <Label>Artifact Images</Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                        <div className="text-center">
                                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="mt-4">
                                                <Label htmlFor="images" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block">
                                                    Choose Images
                                                </Label>
                                                <Input
                                                    id="images"
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Upload multiple images of your artifact (PNG, JPG, JPEG)
                                            </p>
                                        </div>
                                    </div>
                                    {errors.images && <div className="text-red-500 text-sm">{errors.images}</div>}

                                    {/* Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Donor Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Donor Information</CardTitle>
                                <CardDescription>
                                    Your contact information for our records
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="donor_full_name">Full Name *</Label>
                                    <Input
                                        id="donor_full_name"
                                        value={data.donor_full_name}
                                        onChange={e => setData('donor_full_name', e.target.value)}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                    {errors.donor_full_name && <div className="text-red-500 text-sm">{errors.donor_full_name}</div>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="donor_email">Email Address *</Label>
                                        <Input
                                            id="donor_email"
                                            type="email"
                                            value={data.donor_email}
                                            onChange={e => setData('donor_email', e.target.value)}
                                            placeholder="your.email@example.com"
                                            required
                                        />
                                        {errors.donor_email && <div className="text-red-500 text-sm">{errors.donor_email}</div>}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="donor_phone">Phone Number *</Label>
                                        <Input
                                            id="donor_phone"
                                            type="tel"
                                            value={data.donor_phone}
                                            onChange={e => setData('donor_phone', e.target.value)}
                                            placeholder="+254 xxx xxx xxx"
                                            required
                                        />
                                        {errors.donor_phone && <div className="text-red-500 text-sm">{errors.donor_phone}</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Next of Kin Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Next of Kin Information</CardTitle>
                                <CardDescription>
                                    Emergency contact information (optional but recommended)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="next_of_kin_name">Full Name</Label>
                                    <Input
                                        id="next_of_kin_name"
                                        value={data.next_of_kin_name}
                                        onChange={e => setData('next_of_kin_name', e.target.value)}
                                        placeholder="Enter next of kin's full name"
                                    />
                                    {errors.next_of_kin_name && <div className="text-red-500 text-sm">{errors.next_of_kin_name}</div>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="next_of_kin_email">Email Address</Label>
                                        <Input
                                            id="next_of_kin_email"
                                            type="email"
                                            value={data.next_of_kin_email}
                                            onChange={e => setData('next_of_kin_email', e.target.value)}
                                            placeholder="nextofkin@example.com"
                                        />
                                        {errors.next_of_kin_email && <div className="text-red-500 text-sm">{errors.next_of_kin_email}</div>}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="next_of_kin_phone">Phone Number</Label>
                                        <Input
                                            id="next_of_kin_phone"
                                            type="tel"
                                            value={data.next_of_kin_phone}
                                            onChange={e => setData('next_of_kin_phone', e.target.value)}
                                            placeholder="+254 xxx xxx xxx"
                                        />
                                        {errors.next_of_kin_phone && <div className="text-red-500 text-sm">{errors.next_of_kin_phone}</div>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Buttons */}
                        <Card>
                            <CardFooter className="flex justify-end space-x-4">
                                <Button 
                                    variant="outline" 
                                    type="button" 
                                    onClick={() => window.history.back()}
                                    className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                                >
                                    {processing ? 'Submitting...' : 'Submit Donation'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    );
}