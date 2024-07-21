"use client";

import React from "react";
import { Button } from "./ui/button";
import { logout } from "../auth";
import { useRouter } from "next/navigation";
const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };
  return <Button onClick={() => handleLogout()}>Log out</Button>;
};

export default LogoutButton;
