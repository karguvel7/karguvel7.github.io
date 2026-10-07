import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell section-pad">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <Link href="/" className="pill mt-6 inline-flex">Back home</Link>
    </div>
  );
}
