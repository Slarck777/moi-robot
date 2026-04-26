import stationData from "@/content/station.json";

export type Program = {
  id: string;
  name: string;
  price: number;
  duration: number;
  popular: boolean;
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
  programs: Program[];
};

export const station: Station = stationData as Station;
