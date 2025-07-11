export default function AppLogo() {
    return (
        <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#232323] border border-gray-200 dark:border-[#444]">
                <img src="/images/image7.png" alt="National Museum Logo" className="w-6 h-6 object-contain" />
            </span>
            <span className="font-bold text-base tracking-wide text-[#1b1b18] dark:text-white">National Museum</span>
        </div>
    );
}
