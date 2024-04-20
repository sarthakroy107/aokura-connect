import PageNavbar from "@/components/navigation/page-nav";
import React from "react";
import { PuffLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="w-full h-full bg-discord">
      <PageNavbar className="justify-between px-5">sjflcnmljd</PageNavbar>
      <div className="w-full h-[89vh] flex justify-center items-center">
        <PuffLoader color="#fff" />
      </div>
    </div>
  );
};

export default Loading;
