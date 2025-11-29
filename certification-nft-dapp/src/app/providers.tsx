"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { initTelegramWebApp } from "@/lib/telegram";
import type { ReactNode } from "react";
import { useEffect } from "react";

const _manifestUrl = `${process.env.NEXT_PUBLIC_APP_URL}/tonconnect-manifest.json`;

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize Telegram Web App
    initTelegramWebApp();
  }, []);

  return (
    <TonConnectUIProvider manifestUrl="https://peach-fast-clam-38.mypinata.cloud/ipfs/bafkreidsqkapogy6yric4zskh76r5ldsdrstwrlnvsidb2fzi2tflqzywa">
      {children}
    </TonConnectUIProvider>
  );
}
