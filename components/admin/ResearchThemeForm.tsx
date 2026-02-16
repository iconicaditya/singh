"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import FormModal from "@/components/admin/FormModal";

export interface ResearchThemeFormData {
  id?: number;
  iconImage: string;
  title: string;
  points: string[];
}

interface ResearchThemeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ResearchThemeFormData) => void;
  initialData?: ResearchThemeFormData | null;
}

const defaultFormData: ResearchThemeFormData = {
  iconImage: "",
  title: "",
  points: []
};

export default function ResearchThemeForm({
  isOpen,
  onClose,
  onSave,
  initialData
}: ResearchThemeFormProps) {
  const [formData, setFormData] = useState<ResearchThemeFormData>(defaultFormData);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      return;
    }
    setFormData(defaultFormData);
  }, [initialData, isOpen]);

  const handleIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData
      });
      const data = await response.json();
      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, iconImage: data.secure_url }));
      }
    } catch (error) {
      console.error("Icon upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPoint = () => {
    setFormData((prev) => ({ ...prev, points: [...prev.points, ""] }));
  };

  const handlePointChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      points: prev.points.map((point, idx) => (idx === index ? value : point))
    }));
  };

  const handleRemovePoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      points: prev.points.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({
      ...formData,
      points: formData.points.filter(Boolean)
    });
  };

  return (
    <FormModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Research Theme" : "Add Research Theme"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Icon Image</label>
            <div className="flex items-center gap-4">
              <label className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-300 hover:text-blue-500 transition-colors cursor-pointer overflow-hidden">
                {formData.iconImage ? (
                  <img src={formData.iconImage} alt="Icon" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon size={24} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleIconUpload}
                />
              </label>
              <div>
                <p className="text-sm font-semibold text-slate-700">Upload icon</p>
                <p className="text-xs text-slate-400">PNG, JPG, or SVG</p>
                {isUploading && <p className="text-xs text-blue-500 mt-1">Uploading...</p>}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Title</label>
            <input
              value={formData.title}
              onChange={(event) => setFormData({ ...formData, title: event.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:border-blue-500 outline-none"
              placeholder="Plastics & Marine Litter"
              required
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">Points</label>
          <div className="space-y-3">
            {formData.points.map((point, index) => (
              <div key={`point-${index}`} className="flex flex-col sm:flex-row gap-3">
                <input
                  value={point}
                  onChange={(event) => handlePointChange(index, event.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900 focus:border-blue-500 outline-none"
                  placeholder={`Point ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => handleRemovePoint(index)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-rose-500 bg-rose-50 hover:bg-rose-100 transition-all"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddPoint}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all"
            >
              <Plus size={16} /> Add Point
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-3 rounded-xl text-sm font-black bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all"
          >
            Save Theme
          </button>
        </div>
      </form>
    </FormModal>
  );
}
