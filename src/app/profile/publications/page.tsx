"use client";

import React from "react";
import { ProfileNav } from "@/components/profile/profile-nav";
import { PublicationWorkspace } from "@/components/modules/publications/publication-workspace";

export default function RealtorPublicationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <ProfileNav />
      <PublicationWorkspace forcedRole="realtor" />
    </div>
  );
}
