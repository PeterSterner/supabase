export const handelsplatforme = [
  "Nordnet",
  "Saxo Bank",
  "Nordea",
  "Danske Bank",
  "Jyske Bank",
] as const;

export interface Depot {
  navn: string;
  handelsplatform: (typeof handelsplatforme)[number];
}
