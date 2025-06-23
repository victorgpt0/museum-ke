import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, User } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Project {
  id: number;
  title: string;
}

interface Props {
  project: Project;
}

export default function CreateMember({ project }: Props) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setErrors({});
    if (!fullname.trim()) {
      setErrors(prev => ({ ...prev, fullname: 'Full name is required' }));
      toast.error('Please enter a full name');
      setProcessing(false);
      return;
    }
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email address is required' }));
      toast.error('Please enter an email address');
      setProcessing(false);
      return;
    }
    if (!position.trim()) {
      setErrors(prev => ({ ...prev, position: 'Position is required' }));
      toast.error('Please enter a position');
      setProcessing(false);
      return;
    }
    if (!phone.trim()) {
      setErrors(prev => ({ ...prev, phone_number: 'Phone number is required' }));
      toast.error('Please enter a phone number');
      setProcessing(false);
      return;
    }
    router.post(
      `/projects/${project.id}/team-members`,
      {
        fullname: fullname.trim(),
        email_address: email.trim(),
        position: position.trim(),
        phone_number: phone.trim(),
      },
      {
        onStart: () => setProcessing(true),
        onSuccess: () => {
          setFullname('');
          setEmail('');
          setPosition('');
          setPhone('');
          toast.success('Team member has been created successfully');
          setProcessing(false);
        },
        onError: (errs) => {
          setErrors(errs || {});
          if (errs && typeof errs === 'object') {
            Object.values(errs).forEach(msg => toast.error(String(msg)));
          } else {
            toast.error('There was an error submitting the team member.');
          }
          setProcessing(false);
        },
        onFinish: () => setProcessing(false)
      }
    );
  };

  return (
    <AppLayout>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '8px',
            padding: '12px 16px',
          },
          success: {
            style: {
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
            },
            iconTheme: {
              primary: '#16a34a',
              secondary: '#f0fdf4',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
            iconTheme: {
              primary: '#dc2626',
              secondary: '#fef2f2',
            },
          },
          loading: {
            style: {
              background: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
            },
          }
        }}
      />
      <Head title={`Add Team Member - ${project.title}`} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Team Member</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">{project.title}</p>
            </div>
          </div>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2"><User className="h-5 w-5" /> Team Member Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="fullname" className="text-gray-700 dark:text-gray-300">Full Name</Label>
                  <Input
                    id="fullname"
                    type="text"
                    value={fullname}
                    onChange={e => setFullname(e.target.value)}
                    className="mt-1 block w-full"
                  />
                  {errors.fullname && <p className="text-sm text-red-500 mt-2">{errors.fullname}</p>}
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="mt-1 block w-full"
                  />
                  {errors.email_address && <p className="text-sm text-red-500 mt-2">{errors.email_address}</p>}
                </div>
                <div>
                  <Label htmlFor="position" className="text-gray-700 dark:text-gray-300">Position</Label>
                  <Input
                    id="position"
                    type="text"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    className="mt-1 block w-full"
                  />
                  {errors.position && <p className="text-sm text-red-500 mt-2">{errors.position}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
                  <Input
                    id="phone"
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="mt-1 block w-full"
                  />
                  {errors.phone_number && <p className="text-sm text-red-500 mt-2">{errors.phone_number}</p>}
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={processing}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {processing ? 'Saving...' : 'Save Member'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
