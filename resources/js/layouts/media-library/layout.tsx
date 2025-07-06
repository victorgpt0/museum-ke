import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';
import { 
    Image, 
    Video, 
    Music, 
    FileText, 
    Archive, 
    BarChart3 
} from 'lucide-react';

const sidebarNavItems: NavItem[] = [
    {
        title: 'All Media',
        href: '/media-library',
        icon: Image,
    },
    {
        title: 'Images',
        href: '/media-library/type/images',
        icon: Image,
    },
    {
        title: 'Videos',
        href: '/media-library/type/videos',
        icon: Video,
    },
    {
        title: 'Documents',
        href: '/media-library/type/documents',
        icon: FileText,
    },
    {
        title: 'Audio',
        href: '/media-library/type/audio',
        icon: Music,
    },
    {
        title: 'Analytics',
        href: '/media-library/analytics',
        icon: BarChart3,
    },
];

export default function MediaLibraryLayout({ children }: PropsWithChildren) {
    // When server-side rendering, we only render the layout on the client...
    if (typeof window === 'undefined') {
        return null;
    }

    const currentPath = window.location.pathname;

    return (
        <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6">
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-36">
                    <nav className="flex flex-col space-y-1 space-x-0">
                        {sidebarNavItems.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <Button
                                    key={`${item.href}-${index}`}
                                    size="sm"
                                    variant="ghost"
                                    asChild
                                    className={cn('w-full justify-start', {
                                        'bg-muted': currentPath === item.href,
                                    })}
                                >
                                    <Link href={item.href} prefetch>
                                        {Icon && <Icon className="mr-2 h-4 w-4" />}
                                        {item.title}
                                    </Link>
                                </Button>
                            );
                        })}
                    </nav>
                </aside>

                <Separator className="my-6 md:hidden" />

                <div className="flex-1 px-2 md:px-4 lg:px-8">
                    {children}
                </div>
            </div>
        </div>
    );
} 