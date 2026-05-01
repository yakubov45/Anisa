const Skeleton = ({ className }) => (
    <div className={`animate-pulse bg-surface-100 rounded-2xl ${className}`} />
);

export const ProductSkeleton = () => (
    <div className="bg-surface rounded-3xl p-5 border border-surface-50 space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
    </div>
);

export default Skeleton;
