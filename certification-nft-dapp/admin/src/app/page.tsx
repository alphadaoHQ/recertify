"use client";

import { useTonAddress } from "@tonconnect/ui-react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

const _manifestUrl =
  "https://peach-fast-clam-38.mypinata.cloud/ipfs/bafkreidsqkapogy6yric4zskh76r5ldsdrstwrlnvsidb2fzi2tflqzywa";

function AdminContent() {
  const userAddress = useTonAddress();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    // Check admin status - this would need proper implementation
    // For now, just show the interface
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
              <p className="text-gray-300 mb-4">
                Manage certificates and permissions
              </p>

              {/* Mint Form Placeholder */}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">Mint New Certificate</h3>
                <p className="text-gray-400">Mint form would go here</p>
              </div>

              {/* Add Admin Form Placeholder */}
              <div>
                <h3 className="text-lg font-bold mb-2">Add Admin</h3>
                <p className="text-gray-400">Add admin form would go here</p>
              </div>
            </div>

            {/* Contract State Placeholder */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Contract State</h2>
              <p className="text-gray-400">
                Contract state information would go here
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-bold mb-2">Admin Access Required</h3>
            <p className="text-gray-400 mb-4">
              Connect an admin wallet to access this section
            </p>
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
