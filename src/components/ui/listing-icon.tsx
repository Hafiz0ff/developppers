import React from "react";
import {
  Wifi,
  Flame,
  Wind,
  PawPrint,
  Baby,
  Armchair,
  Tv,
  Home,
  Trash2,
  Bell,
  ShieldCheck,
  Camera,
  Building2,
  ArrowUpDown,
  Boxes,
  Car,
  Warehouse,
  SquareParking,
  Layers,
  Building,
  DoorClosed,
  Sun,
  Bath,
  Paintbrush,
  LayoutDashboard,
  Users,
  Award,
  Droplets,
  BellRing,
  Fan,
  Zap,
  Droplet,
  Shield,
  Coffee,
  Utensils,
  Soup,
  Sparkles,
  PlusSquare,
  Dumbbell,
  Landmark,
  Presentation,
  CreditCard,
  Info,
  LucideProps,
} from "lucide-react";
import { AllowedIconKey, sanitizeIconKey } from "@/lib/classifieds/attributes";

/**
 * Custom SVG icons for domain metaphors where standard Lucide icon
 * does not have a 1-to-1 match (per SPEC Section 8).
 */
function WashingMachineIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="20" x="3" y="2" rx="2" />
      <circle cx="12" cy="13" r="5" />
      <path d="M12 10a3 3 0 0 1 3 3" />
      <line x1="7" x2="7.01" y1="6" y2="6" />
      <line x1="11" x2="11.01" y1="6" y2="6" />
    </svg>
  );
}

function RefrigeratorIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <line x1="7" x2="7" y1="5" y2="7" />
      <line x1="7" x2="7" y1="13" y2="16" />
    </svg>
  );
}

function DishwasherIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="20" x="3" y="2" rx="2" />
      <line x1="3" x2="21" y1="7" y2="7" />
      <circle cx="12" cy="14" r="4" />
      <line x1="7" x2="7.01" y1="4.5" y2="4.5" />
      <line x1="10" x2="10.01" y1="4.5" y2="4.5" />
    </svg>
  );
}

function StoveIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="20" x="3" y="2" rx="2" />
      <circle cx="8" cy="7" r="2" />
      <circle cx="16" cy="7" r="2" />
      <line x1="3" x2="21" y1="12" y2="12" />
      <rect width="12" height="6" x="6" y="14" rx="1" />
    </svg>
  );
}

function ElevatorIcon(props: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="20" x="3" y="2" rx="2" />
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="m7 10 2-2 2 2" />
      <path d="m17 14-2 2-2-2" />
    </svg>
  );
}

/**
 * Mapping of allowlisted icon keys to React icon components
 */
const ICON_COMPONENT_MAP: Record<AllowedIconKey, React.ComponentType<LucideProps>> = {
  wifi: Wifi,
  heating: Flame,
  "washing-machine": WashingMachineIcon,
  refrigerator: RefrigeratorIcon,
  dishwasher: DishwasherIcon,
  stove: StoveIcon,
  "air-conditioner": Wind,
  pets: PawPrint,
  "child-friendly": Baby,
  sofa: Armchair,
  tv: Tv,
  "smart-home": Home,
  elevator: ElevatorIcon,
  "waste-chute": Trash2,
  "concierge-bell": Bell,
  barrier: ShieldCheck,
  cctv: Camera,
  "construction-crane": Building2,
  "ceiling-height": ArrowUpDown,
  "building-material": Boxes,
  "parking-open": Car,
  "parking-covered": Warehouse,
  "parking-underground": SquareParking,
  stairs: Layers,
  "building-floors": Building,
  "apartment-doors": DoorClosed,
  balcony: Sun,
  bathroom: Bath,
  "paint-roller": Paintbrush,
  "floor-plan": LayoutDashboard,
  children: Users,
  "business-center": Building2,
  "building-class": Award,
  sprinkler: Droplets,
  "fire-alarm": BellRing,
  ventilation: Fan,
  plug: Zap,
  "water-tap": Droplet,
  security: Shield,
  "water-drop": Droplets,
  coffee: Coffee,
  cutlery: Utensils,
  "serving-dish": Soup,
  "round-mirror": Sparkles,
  pharmacy: PlusSquare,
  dumbbell: Dumbbell,
  bank: Landmark,
  presentation: Presentation,
  atm: CreditCard,
  info: Info,
};

export interface ListingIconProps extends LucideProps {
  iconKey?: string | null;
  fallback?: React.ComponentType<LucideProps>;
}

/**
 * Safe, allowlisted listing icon renderer.
 * Never crashes the application on missing or unknown keys.
 */
export function ListingIcon({
  iconKey,
  fallback = Info,
  className,
  ...props
}: ListingIconProps) {
  const sanitized = sanitizeIconKey(iconKey || "");
  const Component = ICON_COMPONENT_MAP[sanitized] || fallback;

  return <Component className={className} {...props} />;
}
