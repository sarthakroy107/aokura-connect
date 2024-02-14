import { Skeleton } from "@ui/components/ui/skeleton";

const MessageLoader = () => {
  return (
    <div className="w-full flex p-3 pt-4 space-x-3.5 ">
      <Skeleton className="w-11 h-11 rounded-full" />
      <div className="space-y-2 py-0.5">
        <div className="flex space-x-2">
          <Skeleton className="w-24 h-3" />
          <Skeleton className="w-40 h-3" />
        </div>
        <Skeleton className="w-44 h-12" />
      </div>
    </div>
  );
};

export default MessageLoader;
