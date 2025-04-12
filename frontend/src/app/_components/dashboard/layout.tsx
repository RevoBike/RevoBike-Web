import Sidebar from "./sideBar";
import Header from "./header";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className="flex bg-[#FAFBFF] min-h-screen">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col w-full">
        <Header />
        <main className="p-2">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
