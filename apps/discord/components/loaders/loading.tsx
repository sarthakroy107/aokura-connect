import { BarLoader } from "react-spinners";

const Loading = () => {
  return (
    <section className="w-full h-full flex justify-center items-center">
      <BarLoader color="#fff" />
    </section>
  );
};

export default Loading;
