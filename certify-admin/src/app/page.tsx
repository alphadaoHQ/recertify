"use client";

import { useTonAddress } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MintForm = dynamic(() => import("@/components/MintForm"), { ssr: false });
const AddAdminForm = dynamic(() => import("@/components/AddAdminForm"), { ssr: false });
const ContractState = dynamic(() => import("@/components/ContractState"), { ssr: false });
const DeployForm = dynamic(() => import("@/components/DeployForm"), { ssr: false });

const _manifestUrl =
  "https://peach-fast-clam-38.mypinata.cloud/ipfs/bafkreidsqkapogy6yric4zskh76r5ldsdrstwrlnvsidb2fzi2tflqzywa";

function AdminContent() {
  const userAddress = useTonAddress();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // In future we can call a server or on-chain getter to determine admin status.
    setIsAdmin(true);
    setIsOwner(true);
  }, []);

  const handleTransactionSuccess = (message: string) => {
    alert(message);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">CertifyNFT Admin Panel</h1>

        {userAddress && (isAdmin || isOwner) ? (
          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
              <p className="text-gray-300 mb-4">Manage certificates and permissions</p>

              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Mint New Certificate</h3>
                <p className="text-gray-400 mb-4">Use the form below to mint a certificate (wallet will ask for confirmation).</p>
                <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    {/* Mint form component */}
                    {/* @ts-ignore server-component */}
                    <MintForm />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-2">Add Admin</h3>
                    <p className="text-gray-400 mb-4">Promote an address to admin using the contract.</p>
                    {/* @ts-ignore server-component */}
                    <AddAdminForm />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-2">Deploy Collection</h3>
                    <p className="text-gray-400 mb-4">Provide compiled collection code/data BOC to deploy a new collection.</p>
                    {/* @ts-ignore server-component */}
                    <DeployForm />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">Add Admin</h3>
                <p className="text-gray-400">Add admin form will be added here.</p>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <ContractState />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-bold mb-2">Admin Access Required</h3>
            <p className="text-gray-400 mb-4">Connect an admin wallet to access this section</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <TonConnectUIProvider manifestUrl="https://peach-fast-clam-38.mypinata.cloud/ipfs/bafkreidsqkapogy6yric4zskh76r5ldsdrstwrlnvsidb2fzi2tflqzywa">
      <AdminContent />
    </TonConnectUIProvider>
  );
}
