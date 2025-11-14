import { AlertCircle, ExternalLink, FileText, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface IPFSFile {
  name: string;
  url: string;
  metadata?: any;
  error?: string;
}

export const IPFSCollectionViewer = () => {
  const [files, setFiles] = useState<IPFSFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const collectionUrl =
    "https://peach-fast-clam-38.mypinata.cloud/ipfs/bafybeiedq3l22745663ebspnmozssslvek4roaw77lhn75eq3wipxqbxze/";

  const fetchCollection = async () => {
    setLoading(true);
    setError(null);

    try {
      const jsonFiles: IPFSFile[] = [];
      let index = 0;

      // Keep fetching numbered JSON files until we get an error
      while (true) {
        try {
          const fileUrl = `${collectionUrl}${index}.json`;
          const response = await fetch(fileUrl);

          if (!response.ok) {
            // If we get a 404 or other error, we've reached the end
            if (response.status === 404) {
              break;
            }
            // For other errors, continue to next file
            console.warn(`Failed to fetch ${index}.json: ${response.status}`);
            index++;
            continue;
          }

          const metadata = await response.json();

          jsonFiles.push({
            name: `${index}.json`,
            url: fileUrl,
            metadata,
          });

          index++;

          // Small delay to avoid overwhelming the API
          await new Promise((resolve) => setTimeout(resolve, 200));
        } catch (err) {
          // If fetch fails completely, we've likely reached the end
          console.warn(`Error fetching ${index}.json:`, err);
          break;
        }
      }

      setFiles(jsonFiles);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load collection",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [fetchCollection]);

  const renderMetadata = (metadata: any) => {
    if (!metadata) return null;

    return (
      <div className="space-y-4">
        {metadata.name && (
          <div>
            <h4 className="font-semibold text-purple-300">{metadata.name}</h4>
          </div>
        )}

        {metadata.description && (
          <p className="text-sm text-gray-400">{metadata.description}</p>
        )}

        {metadata.image && (
          <div className="aspect-square bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={metadata.image}
              alt={metadata.name || "NFT Image"}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                target.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="hidden text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-2" />
              <p className="text-xs">Image not available</p>
            </div>
          </div>
        )}

        {metadata.attributes && metadata.attributes.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-300 mb-2">Attributes</p>
            <div className="grid grid-cols-2 gap-2">
              {metadata.attributes.map((attr: any, index: number) => (
                <div key={index} className="bg-gray-900 p-2 rounded text-xs">
                  <p className="text-gray-500">{attr.trait_type}</p>
                  <p className="font-medium">{attr.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Display raw JSON for full inspection */}
        <details className="mt-4">
          <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
            View Raw JSON
          </summary>
          <pre className="mt-2 p-3 bg-gray-900 rounded text-xs text-gray-300 overflow-x-auto">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </details>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-900/50 rounded-lg">
          <FileText className="w-6 h-6 text-purple-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold">IPFS Collection Viewer</h2>
          <p className="text-sm text-gray-400">
            Display all JSON metadata files from IPFS collection
          </p>
        </div>
      </div>

      <div className="mb-4">
        <a
          href={collectionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
        >
          View Collection on IPFS <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <span className="ml-3 text-gray-400">Loading collection...</span>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg mb-6">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {!loading && !error && files.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-400">
            Found {files.length} JSON file{files.length !== 1 ? "s" : ""} in
            collection
          </p>
        </div>
      )}

      {!loading && !error && files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {files.map((file, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{file.name}</h3>
                  <p className="text-sm text-gray-400 font-mono">
                    File #{index + 1}
                  </p>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>

              {file.metadata ? (
                renderMetadata(file.metadata)
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    Failed to load metadata
                  </p>
                  {file.error && (
                    <p className="text-xs text-red-300 mt-1">{file.error}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && files.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No JSON files found in collection</p>
        </div>
      )}
    </div>
  );
};
