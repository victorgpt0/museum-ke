import * as React from 'react';

export function FormUI({children}:React.ComponentProps<"div">){
    return (

        <div className="py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Form */}
                <div className="rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">

                    {children}

                </div>

            </div>
        </div>
    );
}
