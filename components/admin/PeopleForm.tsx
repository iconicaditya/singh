"use client";

import { motion } from "framer-motion";
import { Upload, X, User, Loader2, Plus, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import dynamic from 'next/dynamic';
import imageCompression from "browser-image-compression";
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const professionalColors = [
  '#000000', '#FFFFFF', '#FF0000', '#0000FF', '#008000', '#FFFF00', '#FFA500', '#800080', '#808080', '#FFC0CB', '#000080', '#008080', '#800000', '#808000', '#00FFFF', '#FF00FF', '#A52A2A', '#D3D3D3', '#A9A9A9', '#708090', '#C0C0C0', '#FFD700', '#F5F5DC', '#FF7F50', '#40E0D0', '#4B0082', '#EE82EE', '#D2691E', '#4682B4', '#4169E1'
];

const modules = {
  toolbar: {
    container: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': professionalColors }, { 'background': professionalColors }],
      [{ 'align': '' }, { 'align': 'center' }, { 'align': 'right' }, { 'align': 'justify' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  },
  history: { delay: 1000, maxStack: 50, userOnly: true }
};


const formats = ['bold', 'italic', 'underline', 'strike', 'color', 'background', 'list', 'align', 'link'];

const MAX_PROFILE_IMAGE_SIZE_BYTES = 500 * 1024;

const loadImageElement = (file: File) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

const canvasCompressToJpeg = async (file: File, maxWidthOrHeight: number, quality: number): Promise<File> => {
  const img = await loadImageElement(file);
  const longestSide = Math.max(img.width, img.height);
  const ratio = longestSide > maxWidthOrHeight ? maxWidthOrHeight / longestSide : 1;
  const width = Math.max(1, Math.round(img.width * ratio));
  const height = Math.max(1, Math.round(img.height * ratio));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas context unavailable");
  }

  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Failed to generate compressed image"));
      },
      "image/jpeg",
      quality
    );
  });

  const baseName = file.name.replace(/\.[^.]+$/, "");
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
};

const getPeopleProfileUploadFile = async (file: File): Promise<File> => {
  if (file.size <= MAX_PROFILE_IMAGE_SIZE_BYTES) {
    return file;
  }

  const attempts = [
    { maxWidthOrHeight: 2048, quality: 0.88 },
    { maxWidthOrHeight: 1600, quality: 0.8 },
    { maxWidthOrHeight: 1280, quality: 0.72 },
    { maxWidthOrHeight: 1024, quality: 0.64 },
    { maxWidthOrHeight: 768, quality: 0.56 },
    { maxWidthOrHeight: 640, quality: 0.48 },
    { maxWidthOrHeight: 512, quality: 0.4 },
    { maxWidthOrHeight: 384, quality: 0.32 },
    { maxWidthOrHeight: 256, quality: 0.24 },
    { maxWidthOrHeight: 160, quality: 0.16 },
  ];

  let current = file;

  for (const attempt of attempts) {
    try {
      current = await imageCompression(current, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: attempt.maxWidthOrHeight,
        useWebWorker: true,
        initialQuality: attempt.quality,
        maxIteration: 20,
        fileType: "image/jpeg",
      });
    } catch {
      current = await canvasCompressToJpeg(current, attempt.maxWidthOrHeight, attempt.quality);
    }

    if (current.size <= MAX_PROFILE_IMAGE_SIZE_BYTES) {
      return current;
    }
  }

  const finalAttempt = await canvasCompressToJpeg(current, 120, 0.1);
  if (finalAttempt.size <= MAX_PROFILE_IMAGE_SIZE_BYTES) {
    return finalAttempt;
  }

  throw new Error("Unable to compress image to 500KB");
};

interface PeopleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
}

export default function PeopleForm({ isOpen, onClose, onSuccess, initialData }: PeopleFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(initialData?.profileImage || "");
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [roleDesignation, setRoleDesignation] = useState(initialData?.roleDesignation || "");
  const [nationality, setNationality] = useState(initialData?.nationality || "");
  const [labId, setLabId] = useState(initialData?.labId || "");
  
  // Social Media Links (Optional)
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedinUrl || "");
  const [twitterUrl, setTwitterUrl] = useState(initialData?.twitterUrl || "");
  const [facebookUrl, setFacebookUrl] = useState(initialData?.facebookUrl || "");
  const [instagramUrl, setInstagramUrl] = useState(initialData?.instagramUrl || "");
  
  // Professor fields
  const [educationBackground, setEducationBackground] = useState(initialData?.educationBackground || "");
  const [pastTeachingBackground, setPastTeachingBackground] = useState(initialData?.pastTeachingBackground || "");
  const [publications, setPublications] = useState<any[]>(initialData?.publications || []);
  const [cvUrl, setCvUrl] = useState(initialData?.cvUrl || "");
  const [cvLinks, setCvLinks] = useState<any[]>(initialData?.cvLinks || []);
  
  // Student fields
  const [graduationYears, setGraduationYears] = useState<string[]>(initialData?.graduationYears || []);
  const [isGraduationYearOpen, setIsGraduationYearOpen] = useState(false);
  const [newGraduationYear, setNewGraduationYear] = useState("");
  const [availableGraduationYears, setAvailableGraduationYears] = useState([
    "Class of 2024",
    "Class of 2025",
    "Class of 2026",
    "Class of 2027",
    "Class of 2028",
    "Class of 2029",
    "Class of 2030"
  ]);
  const [researchTopic, setResearchTopic] = useState(initialData?.researchTopic || "");
  const [conferencePresentation, setConferencePresentation] = useState(initialData?.conferencePresentation || "");
  

  
  // Temp input states
  const [pubTitle, setPubTitle] = useState("");
  const [pubLink, setPubLink] = useState("");
  const [cvLinkUrl, setCvLinkUrl] = useState(() => {
    // Handle both old cvLinks format (array) and new cvLink format (string)
    if (initialData?.cvLinks && initialData.cvLinks.length > 0) {
      return initialData.cvLinks[0]?.link || "";
    }
    return initialData?.cvLink || "";
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form fields when initialData changes (for edit mode)
  useEffect(() => {
    if (isOpen && initialData) {
      setProfileImage(initialData.profileImage || "");
      setFullName(initialData.fullName || "");
      setRoleDesignation(initialData.roleDesignation || "");
      setNationality(initialData.nationality || "");
      setLabId(initialData.labId || "");
      setLinkedinUrl(initialData.linkedinUrl || "");
      setTwitterUrl(initialData.twitterUrl || "");
      setFacebookUrl(initialData.facebookUrl || "");
      setInstagramUrl(initialData.instagramUrl || "");
      setEducationBackground(initialData.educationBackground || "");
      setPastTeachingBackground(initialData.pastTeachingBackground || "");
      setPublications(initialData.publications || []);
      setCvUrl(initialData.cvUrl || "");
      setCvLinks(initialData.cvLinks || []);
      setGraduationYears(initialData.graduationYears || []);
      setResearchTopic(initialData.researchTopic || "");
      setConferencePresentation(initialData.conferencePresentation || "");
      
      // Handle CV link URL
      if (initialData.cvLinks && initialData.cvLinks.length > 0) {
        setCvLinkUrl(initialData.cvLinks[0]?.link || "");
      } else {
        setCvLinkUrl(initialData.cvLink || "");
      }
    } else if (isOpen && !initialData) {
      // Reset form for new entry
      setProfileImage("");
      setFullName("");
      setRoleDesignation("");
      setNationality("");
      setLabId("");
      setLinkedinUrl("");
      setTwitterUrl("");
      setFacebookUrl("");
      setInstagramUrl("");
      setEducationBackground("");
      setPastTeachingBackground("");
      setPublications([]);
      setCvUrl("");
      setCvLinks([]);
      setGraduationYears([]);
      setResearchTopic("");
      setConferencePresentation("");
      setCvLinkUrl("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const fileToUpload = await getPeopleProfileUploadFile(file);
      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setProfileImage(data.secure_url);
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('📤 Uploading CV:', file.name, 'Size:', file.size);
      const res = await fetch('/api/upload?folder=people', {
        method: 'POST',
        body: formData,
      });

      console.log('📊 Response status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('❌ Upload failed with status', res.status, ':', errorText);
        alert(`Upload failed: ${res.status} ${res.statusText}`);
        setIsUploading(false);
        return;
      }

      const data = await res.json();
      console.log('📦 Response data:', data);
      
      if (data.secure_url) {
        setCvUrl(data.secure_url);
        console.log('✅ CV uploaded successfully:', data.secure_url);
      } else if (data.error) {
        console.error('❌ API error:', data.error);
        alert('Upload failed: ' + data.error);
      } else {
        console.error('❌ Unexpected response:', data);
        alert('Upload failed: Empty response');
      }
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert('Failed to upload CV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const addPublication = () => {
    if (pubLink) {
      setPublications([...publications, { link: pubLink }]);
      setPubLink("");
    }
  };

  const removePublication = (idx: number) => {
    setPublications(publications.filter((_, i) => i !== idx));
  };

  const addGraduationYear = () => {
    if (newGraduationYear.trim()) {
      const yearToAdd = newGraduationYear.trim();
      if (!availableGraduationYears.includes(yearToAdd)) {
        setAvailableGraduationYears([...availableGraduationYears, yearToAdd]);
      }
      setGraduationYears([yearToAdd]);
      setNewGraduationYear("");
    }
  };

  const selectGraduationYear = (year: string) => {
    setGraduationYears([year]);
    setIsGraduationYearOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profileImage || !fullName || !roleDesignation) {
      alert("Profile photo, full name, and role are required!");
      return;
    }

    const data: any = {
      fullName,
      roleDesignation,
      profileImage,
      nationality,
      labId,
      linkedinUrl,
      twitterUrl,
      facebookUrl,
      instagramUrl,
    };

    if (roleDesignation === "Professor") {
      data.educationBackground = educationBackground;
      data.pastTeachingBackground = pastTeachingBackground;
      data.publications = publications;
      data.cvUrl = cvUrl;
      // Store single CV link in cvLinks format for backend compatibility
      data.cvLinks = cvLinkUrl ? [{ link: cvLinkUrl }] : [];
    } else {
      data.graduationYears = graduationYears;
      data.researchTopic = researchTopic;
      data.educationBackground = educationBackground;
      data.publications = publications;
      data.conferencePresentation = conferencePresentation;
      data.cvUrl = cvUrl;
      data.cvLinks = cvLinkUrl ? [{ link: cvLinkUrl }] : [];
    }

    try {
      const url = initialData ? `/api/people?id=${initialData.id}` : "/api/people";
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-md p-2 md:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl my-8 flex flex-col max-h-[95vh]"
      >
        {/* Header */}
        <div className="p-6 md:p-10 border-b border-slate-100 flex justify-between items-start sticky top-0 z-10 bg-gradient-to-br from-white via-white to-slate-50/50">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {initialData ? "Edit Profile" : "Add New Person"}
            </h2>
            <p className="text-slate-500 text-sm font-medium mt-2">Complete profile information for lab members</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8 overflow-y-auto flex-1">
          
          {/* SECTION 1: BASIC INFORMATION */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <div className="mb-6 pb-4 border-b-2 border-blue-100">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider">Basic Information</h3>
            </div>

            {/* Profile Photo Upload */}
            <div className="flex flex-col items-center gap-4 mb-8 p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200">
              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center w-40 h-40 rounded-full border-3 border-dashed ${isUploading ? 'border-amber-400 bg-amber-50' : 'border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50/50'} cursor-pointer transition-all group shadow-sm ${isUploading ? 'opacity-75' : ''}`}
              >
                {profileImage && !isUploading ? (
                  <div className="relative w-full h-full rounded-full overflow-hidden">
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Upload className="text-white" size={28} />
                    </div>
                  </div>
                ) : (
                  <>
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin">
                          <Loader2 className="text-amber-600" size={36} />
                        </div>
                        <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest mt-2">Processing...</p>
                      </div>
                    ) : (
                      <>
                        <User size={40} className="text-slate-400" />
                        <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mt-2">Upload Photo</p>
                      </>
                    )}
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                  disabled={isUploading}
                />
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Profile Photo is Mandatory</p>
            </div>

            {/* Full Name */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-black uppercase tracking-widest text-slate-600">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-5 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                placeholder="Dr. John Doe"
              />
            </div>

            {/* Role / Designation */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-600">Role / Designation *</label>
              <select
                value={roleDesignation}
                onChange={(e) => setRoleDesignation(e.target.value)}
                required
                className="w-full px-5 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 appearance-none"
              >
                <option value="">Select a role...</option>
                <option value="Professor">Professor</option>
                <option value="Graduate students">Graduate students</option>
                <option value="Undergraduate students">Undergraduate students</option>
              </select>
            </div>
          </motion.div>

          {/* SECTION 2: NATIONALITY (Common) */}
          {roleDesignation && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="space-y-2 mb-6">
                <label className="text-xs font-black uppercase tracking-widest text-slate-600">Nationality</label>
                <input
                  type="text"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter nationality"
                />
              </div>

              {/* Lab ID */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-600">Lab ID</label>
                <input
                  type="text"
                  value={labId}
                  onChange={(e) => setLabId(e.target.value)}
                  className="w-full px-5 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                  placeholder="Enter lab ID"
                />
              </div>
            </motion.div>
          )}

          {/* SECTION 2B: SOCIAL MEDIA LINKS (Optional - Common) */}
          {roleDesignation && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <div className="mb-4 pb-3">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-600 mb-4">Social Media Links [Optional]</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* LinkedIn */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                    </svg>
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm placeholder:text-slate-400"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                {/* Twitter */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7a10.6 10.6 0 01-9.5 5M23 3v0"/>
                    </svg>
                    Twitter
                  </label>
                  <input
                    type="url"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 transition-all outline-none text-sm placeholder:text-slate-400"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>

                {/* Facebook */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </label>
                  <input
                    type="url"
                    value={facebookUrl}
                    onChange={(e) => setFacebookUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-700/20 focus:border-blue-700 transition-all outline-none text-sm placeholder:text-slate-400"
                    placeholder="https://facebook.com/yourprofile"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/>
                    </svg>
                    Instagram
                  </label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-lg focus:ring-4 focus:ring-pink-500/20 focus:border-pink-500 transition-all outline-none text-sm placeholder:text-slate-400"
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* SECTION 3: PROFESSOR FIELDS */}
          {roleDesignation === "Professor" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="mb-6 pb-4 border-b-2 border-amber-100">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  Professor Information
                </h3>
              </div>

              <div className="space-y-6">
                {/* Education Background */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-600">Education Background</label>
                  <RichTextEditor
                    value={educationBackground}
                    onChange={setEducationBackground}
                    placeholder="Enter educational qualifications, degrees, institutions..."
                  />
                </div>

                {/* Past Teaching Background */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-600">Past Teaching Background</label>
                  <RichTextEditor
                    value={pastTeachingBackground}
                    onChange={setPastTeachingBackground}
                    placeholder="Enter teaching experience, courses taught, institutions..."
                  />
                </div>

                {/* Publications */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-600">Publications</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={pubLink}
                      onChange={(e) => setPubLink(e.target.value)}
                      placeholder="Enter publication link / DOI / URL"
                      className="flex-1 px-4 py-3.5 bg-white border-2 border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-sm"
                    />
                    <button type="button" onClick={addPublication} disabled={!pubLink} className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-2 font-bold text-sm whitespace-nowrap">
                      <Plus size={18} />
                      Add Link
                    </button>
                  </div>
                  <div className="space-y-2">
                    {publications.map((pub, idx) => (
                      <motion.div key={idx} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl border border-blue-200 group hover:border-blue-300 transition-all">
                        <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate font-medium">
                          {pub.link}
                        </a>
                        <button type="button" onClick={() => removePublication(idx)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all flex-shrink-0 opacity-0 group-hover:opacity-100 ml-2">
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* CV Upload & Links */}
                <div className="grid grid-cols-2 gap-6">
                  {/* CV Upload */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      CV Upload (PDF)
                    </label>
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => {
                        const cvInput = document.createElement('input');
                        cvInput.type = 'file';
                        cvInput.accept = '.pdf,.doc,.docx';
                        cvInput.onchange = (e: any) => handleCVUpload(e);
                        cvInput.click();
                      }}
                      className="w-full px-6 py-4 bg-gradient-to-br from-blue-50 to-blue-50/50 border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-100/30 rounded-2xl transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer disabled:opacity-50 disabled:border-amber-300 disabled:bg-amber-50/30"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin">
                            <div className="w-6 h-6 border-3 border-blue-300 border-t-blue-600 rounded-full"></div>
                          </div>
                          <div className="text-center">
                            <p className="font-black text-sm text-amber-900">Processing Upload...</p>
                            <p className="text-xs text-amber-700 mt-1">Please wait while your CV is being uploaded</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="p-3 bg-blue-500/10 group-hover:bg-blue-500/20 rounded-full transition-all">
                            <Upload size={24} className="text-blue-600" />
                          </div>
                          <div className="text-center">
                            <p className="font-black text-sm text-slate-900">Drop or Click to Upload</p>
                            <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX</p>
                          </div>
                        </>
                      )}
                    </button>
                    {cvUrl && !isUploading && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-50/50 border-2 border-green-300 rounded-xl flex items-center justify-between group hover:border-green-400 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-green-900">CV Uploaded</p>
                            <p className="text-xs text-green-700 mt-0.5">Ready to submit</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCvUrl('')}
                          className="p-2 hover:bg-green-200/50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X size={18} className="text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* CV Link */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      CV Link (URL)
                    </label>
                    <input
                      type="url"
                      value={cvLinkUrl}
                      onChange={(e) => setCvLinkUrl(e.target.value)}
                      placeholder="https://example.com/cv or your CV link"
                      className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-sm placeholder:text-slate-400"
                    />
                    {cvLinkUrl && (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 border-2 border-blue-300 rounded-xl flex items-center justify-between group hover:border-blue-400 transition-all">
                        <a 
                          href={cvLinkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l6-6m0 0l-6 6" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-blue-900 truncate">CV Link Added</p>
                            <p className="text-xs text-blue-700 truncate mt-0.5">{cvLinkUrl}</p>
                          </div>
                        </a>
                        <button
                          type="button"
                          onClick={() => setCvLinkUrl('')}
                          className="p-2 hover:bg-blue-200/50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2"
                        >
                          <X size={18} className="text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SECTION 4: STUDENT FIELDS */}
          {(roleDesignation === "Graduate students" || roleDesignation === "Undergraduate students") && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="mb-6 pb-4 border-b-2 border-green-100">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  {roleDesignation === "Graduate students" ? "Graduate Student Information" : "Undergraduate Student Information"}
                </h3>
              </div>

              <div className="space-y-6">
                {/* Graduation Year / Class */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-600">Graduation Year / Class</label>
                  
                  {/* Custom collapsible dropdown */}
                  <div className="relative">
                    {/* Selected value display with controls */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsGraduationYearOpen(!isGraduationYearOpen)}
                        className="flex-1 flex items-center justify-between px-4 py-3.5 bg-white border-2 border-blue-400 rounded-2xl font-black text-slate-900 hover:border-blue-500 transition-all"
                      >
                        <span className="text-sm">
                          {graduationYears.length > 0 ? graduationYears[0] : "SELECT GRADUATION YEAR"}
                        </span>
                        <span className="text-blue-500 group-hover:text-blue-700">
                          {isGraduationYearOpen ? "▲" : "▼"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsGraduationYearOpen(true)}
                        className="px-3 py-3.5 rounded-full bg-slate-100 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all flex-shrink-0"
                        title="Add graduation year"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    
                    {/* Dropdown menu */}
                    {isGraduationYearOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-slate-200 rounded-2xl shadow-lg z-20"
                      >
                        {/* Add new year input */}
                        <div className="p-3 border-b border-slate-200">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newGraduationYear}
                              onChange={(e) => setNewGraduationYear(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addGraduationYear()}
                              placeholder="Add custom graduation year..."
                              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none text-sm"
                            />
                            <button
                              type="button"
                              onClick={addGraduationYear}
                              disabled={!newGraduationYear.trim()}
                              className="px-3 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-all text-sm font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        {/* Options list */}
                        <div className="max-h-60 overflow-y-auto">
                          <p className="px-4 py-2 text-xs text-slate-400 font-medium uppercase tracking-wider">Select graduation year</p>
                          <div className="space-y-1 px-2 py-2">
                            {availableGraduationYears.map((year) => (
                              <button
                                key={year}
                                type="button"
                                onClick={() => selectGraduationYear(year)}
                                className={`w-full text-left px-4 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-between group ${
                                  graduationYears.includes(year)
                                    ? "bg-blue-100 text-blue-600 border border-blue-300"
                                    : "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200"
                                }`}
                              >
                                {year}
                                {graduationYears.includes(year) && (
                                  <Trash2 
                                    size={18} 
                                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setGraduationYears([]);
                                    }} 
                                  />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Research Topic */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-600">Research Topic</label>
                  <input
                    type="text"
                    value={researchTopic}
                    onChange={(e) => setResearchTopic(e.target.value)}
                    className="w-full px-5 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-slate-900 placeholder:text-slate-400"
                    placeholder="Enter research topic or area of focus"
                  />
                </div>

                {/* Education Background */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-600">Education Background</label>
                  <RichTextEditor
                    value={educationBackground}
                    onChange={setEducationBackground}
                    placeholder="Enter educational background, schools, degrees..."
                  />
                </div>

                {/* Publications */}
                <div className="space-y-3">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-600">Publications</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={pubLink}
                      onChange={(e) => setPubLink(e.target.value)}
                      placeholder="Enter publication link / DOI / URL"
                      className="flex-1 px-4 py-3.5 bg-white border-2 border-slate-200 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-sm"
                    />
                    <button type="button" onClick={addPublication} disabled={!pubLink} className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg transition-all flex items-center gap-2 font-bold text-sm whitespace-nowrap">
                      <Plus size={18} />
                      Add Link
                    </button>
                  </div>
                  <div className="space-y-2">
                    {publications.map((pub, idx) => (
                      <motion.div key={idx} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-xl border border-blue-200 group hover:border-blue-300 transition-all">
                        <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700 hover:underline truncate font-medium">
                          {pub.link}
                        </a>
                        <button type="button" onClick={() => removePublication(idx)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-all flex-shrink-0 opacity-0 group-hover:opacity-100 ml-2">
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Conference Presentations */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-600">Conference Presentations / Proceedings</label>
                  <RichTextEditor
                    value={conferencePresentation}
                    onChange={setConferencePresentation}
                    placeholder="Enter conference presentations, proceedings, workshops..."
                  />
                </div>

                {/* CV Upload & Links */}
                <div className="grid grid-cols-2 gap-6">
                  {/* CV Upload */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      CV Upload (PDF)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const cvInput = document.createElement('input');
                        cvInput.type = 'file';
                        cvInput.accept = '.pdf,.doc,.docx';
                        cvInput.onchange = (e: any) => handleCVUpload(e);
                        cvInput.click();
                      }}
                      className="w-full px-6 py-4 bg-gradient-to-br from-green-50 to-green-50/50 border-2 border-dashed border-green-300 hover:border-green-500 hover:bg-green-100/30 rounded-2xl transition-all flex flex-col items-center justify-center gap-3 group cursor-pointer"
                    >
                      <div className="p-3 bg-green-500/10 group-hover:bg-green-500/20 rounded-full transition-all">
                        <Upload size={24} className="text-green-600" />
                      </div>
                      <div className="text-center">
                        <p className="font-black text-sm text-slate-900">Drop or Click to Upload</p>
                        <p className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX</p>
                      </div>
                    </button>
                    {cvUrl && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-50/50 border-2 border-green-300 rounded-xl flex items-center justify-between group hover:border-green-400 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-sm text-green-900">CV Uploaded</p>
                            <p className="text-xs text-green-700 mt-0.5">Ready to submit</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setCvUrl('')}
                          className="p-2 hover:bg-green-200/50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <X size={18} className="text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* CV Link */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      CV Link (URL)
                    </label>
                    <input
                      type="url"
                      value={cvLinkUrl}
                      onChange={(e) => setCvLinkUrl(e.target.value)}
                      placeholder="https://example.com/cv or your CV link"
                      className="w-full px-6 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none font-medium text-sm placeholder:text-slate-400"
                    />
                    {cvLinkUrl && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-50/50 border-2 border-green-300 rounded-xl flex items-center justify-between group hover:border-green-400 transition-all">
                        <a 
                          href={cvLinkUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 flex-1 min-w-0"
                        >
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4m-4-6l6-6m0 0l-6 6" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-green-900 truncate">CV Link Added</p>
                            <p className="text-xs text-green-700 truncate mt-0.5">{cvLinkUrl}</p>
                          </div>
                        </a>
                        <button
                          type="button"
                          onClick={() => setCvLinkUrl('')}
                          className="p-2 hover:bg-green-200/50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0 ml-2"
                        >
                          <X size={18} className="text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30 active:scale-95"
            >
              {initialData ? "Update Profile" : "Create Profile"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Rich Text Editor Component
function RichTextEditor({ value, onChange, placeholder }: { value: string; onChange: (val: string) => void; placeholder: string }) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="space-y-2">
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white rounded-lg overflow-hidden"
        style={{
          height: '350px',
          display: 'flex',
          flexDirection: 'column'
        }}
      />
      <style>{`
        .ql-container {
          flex: 1;
          font-size: 14px;
        }
        .ql-editor {
          min-height: 300px;
          padding: 12px;
        }
      `}</style>
    </div>
  );
}

// Toolbar Button Component - Not needed with ReactQuill
function ToolbarButton({
  onClick,
  active,
  title,
  icon,
}: {
  onClick: () => void;
  active: boolean;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-all ${
        active
          ? "bg-blue-500 text-white"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-300"
      }`}
    >
      {icon}
    </button>
  );
}
