"use client";

import React from "react";
import { PublicationWorkspace } from "@/components/modules/publications/publication-workspace";

export default function DeveloperPublicationsPage() {
  return (
    <div className="space-y-6">
      <PublicationWorkspace forcedRole="developer" />
    </div>
  );
}
