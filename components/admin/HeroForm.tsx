import { motion } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

interface HeroFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function HeroForm({ isOpen, onClose, onSuccess, initialData }: HeroFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(initialData?.backgroundImage || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setBackgroundImage(data.secure_url);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      mainHeading: formData.get('mainHeading')?.toString() || "",
      subheading: formData.get('subheading')?.toString() || "",
      backgroundImage: backgroundImage,
    };

    try {
      const url = initialData ? `/api/hero?id=${initialData.id}` : "/api/hero";
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
              {initialData ? "Edit" : "Add"} <span className="text-blue-600">Hero Slide</span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">Manage hero carousel content.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm border border-slate-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-8 space-y-4 md:space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Main Heading</label>
            <input
              name="mainHeading"
              defaultValue={initialData?.mainHeading}
              required
              className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
              placeholder="Enter main heading..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Subheading</label>
            <textarea
              name="subheading"
              defaultValue={initialData?.subheading}
              required
              rows={3}
              className="w-full px-4 md:px-5 py-3 md:py-4 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium resize-none"
              placeholder="Enter subheading..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">Background Image Upload</label>
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-start">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-slate-200 rounded-xl md:rounded-2xl p-4 md:p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
              >
                {backgroundImage ? (
                  <div className="relative w-full aspect-video rounded-lg md:rounded-xl overflow-hidden shadow-sm">
                    <img src={backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="text-white" size={24} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-lg md:rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      {isUploading ? <Loader2 className="animate-spin" size={24} /> : <Upload size={24} />}
                    </div>
                    <p className="text-xs md:text-sm font-bold text-slate-600">Click to upload background image</p>
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
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Direct URL (Optional)</label>
                <input
                  type="url"
                  value={backgroundImage}
                  onChange={(e) => setBackgroundImage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-medium"
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20"
            >
              {initialData ? "Update" : "Create"} Hero Slide
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
