"use client";
import { redirect } from "next/navigation";
import { useCheckAdmin } from "./_utils/check-admin";
import { useEffect } from "react";

const Home = () => {
  const admin = useCheckAdmin();

  useEffect(() => {
    if (admin) {
      redirect("/dashboard");
    } else {
      redirect("/login");
    }
  }, [admin]);
};

export default Home;
