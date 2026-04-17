import React from 'react'
import { Button } from '@/components/ui/button'
import TradingViewWidget from '@/components/TradingViewWidget'
import { HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from '@/lib/constants'
const page = () => {

  const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

  return (
    <div className="flex flex-col xl:flex-row gap-6 min-h-screen bg-gray-950 text-gray-200 p-4 md:p-6 home-wrapper">

      {/* LEFT SECTION */}
      <section className="grid w-full gap-6 md:grid-cols-1 xl:grid-cols-1 home-section">

        <div className="md:col-span-1 xl:col-span-1">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md shadow-lg hover:shadow-green-500/10 transition-all duration-300 p-3">
            <TradingViewWidget
              title='Market Overview'
              scriptUrl={`${scriptUrl}market-overview.js`}
              config={MARKET_OVERVIEW_WIDGET_CONFIG}
              className='custom-chart'
              height={600}
            />
          </div>
        </div>

        <div className="md:col-span-1 xl:col-span-2">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md shadow-lg hover:shadow-green-500/10 transition-all duration-300 p-3">
            <TradingViewWidget
              title='Stock Heatmap'
              scriptUrl={`${scriptUrl}stock-heatmap.js`}
              config={HEATMAP_WIDGET_CONFIG}
              className='custom-chart'
              height={600}
            />
          </div>
        </div>

      </section>

      {/* RIGHT SECTION */}
      <section className="grid w-full gap-6 md:grid-cols-1 xl:grid-cols-1 home-section">

        <div className="h-full md:col-span-1 xl:col-span-1">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md shadow-lg hover:shadow-green-500/10 transition-all duration-300 p-3 h-full">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}timeline.js`}
              config={TOP_STORIES_WIDGET_CONFIG}
              height={600}
            />
          </div>
        </div>

        <div className="h-full md:col-span-1 xl:col-span-2">
          <div className="rounded-2xl border border-gray-800 bg-gray-900/60 backdrop-blur-md shadow-lg hover:shadow-green-500/10 transition-all duration-300 p-3 h-full">
            <TradingViewWidget
              scriptUrl={`${scriptUrl}market-quotes.js`}
              config={MARKET_DATA_WIDGET_CONFIG}
              height={600}
            />
          </div>
        </div>

      </section>

    </div>
  )
}

export default page