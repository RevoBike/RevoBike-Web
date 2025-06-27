import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "leaflet/dist/leaflet.css";
import { Poppins } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import Providers from "./client/provider";
import Footer from "./dashboard/_components/footer";
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "This is admin dashboard for Revo bike",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head></head>
      <body
        className={`${poppins.className} flex flex-col min-h-screen bg-[#FAFBFF]`}
      >
        <Providers>
          <MantineProvider
            theme={{
              components: {
                Button: {
                  defaultProps: {
                    variant: "unstyled",
                  },
                },
              },
            }}
          >
            <Notifications limit={1} />
            <div className="flex-grow">{children}</div>
          </MantineProvider>
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
