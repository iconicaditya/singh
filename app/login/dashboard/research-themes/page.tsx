"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Layers } from "lucide-react";
import DashboardTable from "@/components/admin/DashboardTable";
import ResearchThemeForm, { ResearchThemeFormData } from "@/components/admin/ResearchThemeForm";

interface ResearchTheme extends ResearchThemeFormData {
  id: number;
  updatedAt: string;
}

export default function AdminResearchThemesPage() {
  const [themes, setThemes] = useState<ResearchTheme[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ResearchTheme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchThemes = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/research-themes", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch research themes");
      }
      const data = await response.json();
      const normalized = Array.isArray(data)
        ? data.map((item) => ({
            id: Number(item.id),
            title: String(item.title || ""),
            iconImage: String(item.iconImage || ""),
            points: Array.isArray(item.points) ? item.points : [],
            updatedAt: String(item.updatedAt || item.createdAt || new Date().toISOString())
          }))
        : [];
      setThemes(normalized);
    } catch (error) {
      console.error("Research themes fetch error:", error);
      setErrorMessage("Unable to load research themes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const handleSave = async (data: ResearchThemeFormData) => {
    try {
      const response = await fetch("/api/research-themes", {
        method: editingTheme ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTheme ? { ...data, id: editingTheme.id } : data)
      });

      if (!response.ok) {
        throw new Error("Failed to save research theme");
      }

      await fetchThemes();
      setIsFormOpen(false);
      setEditingTheme(null);
    } catch (error) {
      console.error("Research theme save error:", error);
      alert("Failed to save research theme.");
    }
  };

  const handleDelete = async (theme: ResearchTheme) => {
    if (!confirm(`Delete research theme "${theme.title}"?`)) return;
    try {
      const response = await fetch(`/api/research-themes?id=${theme.id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error("Failed to delete research theme");
      }
      await fetchThemes();
    } catch (error) {
      console.error("Research theme delete error:", error);
      alert("Failed to delete research theme.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-[#f8fafc] min-h-screen text-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Research Themes <span className="text-blue-600">Management</span></h1>
          <p className="mt-2 text-slate-500 font-medium text-sm md:text-base">Organize and maintain the lab's research focus areas.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
        </div>
      ) : errorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-rose-600 font-semibold">
          {errorMessage}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          <div className="min-w-[600px] md:min-w-full">
            <DashboardTable
              title="Research Themes"
              description="Manage themes and their key research points."
              icon={Layers}
              data={themes}
              onAdd={() => {
                setEditingTheme(null);
                setIsFormOpen(true);
              }}
              onEdit={(item) => {
                setEditingTheme(item);
                setIsFormOpen(true);
              }}
              onDelete={(item) => handleDelete(item)}
              columns={[
                {
                  header: "Theme",
                  accessor: "title",
                  render: (value, item) => (
                    <div className="flex items-center gap-3 min-w-[220px] md:max-w-md">
                      <div className="h-10 w-10 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden flex items-center justify-center text-slate-300">
                        {item.iconImage ? (
                          <img src={item.iconImage} alt={value} className="h-full w-full object-cover" />
                        ) : (
                          <ImageIcon size={18} />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 line-clamp-2 md:line-clamp-1 text-sm md:text-base">
                          {value}
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  header: "Points",
                  accessor: "points",
                  render: (value) => (
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {(value as string[]).slice(0, 2).map((area, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md whitespace-nowrap"
                        >
                          {area}
                        </span>
                      ))}
                      {(value as string[]).length > 2 && (
                        <span className="text-[10px] text-slate-400">+{(value as string[]).length - 2}</span>
                      )}
                    </div>
                  )
                },
                {
                  header: "Updated",
                  accessor: "updatedAt",
                  render: (value) => (
                    <span className="text-[11px] md:text-sm font-medium text-slate-400 whitespace-nowrap">
                      {new Date(value).toLocaleDateString()}
                    </span>
                  )
                }
              ]}
            />
          </div>
        </div>
      )}

      <ResearchThemeForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTheme(null);
        }}
        onSave={handleSave}
        initialData={editingTheme}
      />
    </div>
  );
}
