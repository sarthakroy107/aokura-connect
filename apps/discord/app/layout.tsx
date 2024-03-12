import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/provider/theme-provider";
import ModalProvider from "@/components/provider/modal-provider";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/components/provider/react-query-provider";
import { SocketProvider } from "@/components/provider/socket-provider";
import AppProvider from "@/components/provider/app-provider";
import { cn } from "@ui/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Discord clone",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "w-full min-h-screen")}>
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            themes={["dark", "light", "system", "orange", "green", "blue"]}
          >
            <ReactQueryProvider>
              <SocketProvider>
                <ModalProvider />
                {children}
                <Toaster richColors={true} />
              </SocketProvider>
            </ReactQueryProvider>
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
