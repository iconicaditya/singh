"use client";

import { useState } from "react";
import { Image as ImageIcon, Layers } from "lucide-react";
import DashboardTable from "@/components/admin/DashboardTable";
import ResearchThemeForm, { ResearchThemeFormData } from "@/components/admin/ResearchThemeForm";

interface ResearchTheme extends ResearchThemeFormData {
  id: number;
  updatedAt: string;
}

const initialThemes: ResearchTheme[] = [
  {
    id: 1,
    iconImage: "",
    title: "Plastics & Marine Litter",
    points: ["Microplastics monitoring", "Marine litter education", "Policy interventions"],
    updatedAt: "2026-01-10"
  },
  {
    id: 2,
    iconImage: "",
    title: "Waste Management",
    points: ["Campus composting", "Open burning mitigation", "Municipal solid waste"],
    updatedAt: "2026-01-28"
  },
  {
    id: 3,
    iconImage: "",
    title: "Climate Change",
    points: ["Heat risk perception", "Mitigation co-benefits", "Community resilience"],
    updatedAt: "2026-02-02"
  }
];

export default function AdminResearchThemesPage() {
  const [themes, setThemes] = useState<ResearchTheme[]>(initialThemes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ResearchTheme | null>(null);

  const handleSave = (data: ResearchThemeFormData) => {
    if (editingTheme) {
      setThemes((prev) =>
        prev.map((theme) =>
          theme.id === editingTheme.id
            ? {
                ...theme,
                ...data,
                updatedAt: new Date().toISOString().split("T")[0]
              }
            : theme
        )
      );
    } else {
      setThemes((prev) => [
        {
          id: Date.now(),
          updatedAt: new Date().toISOString().split("T")[0],
          ...data
        },
        ...prev
      ]);
    }
    setIsFormOpen(false);
    setEditingTheme(null);
  };

  const handleDelete = (theme: ResearchTheme) => {
    if (!confirm(`Delete research theme "${theme.title}"?`)) return;
    setThemes((prev) => prev.filter((item) => item.id !== theme.id));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-[#f8fafc] min-h-screen text-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Research Themes <span className="text-blue-600">Management</span></h1>
          <p className="mt-2 text-slate-500 font-medium text-sm md:text-base">Organize and maintain the lab's research focus areas.</p>
        </div>
      </div>

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
