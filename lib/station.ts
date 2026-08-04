import stationData from "@/content/station.json";

export type Program = {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  /** Цена в ночные часы, см. Station.nightHours */
  nightPrice: number;
  duration: number;
  popular: boolean;
  /** 1..5, по возрастанию тщательности мойки */
  cleanLevel: number;
  /** Бонусов начисляется за мойку */
  bonus: number;
  description: string;
  steps: string[];
};

export type Station = {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  kubonUrl: string;
  boxCount: number;
  workingHours: string;
  payment: string;
  /** Окно ночного тарифа, человекочитаемо */
  nightHours: string;
  programs: Program[];
};

export const station: Station = stationData as Station;
