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
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}