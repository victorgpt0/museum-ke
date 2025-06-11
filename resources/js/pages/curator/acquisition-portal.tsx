import React, { useState, useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';

interface DonationFormData {
    title: string;
    description: string;
    source: string;
    donor_full_name: string;
    donor_email: string;
    donor_phone: string;
    next_of_kin_name: string;
    next_of_kin_email: string;
    next_of_kin_phone: string;
}

interface PageProps {
    errors: Record<string, string>;
    flash: {
        success?: string;
        error?: string;
    };
}

export default function DonationForm() {
    const { errors, flash } = usePage<PageProps>().props;
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    const { data, setData, post, processing, reset } = useForm<DonationFormData>({
        title: '',
        description: '',
        source: '',
        donor_full_name: '',
        donor_email: '',
        donor_phone: '',
        next_of_kin_name: '',
        next_of_kin_email: '',
        next_of_kin_phone: ''
    });

    // Clean up object URLs on component unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    // Reset form on successful submission
    useEffect(() => {
        if (flash.success) {
            reset();
            setSelectedImages([]);
            setImagePreviews([]);
            setUploadedMediaIds([]);
        }
    }, [flash.success, reset]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        if (files.length === 0) return;

        // Validate file types
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            alert(`Please upload only image files (JPEG, JPG, PNG, WebP).`);
            return;
        }

        // Validate file sizes (5MB max per file)
        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            alert(`Some files are too large. Maximum file size is 5MB. Please choose smaller files.`);
            return;
        }

        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        
        const newImages = [...selectedImages, ...files];
        const newPreviews = [...imagePreviews, ...previews];
        
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);

        // Optionally upload images immediately to temporary storage
        uploadImagesToTemporaryStorage(files);
    };

    // Upload images to temporary storage (optional approach)
    const uploadImagesToTemporaryStorage = async (files: File[]) => {
        if (files.length === 0) return;

        setIsUploadingImages(true);
        
        try {
            const formData = new FormData();
            files.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
            });

            const response = await fetch(route('media.temp-upload'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Temporary upload successful:', result);
                
                // Store the temporary media IDs or file paths
                if (result.media_ids) {
                    setUploadedMediaIds(prev => [...prev, ...result.media_ids]);
                }
            } else {
                console.error('Temporary upload failed:', response.statusText);
                alert('Failed to upload some images. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading images:', error);
            alert('Error uploading images. Please try again.');
        } finally {
            setIsUploadingImages(false);
        }
    };

    const removeImage = (index: number) => {
        // Revoke the object URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);
        
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        const newMediaIds = uploadedMediaIds.filter((_, i) => i !== index);
        
        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
        setUploadedMediaIds(newMediaIds);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        console.log('Form submission started');
        console.log('Form data:', data);
        console.log('Selected images:', selectedImages);
        console.log('Uploaded media IDs:', uploadedMediaIds);

        // Validate required fields before submission
        if (!data.title.trim()) {
            alert('Please enter an artifact title');
            return;
        }
        if (!data.description.trim()) {
            alert('Please enter a description');
            return;
        }
        if (!data.source.trim()) {
            alert('Please enter the source/origin');
            return;
        }
        if (!data.donor_full_name.trim()) {
            alert('Please enter your full name');
            return;
        }
        if (!data.donor_email.trim()) {
            alert('Please enter your email address');
            return;
        }
        if (!data.donor_phone.trim()) {
            alert('Please enter your phone number');
            return;
        }

        try {
            // APPROACH 1: Send images with form data (Media Library handles in controller)
            const formData = new FormData();
            
            // Add text fields
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value as string);
            });

            // Add images for Media Library processing
            selectedImages.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
            });

            // Add any temporary media IDs if using temporary upload approach
            if (uploadedMediaIds.length > 0) {
                uploadedMediaIds.forEach((mediaId, index) => {
                    formData.append(`temp_media_ids[${index}]`, mediaId);
                });
            }

            console.log('FormData entries:');
            for (let [key, value] of formData.entries()) {
                console.log(key, value instanceof File ? `File: ${value.name}` : value);
            }

            // Use Inertia's post method with FormData
            post(route('donations.store'), {
                data: formData,
                forceFormData: true,
                preserveState: false,
                preserveScroll: true,
                onStart: () => {
                    console.log('Request started');
                },
                onSuccess: (page) => {
                    console.log('Request successful:', page);
                },
                onError: (errors) => {
                    console.error('Request failed with errors:', errors);
                },
                onFinish: () => {
                    console.log('Request finished');
                }
            });

            // APPROACH 2: Alternative - Send form data first, then attach images
            /*
            post(route('donations.store'), {
                data: {
                    ...data,
                    temp_media_ids: uploadedMediaIds, // If using temporary upload
                    image_count: selectedImages.length
                },
                preserveState: false,
                preserveScroll: true,
                onStart: () => console.log('Request started'),
                onSuccess: (response) => {
                    console.log('Request successful:', response);
                    
                    // If donation was created successfully and we have images to attach
                    if (response.props.donation_id && selectedImages.length > 0) {
                        attachImagesToDonation(response.props.donation_id);
                    }
                },
                onError: (errors) => console.error('Request failed:', errors),
                onFinish: () => console.log('Request finished')
            });
            */

        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    // Alternative method: Attach images after donation creation
    const attachImagesToDonation = async (donationId: string) => {
        if (selectedImages.length === 0) return;

        const formData = new FormData();
        selectedImages.forEach((file, index) => {
            formData.append(`images[${index}]`, file);
        });

        try {
            const response = await fetch(route('donations.attach-media', donationId), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            if (response.ok) {
                console.log('Images attached successfully');
                // Optionally trigger a success message or redirect
            } else {
                console.error('Failed to attach images');
            }
        } catch (error) {
            console.error('Error attaching images:', error);
        }
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

                    {/* Debug Information - Remove in production */}
                    {process.env.NODE_ENV === 'development' && (
                        <div className="mb-6 border border-blue-200 bg-blue-50 p-4 rounded-md">
                            <h3 className="font-semibold text-blue-800">Debug Info:</h3>
                            <p className="text-blue-700">Processing: {processing ? 'Yes' : 'No'}</p>
                            <p className="text-blue-700">Uploading Images: {isUploadingImages ? 'Yes' : 'No'}</p>
                            <p className="text-blue-700">Errors: {JSON.stringify(errors)}</p>
                            <p className="text-blue-700">Flash: {JSON.stringify(flash)}</p>
                            <p className="text-blue-700">Selected Images: {selectedImages.length}</p>
                            <p className="text-blue-700">Uploaded Media IDs: {uploadedMediaIds.length}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {flash.success && (
                        <div className="mb-6 border border-green-200 bg-green-50 p-4 rounded-md flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <p className="text-green-800">
                                {flash.success}
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {(flash.error || errors.submission) && (
                        <div className="mb-6 border border-red-200 bg-red-50 p-4 rounded-md flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                            <p className="text-red-800">
                                {flash.error || errors.submission}
                            </p>
                        </div>
                    )}

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
                                        className={errors.title ? 'border-red-500' : ''}
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
                                        className={errors.description ? 'border-red-500' : ''}
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
                                        className={errors.source ? 'border-red-500' : ''}
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
                                                <Label 
                                                    htmlFor="images" 
                                                    className={`cursor-pointer px-4 py-2 rounded-md inline-block transition-colors ${
                                                        isUploadingImages 
                                                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                                    }`}
                                                >
                                                    {isUploadingImages ? 'Uploading...' : 'Choose Images'}
                                                </Label>
                                                <Input
                                                    id="images"
                                                    type="file"
                                                    multiple
                                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                    disabled={isUploadingImages}
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Upload multiple images of your artifact (PNG, JPG, JPEG, WebP - Max 5MB each)
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
                                                        disabled={isUploadingImages}
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    {uploadedMediaIds[index] && (
                                                        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                                            ✓
                                                        </div>
                                                    )}
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
                                        className={errors.donor_full_name ? 'border-red-500' : ''}
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
                                            className={errors.donor_email ? 'border-red-500' : ''}
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
                                            className={errors.donor_phone ? 'border-red-500' : ''}
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
                                        className={errors.next_of_kin_name ? 'border-red-500' : ''}
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
                                            className={errors.next_of_kin_email ? 'border-red-500' : ''}
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
                                            className={errors.next_of_kin_phone ? 'border-red-500' : ''}
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
                                    disabled={processing || isUploadingImages}
                                    className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </Button>
                                <Button 
                                    type="submit" 
                                    disabled={processing || isUploadingImages}
                                    className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
                                >
                                    {processing ? 'Submitting...' : isUploadingImages ? 'Uploading Images...' : 'Submit Donation'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    );
}