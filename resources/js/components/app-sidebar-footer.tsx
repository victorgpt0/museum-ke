import { usePage } from '@inertiajs/react';

export function AppSidebarFooter() {
    const {quote} = usePage().props;
    return (
        <footer className="border-sidebar-border/50 bottom-0 flex h-16 shrink-0 items-center gap-2 border-t px-6 transition-[width,height] ease-linear md:px-4">

    <div className={`flex flex-col items-center justify-center flex-1 h-16 text-center`}>
    <blockquote className="text-sm font-medium text-foreground/80">
        "{(quote as { message: string }).message}"
        </blockquote>
        <cite className="text-xs text-muted-foreground mt-1">
                    — {(quote as { author: string }).author}
    </cite>
    </div>

    </footer>
);
}
