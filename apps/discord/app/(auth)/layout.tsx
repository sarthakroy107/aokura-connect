const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex items-center justify-center text-white bg-discord_default">
      {children}
    </div>
  );
};

export default AuthLayout;
