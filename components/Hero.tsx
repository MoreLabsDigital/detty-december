"use client";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-overline", { opacity: 0, y: 25, duration: 0.4 })
        .from(
          ".hero-headline .line",
          { y: 100, opacity: 0, stagger: 0.12, duration: 0.75 },
          "-=.15",
        )
        .from(".hero-sub", { y: 25, opacity: 0, duration: 0.5 }, "-=.35")
        .from(".hero-actions", { y: 20, opacity: 0, duration: 0.5 }, "-=.25")
        .from(
          ".hero-art",
          { scale: 0.8, rotation: -12, opacity: 0, duration: 0.9 },
          "-=.8",
        );
    },
    { scope: ref },
  );
  return (
    <section className="hero" ref={ref}>
      <div className="hero-noise" />
      <div className="hero-content">
        <div className="hero-overline">
          LAGOS, NIGERIA THE DECEMBER EDITION 2026
        </div>
        <p className="hero-eyebrow">YOUR DECEMBER, YOUR RULES.</p>
        <h1 className="hero-headline">
          <span className="line">DECEMBER</span>
          <span className="line second">IS A WHOLE</span>
          <span className="line outlined">
            ADVENTURE<span className="period">.</span>
          </span>
        </h1>
        <p className="hero-sub">
          31 days. Endless plans. Find your kind of Detty.
          <br />
          The city is the playground. You make the rules.
        </p>
        <div className="hero-actions">
          <Link href="/#board" className="button yellow">
            EXPLORE DECEMBER <ArrowDownRight size={20} />
          </Link>
          <Link href="/plans" className="text-link">
            BUILD MY ITINERARY <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <svg viewBox="0 0 500 500" role="presentation">
          <path
            d="M70 15 C 490 15 90 170 420 195 S 105 360 415 475"
            stroke="#F36DBB"
            strokeWidth="62"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M70 15 C 490 15 90 170 420 195 S 105 360 415 475"
            stroke="#101010"
            strokeWidth="4"
            strokeDasharray="13 20"
            fill="none"
          />
          <g fill="#FFD84D" stroke="#101010" strokeWidth="4">
            <rect
              x="53"
              y="17"
              width="95"
              height="95"
              rx="19"
              transform="rotate(-13 53 17)"
            />
            <rect
              x="280"
              y="145"
              width="100"
              height="100"
              rx="19"
              transform="rotate(12 280 145)"
            />
            <rect
              x="162"
              y="315"
              width="105"
              height="105"
              rx="19"
              transform="rotate(-8 162 315)"
            />
          </g>
          <g fontSize="52" fontWeight="1000" fill="#101010">
            <text x="72" y="86">
              01
            </text>
            <text x="295" y="213">
              12
            </text>
            <text x="180" y="385">
              31
            </text>
          </g>
          <g fill="#11B8C4" stroke="#101010" strokeWidth="3">
            <circle cx="400" cy="50" r="33" />
            <circle cx="65" cy="275" r="28" />
          </g>
          <text x="375" y="70" fontSize="50">
            ✳
          </text>
          <text x="43" y="295" fontSize="46">
            ✦
          </text>
        </svg>
        <div className="art-badge">
          31 DAYS
          <br />
          OF POSSIBILITY 
        </div>
      </div>
      <div className="hero-bottom">
        <span>AN INTERACTIVE GUIDE TO DECEMBER</span>
        <span>SCROLL TO DISCOVER </span>
      </div>
    </section>
  );
}
