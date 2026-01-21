"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Calendar, Tag, Trash2, Edit } from "lucide-react";
import ActivitiesForm from "@/components/admin/ActivitiesForm";

export default function ActivitiesDashboard() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/activities");
      if (!res.ok) {
        const text = await res.text();
        console.error("API Error Response:", text);
        throw new Error(`API returned ${res.status}`);
      }
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    
    try {
      const res = await fetch(`/api/activities?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchActivities();
      } else {
        alert("Failed to delete activity");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    }
  };

  const handleEdit = (activity: any) => {
    setEditingActivity(activity);
    setIsFormOpen(true);
  };

  const filteredActivities = activities.filter((activity: any) =>
    activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    activity.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Research Activities</h1>
          <p className="text-slate-500">Manage your research activities, events, and workshops</p>
        </div>
        <button
          onClick={() => {
            setEditingActivity(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} /> Add New Activity
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search activities by title or category..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent animate-spin rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity: any) => (
            <div key={activity.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {activity.titleImage && (
                <div className="aspect-video relative">
                  <img src={activity.titleImage} className="w-full h-full object-cover" alt={activity.title} />
                </div>
              )}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase">
                    {activity.category}
                  </span>
                  <span className="flex items-center gap-1 text-slate-400 text-sm">
                    <Calendar size={14} /> {activity.year}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 line-clamp-2">{activity.title}</h3>
                {activity.tags && (
                  <div className="flex flex-wrap gap-2">
                    {activity.tags.split(",").map((tag: string, i: number) => (
                      <span key={i} className="flex items-center gap-1 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Tag size={10} /> {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-50">
                  <button 
                    onClick={() => handleEdit(activity)}
                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(activity.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <ActivitiesForm
          onClose={() => {
            setIsFormOpen(false);
            setEditingActivity(null);
          }}
          onSuccess={fetchActivities}
          initialData={editingActivity}
        />
      )}
    </div>
  );
}
