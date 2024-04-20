import React from "react";
import { PuffLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-discord">
      <PuffLoader color="#fff" />
    </div>
  );
};

export default Loading;
