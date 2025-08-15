export type Pilot = {
  cid: number;
  name: string;
  callsign: string;
  flight_plan?: {
    departure: string;
    arrival: string;
  };
};

export type Controller = {
  cid: number;
  name: string;
  callsign: string;
  frequency: string;
};

export type VatsimData = {
  pilots: Pilot[];
  controllers: Controller[];
};

export async function fetchVatsimData(): Promise<VatsimData> {
  const res = await fetch("https://data.vatsim.net/v3/vatsim-data.json");
  const data = await res.json();
  return {
    pilots: data.pilots || [],
    controllers: data.controllers || [],
  };
}
