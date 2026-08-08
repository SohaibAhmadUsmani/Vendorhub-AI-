import { useQuery } from "@tanstack/react-query";
import { getData } from "../httpClient";

/* --------------------------------------------------------------------------
   recommendationService — prioritized AI action items.
   -------------------------------------------------------------------------- */

const RECOMMENDATIONS_PATH = "/api/vendor/recommendations";

export function useVendorRecommendations() {
  return useQuery({
    queryKey: ["vendor", "recommendations"],
    queryFn: () => getData(RECOMMENDATIONS_PATH),
  });
}

export function getRecommendations(data) {
  const list = Array.isArray(data) ? data : data?.data ?? [];
  return list.map((r) => ({
    id: r._id ?? r.id ?? r.title,
    type: r.type ?? "info",
    title: r.title ?? "Recommendation",
    description: r.description ?? "",
    ctaLabel: r.ctaLabel ?? "Take action",
  }));
}
