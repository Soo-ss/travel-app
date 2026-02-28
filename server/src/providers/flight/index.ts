import type { FlightProvider } from "./FlightProvider";
import { MockFlightProvider } from "./MockFlightProvider";
import { PostgresFlightProvider } from "./PostgresFlightProvider";

let providerInstance: FlightProvider | null = null;

export function getFlightProvider(): FlightProvider {
  if (providerInstance) return providerInstance;

  const providerName = process.env.FLIGHT_PROVIDER || "postgres";

  switch (providerName) {
    case "postgres":
      providerInstance = new PostgresFlightProvider();
      return providerInstance;
    case "mock":
      providerInstance = new MockFlightProvider();
      return providerInstance;
    default:
      throw new Error(`Unsupported FLIGHT_PROVIDER: ${providerName}`);
  }
}
