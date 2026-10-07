import Image from "next/image";

const BRAND: Record<string, string> = {
  angular: "/logos/angular.svg",
  react: "/logos/react.svg",
  "three-js": "/logos/threedotjs.svg",
  "node-js": "/logos/nodedotjs.svg",
  python: "/logos/python.svg",
  mongodb: "/logos/mongodb.svg",
  neo4j: "/logos/neo4j.svg",
  mysql: "/logos/mysql.svg",
  clickhouse: "/logos/clickhouse.svg",
  aws: "/logos/aws.svg",
  azure: "/logos/azure.svg",
  android: "/logos/android.svg",
  github: "/logos/github.svg",
  openapi: "/logos/openapi.svg",
  docker: "/logos/docker.svg",
  typescript: "/logos/typescript.svg",
};

const CONCEPT: Record<string, string> = {
  "micro-frontends": "layers",
  "mean-stack": "stack",
  "rest-apis": "api",
  "oauth-2-0": "lock",
  microservices: "grid",
  llms: "spark",
  "ai-workflows": "flow",
  "multi-agent-systems": "nodes",
  agile: "cycle",
  "leading-development-teams": "people",
  "xamarin-forms": "mobile",
  cordova: "mobile",
};

export function isBrand(slug: string): boolean {
  return slug in BRAND;
}

export function TechLogo({ slug, name }: { slug: string; name: string }) {
  const src = BRAND[slug];
  if (src) {
    return (
      <Image
        src={src}
        alt={`${name} logo`}
        width={150}
        height={150}
        className="h-[150px] w-[150px] object-contain drop-shadow-[0_0_24px_rgba(13,13,13,0.08)]"
      />
    );
  }
  const concept = CONCEPT[slug] ?? "dot";
  return (
    <div
      className="grid h-[150px] w-[150px] place-items-center rounded-2xl border border-line bg-soft text-mute"
      aria-hidden
    >
      <ConceptIcon kind={concept} />
    </div>
  );
}

function ConceptIcon({ kind }: { kind: string }) {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-hidden>
      <rect x="8" y="8" width="48" height="48" rx="12" stroke="currentColor" />
      <text x="32" y="38" textAnchor="middle" fontSize="10" fill="currentColor">
        {kind.slice(0, 4)}
      </text>
    </svg>
  );
}
