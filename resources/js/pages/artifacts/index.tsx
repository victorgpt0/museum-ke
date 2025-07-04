import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent} from '@/components/ui/card';
import Pagination from '@/components/pagination';
import AppLayout from '@/layouts/app-layout';
import Table from '@/components/ui/table';
import { BreadcrumbItem } from '@/types';
import { Plus, Search, Filter, Grid, List, Eye, Edit, Trash2 } from 'lucide-react';

export default function Index() {
  const { artifacts, categories, condition, filters, auth } = usePage().props as any;
  const [filter, setFilter] = useState(filters || {});
  const [tab, setTab] = useState<'all' | 'mine' | 'others'>('all');
  const [view, setView] = useState<'table' | 'grid'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('artifactView') === 'table' ? 'table' : 'grid';
    }
    return 'grid';
  });
  const userId = auth?.user?.id;

  const columns = [
    {
      label: 'Thumbnail',
      accessor: 'thumbnail_url',
      render: (thumbnail_url: string) => (
        <div className="w-16 h-16 overflow-hidden rounded-lg">
          <img
            src={thumbnail_url || 'https://placehold.co/200x200?text=IMG'}
            alt={'Artifact thumbnail'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=error';
            }}
          />
        </div>
      )
    },
    { label: 'Title', accessor: 'title' },
    {
      label: 'Category',
      accessor: 'category',
      render: (category: any) => category?.title || 'N/A'
    },
    {
      label: 'Condition',
      accessor: 'condition',
      render: (condition: string) => (
        <Badge variant={condition === 'good' ? 'default' : 'destructive'}>
          {condition}
        </Badge>
      )
    },
    {
      label: 'Status',
      accessor: 'status',
      render: (status: string) => (
        <Badge variant="outline">{status}</Badge>
      )
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('artifactView', view);
    }
  }, [view]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilter({ ...filter, [name]: value });
  };

  const handleTabChange = (newTab: 'all' | 'mine' | 'others') => {
    setTab(newTab);
    const newFilter = { ...filter };
    if (newTab === 'mine') {
      newFilter.user_id = userId;
    } else if (newTab === 'others') {
      newFilter.user_id = 'not:' + userId;
    } else {
      delete newFilter.user_id;
    }
    setFilter(newFilter);
    router.get(route('artifacts.index'), newFilter, { preserveState: true });
  };

  const submitFilter = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('artifacts.index'), filter);
  };

  const clearFilters = () => {
    setFilter({});
    router.get(route('artifacts.index'), {});
  };

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Artifacts',
      href: route('artifacts.index'),
    }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Artifacts"/>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Artifacts</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage your museum artifacts</p>
          </div>
          <Link href={route('artifacts.create')}>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Artifact
            </Button>
          </Link>
        </div>

        {/* Tabs and View Toggle */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={tab === 'all' ? 'default' : 'outline'}
                onClick={() => handleTabChange('all')}
              >
                All Artifacts
              </Button>
              <Button
                variant={tab === 'mine' ? 'default' : 'outline'}
                onClick={() => handleTabChange('mine')}
              >
                My Artifacts
              </Button>
              <Button
                variant={tab === 'others' ? 'default' : 'outline'}
                onClick={() => handleTabChange('others')}
              >
                Others' Artifacts
              </Button>
              <div className="ml-auto flex gap-2">
                <Button
                  variant={view === 'grid' ? 'default' : 'outline'}
                  onClick={() => setView('grid')}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={view === 'table' ? 'default' : 'outline'}
                  onClick={() => setView('table')}
                >
                  <List className="w-4 h-4 mr-2" />
                  Table
                </Button>
              </div>
            </div>

            {/* Filters */}
            <form onSubmit={submitFilter} className="flex gap-2 flex-wrap">
              <div className="flex gap-2 flex-wrap">
                <Input
                  name="search"
                  value={filter.search || ''}
                  onChange={handleFilterChange}
                  placeholder="Search title..."
                  className="w-48"
                />
                <Select
                  value={filter.category_id || ''}
                  onValueChange={(value) => handleSelectChange('category_id', value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat.id} value={String(cat.id) || ''}>
                          {cat.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  value={filter.condition || ''}
                  onValueChange={(value) => handleSelectChange('condition', value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {condition.map((cond: string) => (
                        <SelectItem key={cond} value={cond || ''}>
                          {cond}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Input
                  name="location"
                  value={filter.location || ''}
                  onChange={handleFilterChange}
                  placeholder="Location..."
                  className="w-40"
                />
                <Button type="submit" variant="outline">
                  <Search className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button type="button" variant="outline" onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Content */}
        {view === 'table' ? (
          <Card>
            <CardContent className="p-0">
              <Table
                data={artifacts.data}
                resource="artifacts"
                type="Artifact"
                columns={columns}
                paginationLinks={artifacts.links}
                from={artifacts.from}
                to={artifacts.to}
                total={artifacts.total}
                canSearch={false}
              />
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
              {artifacts.data.map((artifact: any) => (
                <Card key={artifact.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={artifact.thumbnail_url || "https://placehold.co/400x400?text=IMG"}
                      alt="Artifact Thumbnail"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="font-bold text-lg mb-2">
                      <Link
                        href={route('artifacts.show', artifact.id)}
                        className="hover:underline text-gray-900 dark:text-white"
                      >
                        {artifact.title}
                      </Link>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Category: {artifact.category?.title}
                    </div>
                    <div className="flex gap-2 mb-2">
                      <Badge variant={artifact.condition === 'good' ? 'default' : 'destructive'}>
                        {artifact.condition}
                      </Badge>
                      <Badge variant="outline">{artifact.status}</Badge>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Location: {artifact.location || 'Not specified'}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                      Acquired: {artifact.acquisition_date ? new Date(artifact.acquisition_date).toLocaleDateString() : 'Not specified'}
                    </div>
                    <div className="flex gap-2">
                      <Link href={route('artifacts.show', artifact.id)}>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={route('artifacts.edit', artifact.id)}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Pagination
              links={artifacts.links}
              from={artifacts.from}
              to={artifacts.to}
              total={artifacts.total}
            />
          </>
        )}
      </div>
    </AppLayout>
  );
}
