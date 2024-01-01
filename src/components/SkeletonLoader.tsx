type SkeletonLoaderProps = {
  hasProfileImg: boolean;
  rows: number;
};

const SkeletonLoader = ({ hasProfileImg, rows }: SkeletonLoaderProps) => {
  return (
    <div className="mx-auto w-full max-w-sm rounded-md border p-2">
      <div className="flex animate-pulse space-x-4">
        {hasProfileImg && (
          <div className="h-10 w-10 rounded-full bg-slate-500"></div>
        )}
        <div className="flex-1 space-y-3 py-1">
          <div className="h-2 rounded bg-slate-500"></div>
          <div className="space-y-3">
            {rows >= 2 && (
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 h-2 rounded bg-slate-500"></div>
                <div className="col-span-1 h-2 rounded bg-slate-500"></div>
              </div>
            )}
            {rows === 3 && <div className="h-2 rounded bg-slate-500"></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;
