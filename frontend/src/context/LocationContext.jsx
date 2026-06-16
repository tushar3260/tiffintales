// LocationContext.jsx — Global auto-location state for TiffinTales
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const LocationContext = createContext(null);

const CACHE_KEY = "tt_user_location";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache — reduces redundant API calls

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function saveCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
  } catch {}
}

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    city: null,
    area: null,
    district: null,
    state: null,
    lat: null,
    lng: null,
    displayLabel: null,
    loading: true,
    error: null,
    granted: false,
  });

  const parseAddress = (data) => {
    const addr = data.address || {};
    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.county ||
      addr.state_district ||
      addr.state ||
      "Your Location";
    const area =
      addr.neighbourhood ||
      addr.suburb ||
      addr.quarter ||
      addr.road ||
      null;
    const district = addr.county || addr.state_district || null;
    const state = addr.state || null;
    const displayLabel = area ? `${area}, ${city}` : city;
    return { city, area, district, state, displayLabel };
  };

  const detect = useCallback(async (forceRefresh = false) => {
    // 1. Try cache first (unless forced)
    if (!forceRefresh) {
      const cached = loadCache();
      if (cached) {
        setLocation({ ...cached, loading: false, error: null, granted: true });
        return;
      }
    }

    if (!("geolocation" in navigator)) {
      setLocation((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation not supported",
        granted: false,
      }));
      return;
    }

    setLocation((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
            {
              headers: { "Accept-Language": "en" },
            }
          );
          if (!res.ok) throw new Error("Geocoding failed");
          const data = await res.json();
          const parsed = parseAddress(data);
          const newLoc = { ...parsed, lat, lng, loading: false, error: null, granted: true };
          setLocation(newLoc);
          saveCache(newLoc);
        } catch {
          // Coords are known but reverse geocode failed — store coords at least
          const fallback = {
            city: "Near You",
            area: null,
            district: null,
            state: null,
            displayLabel: "Near You",
            lat,
            lng,
            loading: false,
            error: null,
            granted: true,
          };
          setLocation(fallback);
          saveCache(fallback);
        }
      },
      (err) => {
        const msg =
          err.code === 1
            ? "Location access denied"
            : err.code === 2
            ? "Location unavailable"
            : "Location request timed out";
        setLocation((prev) => ({
          ...prev,
          loading: false,
          error: msg,
          granted: false,
        }));
      },
      // enableHighAccuracy: false = network/WiFi based (instant)
      // enableHighAccuracy: true  = GPS (5-10 second wait = site lag)
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 600000 }
    );
  }, []);

  useEffect(() => {
    // Delay slightly so it doesn't block initial render
    const timer = setTimeout(() => detect(false), 300);
    return () => clearTimeout(timer);
  }, [detect]);

  return (
    <LocationContext.Provider value={{ ...location, refresh: () => detect(true) }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation2 = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocation2 must be used inside LocationProvider");
  return ctx;
};

export default LocationContext;
