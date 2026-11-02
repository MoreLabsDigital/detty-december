
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePlans } from "./PlanProvider";
import { ArrowUpRight, Menu, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

const LINKS = [
  { href: "/#board", label: "THE BOARD" },
  { href: "/play", label: "PLAY" },
  { href: "/explore", label: "EXPLORE" },
  { href: "/plans", label: "MY PLANS" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/#board") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const { plans, ready } = usePlans();
  const count = ready ? plans.itinerary.length : 0;
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [glider, setGlider] = useState<{
    x: number;
    w: number;
  } | null>(null);
  const [lit, setLit] = useState<string | null>(null);

  const navRef = useRef<HTMLElement>(null);

  // Hide mobile header when scrolling down.
  // Show it again when scrolling up.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;

      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;

        setScrolled(y > 24);

        if (Math.abs(y - last) > 6) {
          setHidden(y > last && y > 160);
          last = y;
        }

        ticking = false;
      });
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu when navigating.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scrolling when mobile menu is open.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Animated yellow navigation highlight.
  const place = useCallback(
    (href: string, el: HTMLElement) => {
      setGlider({
        x: el.offsetLeft,
        w: el.offsetWidth,
      });

      setLit(href);
    },
    []
  );

  const rest = useCallback(() => {
    const el =
      navRef.current?.querySelector<HTMLElement>(
        '[aria-current="page"]'
      );

    if (el) {
      setGlider({
        x: el.offsetLeft,
        w: el.offsetWidth,
      });

      setLit(el.dataset.href ?? null);
    } else {
      setGlider(null);
      setLit(null);
    }
  }, []);

  useEffect(() => {
    rest();
    void document.fonts?.ready.then(rest);
  }, [pathname, count, rest]);

  return (
    <>
      <header
        className="dd-header"
        data-hidden={hidden && !open}
        data-scrolled={scrolled}
      >
        <div className="dd-bar">

          {/* DECEMBER SILK LOGO */}
          <Link
            href="/"
            className="dd-brand"
            aria-label="December Silk, home"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/logo.png"
              alt="December Silk Logo"
              width={180}
              height={60}
              priority
              className="dd-brand-logo"
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            ref={navRef}
            className="dd-nav"
            aria-label="Main navigation"
            onMouseLeave={rest}
            onBlur={(e) => {
              if (
                !navRef.current?.contains(
                  e.relatedTarget as Node
                )
              ) {
                rest();
              }
            }}
          >
            <span
              className="dd-glider"
              aria-hidden="true"
              style={
                glider
                  ? {
                      transform: `translate(${glider.x}px, -50%)`,
                      width: glider.w,
                      opacity: 1,
                    }
                  : undefined
              }
            />

            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                data-href={l.href}
                data-lit={lit === l.href}
                aria-current={
                  isActive(pathname, l.href)
                    ? "page"
                    : undefined
                }
                onMouseEnter={(e) =>
                  place(l.href, e.currentTarget)
                }
                onFocus={(e) =>
                  place(l.href, e.currentTarget)
                }
              >
                {l.label}

                {l.href === "/plans" && (
                  <>
                    <b
                      className="dd-count"
                      aria-hidden="true"
                    >
                      {count}
                    </b>

                    <span className="dd-sr">
                      , {count} saved
                    </span>
                  </>
                )}
              </Link>
            ))}
          </nav>

          {/* DESKTOP CTA */}
          <Link
            className="dd-cta"
            href="/explore"
          >
            FIND YOUR VIBE

            <ArrowUpRight
              size={17}
              strokeWidth={2.6}
              aria-hidden="true"
            />
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            className="dd-burger"
            data-open={open}
            onClick={() => setOpen((v) => !v)}
            aria-label={
              open ? "Close menu" : "Open menu"
            }
            aria-expanded={open}
            aria-controls="dd-sheet"
          >
            {open ? (
              <X
                size={22}
                strokeWidth={2.6}
              />
            ) : (
              <Menu
                size={22}
                strokeWidth={2.6}
              />
            )}
          </button>
        </div>
      </header>

      {/* MOBILE NAVIGATION */}
      <div
        id="dd-sheet"
        className="dd-sheet"
        data-open={open}
      >
        <nav aria-label="Main navigation, mobile">
          {LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              style={
                { "--i": i } as CSSProperties
              }
              aria-current={
                isActive(pathname, l.href)
                  ? "page"
                  : undefined
              }
              onClick={() => setOpen(false)}
            >
              <span>{l.label}</span>

              {l.href === "/plans" && (
                <b className="dd-count">
                  {count}
                </b>
              )}
            </Link>
          ))}
        </nav>

        <Link
          className="dd-sheet-cta"
          href="/explore"
          onClick={() => setOpen(false)}
        >
          FIND YOUR VIBE

          <ArrowUpRight
            size={22}
            strokeWidth={2.6}
            aria-hidden="true"
          />
        </Link>
      </div>
    </>
  );
}

// FOOTER
export function Footer() {
  return (
    <footer className="footer">
      <h2>
        MAKE DECEMBER
        <br />
        <em>A STORY</em> WORTH
        <br />
        TELLING.
      </h2>

      <p>
        Find your people. Make your plans.
        Live your December.
      </p>

      <div className="footer-actions">
        <Link
          href="/explore"
          className="button light"
        >
          EXPLORE EVENTS
        </Link>

        <Link
          href="/plans"
          className="button outline-light"
        >
          BUILD MY ITINERARY
        </Link>
      </div>

      <div className="footer-bottom">
        <span>
          © 2026 DECEMBER SILK
        </span>

        <div>
          <Link href="/explore">
            EXPLORE
          </Link>

          <Link href="/plans">
            MY PLANS
          </Link>

          <a href="mailto:hello@example.com">
            CONTACT (PLACEHOLDER)
          </a>
        </div>
      </div>
    </footer>
  );
}
