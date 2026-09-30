"use client";

import { roles } from "@/lib/content";

export function RoleRibbon() {
  return (
    <ul className="rise rise-delay-1 mt-6 flex flex-wrap gap-2">
      {roles.map((role, index) => (
        <li key={role}>
          <span
            className="role-chip"
            style={{ animationDelay: `${120 + index * 70}ms` }}
          >
            {role}
          </span>
        </li>
      ))}
    </ul>
  );
}
