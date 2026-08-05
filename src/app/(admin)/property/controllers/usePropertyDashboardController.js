import checkInApi from "@/helpers/checkInApi";
import { useEffect, useState } from "react";

const COUNT_ENDPOINT = "/property/count/";
const LIST_ENDPOINT = "/property/get_all/";

const STATUS_META = [
  { key: "Occupied", label: "Occupied", color: "#604ae3" },
  { key: "Vacant", label: "Vacant", color: "#58bd7d" },
  { key: "Booked", label: "Booked", color: "#ff8b3d" },
  { key: "Under Maintenance", label: "Under Maintenance", color: "#38c6cf" },
];

const TYPE_META = {
  Flat: { color: "primary" },
  Villa: { color: "warning" },
  Warehouse: { color: "success" },
  Commercial: { color: "info" },
};

export const usePropertyDashboardController = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [countData, setCountData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const load = async () => {
      try {
        const [countRes, allRes, recentRes] = await Promise.all([
          checkInApi.get(COUNT_ENDPOINT),
          checkInApi.get(LIST_ENDPOINT, { params: { limit: 999999 } }),
          checkInApi.get(LIST_ENDPOINT, { params: { limit: 4, sort_by: "created_at", sort_order: "desc" } }),
        ]);
        if (cancelled) return;

        setCountData(countRes.data?.data ?? null);
        setProperties(allRes.data?.data?.data ?? []);
        setRecentProperties(recentRes.data?.data?.data ?? []);
      } catch (err) {
        const status = err?.response?.status;
        const detail = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Unknown error";
        if (!cancelled) setError(status ? `HTTP ${status}: ${detail}` : detail);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, []);

  const totalProperties = countData?.count ?? 0;
  const byType = countData?.byType ?? {};

  const totalBuildings = new Set(
    properties.map((p) => p.buildingDetails || p.propertyDetails?.buildingName).filter(Boolean)
  ).size;

  const statusCounts = STATUS_META.reduce((acc, meta) => {
    acc[meta.key] = properties.filter((p) => p.propertyDetails?.currentStatus === meta.key).length;
    return acc;
  }, {});

  const occupiedCount = statusCounts.Occupied ?? 0;
  const vacantCount = statusCounts.Vacant ?? 0;
  const occupiedPercent = properties.length > 0 ? Math.round((occupiedCount / properties.length) * 100) : 0;

  const statData = [
    { title: "No. of Properties", amount: String(totalProperties), icon: "solar:calendar-date-bold-duotone", variant: "primary" },
    { title: "Total Buildings", amount: String(totalBuildings), icon: "solar:chart-square-bold-duotone", variant: "success" },
    { title: "Occupied Properties", amount: String(occupiedCount), icon: "solar:user-plus-rounded-bold-duotone", variant: "warning" },
    { title: "Vacant Properties", amount: String(vacantCount), icon: "solar:chart-2-bold-duotone", variant: "info" },
  ];

  const occupancyStatusData = STATUS_META.map((meta) => ({
    label: meta.label,
    value: statusCounts[meta.key] ?? 0,
    color: meta.color,
  }));

  const totalTyped = Object.values(byType).reduce((s, v) => s + v, 0) || 1;
  const typeBreakdown = Object.entries(byType).map(([type, count]) => ({
    title: type,
    amount: String(count),
    progress: Math.round((count / totalTyped) * 100),
    variant: TYPE_META[type]?.color ?? "primary",
  }));

  const cityMap = properties.reduce((acc, p) => {
    const city = p.propertyDetails?.city || p.propertyDetails?.areaZone || "Unknown";
    acc[city] = (acc[city] ?? 0) + 1;
    return acc;
  }, {});
  const cityBreakdown = Object.entries(cityMap)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const topProperty = properties.reduce((top, p) => {
    const rent = Number(p.propertyDetails?.monthlyRent ?? p.expectedRent ?? 0);
    const topRent = Number(top?.propertyDetails?.monthlyRent ?? top?.expectedRent ?? 0);
    return rent > topRent ? p : top;
  }, properties[0] ?? null);

  const mapRecent = (p) => ({
    name: p.buildingDetails || p.propertyDetails?.buildingName || `Property #${p.propertyId}`,
    location: [p.propertyDetails?.city, p.propertyDetails?.country].filter(Boolean).join(", ") || "—",
    date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—",
  });

  return {
    loading,
    error,
    statData,
    occupancyStatusData,
    typeBreakdown,
    cityBreakdown,
    topProperty,
    occupiedCount,
    occupiedPercent,
    totalProperties,
    recentProperties: recentProperties.map(mapRecent),
  };
};
