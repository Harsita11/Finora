"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// Sample entries for the signature "ledger strip" — a quiet, ambient
// animation of transaction rows ticking by, in the same mono figures
// used for real balances throughout the app.
const LEDGER_SAMPLE = [
  { label: "Salary deposit", amount: 82000, type: "INCOME" },
  { label: "Rent", amount: -18500, type: "EXPENSE" },
  { label: "Freelance payout", amount: 14200, type: "INCOME" },
  { label: "Groceries", amount: -2340, type: "EXPENSE" },
  { label: "SIP investment", amount: -5000, type: "EXPENSE" },
  { label: "Electricity bill", amount: -1120, type: "EXPENSE" },
  { label: "Refund", amount: 899, type: "INCOME" },
  { label: "Dining out", amount: -760, type: "EXPENSE" },
];

function LedgerRow({ label, amount, type }) {
  const isIncome = type === "INCOME";
  return (
    <div className="flex items-center gap-3 px-5 py-3 mx-2 rounded-xl border bg-card/60 backdrop-blur-sm shrink-0">
      <div
        className={`flex h-7 w-7 items-center justify-center rounded-full ${
          isIncome
            ? "bg-emerald-500/15 text-emerald-500"
            : "bg-rose-500/15 text-rose-500"
        }`}
      >
        {isIncome ? (
          <ArrowUpRight className="h-4 w-4" />
        ) : (
          <ArrowDownRight className="h-4 w-4" />
        )}
      </div>
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      <span
        className={`amount-mono text-sm font-medium whitespace-nowrap ${
          isIncome ? "text-emerald-500" : "text-rose-500"
        }`}
      >
        {isIncome ? "+" : "-"}₹{Math.abs(amount).toLocaleString("en-IN")}
      </span>
    </div>
  );
}

function LedgerStrip() {
  // Duplicate the list so the CSS animation can loop seamlessly at -50%
  const doubled = [...LEDGER_SAMPLE, ...LEDGER_SAMPLE];
  return (
    <div className="mt-14 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="ledger-strip-track">
        {doubled.map((entry, i) => (
          <LedgerRow key={i} {...entry} />
        ))}
      </div>
    </div>
  );
}

// Same source image rendered as two layers moving at different scroll
// speeds — the classic single-image parallax trick. The blurred/zoomed
// "back" layer drifts more (reads as distant stars); the sharp "front"
// layer drifts less (reads as the closer, more solid subject).
function useParallax() {
  const backRef = useRef(null);
  const frontRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    let raf = null;

    const update = () => {
      const y = window.scrollY;
      if (backRef.current) {
        backRef.current.style.transform = `translate3d(0, ${y * 0.4}px, 0) scale(1.15)`;
      }
      if (frontRef.current) {
        frontRef.current.style.transform = `translate3d(0, ${y * 0.15}px, 0)`;
      }
      raf = null;
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { backRef, frontRef };
}

const HeroSection = () => {
  const { backRef, frontRef } = useParallax();

  return (
    <section className="relative pt-40 pb-20 px-4 overflow-hidden">
      {/* Ambient background art — two layers of the same image for a
          simulated depth/parallax effect on scroll */}
      <div className="pointer-events-none absolute inset-0">
        <div
          ref={backRef}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/hero-cosmic.png"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-50 dark:opacity-55 blur-md scale-110"
          />
        </div>
        <div
          ref={frontRef}
          className="absolute inset-0 will-change-transform"
        >
          <Image
            src="/hero-cosmic.png"
            alt=""
            fill
            priority
            className="object-cover object-center opacity-85 dark:opacity-90"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/15 to-background/90" />
      </div>

      <div className="relative container mx-auto text-center">
        <p className="uppercase tracking-[0.2em] text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-4">
          Every rupee, accounted for
        </p>
        <h1 className="text-5xl md:text-7xl lg:text-[84px] leading-[1.05] pb-6 gradient-title">
          Your finances, <br /> kept like a ledger.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Finora tracks income and expenses across accounts and currencies,
          scans receipts with AI, and nudges you before bills are due —
          so nothing slips through.
        </p>
        <div className="flex justify-center space-x-4">
          <Link href="/dashboard">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>

        </div>

        <LedgerStrip />
      </div>
    </section>
  );
};

export default HeroSection;