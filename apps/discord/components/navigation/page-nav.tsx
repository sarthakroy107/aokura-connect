import { cn } from "@ui/lib/utils";

const PageNavbar = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={cn("channel-nav", className)}>{children}</div>;
};

export default PageNavbar;
