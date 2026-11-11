import React from "react";
import { cn } from "@/lib/utils";
import { Check, type LucideProps } from "lucide-react";
import { AllowedIconKey, sanitizeIconKey } from "@/lib/classifieds/attributes";

type SvgIconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

// ============================================================================
// 1. BESPOKE VECTOR ICONS — EXACT MATCH TO USER REFERENCE DESIGN
// ============================================================================

/** 1. Интернет (Wi-Fi: 3 concentric rounded arcs + filled dot at bottom) */
export function WifiIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 8a13 13 0 0 1 16 0" />
      <path d="M7 11.8a8.5 8.5 0 0 1 10 0" />
      <path d="M9.5 15.5a4 4 0 0 1 5 0" />
      <circle cx="12" cy="19.5" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 2. Отопление (Radiator: 4 pill tubes with top/bottom connector pipes & valve) */
export function HeatingIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="6" y="5" width="2.6" height="14" rx="1.3" />
      <rect x="9.7" y="5" width="2.6" height="14" rx="1.3" />
      <rect x="13.4" y="5" width="2.6" height="14" rx="1.3" />
      <rect x="17.1" y="5" width="2.6" height="14" rx="1.3" />
      <path d="M3.5 7.5h15" />
      <path d="M3.5 6v3" />
      <path d="M3.5 16.5h15" />
    </svg>
  );
}

/** 3. Стиральная машина (Front-load washer with top control strip & porthole rim) */
export function WashingMachineIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3.5" y="2.5" width="17" height="19" rx="3.5" />
      <line x1="3.5" y1="7.2" x2="20.5" y2="7.2" />
      <line x1="6.5" y1="4.8" x2="9" y2="4.8" />
      <circle cx="15.2" cy="4.8" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="17.8" cy="4.8" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="4.5" />
      <path d="M12 11.5a2.5 2.5 0 0 1 2.5 2.5" />
    </svg>
  );
}

/** 4. Холодильник (Upright double-door refrigerator with left vertical handles) */
export function RefrigeratorIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="5.5" y="2" width="13" height="20" rx="2.5" />
      <line x1="5.5" y1="9" x2="18.5" y2="9" />
      <line x1="8" y1="4.5" x2="8" y2="6.8" />
      <line x1="8" y1="11.5" x2="8" y2="15.5" />
    </svg>
  );
}

/** 5. Холодильные камеры (6-branch symmetrical snowflake / cold storage) */
export function ColdStorageIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="2.5" x2="12" y2="21.5" />
      <line x1="3.8" y1="7.25" x2="20.2" y2="16.75" />
      <line x1="3.8" y1="16.75" x2="20.2" y2="7.25" />
      <path d="m9.2 5.5 2.8-2.5 2.8 2.5" />
      <path d="m9.2 18.5 2.8 2.5 2.8-2.5" />
      <path d="m16.8 5 2.6 2.8-3.4 1.2" />
      <path d="m19.4 16.2-2.6 2.8-1-3.6" />
      <path d="m7.2 19-2.6-2.8 3.4-1.2" />
      <path d="m4.6 7.8 2.6-2.8 1 3.6" />
    </svg>
  );
}

/** 6. Кондиционер (Horizontal wall split unit with 3 wavy airflow lines below) */
export function AirConditionerIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="8" rx="3" />
      <line x1="6" y1="9" x2="18" y2="9" />
      <path d="M7 14.5c0 1.2 1 1.6 1 2.8s-1 1.6-1 2.7" />
      <path d="M12 14.5c0 1.2 1 1.6 1 2.8s-1 1.6-1 2.7" />
      <path d="M17 14.5c0 1.2 1 1.6 1 2.8s-1 1.6-1 2.7" />
    </svg>
  );
}

/** 7. Мебель (Cozy sofa / armchair with plump rounded armrests & cushions) */
export function SofaIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 12V8a3.5 3.5 0 0 1 3.5-3.5h5A3.5 3.5 0 0 1 18 8v4" />
      <rect x="3" y="10" width="3" height="7" rx="1.5" />
      <rect x="18" y="10" width="3" height="7" rx="1.5" />
      <rect x="6" y="12" width="12" height="4.5" rx="1.5" />
      <line x1="12" y1="12" x2="12" y2="16.5" />
      <line x1="5.5" y1="17.5" x2="4.5" y2="19.5" />
      <line x1="18.5" y1="17.5" x2="19.5" y2="19.5" />
    </svg>
  );
}

/** 8. Лифт (Elevator door frame with center split + up and down arrows on right) */
export function ElevatorIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3.5" y="3" width="12.5" height="18" rx="2.5" />
      <line x1="9.75" y1="3" x2="9.75" y2="21" />
      <polygon points="19,7 16.5,4 14,7" fill="currentColor" stroke="none" />
      <polygon points="19,17 16.5,20 14,17" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 9. Парковка общая (Rounded square with bold letter P inside) */
export function ParkingIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <path d="M9 17V7h4.2a3 3 0 0 1 0 6H9" />
    </svg>
  );
}

/** 9a. Открытая парковка (Open parking: car in open parking stall with bay markings) */
export function ParkingOpenIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Open ground line */}
      <line x1="2" y1="20" x2="22" y2="20" />
      {/* Stall boundary markings */}
      <line x1="3" y1="11" x2="3" y2="20" />
      <line x1="21" y1="11" x2="21" y2="20" />
      {/* Car silhouette front profile */}
      <path d="M7.5 11l1.5-4h6l1.5 4" />
      <rect x="5.5" y="11" width="13" height="6" rx="2" />
      <circle cx="8" cy="14" r="0.8" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14" r="0.8" fill="currentColor" stroke="none" />
      <line x1="10.5" y1="14.5" x2="13.5" y2="14.5" />
      <rect x="6.5" y="17" width="2" height="3" rx="0.5" />
      <rect x="15.5" y="17" width="2" height="3" rx="0.5" />
    </svg>
  );
}

/** 9b. Крытая парковка (Covered parking: protective carport canopy roof over P bay) */
export function ParkingCoveredIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Protective carport canopy roof */}
      <path d="M2 8.5 12 3.5l10 5" />
      <line x1="4" y1="9.5" x2="20" y2="9.5" />
      {/* Canopy support columns */}
      <line x1="4.5" y1="9.5" x2="4.5" y2="20.5" />
      <line x1="19.5" y1="9.5" x2="19.5" y2="20.5" />
      {/* Ground level */}
      <line x1="2" y1="20.5" x2="22" y2="20.5" />
      {/* Bold letter P sheltered under roof */}
      <path d="M10 17.5v-6h3.8a2 2 0 0 1 0 4H10" />
    </svg>
  );
}

/** 9c. Подземная парковка (Underground parking: ground slab on top, subterranean room with P & down arrow) */
export function ParkingUndergroundIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Ground surface slab on top */}
      <line x1="2" y1="4" x2="22" y2="4" />
      {/* Subterranean chamber walls and foundation floor */}
      <path d="M4 4v16a1.5 1.5 0 0 0 1.5 1.5h13a1.5 1.5 0 0 0 1.5-1.5V4" />
      {/* Bold letter P */}
      <path d="M8 16.5v-7h3.8a2.2 2.2 0 0 1 0 4.4H8" />
      {/* Subterranean level down arrow */}
      <path d="M16 8.5v7.5m-2.2-2.2 2.2 2.2 2.2-2.2" />
    </svg>
  );
}

/** 10. Балкон (Foreground railing with vertical spindles + double doors behind) */
export function BalconyIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="6.5" y="3.5" width="11" height="9" rx="1.5" />
      <line x1="12" y1="3.5" x2="12" y2="12.5" />
      <line x1="3" y1="12.5" x2="21" y2="12.5" />
      <line x1="3" y1="20.5" x2="21" y2="20.5" />
      <line x1="4.5" y1="12.5" x2="4.5" y2="20.5" />
      <line x1="8.2" y1="12.5" x2="8.2" y2="20.5" />
      <line x1="12" y1="12.5" x2="12" y2="20.5" />
      <line x1="15.8" y1="12.5" x2="15.8" y2="20.5" />
      <line x1="19.5" y1="12.5" x2="19.5" y2="20.5" />
    </svg>
  );
}

/** 11. Санузел (Bathtub with feet + showerhead pipe spraying water droplets) */
export function BathroomIcon(props: SvgIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2.5 13.5h17" />
      <path d="M3.5 13.5c.5 3.8 2.8 6 7.5 6s7-2.2 7.5-6" />
      <path d="M5.5 19.5v1.5" />
      <path d="M16.5 19.5v1.5" />
      <path d="M18.5 13.5V6a3 3 0 0 0-3-3h-1.5" />
      <path d="M14 2.5 11.5 5l2.5 2.5 2.5-2.5" />
      <line x1="10" y1="8" x2="9" y2="9.5" />
      <line x1="12" y1="9" x2="11" y2="10.8" />
      <line x1="8" y1="9" x2="7" y2="10.8" />
    </svg>
  );
}

// ============================================================================
// 2. ADDITIONAL SYSTEM DOMAIN ICONS IN THE EXACT SAME UNIFIED OUTLINE STYLE
// ============================================================================

export function DishwasherIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="2.5" width="17" height="19" rx="3.5" />
      <line x1="3.5" y1="7.2" x2="20.5" y2="7.2" />
      <circle cx="12" cy="14" r="4" />
      <path d="M9 14h6M12 11v6" />
    </svg>
  );
}

export function StoveIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="2.5" width="17" height="19" rx="3.5" />
      <circle cx="8" cy="7.5" r="2" />
      <circle cx="16" cy="7.5" r="2" />
      <line x1="3.5" y1="12.5" x2="20.5" y2="12.5" />
      <circle cx="7" cy="16.5" r="1.2" />
      <circle cx="12" cy="16.5" r="1.2" />
      <circle cx="17" cy="16.5" r="1.2" />
    </svg>
  );
}

export function PetsIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 14c-2.5 0-4.5 1.8-4.5 3.8 0 1.5 1.5 2.2 4.5 2.2s4.5-.7 4.5-2.2c0-2-2-3.8-4.5-3.8z" />
      <circle cx="7" cy="10" r="1.5" />
      <circle cx="17" cy="10" r="1.5" />
      <circle cx="10" cy="7.5" r="1.5" />
      <circle cx="14" cy="7.5" r="1.5" />
    </svg>
  );
}

export function ChildFriendlyIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="19" r="2" />
      <circle cx="17" cy="19" r="2" />
      <path d="M3 5h3l1.5 8h10a3 3 0 0 0 3-3V7a4 4 0 0 0-4-4h-3" />
    </svg>
  );
}

export function TvIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4.5" width="18" height="12" rx="2.5" />
      <line x1="8" y1="20" x2="16" y2="20" />
      <line x1="12" y1="16.5" x2="12" y2="20" />
    </svg>
  );
}

export function SmartHomeIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 13.5a4.5 4.5 0 0 1 6 0" />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CctvIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 11l14-5 3.5 9.5-14 5z" />
      <circle cx="18.5" cy="9.5" r="2" />
      <path d="M7 16l-4 4M2 20h3" />
    </svg>
  );
}

export function BarrierIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="11" width="4" height="10" rx="1" />
      <path d="M8 13.5h12" />
      <line x1="11" y1="11.5" x2="10" y2="15.5" />
      <line x1="15" y1="11.5" x2="14" y2="15.5" />
      <line x1="19" y1="11.5" x2="18" y2="15.5" />
    </svg>
  );
}

export function SecurityIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3s8 3 8 9c0 5.5-5 8.5-8 9.5-3-1-8-4-8-9.5 0-6 8-9 8-9z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function ConciergeBellIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 18h16M12 4v3M6 18a6 6 0 0 1 12 0" />
      <circle cx="12" cy="4" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WasteChuteIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M9 7h6M8 12h8M9 12v5h6v-5" />
    </svg>
  );
}

export function CeilingHeightIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="3" x2="20" y2="3" />
      <line x1="4" y1="21" x2="20" y2="21" />
      <line x1="12" y1="6" x2="12" y2="18" />
      <path d="m9 8 3-3 3 3M9 16l3 3 3-3" />
    </svg>
  );
}

export function BuildingMaterialIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="5" rx="1" />
      <rect x="3" y="10" width="8" height="5" rx="1" />
      <rect x="13" y="10" width="8" height="5" rx="1" />
      <rect x="3" y="16" width="18" height="5" rx="1" />
    </svg>
  );
}

export function ConstructionCraneIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 21V4l16-1v3L11 8v13M4 14h7M2 21h8M17 6v6" />
    </svg>
  );
}

export function StairsIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 19h4v-4h4v-4h4V7h4" />
    </svg>
  );
}

export function BuildingFloorsIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <line x1="8" y1="7" x2="10" y2="7" />
      <line x1="14" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="10" y2="11" />
      <line x1="14" y1="11" x2="16" y2="11" />
      <line x1="8" y1="15" x2="10" y2="15" />
      <line x1="14" y1="15" x2="16" y2="15" />
    </svg>
  );
}

export function ApartmentDoorsIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function PaintRollerIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="3" width="14" height="6" rx="2" />
      <path d="M18 6h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-7v4a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2v-4" />
    </svg>
  );
}

export function FloorPlanIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M3 13h7v8M10 8h11M16 8v5" />
    </svg>
  );
}

export function BusinessCenterIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="17" rx="2" />
      <path d="M8 8h2M14 8h2M8 12h2M14 12h2M10 21v-4h4v4" />
    </svg>
  );
}

export function BuildingClassIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="9" r="6" />
      <path d="m9 14-2 7 5-3 5 3-2-7" />
      <path d="m10.5 9 1-2.5 1 2.5 2.5.5-2 1.5.5 2.5-2-1.5-2 1.5.5-2.5-2-1.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SprinklerIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 3h6v4H9zM12 7v5M8 12h8" />
      <path d="m7 17-2 3M10 18l-1 3M14 18l1 3M17 17l2 3" />
    </svg>
  );
}

export function FireAlarmIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  );
}

export function VentilationIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 9.5c0-3 2-4 3.5-4s1.5 2.5 0 4M14.5 12c3 0 4 2 4 3.5s-2.5 1.5-4 0M12 14.5c0 3-2 4-3.5 4s-1.5-2.5 0-4M9.5 12c-3 0-4-2-4-3.5s2.5-1.5 4 0" />
    </svg>
  );
}

export function PlugIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="6" y="8" width="12" height="7" rx="2" />
      <line x1="9" y1="4" x2="9" y2="8" />
      <line x1="15" y1="4" x2="15" y2="8" />
      <path d="M12 15v5" />
    </svg>
  );
}

export function WaterTapIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 14h5v-3a4 4 0 0 1 8 0v3h3" />
      <path d="M12 3v3M10 3h4" />
      <path d="M17 18a1.5 1.5 0 0 1-3 0c0-1 1.5-2.5 1.5-2.5S17 17 17 18z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function WaterDropIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3c-4.5 6-7 9.5-7 13a7 7 0 0 0 14 0c0-3.5-2.5-7-7-13z" />
    </svg>
  );
}

export function CoffeeIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 8h13v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8z" />
      <path d="M17 10h2a2 2 0 0 1 0 4h-2M3 20h17" />
      <path d="M7 3c0 1.5 1 2 1 3M11 3c0 1.5 1 2 1 3" />
    </svg>
  );
}

export function CutleryIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 3v7a3 3 0 0 0 3 3v8M6 3v5M9 3v5M17 3v18M17 3a4 4 0 0 1 4 4v5h-4" />
    </svg>
  );
}

export function ServingDishIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 18h18M5 18a7 7 0 0 1 14 0M12 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
    </svg>
  );
}

export function RoundMirrorIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="10" r="6" />
      <path d="M12 16v5M8 21h8M17 4l1 1-1 1M6 6l1 1-1 1" />
    </svg>
  );
}

export function PharmacyIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <path d="M12 7.5v9M7.5 12h9" />
    </svg>
  );
}

export function DumbbellIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 9v6M6 7v10M6 12h12M18 7v10M21 9v6" />
    </svg>
  );
}

export function BankIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m3 9 9-5 9 5M4 9v11M20 9v11M2 20h20M8 10v7M12 10v7M16 10v7" />
    </svg>
  );
}

export function PresentationIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <line x1="7" y1="20" x2="9" y2="16" />
      <line x1="17" y1="20" x2="15" y2="16" />
    </svg>
  );
}

export function AtmIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <line x1="7" y1="9" x2="17" y2="9" />
      <rect x="7" y="13" width="4" height="3" rx="0.5" />
      <line x1="14" y1="14.5" x2="17" y2="14.5" />
    </svg>
  );
}

export function InfoIcon(props: SvgIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16" />
      <circle cx="12" cy="8" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ============================================================================
// 3. ICON COMPONENT MAPPING
// ============================================================================

const ICON_COMPONENT_MAP: Record<AllowedIconKey, React.ComponentType<SvgIconProps>> = {
  wifi: WifiIcon,
  heating: HeatingIcon,
  "washing-machine": WashingMachineIcon,
  refrigerator: RefrigeratorIcon,
  "cold-storage": ColdStorageIcon,
  dishwasher: DishwasherIcon,
  stove: StoveIcon,
  "air-conditioner": AirConditionerIcon,
  pets: PetsIcon,
  "child-friendly": ChildFriendlyIcon,
  sofa: SofaIcon,
  tv: TvIcon,
  "smart-home": SmartHomeIcon,
  elevator: ElevatorIcon,
  "waste-chute": WasteChuteIcon,
  "concierge-bell": ConciergeBellIcon,
  barrier: BarrierIcon,
  cctv: CctvIcon,
  "construction-crane": ConstructionCraneIcon,
  "ceiling-height": CeilingHeightIcon,
  "building-material": BuildingMaterialIcon,
  "parking-open": ParkingOpenIcon,
  "parking-covered": ParkingCoveredIcon,
  "parking-underground": ParkingUndergroundIcon,
  parking: ParkingIcon,
  stairs: StairsIcon,
  "building-floors": BuildingFloorsIcon,
  "apartment-doors": ApartmentDoorsIcon,
  balcony: BalconyIcon,
  bathroom: BathroomIcon,
  "paint-roller": PaintRollerIcon,
  "floor-plan": FloorPlanIcon,
  children: ChildFriendlyIcon,
  "business-center": BusinessCenterIcon,
  "building-class": BuildingClassIcon,
  sprinkler: SprinklerIcon,
  "fire-alarm": FireAlarmIcon,
  ventilation: VentilationIcon,
  plug: PlugIcon,
  "water-tap": WaterTapIcon,
  security: SecurityIcon,
  "water-drop": WaterDropIcon,
  coffee: CoffeeIcon,
  cutlery: CutleryIcon,
  "serving-dish": ServingDishIcon,
  "round-mirror": RoundMirrorIcon,
  pharmacy: PharmacyIcon,
  dumbbell: DumbbellIcon,
  bank: BankIcon,
  presentation: PresentationIcon,
  atm: AtmIcon,
  info: InfoIcon,
};

export interface ListingIconProps extends LucideProps {
  iconKey?: string | null;
  fallback?: React.ComponentType<SvgIconProps>;
}

/**
 * Safe, allowlisted listing icon renderer.
 * Renders bespoke vector icons in the unified modern outline style.
 */
export function ListingIcon({
  iconKey,
  fallback = InfoIcon,
  className,
  ...props
}: ListingIconProps) {
  const sanitized = sanitizeIconKey(iconKey || "");
  const Component = ICON_COMPONENT_MAP[sanitized] || fallback;

  return <Component className={className} {...(props as SvgIconProps)} />;
}

// ============================================================================
// 4. AMENITY TILE COMPONENT — SQUIRCLE CARD WITH SOFT FLOATING SHADOW
// ============================================================================

export interface AmenityTileProps {
  iconKey?: string | null;
  label: string;
  selected?: boolean;
  selectable?: boolean;
  onClick?: () => void;
  className?: string;
  badge?: React.ReactNode;
}

/**
 * Displays an individual amenity in the exact Apple-inspired squircle card style
 * requested by user: pure white squircle with soft diffused shadow, centered dark navy icon,
 * and clean label underneath.
 */
export function AmenityTile({
  iconKey,
  label,
  selected = false,
  selectable = false,
  onClick,
  className = "",
  badge,
}: AmenityTileProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center group transition-all",
        selectable && "cursor-pointer",
        className
      )}
      onClick={selectable ? onClick : undefined}
      role={selectable ? "button" : undefined}
      aria-pressed={selectable ? selected : undefined}
    >
      {/* Squircle Card Container */}
      <div
        className={cn(
          "w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl bg-white dark:bg-slate-900",
          "flex items-center justify-center p-3 relative transition-all duration-200 select-none",
          // Soft, diffused ambient drop shadow as shown in reference design
          "shadow-[0_12px_28px_-6px_rgba(0,0,0,0.06),0_8px_16px_-8px_rgba(0,0,0,0.04)]",
          "border border-slate-100/90 dark:border-slate-800",
          selectable && [
            "hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 active:translate-y-0",
            selected
              ? "ring-2 ring-emerald-500 border-emerald-400/80 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-emerald-500/10"
              : "hover:border-slate-200 dark:hover:border-slate-700",
          ]
        )}
      >
        {/* Selection checkmark badge in top-right corner */}
        {selectable && selected && (
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 h-5 w-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs animate-in zoom-in-75 duration-150">
            <Check className="h-3 w-3 stroke-[3]" />
          </div>
        )}

        {/* Custom optional badge */}
        {badge && <div className="absolute top-1.5 left-1.5">{badge}</div>}

        {/* Vector Icon */}
        <ListingIcon
          iconKey={iconKey}
          className={cn(
            "w-9 h-9 sm:w-11 sm:h-11 transition-colors",
            selected
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-[#0F172A] dark:text-slate-100 group-hover:text-emerald-600"
          )}
        />
      </div>

      {/* Label Text Centered Underneath */}
      <span
        className={cn(
          "mt-2 sm:mt-2.5 text-xs sm:text-[13px] font-medium text-center leading-snug line-clamp-2 max-w-[84px] sm:max-w-[104px] transition-colors",
          selected
            ? "text-emerald-900 dark:text-emerald-300 font-semibold"
            : "text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white"
        )}
      >
        {label}
      </span>
    </div>
  );
}
