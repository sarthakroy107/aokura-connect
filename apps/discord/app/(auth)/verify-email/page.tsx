import { redirect } from "next/navigation";
import { verifyEmail } from "./_actions/verify-email";
import { ShieldCheck, ShieldClose } from "lucide-react";

const Page = async ({
  searchParams,
}: {
  searchParams: { token: string | undefined } | undefined;
}) => {

  let res;

  if (!searchParams?.token) {
    res = {
      success: false,
      message: "No token provided",
      status: 400,
    };
  }

  res = await verifyEmail(searchParams?.token);

  if (res.redirectLink && res.success) {
    setTimeout(function () {
      redirect('/signin');
    }, 3000);
  }

  return (
    <div className="bg-discord h-[38.5rem] w-[450px] rounded-[3px] py-9 flex flex-col items-center">
      {res.success && res.status === 200 ? (
        <>
          <ShieldCheck size={69} className="text-discord_teal" />
          <p className="text-lg text-white font-medium my-3">{res.message}</p>
          <p className="text-white/50 font-medium">Redirecting to login page</p>
        </>
      ) : (
        <>
          <ShieldClose size={69} className="text-discord_red" />
          <p className="text-lg text-white font-medium mt-3">{res.message}</p>
        </>
      )}
    </div>
  );
};

export default Page;
