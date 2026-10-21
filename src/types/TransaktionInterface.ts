export interface Transaktion {
  reference_nummer: string;
  /** Dato i formatet YYYY-MM-DD. */
  handelsdato: string;
  /** Dato i formatet YYYY-MM-DD. */
  valørdato: string;
  valuta: string;
  // Decimalværdier gemmes som strenge for at bevare præcisionen.
  handelskurs: string;
  kursværdi: string;
  handelsomkostninger: string;
  kurtage: string;
  afregningsbeløb: string;
  antal: number;
  ISIN: string;
  titel: string;
}

export type GemtTransaktion = Transaktion & { id?: string | number };
