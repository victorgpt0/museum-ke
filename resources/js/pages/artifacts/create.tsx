import React, { useRef } from 'react';
import { useForm, Link, usePage } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

export default function ArtifactCreate() {
  const { categories, donors, tags } = usePage().props as any;
  const imagesRef = useRef<HTMLInputElement>(null);
  const documentsRef = useRef<HTMLInputElement>(null);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Artifacts',
      href: route('artifacts.index'),
    },
    {
      title: 'Create Artifact',
      href: route('artifacts.create'),
    }
  ];

  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    category_id: '',
    condition: 'good',
    location: '',
    acquisition_date: '',
    status: 'active',
    donor_id: '',
    images: [],
    documents: [],
    tags: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData(e.target.name, e.target.value);
  };

  const handleSelectChange = (name: string, value: string) => {
    setData(name, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setData(e.target.name, Array.from(e.target.files));
    }
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    const currentTags = data.tags || [];
    if (checked) {
      setData('tags', [...currentTags, tagId]);
    } else {
      setData('tags', currentTags.filter((id: string) => id !== tagId));
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('artifacts.store'), {
      forceFormData: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Artifact</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      value={data.title}
                      onChange={handleChange}
                      error={errors.title}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={data.description}
                      onChange={handleChange}
                      error={errors.description}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category_id">Category *</Label>
                    <Select value={data.category_id} onValueChange={(value) => handleSelectChange('category_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat: any) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>{cat.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <InputError message={errors.category_id} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select value={data.condition} onValueChange={(value) => handleSelectChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                    <InputError message={errors.condition} className="mt-1" />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={data.location}
                      onChange={handleChange}
                      error={errors.location}
                    />
                  </div>

                  <div>
                    <Label htmlFor="acquisition_date">Acquisition Date</Label>
                    <Input
                      id="acquisition_date"
                      name="acquisition_date"
                      type="date"
                      value={data.acquisition_date}
                      onChange={handleChange}
                      error={errors.acquisition_date}
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <Select value={data.status} onValueChange={(value) => handleSelectChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                        <SelectItem value="on_display">On Display</SelectItem>
                      </SelectContent>
                    </Select>
                    <InputError message={errors.status} className="mt-1" />
                  </div>

                  <div>
                    <Label htmlFor="donor_id">Donor</Label>
                    <Select value={data.donor_id} onValueChange={(value) => handleSelectChange('donor_id', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Donor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="null">None</SelectItem>
                        {donors.map((donor: any) => (
                          <SelectItem key={donor.id} value={String(donor.id)}>{donor.fullname}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <InputError message={errors.donor_id} className="mt-1" />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div>
                <Label>Tags</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {tags.map((tag: any) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={data.tags.includes(String(tag.id))}
                        onCheckedChange={(checked) => handleTagChange(String(tag.id), checked as boolean)}
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="text-sm">{tag.name}</Label>
                    </div>
                  ))}
                </div>
                <InputError message={errors.tags} className="mt-1" />
              </div>

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="images">Images</Label>
                  <Input
                    ref={imagesRef}
                    id="images"
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                  <InputError message={errors.images} className="mt-1" />
                  <p className="text-sm text-gray-500 mt-1">Accepted formats: JPG, JPEG, PNG, WebP (max 10MB each)</p>
                </div>

                <div>
                  <Label htmlFor="documents">Documents</Label>
                  <Input
                    ref={documentsRef}
                    id="documents"
                    type="file"
                    name="documents"
                    multiple
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="mt-1"
                  />
                  <InputError message={errors.documents} className="mt-1" />
                  <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOCX (max 10MB each)</p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" disabled={processing}>
                  {processing ? 'Creating...' : 'Create Artifact'}
                </Button>
                <Link href={route('artifacts.index')}>
                  <Button variant="outline" type="button">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
