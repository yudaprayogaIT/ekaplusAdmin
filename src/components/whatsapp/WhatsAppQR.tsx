'use client';

import QRCode from "react-qr-code";
import { FaWhatsapp } from "react-icons/fa";

type Props = {
  qr: string;
  msg: string;
};

export default function WhatsAppQR({ qr,msg }: Props) {
  if (!qr) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      
      {/* QR container */}
      <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-gray-100">

        {/* QR code */}
        <QRCode
          value={qr}
          size={240}
          bgColor="#ffffff"
          fgColor="#111827"
        />

        {/* Center Logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100">
            <FaWhatsapp className="w-7 h-7 text-green-500" />
          </div>
        </div>

      </div>

      {/* Instruction text */}
      <div className="text-center text-sm text-gray-500 max-w-xs">
        <h4 className="mb-5">{msg??"Loading ..."}</h4>
        Scan QR ini menggunakan <span className="font-semibold text-gray-700">WhatsApp</span> di ponsel untuk menghubungkan perangkat.
      </div>

    </div>
  );
}