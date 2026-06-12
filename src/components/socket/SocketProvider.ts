'use client';

import { useEffect } from "react";
import { connectSocket } from "@/utils/socket";


export default function SocketProvider() {
  useEffect(() => {
    const socket = connectSocket("https://api-ekaplus.ekatunggal.com", {
      path: "/socket.io",
      // query: {
      //   // token: localStorage.getItem("token") || "",
      // },
    });

    socket.on("connect", () => {
    });

    socket.on("disconnect", () => {
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
