import type { AccommodationProvider } from "./AccommodationProvider";
import { MockAccommodationProvider } from "./MockAccommodationProvider";

let providerInstance: AccommodationProvider | null = null;

export function getAccommodationProvider(): AccommodationProvider {
  if (providerInstance) return providerInstance;

  const providerName = process.env.ACCOMMODATION_PROVIDER || "mock";

  switch (providerName) {
    case "mock":
    default:
      providerInstance = new MockAccommodationProvider();
      return providerInstance;
  }
}
