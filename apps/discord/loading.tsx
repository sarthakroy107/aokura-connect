import { BarLoader } from "react-spinners";
export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <BarLoader color="#fff" />
    </div>
  );
}
