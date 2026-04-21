import { useEffect, useState, useCallback } from "react";

// ─── Change this to your Express API base URL ───────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * useCampaigns
 * Fetches campaigns from your MongoDB/Express backend.
 * All filtering, sorting, and pagination happen server-side.
 *
 * Your Express route should accept:
 *   GET /api/campaigns?page=1&limit=8&category=Education&urgency=High&sort=mostFunded&q=water
 *
 * Expected JSON response shape:
 * {
 *   campaigns: [...],   // array of campaign objects
 *   total: 42,          // total matching count (for pagination)
 *   page: 1,
 *   pages: 6
 * }
 */
export const useCampaigns = ({ page, category, urgency, sort, query }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [total, setTotal]         = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page:  String(page),
        limit: "8",
        ...(category && category !== "All" && { category }),
        ...(urgency  && urgency  !== "All" && { urgency }),
        ...(sort     && { sort: sortKey(sort) }),
        ...(query.trim() && { q: query.trim() }),
      });

      const res = await fetch(`${API_BASE}/campaigns?${params}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setCampaigns(data.campaigns);
      setTotal(data.total);
      setTotalPages(data.pages);
    } catch (err) {
      setError(err.message || "Failed to fetch campaigns.");
    } finally {
      setLoading(false);
    }
  }, [page, category, urgency, sort, query]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, total, totalPages, loading, error, refetch: fetchCampaigns };
};

// Maps UI sort labels → API query param values
const sortKey = (label) => {
  switch (label) {
    case "Most Funded":  return "mostFunded";
    case "Newest":       return "newest";
    case "Most Urgent":  return "mostUrgent";
    case "Ending Soon":  return "endingSoon";
    default:             return "mostFunded";
  }
};