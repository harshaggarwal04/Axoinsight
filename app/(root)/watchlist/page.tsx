import { getUserWatchlistByEmail } from "@/lib/actions/watchlist.actions";
import WatchlistButton from "@/components/WatchlistButton";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { Price } from "@/database/models/price.model";

export default async function WatchlistPage() {
  // ✅ Get session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const email = session?.user?.email;

  if (!email) {
    throw new Error("User not authenticated");
  }

  // ✅ 1. Get watchlist
  const watchlist = await getUserWatchlistByEmail(email);

  // ✅ 2. Get prices from DB cache
  const prices = await Price.find({
    symbol: { $in: watchlist.map((s) => s.symbol) },
  }).lean();

  // ✅ 3. Merge data
  const watchlistWithPrices = watchlist.map((stock) => {
    const price = prices.find((p) => p.symbol === stock.symbol);

    return {
      ...stock,
      price: price?.price,
      change: price?.change,
    };
  });

  return (
    <div className="min-h-screen bg-[#020617] text-gray-200 px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">
          ⭐ Your Watchlist
        </h1>

        <div className="text-sm text-gray-400">
          {watchlistWithPrices.length} stocks
        </div>
      </div>

      {/* Empty State */}
      {watchlistWithPrices.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="text-gray-500 mb-3 text-lg">
            No stocks in your watchlist
          </div>
          <div className="text-sm text-gray-600">
            Add stocks to track them here
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {watchlistWithPrices.map((stock: any) => (
            <div
              key={stock.symbol}
              className="group relative bg-[#0f172a] border border-gray-800 rounded-xl p-4 
              hover:border-green-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]
              transition-all duration-200"
            >
              {/* Top row */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-lg font-semibold text-white">
                    {stock.symbol}
                  </div>
                  <div className="text-sm text-gray-400">
                    {stock.company}
                  </div>
                </div>

                <WatchlistButton
                  symbol={stock.symbol}
                  company={stock.company}
                  isInWatchlist={true}
                  type="icon"
                  userEmail={email}
                />
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-xl font-medium text-green-400">
                  ${stock.price?.toFixed(2) ?? "--"}
                </div>

                <div className="text-sm text-green-400">
                  {stock.change?.toFixed(2) ?? "--"}%
                </div>
              </div>

              {/* Hover effect */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 
              bg-gradient-to-r from-green-500/5 to-transparent pointer-events-none transition" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}