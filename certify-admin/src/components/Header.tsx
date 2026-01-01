"use client";

import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold">CertifyNFT Admin</Link>
          <nav className="hidden md:flex space-x-2 text-sm">
            <Link href="/mint" className="px-3 py-1 rounded hover:bg-gray-700">Mint</Link>
            <Link href="/admins" className="px-3 py-1 rounded hover:bg-gray-700">Admins</Link>
            <Link href="/state" className="px-3 py-1 rounded hover:bg-gray-700">State</Link>
            <Link href="/deploy" className="px-3 py-1 rounded hover:bg-gray-700">Deploy</Link>
          </nav>
        </div>

        <div className="text-sm text-gray-300">
          <span className="hidden sm:inline">Connected with TonConnect</span>
        </div>
      </div>
    </header>
  );
}
