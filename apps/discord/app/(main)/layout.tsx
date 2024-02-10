import NavigationSidebar from "@/components/navigation/navigation-sidebar";

const MainLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="min-h-screen w-full flex text-white">
      <NavigationSidebar />
      {children}
    </div>
  );
}

export default MainLayout;