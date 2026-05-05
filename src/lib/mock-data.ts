export interface MockCharger {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  speed: number;
  plugType: string;
  price: number;
  hasSolar: boolean;
  hasBattery: boolean;
  gridLoad: number;
}

export const MOCK_CHARGERS: MockCharger[] = [
  {
    id: "1",
    name: "John's Supercharger",
    address: "123 Maple St, San Francisco",
    lat: 37.7749,
    lng: -122.4194,
    speed: 22,
    plugType: "TYPE_2",
    price: 0.35,
    hasSolar: true,
    hasBattery: true,
    gridLoad: 0.4,
  },
  {
    id: "2",
    name: "Downtown Green Plug",
    address: "55 Market St, San Francisco",
    lat: 37.7833,
    lng: -122.4167,
    speed: 11,
    plugType: "CCS_2",
    price: 0.28,
    hasSolar: false,
    hasBattery: false,
    gridLoad: 0.88, // High load!
  },
  {
    id: "3",
    name: "Sunset Battery Hub",
    address: "900 Sunset Blvd, San Francisco",
    lat: 37.7694,
    lng: -122.4862,
    speed: 50,
    plugType: "CHAdeMO",
    price: 0.45,
    hasSolar: true,
    hasBattery: true,
    gridLoad: 0.2,
  },
];
