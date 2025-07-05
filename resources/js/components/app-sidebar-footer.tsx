import { usePage } from '@inertiajs/react';

export function AppSidebarFooter() {
    const { quote } = usePage().props;
    return (
        <footer className="border-sidebar-border/50 bottom-0 flex h-16 shrink-0 items-center gap-2 border-t px-6 transition-[width,height] ease-linear md:px-4">
            <div className={`flex h-16 flex-1 flex-col items-center justify-center text-center`}>
                <blockquote className="text-foreground/80 text-sm font-medium">"{(quote as { message: string }).message}"</blockquote>
                <cite className="text-muted-foreground mt-1 text-xs">— {(quote as { author: string }).author}</cite>
            </div>
        </footer>
    );
}
