import PageNavbar from "@/components/navigation/page-nav";

const Page = () => {
  return (
    <div className="w-full h-full bg-discord flex justify-center">
      <PageNavbar>
        <button className="">Online</button>
        <button className="">Pending</button>
        <button className="bg-discord_green_dark p-[2px] px-1 rounded-[2px]">
          Add Friends
        </button>
      </PageNavbar>
    </div>
  );
};

export default Page;
