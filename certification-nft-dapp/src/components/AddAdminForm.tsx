import { Loader2, Shield } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useContract } from "@/hooks/useContract";
import { validateAddress } from "@/lib/utils/address";

interface AddAdminFormProps {
  onSuccess?: () => void;
}

export const AddAdminForm = ({ onSuccess }: AddAdminFormProps) => {
  const [address, setAddress] = useState("");
  const [validationError, setValidationError] = useState("");
  const { addAdmin, loading, error } = useContract();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!address.trim()) {
      setValidationError("Enter admin address");
      return;
    }

    if (!validateAddress(address)) {
      setValidationError("Invalid TON address");
      return;
    }

    const result = await addAdmin(address);
    if (result.success) {
      setAddress("");
      onSuccess?.();
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-900/50 rounded-lg">
          <Shield className="w-6 h-6 text-purple-300" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Add Admin</h2>
          <p className="text-sm text-gray-400">Admin access required</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="admin-address" className="block text-sm font-medium text-gray-300 mb-2">
            New Admin Address
          </label>
          <input
            id="admin-address"
            type="text"
            value={address}
            onChange={(e) => { setAddress(e.target.value); setValidationError(""); }}
            placeholder="Enter address for admin access..."
            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow text-white placeholder-gray-500"
            disabled={loading}
          />
          {validationError && <p className="mt-1 text-sm text-red-400">{validationError}</p>}
        </div>
        {error && (
          <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Adding...</> : <><Shield className="w-5 h-5" /> Add Admin</>}
        </button>
      </form>
    </div>
  );
};