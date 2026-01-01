"use client";

import dynamic from "next/dynamic";

const ContractState = dynamic(() => import("@/components/ContractState"), { ssr: false });

export default function StatePage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Contract State</h1>
      <div className="bg-gray-800 p-6 rounded-lg">
        {/* @ts-ignore server-component */}
        <ContractState />
      </div>
    </div>
  );
}