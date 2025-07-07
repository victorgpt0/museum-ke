import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormUI } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Head, useForm } from '@inertiajs/react';
import { Upload, X, Landmark } from 'lucide-react';
import React, { useEffect, useState } from 'react';

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
    images: FileList | File[] | null;
    [key: string]: unknown;
}

export default function Create() {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [uploadedMediaIds, setUploadedMediaIds] = useState<string[]>([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    const { data, setData, errors, post, processing } = useForm<DonationFormData>({
        title: '',
        description: '',
        source: '',
        donor_full_name: '',
        donor_email: '',
        donor_phone: '',
        next_of_kin_name: '',
        next_of_kin_email: '',
        next_of_kin_phone: '',
        images: null,
    });

    // Clean up object URLs on component unmount
    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length === 0) return;

        // Validate file types
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const invalidFiles = files.filter((file) => !allowedTypes.includes(file.type));
        if (invalidFiles.length > 0) {
            alert(`Please upload only image files (JPEG, JPG, PNG, WebP).`);
            return;
        }

        // Validate file sizes (5MB max per file)
        const oversizedFiles = files.filter((file) => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            alert(`Some files are too large. Maximum file size is 5MB. Please choose smaller files.`);
            return;
        }

        // Create preview URLs
        const previews = files.map((file) => URL.createObjectURL(file));

        const newImages = [...selectedImages, ...files];
        const newPreviews = [...imagePreviews, ...previews];

        setSelectedImages(newImages);

        setData('images', newImages);

        setImagePreviews(newPreviews);
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

        setData('images', newImages);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log('Form submission started');
        console.log('Form data:', data);

        try {
            post(route('acquisitions.store'), {
                forceFormData: true,
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
                },
            });
        } catch (error) {
            console.error('Error during form submission:', error);
        }
    };

    return (
        <>
            <Head title="Artifact Donation Form" />

            <div className="py-8 min-h-screen bg-gradient-to-br from-[#FFFDD0] via-[#f7f7f7] to-[#e9e7e1] flex flex-col items-center justify-center relative">
                {/* Decorative Museum Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#C2A14D]/90 border-4 border-[#bfa14a] shadow-lg">
                            <Landmark className="w-8 h-8 text-[#7c5e18]" />
                        </span>
                        <span className="font-serif text-4xl font-bold tracking-wide text-[#7c5e18] drop-shadow-sm">Museum Artifact Donation</span>
                    </div>
                    <span className="text-lg text-[#6b4f1d] font-serif italic">Preserve History. Share Heritage.</span>
                </div>

                <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h1 className="mb-2 text-3xl font-serif font-bold text-[#3d2c0a]">Artifact Donation Form</h1>
                        <p className="text-[#7c5e18] font-serif">Thank you for your interest in donating to the Museum</p>
                    </div>

                    {/*/!* Success Message *!/*/}
                    {/*{flash.success && (*/}
                    {/*    <div className="mb-6 border border-green-200 bg-green-50 p-4 rounded-md flex items-center space-x-2">*/}
                    {/*        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />*/}
                    {/*        <p className="text-green-800">*/}
                    {/*            {flash.success}*/}
                    {/*        </p>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    {/*/!* Error Message *!/*/}
                    {/*{(flash.error || errors.submission) && (*/}
                    {/*    <div className="mb-6 border border-red-200 bg-red-50 p-4 rounded-md flex items-center space-x-2">*/}
                    {/*        <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />*/}
                    {/*        <p className="text-red-800">*/}
                    {/*            {flash.error || errors.submission}*/}
                    {/*        </p>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    <FormUI>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Artifact Information */}
                            <Card className="bg-white/90 border-[#C2A14D] shadow-xl">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Landmark className="h-6 w-6 text-[#C2A14D]" />
                                        <CardTitle className="font-serif text-2xl text-[#3d2c0a]">Artifact Information</CardTitle>
                                    </div>
                                    <CardDescription className="text-[#7c5e18] font-serif">Please provide details about the artifact you wish to donate</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="title">Artifact Title *</Label>
                                        <Input
                                            id="title"
                                            name={`title`}
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Enter the name or title of the artifact"
                                            required
                                            className={errors.title ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="description">Description *</Label>
                                        <Textarea
                                            id="description"
                                            name="description"
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Describe the artifact, its history, significance, and any other relevant details"
                                            rows={4}
                                            required
                                            className={errors.description ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.description} />
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="source">Source/Origin *</Label>
                                        <Input
                                            id="source"
                                            name={`source`}
                                            value={data.source}
                                            onChange={(e) => setData('source', e.target.value)}
                                            placeholder="Where did this artifact originate from? (e.g., Family collection, specific location, etc.)"
                                            required
                                            className={errors.source ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.source} />
                                    </div>

                                    {/* Image Upload Section */}
                                    <div className="space-y-2">
                                        <Label>Artifact Images</Label>
                                        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
                                            <div className="text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="mt-4">
                                                    <Label
                                                        htmlFor="images"
                                                        className={`inline-block cursor-pointer rounded-md px-4 py-2 transition-colors ${
                                                            isUploadingImages
                                                                ? 'cursor-not-allowed bg-gray-400 text-white'
                                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                        }`}
                                                    >
                                                        {isUploadingImages ? 'Uploading...' : 'Choose Images'}
                                                    </Label>
                                                    <Input
                                                        id="images"
                                                        name={`images`}
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
                                        <InputError message={errors.images} />

                                        {/* Image Previews */}
                                        {imagePreviews.length > 0 && (
                                            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="group relative">
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="h-24 w-full rounded-lg border object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                            disabled={isUploadingImages}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                        {uploadedMediaIds[index] && (
                                                            <div className="absolute bottom-1 left-1 rounded bg-green-500 px-1 text-xs text-white">
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
                            <Card className="bg-white/90 border-[#C2A14D] shadow-xl">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Landmark className="h-6 w-6 text-[#C2A14D]" />
                                        <CardTitle className="font-serif text-2xl text-[#3d2c0a]">Donor Information</CardTitle>
                                    </div>
                                    <CardDescription className="text-[#7c5e18] font-serif">Your contact information for our records</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="donor_full_name">Full Name *</Label>
                                        <Input
                                            id="donor_full_name"
                                            name={`donor_full_name`}
                                            value={data.donor_full_name}
                                            onChange={(e) => setData('donor_full_name', e.target.value)}
                                            placeholder="Enter your full name"
                                            required
                                            className={errors.donor_full_name ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.donor_full_name} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="donor_email">Email Address *</Label>
                                            <Input
                                                id="donor_email"
                                                name={`donor_email`}
                                                type="email"
                                                value={data.donor_email}
                                                onChange={(e) => setData('donor_email', e.target.value)}
                                                placeholder="your.email@example.com"
                                                required
                                                className={errors.donor_email ? 'border-red-500' : ''}
                                            />
                                            <InputError message={errors.donor_email} />
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="donor_phone">Phone Number *</Label>
                                            <Input
                                                id="donor_phone"
                                                name={`donor_phone`}
                                                type="tel"
                                                value={data.donor_phone}
                                                onChange={(e) => setData('donor_phone', e.target.value)}
                                                placeholder="+254 xxx xxx xxx"
                                                required
                                                className={errors.donor_phone ? 'border-red-500' : ''}
                                            />
                                            <InputError message={errors.donor_phone} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Next of Kin Information */}
                            <Card className="bg-white/90 border-[#C2A14D] shadow-xl">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Landmark className="h-6 w-6 text-[#C2A14D]" />
                                        <CardTitle className="font-serif text-2xl text-[#3d2c0a]">Next of Kin Information</CardTitle>
                                    </div>
                                    <CardDescription className="text-[#7c5e18] font-serif">Emergency contact information (optional but recommended)</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <Label htmlFor="next_of_kin_name">Full Name</Label>
                                        <Input
                                            id="next_of_kin_name"
                                            name={`next_of_kin_name`}
                                            value={data.next_of_kin_name}
                                            onChange={(e) => setData('next_of_kin_name', e.target.value)}
                                            placeholder="Enter next of kin's full name"
                                            className={errors.next_of_kin_name ? 'border-red-500' : ''}
                                        />
                                        <InputError message={errors.next_of_kin_name} />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-1">
                                            <Label htmlFor="next_of_kin_email">Email Address</Label>
                                            <Input
                                                id="next_of_kin_email"
                                                name={`next_of_kin_email`}
                                                type="email"
                                                value={data.next_of_kin_email}
                                                onChange={(e) => setData('next_of_kin_email', e.target.value)}
                                                placeholder="nextofkin@example.com"
                                                className={errors.next_of_kin_email ? 'border-red-500' : ''}
                                            />
                                            <InputError message={errors.next_of_kin_email} />
                                        </div>

                                        <div className="space-y-1">
                                            <Label htmlFor="next_of_kin_phone">Phone Number</Label>
                                            <Input
                                                id="next_of_kin_phone"
                                                name={`next_of_kin_phone`}
                                                type="tel"
                                                value={data.next_of_kin_phone}
                                                onChange={(e) => setData('next_of_kin_phone', e.target.value)}
                                                placeholder="+254 xxx xxx xxx"
                                                className={errors.next_of_kin_phone ? 'border-red-500' : ''}
                                            />
                                            <InputError message={errors.next_of_kin_phone} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit Buttons */}
                            <Card className="bg-white/90 border-[#C2A14D] shadow-xl">
                                <CardFooter className="flex justify-end space-x-4">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => window.history.back()}
                                        disabled={processing || isUploadingImages}
                                        className="dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 border-[#C2A14D] text-[#7c5e18] font-serif"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing || isUploadingImages}
                                        className="bg-[#C2A14D] text-[#3d2c0a] font-serif font-bold hover:bg-[#bfa14a] dark:bg-[#C2A14D] dark:text-[#3d2c0a] dark:hover:bg-[#bfa14a] border-[#bfa14a] shadow-md"
                                    >
                                        {processing ? 'Submitting...' : isUploadingImages ? 'Uploading Images...' : 'Submit Donation'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </form>
                    </FormUI>
                </div>
            </div>
        </>
    );
}
