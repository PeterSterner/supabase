export interface Handelsplatform {
  id: string;
  navn: string;
}

export interface Depot {
  navn: string;
  handelsplatform_id: string;
}

export interface DepotVisning extends Depot {
  handelsplatform: Handelsplatform;
}
