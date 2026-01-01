"use client";

import dynamic from "next/dynamic";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const DeployForm = dynamic(() => import("@/components/DeployForm"), { ssr: false });

export default function DeployPage() {
  return (
    <TonConnectUIProvider manifestUrl={"https://peach-fast-clam-38.mypinata.cloud/ipfs/bafkreidsqkapogy6yric4zskh76r5ldsdrstwrlnvsidb2fzi2tflqzywa"}>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Deploy Collection</h1>
        <div className="bg-gray-800 p-6 rounded-lg">
          {/* @ts-ignore server-component */}
          <DeployForm />
        </div>
      </div>
    </TonConnectUIProvider>
  );
}