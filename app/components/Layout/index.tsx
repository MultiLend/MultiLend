import React, { FC, ReactNode } from "react";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className="hidden md:block">
        <Header />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
      </div>
      <div className="flex justify-center items-center text-center font-bold w-screen h-screen md:hidden">
        We didn{"'"}t have time to make it responsive. Please try again on a
        Laptop/PC {"<3"}
      </div>
    </>
  );
};

export default Layout;
