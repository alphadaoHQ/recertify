"use client";

import dynamic from "next/dynamic";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const AddAdminForm = dynamic(() => import("@/components/AddAdminForm"), { ssr: false });

export default function AdminsPage() {
  return (
    <TonConnectUIProvider manifestUrl={"https://peach-fast-clam-38.mypinata.cloud/ipfs/bafkreidsqkapogy6yric4zskh76r5ldsdrstwrlnvsidb2fzi2tflqzywa"}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Admins</h1>
        <div className="bg-gray-800 p-6 rounded-lg">
          {/* @ts-ignore server-component */}
          <AddAdminForm />
        </div>
      </div>
    </TonConnectUIProvider>
  );
}