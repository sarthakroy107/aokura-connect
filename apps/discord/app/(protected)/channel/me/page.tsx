const Page = () => {
  return (
    <div className="w-full h-full bg-discord flex justify-center">
      <div
        className="w-full sticky top-0 h-11 bg-discord shadow-sm shadow-black/30 space-x-4 px-5
        flex items-center text-white text-opacity-40 gap-x-1 text-xs"
      >
        <button className="">
          Online
        </button>
        <button className="">
          Pending
        </button>
        <button className="bg-discord_green_dark p-[2px] px-1 rounded-[2px]">
          Add Friends
        </button>
      </div>
    </div>
  );
};

export default Page;
