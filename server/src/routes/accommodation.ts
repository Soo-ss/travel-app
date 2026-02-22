import { Router } from "express";
import { listAccommodationBookings } from "../repositories/accommodationBookingRepository";
import {
  bookAccommodation,
  getAccommodationDetail,
  getPopularCities,
  searchAccommodations,
} from "../services/accommodationService";
import type {
  AccommodationBookingRequest,
  AccommodationSearchRequest,
} from "../types/accommodation";
import { logger } from "../utils/logger";

const router = Router();

router.get("/world/popular", async (_req, res) => {
  try {
    const response = await getPopularCities();
    res.json(response);
  } catch (error) {
    logger.warn("Failed to load popular accommodation cities", error);
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to load popular cities.",
    });
  }
});

router.post("/search", async (req, res) => {
  try {
    const payload = (req.body || {}) as Partial<AccommodationSearchRequest>;
    const response = await searchAccommodations(payload);
    res.json(response);
  } catch (error) {
    logger.warn("Accommodation search failed", error);
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to search accommodations.",
    });
  }
});

router.post("/book", async (req, res) => {
  try {
    const payload = (req.body || {}) as Partial<AccommodationBookingRequest>;
    const response = await bookAccommodation(payload);
    res.json(response);
  } catch (error) {
    logger.warn("Accommodation booking failed", error);
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to book accommodation.",
    });
  }
});

router.get("/bookings/list", (_req, res) => {
  const items = listAccommodationBookings();
  res.json({
    total: items.length,
    items,
  });
});

router.get("/:id", async (req, res) => {
  try {
    const response = await getAccommodationDetail(req.params.id);
    res.json(response);
  } catch (error) {
    logger.warn("Accommodation detail lookup failed", error);
    res.status(400).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to load accommodation detail.",
    });
  }
});

export default router;
