export const WHATSAPP_NUMBER = "+919030999072";

export interface PackOption {
  id: string;
  name: string;
  price: number;
  regularPrice?: number;
  rotis: number;
  label: string;
}

export const PACK_OPTIONS: Record<string, PackOption> = {
  pack1: {
    id: "pack1",
    name: "Pack of 1",
    price: 45,
    rotis: 1,
    label: "Pack of 1 — ₹45",
  },
  pack2: {
    id: "pack2",
    name: "Pack of 2",
    price: 80,
    regularPrice: 90,
    rotis: 2,
    label: "Pack of 2 — ₹90 ₹80 (10% OFF)",
  },
  pack5: {
    id: "pack5",
    name: "Pack of 5",
    price: 160,
    regularPrice: 180,
    rotis: 5,
    label: "Pack of 5 — ₹180 ₹160 (10% OFF)",
  },
};

export interface DeliveryZoneOption {
  value: string;
  label: string;
  fee: number;
}

export const DELIVERY_ZONES: DeliveryZoneOption[] = [
  { value: "0-5", label: "0 — 5 km (Free Delivery)", fee: 0 },
  { value: "5-10", label: "5 — 10 km (+₹15)", fee: 15 },
  { value: "10-15", label: "10 — 15 km (+₹25)", fee: 25 },
  { value: "15+", label: "Above 15 km (+₹50)", fee: 50 },
];

export const ZONE_LOCATIONS: Record<string, string[]> = {
  "0-5": [
    "Attapur",
    "Mehdipatnam",
    "Tolichowki",
    "Hyderguda",
    "Suncity",
    "Langar Houz",
    "Khadarbagh",
    "Ziaguda",
    "Gudimalkapur",
    "Other (mention in notes)",
  ],
  "5-10": [
    "Shaikpet",
    "Rajendra Nagar",
    "Manikonda",
    "7 Tombs",
    "Alkapur",
    "Asif Nagar",
    "Lakdikapul",
    "Nampally",
    "Masab Tank",
    "Kishan Bagh",
    "Other (mention in notes)",
  ],
  "10-15": [
    "Banjara Hills",
    "Jubilee Hills",
    "Gachibowli",
    "Hi-Tech City",
    "Dilsukhnagar",
    "LB Nagar",
    "Kukatpally",
    "Abids",
    "Koti",
    "Ameerpet",
    "Panjagutta",
    "Old City",
    "Other (mention in notes)",
  ],
  "15+": [
    "Kondapur",
    "Secunderabad",
    "Uppal",
    "Shamshabad",
    "Narsingi",
    "Other (mention in notes)",
  ],
};

export const DELIVERY_SLOTS: Record<string, string[]> = {
  today: ["7 - 9 PM"],
  tomorrow: ["7 - 9 AM", "7 - 9 PM"],
};

export const LEGACY_COD_FEE = 15;

/**
 * Temporary, non-authoritative client-side calculation isolated from
 * the UI components. This mirrors legacy order.html behavior for preview/testing
 * and will be replaced by backend API responses in the integration phase.
 */
export function calculateLegacySummary(
  packKey: string,
  quantity: number,
  zoneValue: string,
  paymentMode: string
) {
  const pack = PACK_OPTIONS[packKey];
  const packPrice = pack ? pack.price : 0;
  const packSubtotal = packPrice * quantity;

  const zone = DELIVERY_ZONES.find((z) => z.value === zoneValue);
  const deliveryFee = zone !== undefined ? zone.fee : null;

  const codFee = paymentMode === "COD" ? LEGACY_COD_FEE : 0;
  const total = packSubtotal + (deliveryFee ?? 0) + codFee;

  return {
    pack,
    packPrice,
    packSubtotal,
    deliveryFee,
    codFee,
    total,
  };
}
