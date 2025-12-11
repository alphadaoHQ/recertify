"use client";

import { TonConnectButton } from "@tonconnect/ui-react";
import { useEffect } from "react";

export function PurpleTonConnectButton() {
  useEffect(() => {
    // Force purple styling after component mounts
    const interval = setInterval(() => {
      const buttons = document.querySelectorAll(
        "[data-tc-connect-button-root] button, [data-tc-dropdown-button-root] button",
      );
      buttons.forEach((button) => {
        const htmlButton = button as HTMLElement;
        htmlButton.style.background = "#7c3aed";
        htmlButton.style.backgroundColor = "#7c3aed";
        htmlButton.style.borderColor = "#7c3aed";
        htmlButton.style.color = "white";
        htmlButton.style.borderRadius = "12px";
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ton-connect-purple">
      <TonConnectButton />
      <style jsx>{`
        .ton-connect-purple :global([data-tc-connect-button-root] button),
        .ton-connect-purple :global([data-tc-dropdown-button-root] button) {
          background: #7c3aed !important;
          background-color: #7c3aed !important;
          border-color: #7c3aed !important;
          color: white !important;
          border-radius: 12px !important;
        }
        .ton-connect-purple :global([data-tc-connect-button-root] button:hover),
        .ton-connect-purple :global([data-tc-dropdown-button-root] button:hover) {
          background: #6d28d9 !important;
          background-color: #6d28d9 !important;
        }
      `}</style>
    </div>
  );
}
