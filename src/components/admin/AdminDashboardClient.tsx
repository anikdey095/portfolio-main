"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Settings,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  FolderPlus,
  FlaskConical,
  User,
  ExternalLink,
  Layers,
  Mail,
  LogOut,
  Pencil,
  Code2,
  GitBranch,
  X,
  BarChart3,
  Image as ImageIcon,
} from "lucide-react";
import { AdminAnalyticsPanel } from "./AdminAnalyticsPanel";

type AdminTab =
  | "profile"
  | "projects"
  | "skills"
  | "journey"
  | "research"
  | "messages"
  | "analytics";

const EMPTY_PROJECT = {
  id: "",
  title: "",
  slug: "",
  tagline: "",
  summary: "",
  problem: "",
  approach: "",
  challenges: "",
  category: "Deep Learning",
  domain: "Applied AI",
  status: "Completed",
  stack: "Python, PyTorch, OpenCV",
  githubUrl: "https://github.com/anikdey095",
  demoUrl: "",
  imageUrl: "",
  galleryImages: [] as string[],
  keyArchitecture: "",
  featured: true,
  featuredOrder: 1,
};

const EMPTY_RESEARCH = {
  id: "",
  title: "",
  tagline: "",
  domain: "Computer Vision",
  status: "Exploring",
  targetOutcome: "Academic Thesis & Proposal",
  problem: "",
  researchQuestion: "",
  proposedDirection: "",
  tags: "Computer Vision, Deep Learning",
};

export function AdminDashboardClient() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("profile");
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [newProject, setNewProject] = useState(EMPTY_PROJECT);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [newResearch, setNewResearch] = useState(EMPTY_RESEARCH);
  const [editingResearchId, setEditingResearchId] = useState<string | null>(null);

  const triggerAlert = (type: "success" | "error", message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const redirectToLogin = useCallback(() => {
    router.replace("/admin/login");
    router.refresh();
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin", {
        credentials: "same-origin",
        cache: "no-store",
      });
      if (res.status === 401) {
        redirectToLogin();
        return;
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [redirectToLogin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "LOGOUT" }),
      });
    } finally {
      redirectToLogin();
    }
  };

  const adminPost = async (action: string, payload: Record<string, unknown>) => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ action, payload }),
    });
    if (res.status === 401) {
      redirectToLogin();
      throw new Error("Unauthorized");
    }
    return res.json();
  };

  // Profile & Metrics
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await adminPost("UPDATE_PROFILE", {
        profile: data.profile,
        metrics: data.metrics,
      });
      if (result.success) {
        triggerAlert("success", result.message || "Profile & metrics saved!");
        fetchData();
      } else {
        triggerAlert("error", result.message || "Update failed.");
      }
    } catch {
      triggerAlert("error", "Failed to update profile.");
    }
  };

  // File Upload (Cloudinary: Photo, Resume, Project Cover/Gallery)
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: "avatar" | "resume" | "projectCover" | "projectGallery"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      try {
        const result = await adminPost("UPLOAD_FILE", {
          fileType,
          base64Data,
          slug: newProject.slug || newProject.title,
          projectId: editingProjectId || undefined,
        });
        if (result.success) {
          if (fileType === "projectCover" && result.secureUrl) {
            setNewProject((prev) => ({ ...prev, imageUrl: result.secureUrl }));
          } else if (fileType === "projectGallery" && result.secureUrl) {
            setNewProject((prev) => ({
              ...prev,
              galleryImages: [...(prev.galleryImages || []), result.secureUrl],
            }));
          }
          triggerAlert("success", result.message);
          if (fileType === "avatar" || fileType === "resume") {
            fetchData();
          }
        } else {
          triggerAlert("error", result.message || "Upload failed.");
        }
      } catch {
        triggerAlert("error", "Failed to upload file.");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Add or Update Project
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;

    const slug =
      newProject.slug.trim() ||
      newProject.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    try {
      const action = editingProjectId ? "UPDATE_PROJECT" : "ADD_PROJECT";
      const payload = editingProjectId
        ? { ...newProject, id: editingProjectId, slug }
        : { ...newProject, slug };

      const result = await adminPost(action, payload);
      if (result.success) {
        triggerAlert(
          "success",
          editingProjectId ? "Project updated!" : "New project added!"
        );
        setNewProject(EMPTY_PROJECT);
        setEditingProjectId(null);
        fetchData();
      } else {
        triggerAlert("error", result.message || "Failed to save project.");
      }
    } catch {
      triggerAlert("error", "Failed to save project.");
    }
  };

  const handleEditProject = (proj: any) => {
    setEditingProjectId(proj.id || proj.slug);
    setNewProject({
      id: proj.id || "",
      title: proj.title || "",
      slug: proj.slug || "",
      tagline: proj.tagline || "",
      summary: proj.summary || "",
      problem: proj.problem || "",
      approach: proj.approach || "",
      challenges: proj.challenges || "",
      category: proj.category || "Deep Learning",
      domain: proj.domain || "Applied AI",
      status: proj.status || "Completed",
      stack: Array.isArray(proj.stack) ? proj.stack.join(", ") : proj.stack || "",
      githubUrl: proj.githubUrl || "",
      demoUrl: proj.demoUrl || "",
      imageUrl: proj.imageUrl || "",
      galleryImages: Array.isArray(proj.galleryImages) ? proj.galleryImages : [],
      keyArchitecture: proj.keyArchitecture || "",
      featured: Boolean(proj.featured),
      featuredOrder: typeof proj.featuredOrder === "number" ? proj.featuredOrder : 99,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const result = await adminPost("DELETE_PROJECT", { id });
      if (result.success) {
        triggerAlert("success", "Project deleted!");
        fetchData();
      } else {
        triggerAlert("error", result.message || "Delete failed.");
      }
    } catch {
      triggerAlert("error", "Failed to delete project.");
    }
  };

  // Add or Update Research
  const handleSaveResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResearch.title.trim()) return;

    try {
      const action = editingResearchId ? "UPDATE_RESEARCH" : "ADD_RESEARCH";
      const payload = editingResearchId
        ? { ...newResearch, id: editingResearchId }
        : newResearch;
      const result = await adminPost(action, payload);
      if (result.success) {
        triggerAlert(
          "success",
          editingResearchId ? "Research updated!" : "Research agenda added!"
        );
        setNewResearch(EMPTY_RESEARCH);
        setEditingResearchId(null);
        fetchData();
      } else {
        triggerAlert("error", result.message || "Failed to save research.");
      }
    } catch {
      triggerAlert("error", "Failed to save research.");
    }
  };

  const handleEditResearch = (res: any) => {
    setEditingResearchId(res.id);
    setNewResearch({
      id: res.id || "",
      title: res.title || "",
      tagline: res.tagline || "",
      domain: res.domain || "Computer Vision",
      status: res.status || "Exploring",
      targetOutcome: res.targetOutcome || "",
      problem: res.problem || "",
      researchQuestion: res.researchQuestion || "",
      proposedDirection: res.proposedDirection || "",
      tags: Array.isArray(res.tags) ? res.tags.join(", ") : res.tags || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Save Skills
  const handleSaveSkills = async () => {
    try {
      const result = await adminPost("UPDATE_SKILLS", { skills: data.skills });
      if (result.success) {
        triggerAlert("success", "Skills saved & synced!");
        fetchData();
      } else {
        triggerAlert("error", result.message || "Failed to save skills.");
      }
    } catch {
      triggerAlert("error", "Failed to save skills.");
    }
  };

  // Save Journey
  const handleSaveJourney = async () => {
    try {
      const result = await adminPost("UPDATE_JOURNEY", {
        journey: data.journey,
      });
      if (result.success) {
        triggerAlert("success", "Journey milestones saved & synced!");
        fetchData();
      } else {
        triggerAlert("error", result.message || "Failed to save journey.");
      }
    } catch {
      triggerAlert("error", "Failed to save journey.");
    }
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex items-center justify-center font-mono text-sm">
        Loading Private Admin Studio...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 w-full">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Live Portfolio</span>
          </Link>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 text-xs font-mono text-red-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] flex items-center gap-3">
            <Settings className="w-8 h-8 text-[#0ea5e9]" />
            <span>Private Admin Studio</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Update profile, photo, resume PDF, metrics, projects, skills, journey timeline, research directions, and inbox messages.
          </p>
        </div>

        {/* Global Alert Notification */}
        {alert && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-center gap-2 text-xs font-mono ${
              alert.type === "success"
                ? "bg-emerald-950/40 border border-emerald-500/40 text-emerald-300"
                : "bg-red-950/40 border border-red-500/40 text-red-300"
            }`}
          >
            {alert.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{alert.message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[var(--border-subtle)] pb-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
              activeTab === "profile"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile &amp; Uploads</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
              activeTab === "projects"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Projects ({data.projects?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
              activeTab === "skills"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Skills ({data.skills?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("journey")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
              activeTab === "journey"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Journey ({data.journey?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("research")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
              activeTab === "research"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Research ({data.research?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("messages")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
              activeTab === "messages"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Messages ({data.messages?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all border ${
              activeTab === "analytics"
                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics</span>
          </button>
        </div>

        {/* Tab 1: Profile, Files & Metrics */}
        {activeTab === "profile" && (
          <div className="space-y-8 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    1-Click Profile Photo Upload
                  </h3>
                  <Upload className="w-4 h-4 text-cyan-400" />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Uploads to Cloudinary (`portfolio/profile`) and updates your Hero portrait in MongoDB.
                  {!data.integrations?.cloudinaryConfigured && (
                    <span className="block text-amber-400 mt-1 font-mono">
                      Requires CLOUDINARY_API_KEY in .env.local / Vercel.
                    </span>
                  )}
                </p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleFileUpload(e, "avatar")}
                  className="block w-full text-xs text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
                />
              </div>

              <div className="p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[var(--text-primary)]">
                    1-Click Resume PDF Upload
                  </h3>
                  <Upload className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Uploads PDF to Cloudinary (`portfolio/resume`) and updates all Resume links in MongoDB.
                  {!data.integrations?.cloudinaryConfigured && (
                    <span className="block text-amber-400 mt-1 font-mono">
                      Requires CLOUDINARY_API_KEY in .env.local / Vercel.
                    </span>
                  )}
                </p>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileUpload(e, "resume")}
                  className="block w-full text-xs text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-400 cursor-pointer"
                />
              </div>
            </div>

            <form
              onSubmit={handleSaveProfile}
              className="p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-6"
            >
              <h3 className="text-lg font-bold text-[var(--text-primary)] border-b border-[var(--border-subtle)] pb-3">
                Personal Information, Education &amp; Metrics
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Name
                  </label>
                  <input
                    type="text"
                    value={data.profile.name || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, name: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Title
                  </label>
                  <input
                    type="text"
                    value={data.profile.title || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, title: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Location
                  </label>
                  <input
                    type="text"
                    value={data.profile.location || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: { ...data.profile, location: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">
                  Subtitle / Positioning
                </label>
                <input
                  type="text"
                  value={data.profile.subtitle || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">
                  Full Bio
                </label>
                <textarea
                  rows={3}
                  value={data.profile.bio || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      profile: { ...data.profile, bio: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              {/* Education */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={data.profile.education?.degree || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          education: {
                            ...data.profile.education,
                            degree: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={data.profile.education?.institution || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          education: {
                            ...data.profile.education,
                            institution: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Expected Graduation
                  </label>
                  <input
                    type="text"
                    value={data.profile.education?.expectedGraduation || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          education: {
                            ...data.profile.education,
                            expectedGraduation: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Socials */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Email (Gmail)
                  </label>
                  <input
                    type="text"
                    value={data.profile.socials?.email || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          socials: {
                            ...data.profile.socials,
                            email: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={data.profile.socials?.linkedin || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          socials: {
                            ...data.profile.socials,
                            linkedin: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={data.profile.socials?.github || ""}
                    onChange={(e) =>
                      setData({
                        ...data,
                        profile: {
                          ...data.profile,
                          socials: {
                            ...data.profile.socials,
                            github: e.target.value,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Verified Metrics */}
              <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                    Verified Highlight Metrics ({data.metrics?.length || 0})
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setData({
                        ...data,
                        metrics: [
                          ...(data.metrics || []),
                          { value: "New", label: "Metric Label", detail: "" },
                        ],
                      })
                    }
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-[11px] font-mono text-cyan-300"
                  >
                    <Plus className="w-3 h-3" /> Add Metric
                  </button>
                </div>

                <div className="space-y-3">
                  {(data.metrics || []).map((m: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                    >
                      <input
                        type="text"
                        value={m.value || ""}
                        onChange={(e) => {
                          const updated = [...data.metrics];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          setData({ ...data, metrics: updated });
                        }}
                        placeholder="Value"
                        className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)]"
                      />
                      <input
                        type="text"
                        value={m.label || ""}
                        onChange={(e) => {
                          const updated = [...data.metrics];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setData({ ...data, metrics: updated });
                        }}
                        placeholder="Label"
                        className="sm:col-span-4 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                      />
                      <input
                        type="text"
                        value={m.detail || ""}
                        onChange={(e) => {
                          const updated = [...data.metrics];
                          updated[idx] = { ...updated[idx], detail: e.target.value };
                          setData({ ...data, metrics: updated });
                        }}
                        placeholder="Detail"
                        className="sm:col-span-5 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.metrics.filter(
                            (_: unknown, i: number) => i !== idx
                          );
                          setData({ ...data, metrics: updated });
                        }}
                        className="sm:col-span-1 p-1.5 rounded-lg border border-red-500/30 hover:bg-red-950/40 text-red-400 justify-self-end"
                        title="Remove Metric"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition-all"
              >
                Save All Profile &amp; Metric Changes
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Projects (Add / Edit / Delete) */}
        {activeTab === "projects" && (
          <div className="space-y-8 animate-in fade-in">
            <form
              onSubmit={handleSaveProject}
              className="p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 font-bold">
                  <FolderPlus className="w-4 h-4" />
                  <span>
                    {editingProjectId ? "Edit Existing Project" : "Add New Project"}
                  </span>
                </div>
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProjectId(null);
                      setNewProject(EMPTY_PROJECT);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) =>
                      setNewProject({ ...newProject, title: e.target.value })
                    }
                    placeholder="e.g. Vision-Language Multimodal Agent"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Category
                  </label>
                  <select
                    value={newProject.category}
                    onChange={(e) =>
                      setNewProject({ ...newProject, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Deep Learning">Deep Learning</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Computer Vision">Computer Vision</option>
                    <option value="Generative AI">Generative AI</option>
                    <option value="Applied Research">Applied Research</option>
                    <option value="Systems & Web">Systems &amp; Web</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={newProject.slug}
                    onChange={(e) =>
                      setNewProject({ ...newProject, slug: e.target.value })
                    }
                    placeholder="auto-generated-from-title"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Domain
                  </label>
                  <input
                    type="text"
                    value={newProject.domain}
                    onChange={(e) =>
                      setNewProject({ ...newProject, domain: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Status
                  </label>
                  <select
                    value={newProject.status}
                    onChange={(e) =>
                      setNewProject({ ...newProject, status: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Active Development">Active Development</option>
                    <option value="Research Direction">Research Direction</option>
                    <option value="Prototype">Prototype</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">
                  Tagline (One sentence)
                </label>
                <input
                  type="text"
                  value={newProject.tagline}
                  onChange={(e) =>
                    setNewProject({ ...newProject, tagline: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">
                  Summary / Description
                </label>
                <textarea
                  rows={2}
                  value={newProject.summary}
                  onChange={(e) =>
                    setNewProject({ ...newProject, summary: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Problem
                  </label>
                  <textarea
                    rows={2}
                    value={newProject.problem}
                    onChange={(e) =>
                      setNewProject({ ...newProject, problem: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Approach
                  </label>
                  <textarea
                    rows={2}
                    value={newProject.approach}
                    onChange={(e) =>
                      setNewProject({ ...newProject, approach: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Challenge &amp; Lesson
                  </label>
                  <textarea
                    rows={2}
                    value={newProject.challenges}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        challenges: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newProject.stack}
                    onChange={(e) =>
                      setNewProject({ ...newProject, stack: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={newProject.githubUrl}
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        githubUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={newProject.demoUrl}
                    onChange={(e) =>
                      setNewProject({ ...newProject, demoUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--border-subtle)]">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[var(--text-secondary)] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Project Cover Image (Cloudinary or URL)</span>
                  </label>
                  <input
                    type="text"
                    value={newProject.imageUrl || ""}
                    onChange={(e) =>
                      setNewProject({ ...newProject, imageUrl: e.target.value })
                    }
                    placeholder="https://res.cloudinary.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileUpload(e, "projectCover")}
                    className="block w-full text-[11px] text-[var(--text-muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:bg-cyan-500/20 file:text-cyan-300 cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-[var(--text-secondary)] flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Project Gallery Images ({newProject.galleryImages?.length || 0})</span>
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => handleFileUpload(e, "projectGallery")}
                    className="block w-full text-[11px] text-[var(--text-muted)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-mono file:bg-emerald-500/20 file:text-emerald-300 cursor-pointer"
                  />
                  {newProject.galleryImages && newProject.galleryImages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {newProject.galleryImages.map((url, gIdx) => (
                        <span
                          key={`${url}-${gIdx}`}
                          className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]"
                        >
                          Image {gIdx + 1}
                          <button
                            type="button"
                            onClick={() =>
                              setNewProject({
                                ...newProject,
                                galleryImages: newProject.galleryImages.filter(
                                  (_, i) => i !== gIdx
                                ),
                              })
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap items-center gap-5">
                  <label className="inline-flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProject.featured}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          featured: e.target.checked,
                        })
                      }
                      className="accent-cyan-500"
                    />
                    Show on Homepage (Featured)
                  </label>

                  <div className="inline-flex items-center gap-2">
                    <label className="text-xs font-mono text-[var(--text-secondary)]">
                      Featured Order:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={newProject.featuredOrder ?? 1}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          featuredOrder: Number(e.target.value) || 1,
                        })
                      }
                      className="w-20 px-2.5 py-1 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {editingProjectId
                      ? "Save Project Changes"
                      : "Add Project to Portfolio"}
                  </span>
                </button>
              </div>
            </form>

            {/* List Existing Projects */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold font-mono text-[var(--text-primary)] uppercase">
                Existing Projects ({data.projects?.length})
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {data.projects?.map((proj: any) => (
                  <div
                    key={proj.id}
                    className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm text-[var(--text-primary)]">
                          {proj.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                          {proj.category}
                        </span>
                        {proj.featured && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate max-w-xl">
                        {proj.tagline || proj.summary}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEditProject(proj)}
                        className="p-2 rounded-lg border border-cyan-500/30 hover:bg-cyan-950/40 text-cyan-400"
                        title="Edit Project"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/projects/${proj.slug}`}
                        target="_blank"
                        className="p-2 rounded-lg border border-[var(--border-subtle)] hover:border-cyan-400 text-[var(--text-secondary)] hover:text-cyan-400"
                        title="View Write-Up"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 rounded-lg border border-red-500/30 hover:bg-red-950/40 text-red-400"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Skills Management */}
        {activeTab === "skills" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Manage Technical Skills &amp; Categories
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Add, edit, or remove skills and categories shown on your portfolio.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      skills: [
                        ...(data.skills || []),
                        {
                          id: `cat-${Date.now()}`,
                          title: "New Skill Category",
                          description: "Category description...",
                          items: [
                            {
                              name: "New Skill",
                              status: "Building with",
                              focusArea: "Core Focus",
                              context: "Applied tools",
                            },
                          ],
                        },
                      ],
                    })
                  }
                  className="px-4 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono text-cyan-300 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Category
                </button>
                <button
                  type="button"
                  onClick={handleSaveSkills}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition-colors"
                >
                  Save All Skills
                </button>
              </div>
            </div>

            <div className="space-y-5">
              {(data.skills || []).map((cat: any, catIdx: number) => (
                <div
                  key={cat.id || catIdx}
                  className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start border-b border-[var(--border-subtle)] pb-4">
                    <input
                      type="text"
                      value={cat.title || ""}
                      onChange={(e) => {
                        const updated = [...data.skills];
                        updated[catIdx] = {
                          ...updated[catIdx],
                          title: e.target.value,
                        };
                        setData({ ...data, skills: updated });
                      }}
                      className="sm:col-span-4 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)]"
                    />
                    <input
                      type="text"
                      value={cat.description || ""}
                      onChange={(e) => {
                        const updated = [...data.skills];
                        updated[catIdx] = {
                          ...updated[catIdx],
                          description: e.target.value,
                        };
                        setData({ ...data, skills: updated });
                      }}
                      className="sm:col-span-7 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm("Delete this skill category?")) return;
                        setData({
                          ...data,
                          skills: data.skills.filter(
                            (_: unknown, i: number) => i !== catIdx
                          ),
                        });
                      }}
                      className="sm:col-span-1 p-2 rounded-lg border border-red-500/30 hover:bg-red-950/40 text-red-400 justify-self-end"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {(cat.items || []).map((item: any, itemIdx: number) => (
                      <div
                        key={itemIdx}
                        className="p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                      >
                        <input
                          type="text"
                          value={item.name || ""}
                          onChange={(e) => {
                            const updated = [...data.skills];
                            const items = [...updated[catIdx].items];
                            items[itemIdx] = {
                              ...items[itemIdx],
                              name: e.target.value,
                            };
                            updated[catIdx] = { ...updated[catIdx], items };
                            setData({ ...data, skills: updated });
                          }}
                          placeholder="Skill Name"
                          className="sm:col-span-3 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                        />
                        <select
                          value={item.status || "Building with"}
                          onChange={(e) => {
                            const updated = [...data.skills];
                            const items = [...updated[catIdx].items];
                            items[itemIdx] = {
                              ...items[itemIdx],
                              status: e.target.value,
                            };
                            updated[catIdx] = { ...updated[catIdx], items };
                            setData({ ...data, skills: updated });
                          }}
                          className="sm:col-span-2 px-2 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                        >
                          <option value="Building with">Building with</option>
                          <option value="Working with">Working with</option>
                          <option value="Exploring">Exploring</option>
                          <option value="Focused on">Focused on</option>
                        </select>
                        <input
                          type="text"
                          value={item.focusArea || ""}
                          onChange={(e) => {
                            const updated = [...data.skills];
                            const items = [...updated[catIdx].items];
                            items[itemIdx] = {
                              ...items[itemIdx],
                              focusArea: e.target.value,
                            };
                            updated[catIdx] = { ...updated[catIdx], items };
                            setData({ ...data, skills: updated });
                          }}
                          placeholder="Focus Area"
                          className="sm:col-span-3 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]"
                        />
                        <input
                          type="text"
                          value={item.context || ""}
                          onChange={(e) => {
                            const updated = [...data.skills];
                            const items = [...updated[catIdx].items];
                            items[itemIdx] = {
                              ...items[itemIdx],
                              context: e.target.value,
                            };
                            updated[catIdx] = { ...updated[catIdx], items };
                            setData({ ...data, skills: updated });
                          }}
                          placeholder="Tools / Context"
                          className="sm:col-span-3 px-2.5 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...data.skills];
                            updated[catIdx] = {
                              ...updated[catIdx],
                              items: updated[catIdx].items.filter(
                                (_: unknown, i: number) => i !== itemIdx
                              ),
                            };
                            setData({ ...data, skills: updated });
                          }}
                          className="sm:col-span-1 p-1.5 rounded-lg border border-red-500/30 hover:bg-red-950/40 text-red-400 justify-self-end"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...data.skills];
                        updated[catIdx] = {
                          ...updated[catIdx],
                          items: [
                            ...(updated[catIdx].items || []),
                            {
                              name: "",
                              status: "Building with",
                              focusArea: "",
                              context: "",
                            },
                          ],
                        };
                        setData({ ...data, skills: updated });
                      }}
                      className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 hover:underline pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Skill to {cat.title}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Journey Timeline Management */}
        {activeTab === "journey" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)]">
                  Manage Learning &amp; Building Journey
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Edit milestones, periods, focus points (one per line), and outcomes.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() =>
                    setData({
                      ...data,
                      journey: [
                        ...(data.journey || []),
                        {
                          step: String((data.journey?.length || 0) + 1).padStart(
                            2,
                            "0"
                          ),
                          title: "New Milestone",
                          domain: "AI / ML",
                          period: "2026",
                          description: "",
                          focusPoints: [""],
                          keyOutcome: "",
                        },
                      ],
                    })
                  }
                  className="px-4 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs font-mono text-cyan-300 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Milestone
                </button>
                <button
                  type="button"
                  onClick={handleSaveJourney}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs font-mono transition-colors"
                >
                  Save Journey Timeline
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {(data.journey || []).map((m: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <input
                      type="text"
                      value={m.step || ""}
                      onChange={(e) => {
                        const updated = [...data.journey];
                        updated[idx] = { ...updated[idx], step: e.target.value };
                        setData({ ...data, journey: updated });
                      }}
                      placeholder="Step"
                      className="sm:col-span-1 px-2.5 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono text-[#0ea5e9]"
                    />
                    <input
                      type="text"
                      value={m.title || ""}
                      onChange={(e) => {
                        const updated = [...data.journey];
                        updated[idx] = { ...updated[idx], title: e.target.value };
                        setData({ ...data, journey: updated });
                      }}
                      placeholder="Milestone Title"
                      className="sm:col-span-5 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)]"
                    />
                    <input
                      type="text"
                      value={m.period || ""}
                      onChange={(e) => {
                        const updated = [...data.journey];
                        updated[idx] = { ...updated[idx], period: e.target.value };
                        setData({ ...data, journey: updated });
                      }}
                      placeholder="Period"
                      className="sm:col-span-2 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]"
                    />
                    <input
                      type="text"
                      value={m.domain || ""}
                      onChange={(e) => {
                        const updated = [...data.journey];
                        updated[idx] = { ...updated[idx], domain: e.target.value };
                        setData({ ...data, journey: updated });
                      }}
                      placeholder="Tech / Domain"
                      className="sm:col-span-3 px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm("Delete this milestone?")) return;
                        setData({
                          ...data,
                          journey: data.journey.filter(
                            (_: unknown, i: number) => i !== idx
                          ),
                        });
                      }}
                      className="sm:col-span-1 p-2 rounded-lg border border-red-500/30 hover:bg-red-950/40 text-red-400 justify-self-end"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={m.description || ""}
                    onChange={(e) => {
                      const updated = [...data.journey];
                      updated[idx] = {
                        ...updated[idx],
                        description: e.target.value,
                      };
                      setData({ ...data, journey: updated });
                    }}
                    placeholder="Description"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] resize-none"
                  />

                  <textarea
                    rows={3}
                    value={
                      Array.isArray(m.focusPoints) ? m.focusPoints.join("\n") : ""
                    }
                    onChange={(e) => {
                      const updated = [...data.journey];
                      updated[idx] = {
                        ...updated[idx],
                        focusPoints: e.target.value.split("\n"),
                      };
                      setData({ ...data, journey: updated });
                    }}
                    placeholder="Focus points (one per line)"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)] resize-none"
                  />

                  <input
                    type="text"
                    value={m.keyOutcome || ""}
                    onChange={(e) => {
                      const updated = [...data.journey];
                      updated[idx] = {
                        ...updated[idx],
                        keyOutcome: e.target.value,
                      };
                      setData({ ...data, journey: updated });
                    }}
                    placeholder="Key Outcome"
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-emerald-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Research Agendas */}
        {activeTab === "research" && (
          <div className="space-y-8 animate-in fade-in">
            <form
              onSubmit={handleSaveResearch}
              className="p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-bold">
                  <FlaskConical className="w-4 h-4" />
                  <span>
                    {editingResearchId
                      ? "Edit Research Agenda"
                      : "Add Research Agenda"}
                  </span>
                </div>
                {editingResearchId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingResearchId(null);
                      setNewResearch(EMPTY_RESEARCH);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-3.5 h-3.5" /> Cancel Edit
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Research Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newResearch.title}
                    onChange={(e) =>
                      setNewResearch({ ...newResearch, title: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Status
                  </label>
                  <select
                    value={newResearch.status}
                    onChange={(e) =>
                      setNewResearch({ ...newResearch, status: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="Exploring">Exploring</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Experimenting">Experimenting</option>
                    <option value="Completed">Completed</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={newResearch.tagline}
                    onChange={(e) =>
                      setNewResearch({ ...newResearch, tagline: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--text-secondary)]">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newResearch.tags}
                    onChange={(e) =>
                      setNewResearch({ ...newResearch, tags: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">
                  Problem
                </label>
                <textarea
                  rows={2}
                  value={newResearch.problem}
                  onChange={(e) =>
                    setNewResearch({ ...newResearch, problem: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">
                  Central Research Question
                </label>
                <input
                  type="text"
                  value={newResearch.researchQuestion}
                  onChange={(e) =>
                    setNewResearch({
                      ...newResearch,
                      researchQuestion: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--text-secondary)]">
                  Proposed Direction
                </label>
                <textarea
                  rows={2}
                  value={newResearch.proposedDirection}
                  onChange={(e) =>
                    setNewResearch({
                      ...newResearch,
                      proposedDirection: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs font-mono transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {editingResearchId
                    ? "Save Research Changes"
                    : "Add Research Agenda"}
                </span>
              </button>
            </form>

            <div className="space-y-3">
              <h4 className="text-sm font-bold font-mono text-[var(--text-primary)] uppercase">
                Active Research Agendas ({data.research?.length})
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {data.research?.map((res: any) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="font-bold text-sm text-[var(--text-primary)]">
                        {res.title}
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate max-w-xl">
                        {res.problem}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEditResearch(res)}
                        className="p-2 rounded-lg border border-cyan-500/30 hover:bg-cyan-950/40 text-cyan-400"
                        title="Edit Research"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm("Delete research card?")) return;
                          await adminPost("DELETE_RESEARCH", { id: res.id });
                          fetchData();
                        }}
                        className="p-2 rounded-lg border border-red-500/30 hover:bg-red-950/40 text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Contact Messages Inbox */}
        {activeTab === "messages" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-mono text-[var(--text-primary)] uppercase">
                Contact Inbox ({data.messages?.length || 0})
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                Saved from the portfolio contact form
              </span>
            </div>

            {!data.messages || data.messages.length === 0 ? (
              <div className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] text-center text-sm text-[var(--text-secondary)]">
                No contact messages received yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {data.messages.map((msg: any) => {
                  const replyUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                    msg.email || ""
                  )}&su=${encodeURIComponent(
                    `Re: ${msg.subject || "Portfolio Inquiry"}`
                  )}`;
                  return (
                    <div
                      key={msg.id}
                      className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm text-[var(--text-primary)]">
                              {msg.subject || "Portfolio Inquiry"}
                            </span>
                            {msg.emailStatus && (
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                  msg.emailStatus === "delivered"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                }`}
                              >
                                {msg.emailStatus === "delivered"
                                  ? "Gmail Delivered"
                                  : "Inbox Saved (Relay Pending)"}
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                            From:{" "}
                            <span className="text-cyan-400">{msg.name}</span> (
                            {msg.email})
                            {msg.createdAt &&
                              ` · ${new Date(msg.createdAt).toLocaleString()}`}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a
                            href={replyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0ea5e9] hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Reply via Gmail</span>
                          </a>
                          <button
                            onClick={async () => {
                              if (!confirm("Delete this message?")) return;
                              const result = await adminPost("DELETE_MESSAGE", {
                                id: msg.id,
                              });
                              if (result.success) {
                                triggerAlert("success", "Message deleted!");
                                fetchData();
                              }
                            }}
                            className="p-2 rounded-lg border border-red-500/30 hover:bg-red-950/40 text-red-400"
                            title="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Visitor Analytics */}
        {activeTab === "analytics" && <AdminAnalyticsPanel />}
      </main>

      <Footer />
    </div>
  );
}
