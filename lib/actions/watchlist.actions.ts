'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

/* =========================
   EXISTING FUNCTION (UNCHANGED)
   ========================= */
export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
  if (!email) return [];

  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    // Better Auth stores users in the "user" collection
    const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

    if (!user) return [];

    const userId = (user.id as string) || String(user._id || '');
    if (!userId) return [];

    const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
    return items.map((i) => String(i.symbol));
  } catch (err) {
    console.error('getWatchlistSymbolsByEmail error:', err);
    return [];
  }
}

/* =========================
   HELPER (REUSABLE)
   ========================= */
async function getUserIdByEmail(email: string): Promise<string | null> {
  if (!email) return null;

  const mongoose = await connectToDatabase();
  const db = mongoose.connection.db;
  if (!db) return null;

  const user = await db.collection('user').findOne<{ _id?: unknown; id?: string }>({ email });
  if (!user) return null;

  return (user.id as string) || String(user._id || '');
}

/* =========================
   GET FULL WATCHLIST
   ========================= */
export async function getUserWatchlistByEmail(email: string) {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) return [];

    const items = await Watchlist.find({ userId })
      .sort({ addedAt: -1 })
      .lean();

    return items;
  } catch (err) {
    console.error('getUserWatchlistByEmail error:', err);
    return [];
  }
}

/* =========================
   ADD TO WATCHLIST
   ========================= */
export async function addToWatchlistByEmail(
  email: string,
  symbol: string,
  company: string
) {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) throw new Error('User not found');

    await Watchlist.create({
      userId,
      symbol: symbol.toUpperCase(),
      company,
    });

    return { success: true };
  } catch (err: any) {
    if (err.code === 11000) {
      return { success: false, message: 'Already in watchlist' };
    }
    return { success: false, message: 'Failed to add' };
  }
}

/* =========================
   REMOVE FROM WATCHLIST
   ========================= */
export async function removeFromWatchlistByEmail(
  email: string,
  symbol: string
) {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) throw new Error('User not found');

    await Watchlist.deleteOne({
      userId,
      symbol: symbol.toUpperCase(),
    });

    return { success: true };
  } catch (err) {
    console.error('removeFromWatchlistByEmail error:', err);
    return { success: false };
  }
}


export async function toggleWatchlistByEmail(
  email: string,
  symbol: string,
  company: string
) {
  try {
    const userId = await getUserIdByEmail(email);
    if (!userId) throw new Error('User not found');

    const normalizedSymbol = symbol.toUpperCase();

    const existing = await Watchlist.findOne({
      userId,
      symbol: normalizedSymbol,
    });

    if (existing) {
      await Watchlist.deleteOne({ _id: existing._id });
      return { added: false };
    } else {
      await Watchlist.create({
        userId,
        symbol: normalizedSymbol,
        company,
      });
      return { added: true };
    }
  } catch (err) {
    console.error('toggleWatchlistByEmail error:', err);
    return { error: true };
  }
}

export async function getAllTrackedSymbols(): Promise<string[]> {
  await connectToDatabase();

  const symbols = await Watchlist.distinct("symbol");
  return symbols;
}