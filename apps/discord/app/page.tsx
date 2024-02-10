import { currentProfile } from "@/lib/auth/current-user"

const Page = async () => {

  const data = await currentProfile()
  console.log(data)
  if (!data) return <div>Loading...</div>
  return (
    <div className="w-full h-screen bg-discord text-white">
     {data.id}
    </div>
  )
}

export default Page