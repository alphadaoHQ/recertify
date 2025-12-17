import { TonConnectButton } from "@tonconnect/ui-react";
import { Image as ImageIcon, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { AddAdminForm } from "@/components/AddAdminForm";
import { ContractState } from "@/components/ContractState";
import { MintForm } from "@/components/MintForm";
import { METADATA_BASE_URI } from "@/lib/constants";

interface AdminTabProps {
  isDarkMode: boolean;
  isTransitioning: boolean;
  previousTab: string | null;
  userAddress: string | undefined;
  isAdmin: boolean;
  isOwner: boolean;
  handleTransactionSuccess: (message: string) => void;
}

export function AdminTab({
  isDarkMode,
  isTransitioning,
  previousTab,
  userAddress,
  isAdmin,
  isOwner,
  handleTransactionSuccess,
}: AdminTabProps) {
  const [nftImages, setNftImages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const loadNftImages = async () => {
      const images: { [key: number]: string } = {};

      for (let i = 1; i <= 3; i++) {
        try {
          const response = await fetch(`${METADATA_BASE_URI}${i}.json`);
          if (response.ok) {
            const metadata = await response.json();
            images[i] = metadata.image;
          }
        } catch (error) {
          console.error(`Failed to load metadata for NFT ${i}:`, error);
        }
      }

      setNftImages(images);
    };

    loadNftImages();
  }, []);
  return (
    <div
      className={`${isTransitioning ? (previousTab === "home" ? "slide-in-right" : previousTab === "gallery" ? "slide-in-right" : "fade-in") : "fade-in"}`}
    >
      {userAddress && (isAdmin || isOwner) ? (
        <div className="space-y-6">
          <div>
            <h2
              className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Admin Dashboard
            </h2>
            <p
              className={`text-sm transition-colors duration-300 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Manage certificates and permissions
            </p>
          </div>

          <div className="space-y-6">
            {isAdmin && (
              <div
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Mint New Certificate
                </h3>
                <MintForm
                  onSuccess={() =>
                    handleTransactionSuccess("Certificate minted successfully!")
                  }
                />
              </div>
            )}

            {(isOwner || isAdmin) && (
              <div
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800/50 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <h3
                  className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Add Admin
                </h3>
                <AddAdminForm
                  onSuccess={() => handleTransactionSuccess("Admin added!")}
                />
              </div>
            )}
          </div>

          {/* NFT Preview Section */}
          <div className="mt-6">
            <div
              className={`p-4 rounded-xl border transition-all duration-300 ${
                isDarkMode
                  ? "bg-[#192734] border-[#2f3336]"
                  : "bg-white border-[#e1e8ed]"
              }`}
            >
              <h3
                className={`text-lg font-bold mb-4 transition-colors duration-300 ${
                  isDarkMode ? "text-white" : "text-[#14171a]"
                }`}
              >
                <ImageIcon className="w-5 h-5 inline mr-2" />
                Certificate NFT Preview
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Certificate 1 */}
                <div
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDarkMode
                      ? "bg-[#22303c] border-[#2f3336]"
                      : "bg-[#f7f9fa] border-[#e1e8ed]"
                  }`}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <img
                      src={nftImages[1] || `${METADATA_BASE_URI}1.png`}
                      alt="ALPHA DAO Certificate #1"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-nft.png";
                      }}
                    />
                  </div>
                  <h4
                    className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-[#14171a]"
                    }`}
                  >
                    ALPHA DAO Certificate
                  </h4>
                  <p
                    className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? "text-[#8899a6]" : "text-[#536471]"
                    }`}
                  >
                    ID: #1
                  </p>
                </div>

                {/* Certificate 2 */}
                <div
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDarkMode
                      ? "bg-[#22303c] border-[#2f3336]"
                      : "bg-[#f7f9fa] border-[#e1e8ed]"
                  }`}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <img
                      src={nftImages[2] || `${METADATA_BASE_URI}2.png`}
                      alt="ALPHA DAO Certificate #2"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-nft.png";
                      }}
                    />
                  </div>
                  <h4
                    className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-[#14171a]"
                    }`}
                  >
                    ALPHA DAO Certificate
                  </h4>
                  <p
                    className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? "text-[#8899a6]" : "text-[#536471]"
                    }`}
                  >
                    ID: #2
                  </p>
                </div>

                {/* Certificate 3 */}
                <div
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    isDarkMode
                      ? "bg-[#22303c] border-[#2f3336]"
                      : "bg-[#f7f9fa] border-[#e1e8ed]"
                  }`}
                >
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <img
                      src={nftImages[3] || `${METADATA_BASE_URI}3.png`}
                      alt="ALPHA DAO Certificate #3"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-nft.png";
                      }}
                    />
                  </div>
                  <h4
                    className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
                      isDarkMode ? "text-white" : "text-[#14171a]"
                    }`}
                  >
                    ALPHA DAO Certificate
                  </h4>
                  <p
                    className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? "text-[#8899a6]" : "text-[#536471]"
                    }`}
                  >
                    ID: #3
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contract State */}
          <div className="mt-6">
            <ContractState />
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3
            className={`text-lg font-bold mb-2 transition-colors duration-300 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Admin Access Required
          </h3>
          <p
            className={`text-sm mb-4 transition-colors duration-300 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Connect an admin wallet to access this section
          </p>
          {!userAddress && (
            <div
              className={`rounded-xl overflow-hidden shadow-md transition-all duration-300 inline-block ${
                isDarkMode ? "ring-1 ring-gray-700" : "ring-1 ring-gray-200"
              }`}
            >
              <div
                className={`p-0.5 transition-colors duration-300 ${
                  isDarkMode ? "bg-gray-900" : "bg-gray-50"
                }`}
              >
                <TonConnectButton key="admin-connect" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
