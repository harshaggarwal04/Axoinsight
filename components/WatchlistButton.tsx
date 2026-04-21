"use client";
import React, { useMemo, useState, useEffect } from "react";
import { toggleWatchlistByEmail } from "@/lib/actions/watchlist.actions";

type WatchlistButtonProps = {
  symbol: string;
  company: string;
  isInWatchlist: boolean;
  userEmail: string; // ✅ added
  showTrashIcon?: boolean;
  type?: "button" | "icon";
  onWatchlistChange?: (...args: any[]) => void;
};

const WatchlistButton = ({
  symbol,
  company,
  isInWatchlist,
  userEmail, // ✅ use from props
  showTrashIcon = false,
  type = "button",
}: WatchlistButtonProps) => {
  const [added, setAdded] = useState<boolean>(!!isInWatchlist);

  // ✅ sync with server state
  useEffect(() => {
    setAdded(!!isInWatchlist);
  }, [isInWatchlist]);

  const label = useMemo(() => {
    if (type === "icon") return "";
    return added ? "Remove from Watchlist" : "Add to Watchlist";
  }, [added, type]);

  const handleClick = async () => {
    const next = !added;
    setAdded(next); // optimistic UI

    const res = await toggleWatchlistByEmail(
      userEmail, // ✅ FIXED (no hardcoding)
      symbol,
      company
    );

    if (res?.error) {
      setAdded(!next); // rollback
    }
  };

  if (type === "icon") {
    return (
      <button
        title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
        className={`group relative flex items-center justify-center w-9 h-9 rounded-full 
        bg-[#0f172a] border border-gray-700 hover:border-green-500 transition-all duration-200
        ${added ? "shadow-[0_0_10px_rgba(34,197,94,0.6)]" : ""}`}
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={added ? "#22c55e" : "none"}
          stroke="#22c55e"
          strokeWidth="1.5"
          className="w-5 h-5 transition-all duration-200 group-hover:scale-110"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
      transition-all duration-200 border
      ${
        added
          ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
          : "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20"
      }`}
    >
      {showTrashIcon && added ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6"
          />
        </svg>
      ) : null}
      <span>{label}</span>
    </button>
  );
};

export default WatchlistButton;