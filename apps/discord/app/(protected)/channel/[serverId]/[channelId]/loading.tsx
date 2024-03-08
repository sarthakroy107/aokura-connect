import { BarLoader } from "react-spinners"

const Loading = () => {
  return (
    <div className="w-full h-[57.5rem] flex justify-center items-center">
      <BarLoader color="#fff" />
    </div>
  )
}

export default Loading