import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-5 py-24 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">404</p>
      <h1 className="mt-4 text-4xl font-medium tracking-[-0.03em] text-ink">
        Nothing is published at this address.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The portfolio is a single page. The work, stack, and contact details are on the home page.
      </p>
      <Link
        href="/"
        className="mt-8 w-fit border-b border-ink pb-0.5 text-sm text-ink hover:text-muted"
      >
        Back to the portfolio
      </Link>
    </main>
  );
}
