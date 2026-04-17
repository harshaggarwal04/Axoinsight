import Image from "next/image";
import Link from "next/link";
import React from "react";
 
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="auth-layout bg-gray-950 text-gray-200">

      {/* LEFT */}
      <section className="auth-left-section scrollbar-hide-default flex flex-col justify-between bg-gray-950/80 backdrop-blur-md border-r border-gray-800">

        {/* Logo */}
        <Link href='/' className="auth-logo flex items-center gap-2">
          <Image
            src="/assets/icons/logob.png"
            alt="axoinsight"
            width={140}
            height={32}
            className="h-12 w-auto hover:opacity-80 transition"
          />
        </Link>

        {/* Form */}
        <div className="pb-6 lg:pb-8 flex-1 flex items-center">
          <div className="w-full max-w-md mx-auto">
            {children}
          </div>
        </div>

        {/* Subtle footer */}
        <p className="text-xs text-gray-500 text-center pb-4">
          © {new Date().getFullYear()} AxoInsight
        </p>
      </section>

      {/* RIGHT */}
      <section className="auth-right-section relative overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black">

        {/* Glow effect */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-500/20 blur-[120px] rounded-full"></div>

        {/* Testimonial */}
        <div className="z-10 relative lg:mt-6 lg:mb-16 px-6 lg:px-10">
          <blockquote className="auth-blockquote text-lg lg:text-xl leading-relaxed text-gray-300 italic">
            “The insights are clear, fast, and actually useful—I finally feel confident making decisions.”
          </blockquote>

          <div className="flex items-center justify-between mt-6">
            <div>
              <cite className="auth-testimonial-author text-green-400 font-medium">
                — John
              </cite>
              <p className="text-xs text-gray-500">
                Retail Investor
              </p>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((star)=>(
                <Image
                  src="/assets/icons/star.svg"
                  alt="star"
                  key={star}
                  width={20}
                  height={20}
                  className="w-5 h-5 opacity-90"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="flex-1 relative flex items-center justify-center px-4">
          <div className="relative w-full max-w-5xl">

            {/* Glass effect wrapper */}
            <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-2xl bg-gray-900/40 backdrop-blur-md">

              <Image
                src="/assets/images/dashboard(0).png"
                alt="Dashboard preview"
                width={1440}
                height={1150}
                className="auth-dashboard-preview w-full h-auto object-cover opacity-90"
              />

            </div>
          </div>
        </div>

      </section>
      
    </main>
  );
};

export default Layout;