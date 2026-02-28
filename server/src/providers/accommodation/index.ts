import type { AccommodationProvider } from "./AccommodationProvider";
import { MockAccommodationProvider } from "./MockAccommodationProvider";
import { PostgresAccommodationProvider } from "./PostgresAccommodationProvider";

let providerInstance: AccommodationProvider | null = null;

export function getAccommodationProvider(): AccommodationProvider {
  if (providerInstance) return providerInstance;

  const providerName = process.env.ACCOMMODATION_PROVIDER || "postgres";

  switch (providerName) {
    case "postgres":
      providerInstance = new PostgresAccommodationProvider();
      return providerInstance;
    case "mock":
      providerInstance = new MockAccommodationProvider();
      return providerInstance;
    default:
      throw new Error(`Unsupported ACCOMMODATION_PROVIDER: ${providerName}`);
  }
}
