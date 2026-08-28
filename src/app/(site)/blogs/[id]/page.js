"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Tag,
  LinkIcon,
  BookOpen,
  Loader2,
  ChevronRight,
  Eye,
  Share2,
  Gem,
  X,
  CheckCircle2,
  Hash,
  Home,
} from "lucide-react";
import { getBlogById, getAllBlogs } from "@/lib/blogs/api";

// ==========================================
// ✅ BLACK & WHITE (MONOCHROME) SCHEME
// ==========================================
const BLACK = "#000000";
const DARK_GRAY = "#333333";
const PURE_WHITE = "#FFFFFF";
const LIGHT_GRAY = "#E5E5E5"; // Mapped to MINT

// Derived colors mapped to old palette
const TEAL = PURE_WHITE;       // Main accent on dark bg is white
const DARK_TEAL = BLACK;
const MINT = LIGHT_GRAY;
const BRIGHT_CYAN = DARK_GRAY;

const NAVY = BLACK;
const NAVY_LIGHT = "#1A1A1A";
const NAVY_DARK = "#000000";
const NAVY_CARD = "#111111"; // Slightly lighter than bg for cards

// White opacity helpers (replacing CREAM)
const CREAM_30 = "rgba(255, 255, 255, 0.3)";
const CREAM_40 = "rgba(255, 255, 255, 0.4)";
const CREAM_50 = "rgba(255, 255, 255, 0.5)";
const CREAM_60 = "rgba(255, 255, 255, 0.6)";
const CREAM_70 = "rgba(255, 255, 255, 0.7)";
const CREAM_75 = "rgba(255, 255, 255, 0.75)";
const CREAM_80 = "rgba(255, 255, 255, 0.8)";
const CREAM_90 = "rgba(255, 255, 255, 0.9)";

// ==========================================
// ✅ SAFE IMAGE HELPER
// ==========================================
const getSafeImage = (img) => {
  if (!img) return null;
  if (typeof img === "string") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

// ==========================================
// ✅ HTML DECODE HELPER
// ==========================================
const decodeHtml = (html) => {
  if (!html) return "";
  if (typeof window === "undefined") return html;
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

// ==========================================
// ✅ CUSTOM SOCIAL SVG ICONS
// ==========================================
const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const TwitterIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 22.267.792 23 1.771 23h20.451C23.208 23 24 22.267 24 21.271V1.729C24 .774 23.208 0 22.222 0h.003z" />
  </svg>
);

// ==========================================
// ✅ TOAST
// ==========================================
const Toast = ({ message, visible, onClose }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium text-black animate-slide-up"
      style={{
        background: `linear-gradient(135deg, ${PURE_WHITE}, ${LIGHT_GRAY})`,
        boxShadow: `0 4px 16px rgba(255,255,255,0.2)`,
      }}
    >
      ✓ {message}
    </div>
  );
};

// ==========================================
// ✅ MAIN BLOG DETAIL PAGE
// ==========================================
export default function BlogDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const [toast, setToast] = useState({ message: "", visible: false });

  const showToast = (msg) => setToast({ message: msg, visible: true });
  const hideToast = () => setToast({ message: "", visible: false });

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await getBlogById(id);
        setBlog(res?.data || res);
      } catch (err) {
        setError(err.message || "Blog not found or removed");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getAllBlogs({
          limit: 4,
          status: "published",
          sortBy: "createdAt",
          order: "desc",
        });

        if (data.success) {
          const filtered = (data.data || []).filter((b) => b._id !== id);
          setRecentBlogs(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error("Fetch recent blogs error:", err);
      }
    };
    if (id) fetchRecent();
  }, [id]);

  useEffect(() => {
    if (!blog || loading) return;
    const timer = setTimeout(() => setIsVisible(true), 80);
    return () => clearTimeout(timer);
  }, [blog, loading]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = blog?.title || "Blog Post";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast("Link copied to clipboard!");
    } catch {
      showToast("Failed to copy link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: blog?.title,
        text: `Check out: ${blog?.title}`,
        url: window.location.href,
      });
    } else {
      copyToClipboard();
    }
  };

  const formatDateShort = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getReadTime = (content) => {
    if (!content) return "1 min read";
    const plainText = content.replace(/<[^>]*>/g, "");
    const words = plainText.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  const blogImageUrl = blog ? getSafeImage(blog.featuredImage) || blog.image || null : null;
  const decodedContent = blog ? decodeHtml(blog.content) : "";

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: `linear-gradient(to bottom, ${BLACK} 0%, ${BLACK} 60%, ${PURE_WHITE} 100%)` }}
      >
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <div
              className="w-14 h-14 border-2 rounded-full animate-spin"
              style={{
                borderColor: `rgba(255,255,255,0.2)`,
                borderTopColor: PURE_WHITE,
              }}
            />
            <Gem
              size={16}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ color: `rgba(255,255,255,0.6)` }}
            />
          </div>
          <p className="text-sm tracking-[0.2em] uppercase" style={{ color: CREAM_40 }}>
            Loading blog...
          </p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{ background: `linear-gradient(to bottom, ${BLACK} 0%, ${BLACK} 60%, ${PURE_WHITE} 100%)` }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center border"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            borderColor: "rgba(255,255,255,0.1)",
          }}
        >
          <X size={32} style={{ color: CREAM_40 }} />
        </div>
        <h2 className="text-xl font-bold text-white">Blog Not Found</h2>
        <p className="text-sm text-center max-w-sm" style={{ color: CREAM_50 }}>
          {error || "The blog you're looking for doesn't exist or has been removed."}
        </p>
        <Link
          href="/blogs"
          className="mt-2 flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors text-black"
          style={{
            backgroundColor: PURE_WHITE,
            border: `1px solid ${PURE_WHITE}`,
          }}
        >
          <ArrowLeft size={16} /> Browse Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <Toast message={toast.message} visible={toast.visible} onClose={hideToast} />

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Main Top-Black to Bottom-White Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${BLACK} 0%, ${BLACK} 50%, #1a1a1a 75%, ${PURE_WHITE} 100%)`,
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${PURE_WHITE} 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at top left, rgba(255,255,255,0.1) 0%, transparent 40%)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at bottom right, rgba(255,255,255,0.05) 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* ============================== */}
      {/* ✅ HERO BANNER */}
      {/* ============================== */}
      <section className="relative z-10">
        <div className="relative w-full h-75 sm:h-100 lg:h-130 overflow-hidden">
          {blogImageUrl ? (
            <Image
              src={blogImageUrl}
              alt={blog.title || "Blog cover"}
              fill
              className="object-cover grayscale-30"
              priority
              sizes="100vw"
              unoptimized
            />
          ) : (
            <div
              className="w-full h-full"
              style={{
                background: `linear-gradient(to bottom right, ${NAVY_LIGHT}, ${NAVY_DARK})`,
              }}
            />
          )}

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, ${BLACK}EE, ${BLACK}66, transparent)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(to top, ${BLACK}, ${BLACK}99, transparent)`,
            }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 sm:pb-10 lg:pb-12 px-4 sm:px-6">
            <div className="max-w-4xl w-full text-center">
              {blog.category && (
                <span
                  className="inline-flex items-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold rounded-full mb-4 sm:mb-5"
                  style={{
                    backgroundColor: `rgba(255,255,255,0.1)`,
                    color: PURE_WHITE,
                    border: `1px solid rgba(255,255,255,0.2)`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Tag size={11} style={{ color: PURE_WHITE }} />
                  {blog.category}
                </span>
              )}

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-[1.15] mb-4 sm:mb-5">
                {blog.title}
              </h1>

              {blog.excerpt && (
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl mx-auto mb-5 sm:mb-6" style={{ color: CREAM_75 }}>
                  {blog.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-5 sm:mb-6">
                {blog.author && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                      style={{
                        backgroundColor: `rgba(255,255,255,0.1)`,
                        border: `2px solid rgba(255,255,255,0.2)`,
                      }}
                    >
                      {blog.author.avatar ? (
                        <Image
                          src={blog.author.avatar}
                          alt={blog.author.name}
                          width={36}
                          height={36}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User size={14} style={{ color: `rgba(255,255,255,0.8)` }} />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {blog.author.name}
                    </span>
                  </div>
                )}
                <span className="h-5 w-px" style={{ backgroundColor: `rgba(255,255,255,0.2)` }} />
                <span className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: CREAM_60 }}>
                  <Calendar size={13} style={{ color: `rgba(255,255,255,0.8)` }} />
                  {formatDateShort(blog.createdAt)}
                </span>
                <span className="h-5 w-px" style={{ backgroundColor: `rgba(255,255,255,0.2)` }} />
                <span className="flex items-center gap-1.5 text-xs sm:text-sm" style={{ color: CREAM_60 }}>
                  <Clock size={13} style={{ color: `rgba(255,255,255,0.8)` }} />
                  {blog.readTime || getReadTime(blog.content)}
                </span>
                <span className="h-5 w-px" style={{ backgroundColor: `rgba(255,255,255,0.2)` }} />
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs sm:text-sm transition-colors"
                  style={{ color: CREAM_60 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = PURE_WHITE)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_60)}
                >
                  <Share2 size={13} style={{ color: `rgba(255,255,255,0.8)` }} />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== */}
      {/* ✅ BREADCRUMB */}
      {/* ============================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-5 sm:pt-6">
        <div
          className={`transition-opacity duration-500 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "30ms", transitionProperty: "opacity, transform" }}
        >
          <nav
            className="flex items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl px-4 sm:px-5 py-2.5 sm:py-3"
            style={{
              backgroundColor: `${NAVY_CARD}CC`,
              backdropFilter: "blur(8px)",
              border: `1px solid rgba(255,255,255,0.1)`,
            }}
          >
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-medium shrink-0 transition-colors"
              style={{ color: CREAM_50 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = PURE_WHITE)}
              onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_50)}
            >
              <Home size={13} className="shrink-0" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <ChevronRight size={12} style={{ color: `rgba(255,255,255,0.4)` }} className="shrink-0" />

            <Link
              href="/blogs"
              className="text-xs sm:text-sm font-medium shrink-0 transition-colors"
              style={{ color: CREAM_50 }}
              onMouseEnter={(e) => (e.currentTarget.style.color = PURE_WHITE)}
              onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_50)}
            >
              Blogs
            </Link>

            <ChevronRight size={12} style={{ color: `rgba(255,255,255,0.4)` }} className="shrink-0" />

            {blog.category && (
              <>
                <Link
                  href={`/blogs?category=${encodeURIComponent(blog.category)}`}
                  className="text-xs sm:text-sm font-medium shrink-0 transition-colors"
                  style={{ color: CREAM_50 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = PURE_WHITE)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_50)}
                >
                  {blog.category}
                </Link>
                <ChevronRight size={12} style={{ color: `rgba(255,255,255,0.4)` }} className="shrink-0" />
              </>
            )}

            <span className="text-xs sm:text-sm font-semibold truncate" style={{ color: PURE_WHITE }}>
              {blog.title}
            </span>
          </nav>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          
          {/* ===== LEFT COLUMN ===== */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            
            {/* 1️⃣ Headers */}
            {blog.headers && blog.headers.length > 0 && (
              <div
                className={`transition-opacity duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "50ms", transitionProperty: "opacity, transform" }}
              >
                <div className="space-y-4 sm:space-y-5">
                  {blog.headers.map((header, index) => (
                    <div
                      key={index}
                      className="rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6"
                      style={{
                        backgroundColor: NAVY_CARD,
                        border: `1px solid rgba(255,255,255,0.1)`,
                      }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: `rgba(255,255,255,0.1)`,
                            border: `1px solid rgba(255,255,255,0.2)`,
                          }}
                        >
                          <span className="text-[10px] sm:text-[11px] font-bold" style={{ color: PURE_WHITE }}>
                            {index + 1}
                          </span>
                        </div>
                        <h2
                          className={`font-semibold tracking-tight text-white ${
                            header.headerType === "h2"
                              ? "text-lg sm:text-xl lg:text-2xl"
                              : header.headerType === "h3"
                              ? "text-base sm:text-lg lg:text-xl"
                              : "text-sm sm:text-base lg:text-lg"
                          }`}
                        >
                          {header.title}
                        </h2>
                      </div>
                      {header.image && getSafeImage(header.image) && (
                        <div
                          className="relative w-full aspect-video rounded-xl overflow-hidden mb-4"
                          style={{
                            backgroundColor: NAVY_DARK,
                            boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.1)`,
                          }}
                        >
                          <Image
                            src={getSafeImage(header.image)}
                            alt={header.title}
                            fill
                            className="object-cover grayscale-30"
                            sizes="(max-width: 1024px) 100vw, 66vw"
                            unoptimized
                          />
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              background: `linear-gradient(to top, rgba(0,0,0,0.4), transparent)`,
                            }}
                          />
                        </div>
                      )}
                      {header.description && (
                        <div
                          className="text-sm sm:text-[15px] leading-[1.9] text-white/75
                                     [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 
                                     [&_a]:text-white [&_b]:text-white [&_strong]:text-white"
                          dangerouslySetInnerHTML={{ __html: decodeHtml(header.description) }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2️⃣ Blog Content */}
            <div
              className={`transition-opacity duration-500 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "100ms", transitionProperty: "opacity, transform" }}
            >
              <div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8"
                style={{
                  backgroundColor: NAVY_CARD,
                  border: `1px solid rgba(255,255,255,0.1)`,
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-8 h-px"
                    style={{
                      background: `linear-gradient(to right, ${PURE_WHITE}, transparent)`,
                    }}
                  />
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: PURE_WHITE }}
                  >
                    Article
                  </span>
                </div>
                
                <div
                  className="max-w-none max-h-[70vh] overflow-y-auto pr-2 text-white/75 text-sm sm:text-[15px] leading-[1.9]
                             [&_p]:my-3 
                             [&_div]:my-3 
                             [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:my-4 [&_h1]:text-white
                             [&_h2]:text-xl [&_h2]:font-bold [&_h2]:my-3 [&_h2]:text-white
                             [&_h3]:text-lg [&_h3]:font-bold [&_h3]:my-2 [&_h3]:text-white
                             [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3
                             [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3
                             [&_li]:ml-2 [&_li]:my-1
                             [&_blockquote]:border-l-4 [&_blockquote]:border-white/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-white/60
                             [&_a]:text-white [&_a]:underline
                             [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-4"
                  style={{
                    scrollbarWidth: "thin", 
                    scrollbarColor: `rgba(255,255,255,0.2) transparent`,
                  }}
                  dangerouslySetInnerHTML={{ __html: decodedContent || "<p>No content available.</p>" }}
                />
              </div>
            </div>

            {/* 3️⃣ Key Points */}
            {blog.points && blog.points.length > 0 && (
              <div
                className={`transition-opacity duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "150ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid rgba(255,255,255,0.1)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-8 h-px"
                      style={{
                        background: `linear-gradient(to right, ${PURE_WHITE}, transparent)`,
                    }}
                    />
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.25em]"
                      style={{ color: PURE_WHITE }}
                    >
                      Key Highlights
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl text-white mb-4">Key Points</h3>

                  <div className="space-y-4">
                    {blog.points
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((point, index) => (
                        <div key={index} className="group">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div
                              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                              style={{
                                backgroundColor: PURE_WHITE,
                                boxShadow: `0 2px 8px rgba(255,255,255,0.2)`,
                              }}
                            >
                              <span className="text-[10px] sm:text-xs font-bold text-black">
                                {index + 1}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm sm:text-base font-semibold text-white mb-1 leading-snug">
                                {point.title}
                              </h4>
                              {point.description && (
                                <p className="text-xs sm:text-sm leading-relaxed" style={{ color: CREAM_60 }}>
                                  {point.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {index < blog.points.length - 1 && (
                            <div className="mt-4 pl-10 sm:pl-12">
                              <div
                                className="h-px"
                                style={{
                                  background: `linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.05), rgba(255,255,255,0.2))`,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4️⃣ Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div
                className={`transition-opacity duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "200ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid rgba(255,255,255,0.1)`,
                  }}
                >
                  <h3 className="text-lg sm:text-xl text-white mb-1">Tags</h3>
                  <div
                    className="w-12 h-0.5 rounded-full mb-4 sm:mb-5"
                    style={{
                      background: `linear-gradient(to right, ${PURE_WHITE}, transparent)`,
                    }}
                  />
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {blog.tags.map((tag, i) => (
                      <Link
                        key={i}
                        href={`/blogs?search=${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm rounded-lg sm:rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 transition-colors group"
                        style={{
                          color: CREAM_75,
                          backgroundColor: `rgba(255,255,255,0.05)`,
                          border: `1px solid rgba(255,255,255,0.1)`,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `rgba(255,255,255,0.15)`;
                          e.currentTarget.style.borderColor = `rgba(255,255,255,0.3)`;
                          e.currentTarget.style.color = PURE_WHITE;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = `rgba(255,255,255,0.05)`;
                          e.currentTarget.style.borderColor = `rgba(255,255,255,0.1)`;
                          e.currentTarget.style.color = CREAM_75;
                        }}
                      >
                        <div
                          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `rgba(255,255,255,0.15)` }}
                        >
                          <Hash size={9} style={{ color: `rgba(255,255,255,0.8)` }} />
                        </div>
                        <span className="capitalize">{tag}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5️⃣ Share */}
            <div
              className={`transition-opacity duration-500 ease-out ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: "250ms", transitionProperty: "opacity, transform" }}
            >
              <div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7"
                style={{
                  backgroundColor: NAVY_CARD,
                  border: `1px solid rgba(255,255,255,0.1)`,
                }}
              >
                <h3 className="text-lg sm:text-xl text-white mb-1">Share This Article</h3>
                <div
                  className="w-12 h-0.5 rounded-full mb-4 sm:mb-5"
                  style={{
                    background: `linear-gradient(to right, ${PURE_WHITE}, transparent)`,
                  }}
                />
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-colors"
                    style={{
                      backgroundColor: `rgba(255,255,255,0.1)`,
                      color: PURE_WHITE,
                      border: `1px solid rgba(255,255,255,0.2)`,
                    }}
                  >
                    <FacebookIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-colors"
                    style={{
                      backgroundColor: `rgba(255,255,255,0.05)`,
                      color: CREAM_80,
                      border: `1px solid rgba(255,255,255,0.1)`,
                    }}
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-colors"
                    style={{
                      backgroundColor: `rgba(255,255,255,0.1)`,
                      color: PURE_WHITE,
                      border: `1px solid rgba(255,255,255,0.2)`,
                    }}
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                  <button
                    onClick={copyToClipboard}
                    className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl transition-colors"
                    style={{
                      backgroundColor: `rgba(255,255,255,0.05)`,
                      color: CREAM_80,
                      border: `1px solid rgba(255,255,255,0.1)`,
                    }}
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SIDEBAR ===== */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-3 sm:space-y-4">
              
              {/* Author */}
              {blog.author && (
                <div
                  className={`transition-opacity duration-500 ease-out ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: "300ms", transitionProperty: "opacity, transform" }}
                >
                  <div
                    className="rounded-xl sm:rounded-2xl overflow-hidden"
                    style={{
                      backgroundColor: NAVY_CARD,
                      border: `1px solid rgba(255,255,255,0.1)`,
                    }}
                  >
                    <div
                      className="px-4 sm:px-5 lg:px-6 py-4 sm:py-5"
                      style={{
                        background: `linear-gradient(to right, rgba(255,255,255,0.05), rgba(255,255,255,0.02), transparent)`,
                        borderBottom: `1px solid rgba(255,255,255,0.1)`,
                      }}
                    >
                      <h4
                        className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-2.5 sm:mb-3"
                        style={{ color: CREAM_50 }}
                      >
                        About the Author
                      </h4>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden"
                          style={{
                            backgroundColor: `rgba(255,255,255,0.1)`,
                            border: `2px solid rgba(255,255,255,0.2)`,
                            boxShadow: `0 4px 12px rgba(255,255,255,0.1)`,
                          }}
                        >
                          {blog.author.avatar ? (
                            <Image
                              src={blog.author.avatar}
                              alt={blog.author.name}
                              width={48}
                              height={48}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User size={18} style={{ color: `rgba(255,255,255,0.8)` }} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-bold text-white truncate">
                            {blog.author.name}
                          </p>
                          {blog.author.email && (
                            <p className="text-[11px] sm:text-xs truncate" style={{ color: CREAM_50 }}>
                              {blog.author.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <p className="text-xs sm:text-sm leading-relaxed" style={{ color: CREAM_60 }}>
                        Contributing writer sharing insights and expertise on{" "}
                        <span className="font-medium" style={{ color: PURE_WHITE }}>
                          {blog.category || "various topics"}
                        </span>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Info */}
              <div
                className={`transition-opacity duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "350ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid rgba(255,255,255,0.1)`,
                  }}
                >
                  <h4
                    className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-2.5 sm:mb-3"
                    style={{ color: CREAM_50 }}
                  >
                    Article Info
                  </h4>
                  <div className="space-y-0">
                    <div
                      className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5"
                      style={{ borderBottom: `1px solid rgba(255,255,255,0.1)` }}
                    >
                      <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
                        <Calendar size={11} style={{ color: `rgba(255,255,255,0.6)` }} />Published
                      </span>
                      <span className="font-semibold text-white">{formatDateShort(blog.createdAt)}</span>
                    </div>
                    {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                      <div
                        className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5"
                        style={{ borderBottom: `1px solid rgba(255,255,255,0.1)` }}
                      >
                        <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
                          <Clock size={11} style={{ color: `rgba(255,255,255,0.6)` }} />Updated
                        </span>
                        <span className="font-semibold text-white">{formatDateShort(blog.updatedAt)}</span>
                      </div>
                    )}
                    <div
                      className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5"
                      style={{ borderBottom: `1px solid rgba(255,255,255,0.1)` }}
                    >
                      <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
                        <Clock size={11} style={{ color: `rgba(255,255,255,0.6)` }} />Read Time
                      </span>
                      <span className="font-semibold text-white">{blog.readTime || getReadTime(blog.content)}</span>
                    </div>
                    {blog.viewsCount > 0 && (
                      <div
                        className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5"
                        style={{ borderBottom: `1px solid rgba(255,255,255,0.1)` }}
                      >
                        <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
                          <Eye size={11} style={{ color: `rgba(255,255,255,0.6)` }} />Views
                        </span>
                        <span className="font-semibold text-white">{blog.viewsCount}</span>
                      </div>
                    )}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex items-center justify-between text-xs sm:text-sm py-2 sm:py-2.5">
                        <span className="flex items-center gap-1.5 sm:gap-2" style={{ color: CREAM_60 }}>
                          <Hash size={11} style={{ color: `rgba(255,255,255,0.6)` }} />Tags
                        </span>
                        <span className="font-semibold text-white">{blog.tags.length} tags</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags Cloud */}
              {blog.tags && blog.tags.length > 0 && (
                <div
                  className={`transition-opacity duration-500 ease-out ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: "400ms", transitionProperty: "opacity, transform" }}
                >
                  <div
                    className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                    style={{
                      backgroundColor: NAVY_CARD,
                      border: `1px solid rgba(255,255,255,0.1)`,
                    }}
                  >
                    <h4
                      className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-2.5 sm:mb-3"
                      style={{ color: CREAM_50 }}
                    >
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {blog.tags.map((tag, i) => (
                        <Link
                          key={i}
                          href={`/blogs?search=${encodeURIComponent(tag)}`}
                          className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-medium rounded-full transition-colors"
                          style={{
                            color: CREAM_60,
                            backgroundColor: `rgba(255,255,255,0.05)`,
                            border: `1px solid rgba(255,255,255,0.1)`,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `rgba(255,255,255,0.15)`;
                            e.currentTarget.style.borderColor = `rgba(255,255,255,0.3)`;
                            e.currentTarget.style.color = PURE_WHITE;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = `rgba(255,255,255,0.05)`;
                            e.currentTarget.style.borderColor = `rgba(255,255,255,0.1)`;
                            e.currentTarget.style.color = CREAM_60;
                          }}
                        >
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recent Blogs */}
              {recentBlogs.length > 0 && (
                <div
                  className={`transition-opacity duration-500 ease-out ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: "450ms", transitionProperty: "opacity, transform" }}
                >
                  <div
                    className="rounded-xl sm:rounded-2xl p-4 sm:p-5"
                    style={{
                      backgroundColor: NAVY_CARD,
                      border: `1px solid rgba(255,255,255,0.1)`,
                    }}
                  >
                    <h4
                      className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em] mb-3 sm:mb-4"
                      style={{ color: CREAM_50 }}
                    >
                      Recent Blogs
                    </h4>
                    <div className="space-y-3">
                      {recentBlogs.map((recent) => {
                        const recImg = getSafeImage(recent.featuredImage) || recent.image || null;
                        return (
                          <Link key={recent._id} href={`/blogs/${recent._id}`} className="group block">
                            <div className="flex gap-3">
                              <div
                                className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden"
                                style={{
                                  backgroundColor: NAVY_DARK,
                                  border: `1px solid rgba(255,255,255,0.1)`,
                                }}
                              >
                                {recImg ? (
                                  <Image
                                    src={recImg}
                                    alt={recent.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="64px"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <BookOpen size={16} style={{ color: CREAM_30 }} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5
                                  className="text-[11px] sm:text-xs font-bold line-clamp-2 transition-colors"
                                  style={{ color: CREAM_80 }}
                                  onMouseEnter={(e) => (e.currentTarget.style.color = PURE_WHITE)}
                                  onMouseLeave={(e) => (e.currentTarget.style.color = CREAM_80)}
                                >
                                  {recent.title}
                                </h5>
                                <p
                                  className="text-[10px] sm:text-[11px] mt-1 flex items-center gap-1"
                                  style={{ color: CREAM_40 }}
                                >
                                  <Calendar size={9} style={{ color: `rgba(255,255,255,0.5)` }} />
                                  {formatDateShort(recent.createdAt)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Verified */}
              <div
                className={`transition-opacity duration-500 ease-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                style={{ transitionDelay: "500ms", transitionProperty: "opacity, transform" }}
              >
                <div
                  className="rounded-xl sm:rounded-2xl p-4 sm:p-5 flex items-center gap-3"
                  style={{
                    backgroundColor: NAVY_CARD,
                    border: `1px solid rgba(255,255,255,0.1)`,
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `rgba(255,255,255,0.1)`,
                      border: `1px solid rgba(255,255,255,0.2)`,
                    }}
                  >
                    <CheckCircle2 size={18} style={{ color: PURE_WHITE }} />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      Verified Content
                    </p>
                    <p className="text-[11px] sm:text-xs" style={{ color: CREAM_50 }}>
                      This article is fact-checked and reviewed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}