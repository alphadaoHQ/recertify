"use client";

import React, { useEffect, useState } from "react";

const fetchAudit = async (user: string, page = 1, limit = 20) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (user) params.set("user", user);
  const res = await fetch(`/api/avatar-audit?${params.toString()}`);
  return res.json();
};

const fetchAuditAdmin = async (adminKey: string, page = 1, limit = 20) => {
  const params = new URLSearchParams({
    adminKey,
    page: page.toString(),
    limit: limit.toString(),
  });
  const res = await fetch(`/api/avatar-audit?${params.toString()}`);
  return res.json();
};

export default function AvatarAuditAdminPage() {
  const [mode, setMode] = useState<"user" | "admin">("user");
  const [user, setUser] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // no-op
  }, []);

  const totalPages = Math.ceil(total / pageSize);

  const load = async () => {
    if (mode === "user" && !user) return;
    if (mode === "admin" && !adminKey) return;

    setLoading(true);
    try {
      let j;
      if (mode === "admin") {
        j = await fetchAuditAdmin(adminKey, page, pageSize);
      } else {
        j = await fetchAudit(user, page, pageSize);
      }

      if (j?.success) {
        setRows(j.data || []);
        setTotal(j.total || 0);
      } else {
        setRows([]);
        setTotal(0);
        if (j?.message) alert(`Error: ${j.message}`);
      }
    } catch (e) {
      console.error(e);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Auto-load when page changes
  useEffect(() => {
    if ((mode === "user" && user) || (mode === "admin" && adminKey)) {
      load();
    }
  }, [page]);

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4">Avatar Audit (Admin)</h3>

      {/* Mode Selector */}
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="user"
            checked={mode === "user"}
            onChange={(e) => {
              setMode(e.target.value as "user" | "admin");
              setPage(1);
            }}
          />
          <span>Search by User</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="admin"
            checked={mode === "admin"}
            onChange={(e) => {
              setMode(e.target.value as "user" | "admin");
              setPage(1);
            }}
          />
          <span>Admin: All Audits</span>
        </label>
      </div>

      {/* Input Fields */}
      <div className="flex flex-col gap-3 mb-4">
        {mode === "user" && (
          <div className="flex items-center gap-2">
            <input
              value={user}
              onChange={(e) => {
                setUser(e.target.value);
                setPage(1);
              }}
              placeholder="user_address"
              className="w-80 p-2 rounded border"
            />
            <button
              onClick={load}
              className="px-3 py-1 bg-purple-600 text-white rounded"
            >
              Load
            </button>
          </div>
        )}
        {mode === "admin" && (
          <div className="flex items-center gap-2">
            <input
              type="password"
              value={adminKey}
              onChange={(e) => {
                setAdminKey(e.target.value);
                setPage(1);
              }}
              placeholder="Admin API Key"
              className="w-80 p-2 rounded border"
            />
            <button
              onClick={load}
              className="px-3 py-1 bg-purple-600 text-white rounded"
            >
              Load
            </button>
          </div>
        )}
      </div>

      {/* Table and Pagination */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {/* Pagination Info */}
          {total > 0 && (
            <div className="mb-4 text-sm text-gray-600">
              Showing {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, total)} of {total}
              {totalPages > 1 && ` (Page ${page} of ${totalPages})`}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="text-left bg-gray-100">
                  <th className="p-2">ID</th>
                  <th className="p-2">User Address</th>
                  <th className="p-2">Method</th>
                  <th className="p-2">Avatar URL</th>
                  <th className="p-2">Metadata</th>
                  <th className="p-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No results
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 align-top">{r.id}</td>
                      <td className="p-2 align-top text-sm break-words max-w-xs">
                        {r.user_address}
                      </td>
                      <td className="p-2 align-top">{r.method}</td>
                      <td className="p-2 align-top text-sm break-words max-w-xs">
                        <a
                          className="text-blue-400 hover:underline"
                          href={r.avatar_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {r.avatar_url
                            ? r.avatar_url.substring(0, 50) + "..."
                            : "—"}
                        </a>
                      </td>
                      <td className="p-2 align-top text-xs break-words max-w-sm">
                        <pre className="whitespace-pre-wrap bg-gray-50 p-1 rounded">
                          {JSON.stringify(r.metadata, null, 2)}
                        </pre>
                      </td>
                      <td className="p-2 align-top text-sm">
                        {new Date(r.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
