import React, { useEffect, useState } from "react";
import { fetchVatsimData } from "../api/vatsimApi";
import type { Controller, Pilot } from "../api/vatsimApi";
import { useNavigate } from "react-router-dom";

type FilterType = "all" | "pilot" | "controller";
type Item = (Pilot | Controller) & { _type: "pilot" | "controller" };

export function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filtered, setFiltered] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const password = localStorage.getItem("password");
    if (!password) {
      window.location.href = "/login";
      return;
    }
    fetchVatsimData().then(data => {
      const pilots: Item[] = data.pilots.map(p => ({ ...p, _type: "pilot" }));
      const controllers: Item[] = data.controllers.map(c => ({ ...c, _type: "controller" }));
      setItems([...pilots, ...controllers]);
      setFiltered([...pilots, ...controllers]);
    });
  }, []);

  useEffect(() => {
    let filteredItems = items;
    if (filterType !== "all") {
      filteredItems = filteredItems.filter(item => item._type === filterType);
    }
    if (search) {
      const s = search.toLowerCase();
      filteredItems = filteredItems.filter(item => {
        if (item._type === "pilot") {
          const p = item as Pilot;
          return (
            p.callsign.toLowerCase().includes(s) ||
            p.name.toLowerCase().includes(s) ||
            (p.flight_plan?.departure?.toLowerCase().includes(s) ?? false) ||
            (p.flight_plan?.arrival?.toLowerCase().includes(s) ?? false)
          );
        } else {
          const c = item as Controller;
          return (
            c.callsign.toLowerCase().includes(s) ||
            c.name.toLowerCase().includes(s) ||
            c.frequency.toLowerCase().includes(s)
          );
        }
      });
    }
    setFiltered(filteredItems);
    setPage(1);
  }, [search, items, filterType]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const handleAddToWatch = (item: Item) => {
    // פעולה ריקה כרגע
  };

  const handleLogout = () => {
    localStorage.removeItem("password");
    navigate("/");
  };

  return (
    <main className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full flex justify-end mb-4">
        <button
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          onClick={handleLogout}
        >
          התנתק
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-4">VATSIM Online</h1>
      <div className="mb-4 flex flex-col sm:flex-row gap-2 w-full max-w-6xl">
        <input
          type="text"
          placeholder="חפש לפי שם, קריאה, שדה, תדר"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1"
        />
        <div className="flex gap-2">
          <button
            className={`px-3 py-2 rounded border ${filterType === "all" ? "bg-blue-600 text-white" : ""}`}
            onClick={() => setFilterType("all")}
          >
            הצג הכל
          </button>
          <button
            className={`px-3 py-2 rounded border ${filterType === "pilot" ? "bg-blue-600 text-white" : ""}`}
            onClick={() => setFilterType("pilot")}
          >
            טייסים בלבד
          </button>
          <button
            className={`px-3 py-2 rounded border ${filterType === "controller" ? "bg-blue-600 text-white" : ""}`}
            onClick={() => setFilterType("controller")}
          >
            עמדות בלבד
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-6xl">
        {paged.map(item =>
          item._type === "pilot" ? (
            <div
              key={`pilot-${item.cid}-${item.callsign}`}
              className="border rounded shadow p-4 flex flex-col justify-between"
              style={{
                background: "#23272e",
                color: "#e6edf3",
                minHeight: 160,
              }}
            >
              <div>
                <div className="font-bold text-lg mb-1">
                  {item.callsign} <span className="text-xs text-blue-400">(טייס)</span>
                </div>
                <div className="mb-1">שם: {item.name}</div>
                <div className="mb-1">CID: {item.cid}</div>
                {"flight_plan" in item && item.flight_plan ? (
                  <div className="text-sm mt-2">
                    <span>מוצא: {item.flight_plan.departure}</span>
                    <br />
                    <span>יעד: {item.flight_plan.arrival}</span>
                  </div>
                ) : (
                  <div className="text-sm mt-2 text-gray-400">אין נתוני טיסה</div>
                )}
              </div>
              <button
                className="mt-4 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
                onClick={() => handleAddToWatch(item)}
              >
                הוסף למעקב
              </button>
            </div>
          ) : (
            <div
              key={`controller-${item.cid}-${item.callsign}`}
              className="border rounded shadow p-4 flex flex-col justify-between"
              style={{
                background: "#23272e",
                color: "#e6edf3",
                minHeight: 160,
              }}
            >
              <div>
                <div className="font-bold text-lg mb-1">
                  {item.callsign} <span className="text-xs text-green-400">(עמדה)</span>
                </div>
                <div className="mb-1">שם: {item.name}</div>
                <div className="mb-1">CID: {item.cid}</div>
                <div className="mb-1">תדר: {(item as Controller).frequency}</div>
              </div>
              <button
                className="mt-4 px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
                onClick={() => handleAddToWatch(item)}
              >
                הוסף למעקב
              </button>
            </div>
          )
        )}
      </div>
      <div className="flex gap-2 mt-6">
        <button
          className="px-3 py-1 rounded border"
          disabled={page === 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          הקודם
        </button>
        <span>
          עמוד {page} מתוך {totalPages}
        </span>
        <button
          className="px-3 py-1 rounded border"
          disabled={page === totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          הבא
        </button>
      </div>
    </main>
  );
}
