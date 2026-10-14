"use client";

import dynamic from "next/dynamic";
import React from "react";
import { InteractiveMapProps } from "./interactive-map";
import { MapLoadingSkeleton } from "./map-loading-skeleton";

const DynamicLeafletMap = dynamic(
  () => import("./interactive-map").then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => <MapLoadingSkeleton />,
  }
);

export function InteractiveMapWrapper(props: InteractiveMapProps) {
  return <DynamicLeafletMap {...props} />;
}
