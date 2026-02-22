import type { FlightProvider } from "./FlightProvider";
import { MockFlightProvider } from "./MockFlightProvider";

let providerInstance: FlightProvider | null = null;

export function getFlightProvider(): FlightProvider {
  if (providerInstance) return providerInstance;

  const providerName = process.env.FLIGHT_PROVIDER || "mock";

  switch (providerName) {
    case "mock":
    default:
      providerInstance = new MockFlightProvider();
      return providerInstance;
  }
}
