import { cron } from "inngest";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompt";
import { getAllUsersForNewsEmail } from "../actions/user.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { getNews } from "../actions/finnhub.actions";
import { getFormattedTodayDate } from "../utils";
import { getAllTrackedSymbols } from "../actions/watchlist.actions";
import { getStockPrice } from "../actions/finnhub.actions";
import { Price } from "@/database/models/price.model";
import { connectToDatabase } from "@/database/mongoose";

export const sendSignUpEmail = inngest.createFunction(
  {
    id: "sign-up-email",
    triggers: {
      event: "app/user.created",
    },
  },
  async ({ event, step }) => {
    const userProfile = `
      - Country: ${event.data.country}
      - Investment goals: ${event.data.investmentGoals}
      - Risk tolerance: ${event.data.riskTolerance}
      - Preferred industry: ${event.data.preferredIndustry}
    `;

    const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace(
      "{{userProfile}}",
      userProfile
    );

    const response = await step.ai.infer("generate-welcome-intro", {
      model: step.ai.models.gemini({ model: "gemini-2.5-flash-lite" }),
      body: {
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      },
    });

    await step.run("send-welcome-email", async () => {
      const part = response?.candidates?.[0]?.content?.parts?.[0];

      const introText =
        (part && "text" in part ? part.text : null) ||
        "Thanks for joining Axoinsight.";
      const { data: { email, name } } = event;
      return await sendWelcomeEmail({
        email, name, intro: introText
      })


    });

    return {
      success: true,
      message: "welcome email generated successfully",
    };
  }
);

export const sendDailyNewsSummary = inngest.createFunction(
  {
    id: "daily-news-summary",
    triggers: [{ event: "app/send.daily.news" }, { cron: '0 12 * * *' }],
  },

  async ({ step }) => {
    // Step#1 get all users for news delivery
    const users = await step.run('get-all-users', getAllUsersForNewsEmail)
    if (!users || users.length === 0) return { success: false, message: "No users found for news email" }

    // Step#2 fetch personalised news for each user
    const results = await step.run('fetch-user-news', async () => {
      const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];
      for (const user of users as UserForNewsEmail[]) {
        try {
          const symbols = await getWatchlistSymbolsByEmail(user.email);
          let articles = await getNews(symbols);
          // Enforce max 6 articles per user
          articles = (articles || []).slice(0, 6);
          // If still empty, fallback to general
          if (!articles || articles.length === 0) {
            articles = await getNews();
            articles = (articles || []).slice(0, 6);
          }
          perUser.push({ user, articles });
        } catch (e) {
          console.error('daily-news: error preparing user news', user.email, e);
          perUser.push({ user, articles: [] });
        }
      }
      return perUser;
    });
    // Step#3 Summarize news via ai for each user
    const userNewsSummaries: { user: UserForNewsEmail; newsContent: string | null }[] = [];

    for (const { user, articles } of results) {
      try {
        const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

        const response = await step.ai.infer(`summarize-news-${user.email}`, {
          model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
          body: {
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
          }
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.'

        userNewsSummaries.push({ user, newsContent });
      } catch (e) {
        console.error('Failed to summarize news for : ', user.email);
        userNewsSummaries.push({ user, newsContent: null });
      }
    }
    // send emails
    await step.run('send-news-emails', async () => {
      await Promise.all(
        userNewsSummaries.map(async ({ user, newsContent }) => {
          if (!newsContent) return false;

          return await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent })
        })
      )
    })

    return { success: true, message: 'Daily news summary emails sent successfully' }


  }

)

export const updateStockPrices = inngest.createFunction(
  {
    id: "update-stock-prices",
    triggers: [{ cron: "*/1 * * * *" }], // every 1 minute
  },
  async ({ step }) => {
    // 1️⃣ Connect DB
    await step.run("connect-db", connectToDatabase);

    // 2️⃣ Get all watchlist symbols
    const symbols = await step.run("get-symbols", getAllTrackedSymbols);

    if (!symbols || symbols.length === 0) {
      return { success: false, message: "No symbols to update" };
    }

    // 3️⃣ Avoid API rate limits
    const limitedSymbols = symbols.slice(0, 30);

    // 4️⃣ Fetch + store prices
    await step.run("update-prices", async () => {
      for (const rawSymbol of limitedSymbols) {
        const symbol = rawSymbol.toUpperCase().trim();

        try {
          // ✅ your function already returns { price, change }
          const data = await getStockPrice(symbol);

          const price = data.price ?? 0;
          const change = data.change ?? 0;

          await Price.updateOne(
            { symbol },
            {
              symbol,
              price,
              change,
              updatedAt: new Date(),
            },
            { upsert: true }
          );

          console.log("symbol:", symbol);
          console.log("finnhub data:", data);
        } catch (err) {
          console.error("Price update failed for:", symbol, err);
        }
      }
    });

    return {
      success: true,
      updated: limitedSymbols.length,
    };
  }
);