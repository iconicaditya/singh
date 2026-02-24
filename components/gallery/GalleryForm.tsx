import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2, Plus } from "lucide-react";
import { useState, useRef } from "react";
import { compressImageToMaxBytes } from "@/lib/imageUploadCompression";

interface GalleryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function GalleryForm({ isOpen, onClose, onSuccess, initialData }: GalleryFormProps) {
  const defaultCategories = ["RESEARCH", "PROJECT", "PLASTIC WASTE", "RECYCLING", "LANDFILL MGMT", "ORGANIC WASTE"];
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [categories, setCategories] = useState(() => {
    const list = [...defaultCategories];
    if (initialData?.category && !list.includes(initialData.category)) {
      list.unshift(initialData.category);
    }
    return list;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const fileToUpload = await compressImageToMaxBytes(file, 500 * 1024);
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload an image before saving.");
      return;
    }
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    // Ensure we use the uploaded image URL
    data.imageUrl = imageUrl;
    data.category = category;

    try {
      const url = initialData ? `/api/gallery?id=${initialData.id}` : "/api/gallery";
      const method = initialData ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCategory = () => {
    const value = newCategory.trim();
    if (!value) return;
    if (!categories.includes(value)) {
      setCategories((prev) => [value, ...prev]);
    }
    setCategory(value);
    setNewCategory("");
    setShowNewCategory(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-2 md:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-2xl md:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900">
              {initialData ? "Edit" : "Add"} <span className="text-blue-600">Gallery Item</span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">Manage visual research documentation.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm border border-slate-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-4 md:space-y-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Title</label>
              <input
                name="title"
                defaultValue={initialData?.title}
                required
                className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                placeholder="Item title..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Category</label>
              <div className="flex gap-2">
                <select
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium appearance-none"
                  required
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCategory((prev) => !prev)}
                  className="shrink-0 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                  title="Add category"
                >
                  <Plus size={18} />
                </button>
              </div>
              {showNewCategory && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category"
                    className="flex-1 px-4 py-2 md:py-3 bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-[11px] md:text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-4 py-2 md:py-3 rounded-lg md:rounded-xl bg-blue-600 text-white text-[11px] md:text-xs font-bold hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Image Upload</label>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-start">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
              >
                {imageUrl ? (
                  <div className="relative w-full aspect-video rounded-lg md:rounded-xl overflow-hidden shadow-sm">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="text-white" size={24} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-lg md:rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                    </div>
                    <p className="text-xs md:text-sm font-bold text-slate-600">Click to upload image</p>
                    <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest">JPG, PNG or WEBP</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              
              <div className="w-full sm:w-48 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Direct URL (Optional)</label>
                <input
                  name="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2 md:py-3 bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium text-[11px] md:text-xs"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900">Description</label>
            <textarea
              name="description"
              defaultValue={initialData?.description}
              rows={3}
              className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium resize-none"
              placeholder="Detailed description..."
            />
          </div>

          <div className="pt-2 md:pt-4 flex flex-col sm:flex-row gap-3 md:gap-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="order-2 sm:order-1 flex-1 px-6 md:px-8 py-3 md:py-4 bg-slate-100 text-slate-600 rounded-xl md:rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="order-1 sm:order-2 flex-[2] px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white rounded-xl md:rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />} 
              {initialData ? "Update Item" : "Create Item"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

