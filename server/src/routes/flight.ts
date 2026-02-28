import { Router } from "express";
import { listBookings } from "../repositories/flightBookingRepository";
import { bookFlight, searchFlights } from "../services/flightService";
import type { FlightBookingRequest, FlightSearchRequest } from "../types/flight";
import { logger } from "../utils/logger";

const router = Router();

router.post("/search", async (req, res) => {
  try {
    const payload = (req.body || {}) as Partial<FlightSearchRequest>;
    const response = await searchFlights(payload);
    res.json(response);
  } catch (error) {
    logger.warn("Flight search failed", error);
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to search flights.",
    });
  }
});

router.post("/book", async (req, res) => {
  try {
    const payload = (req.body || {}) as Partial<FlightBookingRequest>;
    const response = await bookFlight(payload);
    res.json(response);
  } catch (error) {
    logger.warn("Flight booking failed", error);
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to book flight.",
    });
  }
});

router.get("/bookings", async (_req, res) => {
  try {
    const items = await listBookings();
    res.json({
      total: items.length,
      items,
    });
  } catch (error) {
    logger.warn("Failed to fetch flight bookings", error);
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to load flight bookings.",
    });
  }
});

export default router;
