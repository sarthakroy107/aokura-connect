import { BarLoader } from "react-spinners"

const Loading = () => {
  return (
    <div className="bg-discord w-[390px] md:w-[430px] lg:w-[480] h-[38.5rem] flex justify-center items-center">
      <BarLoader color="#4f545c" />
    </div>
  )
}

export default Loading