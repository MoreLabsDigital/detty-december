"use client";
import Link from "next/link";
import { usePlans } from "./PlanProvider";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";
export function Header() {
  const { plans, ready } = usePlans();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Detty December home">
        DETTY DECEMBER
      </Link>
      <nav className={open ? "nav open" : "nav"} aria-label="Main navigation">
        <Link onClick={() => setOpen(false)} href="/#board">
          THE BOARD
        </Link>
        <Link onClick={() => setOpen(false)} href="/explore">
          EXPLORE
        </Link>
        <Link onClick={() => setOpen(false)} href="/plans">
          MY PLANS <b>{ready ? plans.itinerary.length : 0}</b>
        </Link>
      </nav>
      <Link className="header-cta" href="/explore">
        FIND YOUR VIBE <ArrowUpRight size={17} />
      </Link>
      <button
        className="mobile-menu"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      {/* <div className="footer-star">✳</div> */}
      <h2>
        MAKE DECEMBER
        <br />
        <em>A STORY</em> WORTH
        <br />
        TELLING.
      </h2>
      <p>Find your people. Make your plans. Live your December.</p>
      <div className="footer-actions">
        <Link href="/explore" className="button light">
          EXPLORE EVENTS 
        </Link>
        <Link href="/plans" className="button outline-light">
          BUILD MY ITINERARY 
        </Link>
      </div>
      <div className="footer-bottom">
        <span>© 2026 DETTY DECEMBER / DEMONSTRATION</span>
        <div>
          <Link href="/explore">EXPLORE</Link>
          <Link href="/plans">MY PLANS</Link>
          <a href="mailto:hello@example.com">CONTACT (PLACEHOLDER)</a>
        </div>
      </div>
    </footer>
  );
}
