"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, FileText, Loader2 } from "lucide-react";

type TeamMember = {
  name?: string;
  role?: string;
};

type ContentSection = {
  title?: string;
  content?: string;
  description?: string;
  text?: string;
  body?: string;
  html?: string;
  image?: string;
  imageUrl?: string;
  sectionImage?: string;
  titleImage?: string;
  url?: string;
  images?: string[];
};

type ProjectObjective = {
  title?: string;
  description?: string;
};

type Project = {
  id: number;
  title: string;
  subtitle: string | null;
  category: string;
  tags: string | null;
  teamMembers: TeamMember[];
  location: string | null;
  description: string;
  status: string;
  imageUrl: string | null;
  aboutProject: string | null;
  projectObjectives: ProjectObjective[];
  contentSections: ContentSection[];
  startDate: string | null;
  endDate: string | null;
  attachedResearchIds: Array<string | number>;
  link: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

const pretty = (value?: string | null) => value || "—";

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString();
};

const parseTags = (tags?: string | null) => {
  if (!tags) return [];
  return tags
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getContentImage = (section?: ContentSection) => {
  if (!section) return "";

  return (
    section.image ||
    section.imageUrl ||
    section.sectionImage ||
    section.titleImage ||
    section.url ||
    ""
  ).trim();
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const plainTextToHtml = (value: string) =>
  escapeHtml(value)
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br />");

const getSectionContentHtml = (section?: ContentSection) => {
  if (!section) return "";

  const candidates = [section.content, section.html, section.description, section.text, section.body];
  const firstText = candidates.find((value) => typeof value === "string" && value.trim().length > 0);

  if (firstText) {
    const trimmed = firstText.trim();
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
    return looksLikeHtml ? trimmed : `<p>${plainTextToHtml(trimmed)}</p>`;
  }

  const contentAsAny = (section as any)?.content;
  if (contentAsAny && typeof contentAsAny === "object" && Array.isArray(contentAsAny.ops)) {
    const deltaText = contentAsAny.ops
      .map((operation: any) => (typeof operation?.insert === "string" ? operation.insert : ""))
      .join("")
      .trim();

    return deltaText ? `<p>${plainTextToHtml(deltaText)}</p>` : "";
  }

  return "";
};

const getContentImages = (section?: ContentSection) => {
  if (!section) return [] as string[];

  const fromArray = Array.isArray(section.images)
    ? section.images.filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    : [];

  const single = getContentImage(section);
  const merged = single ? [single, ...fromArray] : fromArray;

  return Array.from(new Set(merged));
};

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!params?.id) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/projects/${params.id}`, { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load project");
        }

        setProject(data);
      } catch (fetchError: any) {
        setError(fetchError?.message || "Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params?.id]);

  const tags = useMemo(() => parseTags(project?.tags), [project?.tags]);
  const validObjectives = useMemo(() => {
    if (!project?.projectObjectives || !Array.isArray(project.projectObjectives)) return [];

    return project.projectObjectives.filter((objective: any) => {
      if (typeof objective === "string") return objective.trim().length > 0;

      if (objective && typeof objective === "object") {
        const title = typeof objective.title === "string" ? objective.title.trim() : "";
        const description = typeof objective.description === "string" ? objective.description.trim() : "";
        return title.length > 0 || description.length > 0;
      }

      return false;
    });
  }, [project?.projectObjectives]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-sm text-slate-600">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center shadow-sm">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">Project not found</h1>
          <p className="text-slate-600 mb-6 break-words">{error || "Unable to load this project."}</p>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative">
        {project.imageUrl ? (
          <div className="absolute inset-0">
            <img src={project.imageUrl} alt={project.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-slate-950/70" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium mb-8"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>

          <div className="max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white break-words">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="mt-4 text-base sm:text-lg lg:text-xl text-white/90 break-words">{project.subtitle}</p>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6">
              {project.contentSections.length > 0 ? (
                <div className="space-y-4 sm:space-y-5">
                  {project.contentSections.map((section, index) => {
                    const contentTitle = section?.title?.trim() || "";
                    const hasTitle = contentTitle.length > 0;
                    const contentImageAlt = hasTitle ? contentTitle : project.title;
                    const contentHtml = getSectionContentHtml(section);
                    const contentImages = getContentImages(section);

                    return (
                      <div key={index}>
                        {contentImages.length > 0 && (
                          <div
                            className={`mb-4 sm:mb-5 ${
                              contentImages.length === 1 ? "block" : "grid grid-cols-2 gap-3 sm:gap-4"
                            }`}
                          >
                            {contentImages.map((imageUrl, imageIndex) => (
                              <img
                                key={`${index}-${imageIndex}`}
                                src={imageUrl}
                                alt={contentImageAlt}
                                className={`w-full ${
                                  contentImages.length === 1
                                    ? "h-auto object-contain"
                                    : "aspect-video object-cover"
                                }`}
                              />
                            ))}
                          </div>
                        )}
                        <div className="space-y-4 sm:space-y-5">
                          {hasTitle && (
                            <div className="flex items-center gap-3 sm:gap-4">
                              <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-blue-100 text-blue-600 shrink-0">
                                <FileText size={22} />
                              </span>
                              <h3 className="text-[16px] font-bold leading-normal text-slate-900 break-words">
                                {contentTitle}
                              </h3>
                            </div>
                          )}

                          {contentHtml ? (
                            <div
                              className="project-content-rich text-slate-700 leading-relaxed break-words"
                              dangerouslySetInnerHTML={{ __html: contentHtml }}
                            />
                          ) : (
                            <p className="text-slate-700">—</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-700">—</p>
              )}
            </div>

            {validObjectives.length > 0 && (
              <div className="bg-white rounded-2xl p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-4">Objectives</h2>
                <div className="space-y-3">
                  {validObjectives.map((objective, index) => (
                    <div key={index} className="rounded-xl p-3 sm:p-4 bg-slate-50">
                      <p className="font-medium text-slate-900 break-words">{objective?.title || String(objective || "—")}</p>
                      {objective?.description && (
                        <p className="mt-2 text-slate-700 break-words">{objective.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 self-start">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Project Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 text-sm">
                <div><span className="font-semibold text-slate-800">ID:</span> <span className="text-slate-700">{project.id}</span></div>
                <div><span className="font-semibold text-slate-800">Category:</span> <span className="text-slate-700 break-words">{pretty(project.category)}</span></div>
                <div><span className="font-semibold text-slate-800">Status:</span> <span className="text-slate-700 break-words">{pretty(project.status)}</span></div>
                <div><span className="font-semibold text-slate-800">Location:</span> <span className="text-slate-700 break-words">{pretty(project.location)}</span></div>
                <div><span className="font-semibold text-slate-800">Start Date:</span> <span className="text-slate-700">{formatDate(project.startDate)}</span></div>
                <div><span className="font-semibold text-slate-800">End Date:</span> <span className="text-slate-700">{formatDate(project.endDate)}</span></div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Tags</h2>
              {tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs sm:text-sm bg-slate-100 text-slate-800 rounded-full break-words">
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-700">—</p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Team Members</h2>
              {project.teamMembers.length > 0 ? (
                <ul className="space-y-2">
                  {project.teamMembers.map((member, index) => (
                    <li key={index} className="text-slate-700 border border-slate-200 rounded-xl p-3">
                      <p className="font-medium break-words">{pretty(member?.name)}</p>
                      <p className="text-sm text-slate-600 break-words">{pretty(member?.role)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-700">—</p>
              )}
            </div>

          </aside>
        </div>
      </section>

      <style jsx global>{`
        .project-content-rich p {
          margin-bottom: 1.1rem;
          font-size: 14px;
          line-height: 1.65;
          color: #23375b;
        }
        .project-content-rich strong,
        .project-content-rich b {
          font-weight: 700;
          color: inherit;
        }
        .project-content-rich em,
        .project-content-rich i {
          font-style: italic;
        }
        .project-content-rich ul,
        .project-content-rich ol {
          margin: 0.5rem 0 1.25rem;
          padding-left: 1.35rem;
        }
        .project-content-rich ul {
          list-style-type: disc;
        }
        .project-content-rich ol {
          list-style-type: decimal;
        }
        .project-content-rich li {
          margin-bottom: 0.65rem;
          font-size: 14px;
          line-height: 1.55;
          color: #23375b;
          display: list-item;
        }
        .project-content-rich li[data-list="bullet"] {
          list-style-type: disc;
        }
        .project-content-rich li[data-list="ordered"] {
          list-style-type: decimal;
        }
        .project-content-rich ul li::marker,
        .project-content-rich ol li::marker {
          color: #c7d2e3;
        }
      `}</style>
    </main>
  );
}
