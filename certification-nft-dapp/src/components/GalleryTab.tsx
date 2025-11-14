import { CertificateShelf } from "@/components/CertificateShelf";
import { Image as ImageIcon } from "lucide-react";
import { METADATA_BASE_URI } from "@/lib/constants";
import { useState, useEffect } from "react";

interface GalleryTabProps {
  isDarkMode: boolean;
  isTransitioning: boolean;
  previousTab: string | null;
}

interface CertificatePreview {
  id: number;
  name: string;
  image: string;
  description?: string;
}

export function GalleryTab({
  isDarkMode,
  isTransitioning,
  previousTab
}: GalleryTabProps) {
  const [certificatePreviews, setCertificatePreviews] = useState<CertificatePreview[]>([]);

  useEffect(() => {
    const loadCertificatePreviews = async () => {
      const previews: CertificatePreview[] = [];

      // Load first 10 certificates or until we can't find more
      for (let i = 1; i <= 10; i++) {
        try {
          const response = await fetch(`${METADATA_BASE_URI}${i}.json`);
          if (response.ok) {
            const metadata = await response.json();
            previews.push({
              id: i,
              name: metadata.name || `ALPHA DAO Certificate #${i}`,
              image: metadata.image,
              description: metadata.description
            });
          } else {
            break; // Stop if we can't find consecutive certificates
          }
        } catch (error) {
          console.error(`Failed to load certificate ${i}:`, error);
          break;
        }
      }

      setCertificatePreviews(previews);
    };

    loadCertificatePreviews();
  }, []);

  return (
    <div className={`${isTransitioning ? (previousTab === 'home' ? 'slide-in-right' : previousTab === 'admin' ? 'slide-in-left' : 'fade-in') : 'fade-in'}`}>
      <div className="mb-6">
        <h2 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
          isDarkMode ? "text-white" : "text-[#14171a]"
        }`}>
          Certificate Gallery
        </h2>
        <p className={`text-sm transition-colors duration-300 ${
          isDarkMode ? "text-[#8899a6]" : "text-[#536471]"
        }`}>
          Browse all issued certificates and explore our community's achievements
        </p>
      </div>

      {/* Certificate Previews */}
      {certificatePreviews.length > 0 && (
        <div className="mb-8">
          <div className={`p-4 rounded-xl border transition-all duration-300 ${
            isDarkMode ? "bg-[#192734] border-[#2f3336]" : "bg-white border-[#e1e8ed]"
          }`}>
            <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 flex items-center gap-2 ${
              isDarkMode ? "text-white" : "text-[#14171a]"
            }`}>
              <ImageIcon className="w-5 h-5" />
              Certificate Collection
            </h3>
            <div className="grid  gap-4">
              {certificatePreviews.map((cert) => (
                <div key={cert.id} className={`p-4 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
                  isDarkMode ? "bg-[#22303c] border-[#2f3336]" : "bg-[#f7f9fa] border-[#e1e8ed]"
                }`}>
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <img
                      src={cert.image}
                      alt={cert.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-nft.png';
                      }}
                    />
                  </div>
                  <h4 className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
                    isDarkMode ? "text-white" : "text-[#14171a]"
                  }`}>
                    {cert.name}
                  </h4>
                  <p className={`text-xs transition-colors duration-300 ${
                    isDarkMode ? "text-[#8899a6]" : "text-[#536471]"
                  }`}>
                    ID: #{cert.id}
                  </p>
                  {cert.description && (
                    <p className={`text-xs mt-2 transition-colors duration-300 ${
                      isDarkMode ? "text-[#8899a6]" : "text-[#536471]"
                    }`}>
                      {cert.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <CertificateShelf />
    </div>
  );
}