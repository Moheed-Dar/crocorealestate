// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import axios from "axios";
// import {
//   ArrowRight,
//   Star,
//   MapPin,
//   Crown,
//   Building2,
//   Heart,
//   ArrowUpRight,
// } from "lucide-react";

// // ============================================
// // BLACK & WHITE (MONOCHROME) SCHEME
// // ============================================
// const BLACK = "#000000";      // Primary Black
// const DARK_GRAY = "#333333";  // Secondary Dark Gray
// const LIGHT_GRAY = "#F4F4F5"; // Main Background
// const PURE_WHITE = "#FFFFFF"; // White for cards/text on black

// const TEAL = BLACK;
// const GREEN = DARK_GRAY;
// const MINT = LIGHT_GRAY;
// const DARK = BLACK;

// // ============================================
// // SAFE IMAGE HELPER
// // ============================================
// const getSafeImg = (img) => {
//   if (!img) return null;
//   if (typeof img === "string" && img.trim() !== "") return img.trim();
//   if (typeof img === "object" && img?.url) return img.url.trim();
//   return null;
// };

// const PLACEHOLDER =
//   "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

// // ============================================
// // STATUS DOT COLOR (Grayscale)
// // ============================================
// const getStatusDotColor = (status) => {
//   const s = (status || "").toLowerCase().trim();
//   switch (s) {
//     case "available": return "bg-gray-800";
//     case "sold": return "bg-black";
//     case "rented": return "bg-gray-500";
//     case "pending": return "bg-gray-400";
//     case "new": return "bg-gray-700";
//     default: return "bg-black";
//   }
// };

// const getStatusText = (status) => {
//   const s = (status || "").toLowerCase().trim();
//   switch (s) {
//     case "available": return "Available";
//     case "sold": return "Sold";
//     case "rented": return "Rented";
//     case "new": return "New";
//     default: return status || "Available";
//   }
// };

// export default function HeroSection() {
//   /* ============================================================
//      SLIDER IMAGES (5 hero images)
//   ============================================================ */
//   const heroImages = [
//     "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
//     "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
//   ];

//   /* ============================================================
//      REAL PROPERTIES (fetched from API)
//   ============================================================ */
//   const [properties, setProperties] = useState([]);
//   const [propertiesLoading, setPropertiesLoading] = useState(true);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [likedIds, setLikedIds] = useState(new Set());
//   const totalImages = heroImages.length;

//   // Fetch top 2 featured/latest properties
//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         setPropertiesLoading(true);
//         const res = await axios.get(
//           "/api/properties/get-all?page=1&limit=2&sortBy=isFeatured&sortOrder=desc"
//         );
//         const data = res.data?.data || [];
//         setProperties(data.slice(0, 2));
//       } catch {
//         setProperties([]);
//       } finally {
//         setPropertiesLoading(false);
//       }
//     };
//     fetchProperties();
//   }, []);

//   // Auto slider
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImageIndex((prev) => (prev + 1) % totalImages);
//     }, 3500);
//     return () => clearInterval(interval);
//   }, [totalImages]);

//   const toggleLike = (id, e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setLikedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   /* ============================================================
//      PROPERTY CARD (Hero Version — Clean & Simple Layout)
//   ============================================================ */
//   const HeroPropertyCard = ({ property, index }) => {
//     const img =
//       getSafeImg(property.thumbnail) ||
//       getSafeImg(property.images?.[0]) ||
//       PLACEHOLDER;
//     const isLiked = likedIds.has(property._id);

//     return (
//       <Link
//         href={`/properties/${property._id}`}
//         className="group relative flex h-full flex-1 flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
//         style={{
//           backgroundColor: PURE_WHITE,
//           boxShadow: `0 20px 50px -15px ${BLACK}30`,
//           border: `1px solid ${BLACK}20`,
//         }}
//       >
//         {/* Image Area (65% height to fill the space nicely) */}
//         <div className="relative h-[65%] w-full overflow-hidden">
//           <Image
//             src={img}
//             alt={property.title || "Property"}
//             fill
//             loading={index === 0 ? "eager" : "lazy"}
//             className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-60 group-hover:grayscale-0"
//             sizes="260px"
//           />

//           {/* Like button */}
//           <button
//             onClick={(e) => toggleLike(property._id, e)}
//             className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all hover:scale-110"
//             style={{
//               backgroundColor: `${PURE_WHITE}AA`,
//               border: `1px solid ${BLACK}30`,
//             }}
//           >
//             <Heart
//               size={14}
//               className={isLiked ? "fill-black text-black" : ""}
//               style={!isLiked ? { color: BLACK } : undefined}
//             />
//           </button>

//           {/* Arrow up right on hover */}
//           <div
//             className="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-xl opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2"
//             style={{
//               backgroundColor: BLACK,
//               color: PURE_WHITE,
//               boxShadow: `0 4px 12px ${DARK_GRAY}40`,
//             }}
//           >
//             <ArrowUpRight size={16} strokeWidth={2.5} />
//           </div>
//         </div>

//         {/* Text Content Area */}
//         <div className="flex flex-1 flex-col justify-center px-4 py-4">
//           <span
//             className="truncate text-sm font-extrabold"
//             style={{ color: DARK }}
//           >
//             {property.title || "Untitled Property"}
//           </span>

//           <span
//             className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium"
//             style={{ color: TEAL }}
//           >
//             <MapPin size={11} className="shrink-0" style={{ color: GREEN }} />
//             <span className="truncate">
//               {property.location || property.city || "Location"}
//             </span>
//           </span>

//           {/* Status pill */}
//           <div className="mt-2.5 flex items-center gap-1.5">
//             <span
//               className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
//               style={{
//                 backgroundColor: `${BLACK}15`,
//                 color: BLACK,
//                 border: `1px solid ${BLACK}25`,
//               }}
//             >
//               <span
//                 className={`inline-block h-1.5 w-1.5 rounded-full ${getStatusDotColor(property.status)}`}
//               />
//               {getStatusText(property.status)}
//             </span>
//             {property.propertyCode && (
//               <span
//                 className="rounded-md px-1.5 py-0.5 font-mono text-[9px] font-bold"
//                 style={{
//                   color: GREEN,
//                   backgroundColor: `${GREEN}15`,
//                 }}
//               >
//                 {property.propertyCode}
//               </span>
//             )}
//           </div>
//         </div>
//       </Link>
//     );
//   };

//   /* ============================================================
//      LOADING SKELETON CARD
//   ============================================================ */
//   const CardSkeleton = () => (
//     <div
//       className="flex h-full flex-1 flex-col overflow-hidden rounded-2xl animate-pulse"
//       style={{ backgroundColor: PURE_WHITE }}
//     >
//       <div
//         className="h-[65%] w-full"
//         style={{ backgroundColor: `${BLACK}10` }}
//       />
//       <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-4">
//         <div
//           className="h-4 rounded w-3/4"
//           style={{ backgroundColor: `${BLACK}15` }}
//         />
//         <div
//           className="h-3 rounded w-1/2"
//           style={{ backgroundColor: `${BLACK}15` }}
//         />
//       </div>
//     </div>
//   );

//   return (
//     <section
//       className="relative w-full min-h-screen overflow-hidden text-black"
//       style={{ backgroundColor: MINT }}
//     >
//       {/* ==== TOP GRADIENT ADDED WITH BLACK ==== */}
//       <div
//         className="pointer-events-none absolute inset-x-0 top-0 h-150"
//         style={{
//           background: `linear-gradient(to bottom, #000000 0%, transparent 100%)`,
//           opacity: 0.6,
//         }}
//       />

//       <div className="relative flex min-h-screen w-full md:mt-10 flex-col lg:flex-row">
//         {/* ============ LEFT : TEXT (VERTICALLY CENTERED) ============ */}
//         <div className="relative z-20 flex w-full flex-1 flex-col justify-center px-6 pt-16 pb-8 sm:px-10 sm:pt-20 sm:pb-10 md:pt-0 md:py-32 lg:w-[44%] lg:flex-none lg:py-25 lg:pl-14 lg:pr-8">
//           {/* Tag pill */}
//           <span
//             className="w-fit rounded-full px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] shadow-md sm:text-[11px]"
//             style={{
//               backgroundColor: BLACK,
//               color: PURE_WHITE,
//             }}
//           >
//             ( Find Your Place )
//           </span>

//           {/* Main Heading */}
//           <h1 className="mt-6 text-[40px] font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-5xl md:text-6xl xl:text-[58px]">
//             <span style={{ color: BLACK }}>Discover Your</span>
//             <br />
//             <span style={{ color: DARK_GRAY }}>
//               Dream Home
//             </span>{" "}
//             <span style={{ color: BLACK }}>Today</span>
//           </h1>

//           {/* Divider (Solid Color) */}
//           <div
//             className="mt-8 h-0.75 w-24 sm:w-32 md:w-36 rounded-full"
//             style={{ backgroundColor: BLACK }}
//           />

//           {/* Paragraph */}
//           <p
//             className="mt-6 sm:mt-8 max-w-[320px] sm:max-w-90 md:max-w-100 text-justify text-[13px] font-medium leading-6 sm:text-sm"
//             style={{ color: `${BLACK}CC` }}
//           >
//             Handpicked properties in prime locations — built for comfort, luxury,
//             and everyday living.
//           </p>

//           {/* CTA row */}
//           <div className="mt-8 sm:mt-9 flex flex-wrap items-center gap-4 sm:gap-6">
//             <Link
//               href="/properties"
//               className="group flex w-fit items-center gap-3 sm:gap-4 rounded-full py-2.5 pl-6 sm:pl-7 pr-2 sm:pr-2.5 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-0.5"
//               style={{
//                 backgroundColor: BLACK,
//                 color: PURE_WHITE,
//               }}
//             >
//               <span className="text-xs sm:text-sm font-extrabold">View Properties</span>
//               <span
//                 className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
//                 style={{
//                   backgroundColor: PURE_WHITE,
//                   color: BLACK,
//                 }}
//               >
//                 <ArrowRight size={14} strokeWidth={2.5} className="sm:hidden" />
//                 <ArrowRight size={16} strokeWidth={2.5} className="hidden sm:block" />
//               </span>
//             </Link>

//             <Link
//               href="https://calendar.app.google/zf9eeGFTRRb44AKU6"
//               className="border-b-2 pb-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] transition-colors"
//               style={{
//                 color: BLACK,
//                 borderColor: `${BLACK}50`,
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.color = DARK_GRAY;
//                 e.currentTarget.style.borderColor = DARK_GRAY;
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.color = BLACK;
//                 e.currentTarget.style.borderColor = `${BLACK}50`;
//               }}
//             >
//               ( Book A Consultation )
//             </Link>
//           </div>
//         </div>

//         {/* ============ RIGHT : PROPERTY GALLERY ============ */}
//         {/* Mobile/Tablet: Visible and stacked below text */}
//         <div className="relative w-full flex-1 md:hidden">
//           <div className="relative w-full h-150 sm:h-170 px-6 pb-10 sm:px-10">
//             {/* Main Slider */}
//             <div className="relative h-[55%] w-full mb-5 sm:mb-6">
//               <div
//                 className="group relative h-full w-full overflow-hidden rounded-2xl"
//                 style={{
//                   boxShadow: `0 30px 70px -20px ${BLACK}40`,
//                   border: `1px solid ${PURE_WHITE}50`,
//                 }}
//               >
//                 {heroImages.map((img, index) => (
//                   <div
//                     key={index}
//                     className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
//                       index === currentImageIndex ? "opacity-100" : "opacity-0"
//                     }`}
//                   >
//                     <Image
//                       src={img}
//                       alt={`Property exterior ${index + 1}`}
//                       fill
//                       priority={index === 0}
//                       loading={index === 0 ? "eager" : "lazy"}
//                       className="object-cover transition-transform duration-2000 group-hover:scale-105 grayscale-60 group-hover:grayscale-0"
//                       sizes="100vw"
//                     />
//                   </div>
//                 ))}

//                 {/* Floating badge */}
//                 <div
//                   className="absolute right-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5 shadow-lg backdrop-blur-md sm:right-5 sm:top-5 sm:px-4 sm:py-2"
//                   style={{
//                     backgroundColor: `${MINT}E6`,
//                     color: BLACK,
//                   }}
//                 >
//                   <span
//                     className="h-2 w-2 animate-pulse rounded-full"
//                     style={{ backgroundColor: DARK_GRAY }}
//                   />
//                   <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.15em]">
//                     250+ New Listings
//                   </span>
//                 </div>

//                 {/* Building icon */}
//                 <div
//                   className="absolute left-4 bottom-4 flex items-center gap-2 rounded-full px-3 py-1.5 backdrop-blur-md sm:left-5 sm:bottom-5 sm:px-4 sm:py-2"
//                   style={{
//                     backgroundColor: `${BLACK}E6`,
//                     color: PURE_WHITE,
//                   }}
//                 >
//                   <Building2 size={14} />
//                   <span className="text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.15em]">
//                     Premium Listings
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Progress Bar */}
//             <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5 sm:mb-6">
//               <span className="text-base sm:text-lg font-extrabold" style={{ color: BLACK }}>
//                 {String(currentImageIndex + 1).padStart(2, "0")}
//               </span>
//               <div
//                 className="relative h-0.75 w-28 sm:w-40 overflow-hidden rounded-full"
//                 style={{ backgroundColor: "#E5E5E5" }}
//               >
//                 <div
//                   className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
//                   style={{
//                     width: `${((currentImageIndex + 1) / totalImages) * 100}%`,
//                     backgroundColor: BLACK,
//                   }}
//                 />
//               </div>
//               <span className="text-base sm:text-lg font-extrabold" style={{ color: BLACK }}>
//                 {String(totalImages).padStart(2, "0")}
//               </span>
//             </div>

//             {/* Property Cards */}
//             <div className="flex h-[calc(45%-60px)] gap-3 sm:gap-4">
//               {propertiesLoading ? (
//                 <>
//                   <CardSkeleton />
//                   <CardSkeleton />
//                 </>
//               ) : properties.length > 0 ? (
//                 properties.map((p, i) => (
//                   <HeroPropertyCard key={p._id} property={p} index={i} />
//                 ))
//               ) : (
//                 <>
//                   <div
//                     className="flex h-full flex-1 flex-col rounded-2xl"
//                     style={{
//                       backgroundColor: PURE_WHITE,
//                       border: `1px solid ${BLACK}20`,
//                     }}
//                   >
//                     <div className="flex flex-1 flex-col justify-center items-center px-4">
//                       <Building2 size={32} style={{ color: BLACK }} />
//                       <span className="mt-3 text-sm font-extrabold text-center" style={{ color: DARK }}>
//                         No Properties Available
//                       </span>
//                     </div>
//                   </div>
//                   <div
//                     className="flex h-full flex-1 flex-col rounded-2xl"
//                     style={{
//                       backgroundColor: PURE_WHITE,
//                       border: `1px solid ${BLACK}20`,
//                     }}
//                   >
//                     <div className="flex flex-1 flex-col justify-center items-center px-4">
//                       <Crown size={32} style={{ color: DARK_GRAY }} />
//                       <span className="mt-3 text-sm font-extrabold text-center" style={{ color: DARK }}>
//                         Featured Soon
//                       </span>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Desktop Gallery Layout (md and above) */}
//         <div className="relative hidden md:block md:h-160 lg:h-auto lg:flex-1 lg:ml-[-10%]">
//           {/* ---------- MAIN LARGE IMAGE (top + side margins) ---------- */}
//           <div className="absolute left-0 right-4 bottom-16 top-16 md:right-6 md:top-20 lg:bottom-20 lg:top-24">
//             <div
//               className="group relative h-full w-full overflow-hidden rounded-tl-[200px] lg:rounded-tl-[300px] rounded-2xl"
//               style={{
//                 boxShadow: `0 30px 70px -20px ${BLACK}40`,
//                 border: `1px solid ${PURE_WHITE}50`,
//               }}
//             >
//               {/* FIXED: Added proper opacity transition classes for desktop slider */}
//               {heroImages.map((img, index) => (
//                 <div
//                   key={index}
//                   className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
//                     index === currentImageIndex ? "opacity-100" : "opacity-0"
//                   }`}
//                 >
//                   <Image
//                     src={img}
//                     alt={`Property exterior ${index + 1}`}
//                     fill
//                     priority={index === 0}
//                     loading={index === 0 ? "eager" : "lazy"}
//                     className="object-cover transition-transform duration-2000 group-hover:scale-105 grayscale-60 group-hover:grayscale-0"
//                     sizes="(max-width: 1024px) 100vw, 64vw"
//                   />
//                 </div>
//               ))}

//               {/* Floating badge */}
//               <div
//                 className="absolute right-4 top-4 md:right-5 md:top-5 flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 shadow-lg backdrop-blur-md"
//                 style={{
//                   backgroundColor: `${MINT}E6`,
//                   color: BLACK,
//                 }}
//               >
//                 <span
//                   className="h-2 w-2 animate-pulse rounded-full"
//                   style={{ backgroundColor: DARK_GRAY }}
//                 />
//                 <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.15em]">
//                   250+ New Listings
//                 </span>
//               </div>

//               {/* Building icon */}
//               <div
//                 className="absolute left-4 bottom-4 md:left-5 md:bottom-5 flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2 backdrop-blur-md"
//                 style={{
//                   backgroundColor: `${BLACK}E6`,
//                   color: PURE_WHITE,
//                 }}
//               >
//                 <Building2 size={14} />
//                 <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-[0.15em]">
//                   Premium Listings
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ---------- 2 REAL PROPERTY CARDS ---------- */}
//           <div className="absolute bottom-20 right-4 top-[52%] z-10 flex w-[80%] gap-3 pl-3 md:bottom-24 md:right-8 md:w-[58%] md:gap-5 md:pl-6">
//             {propertiesLoading ? (
//               <>
//                 <CardSkeleton />
//                 <CardSkeleton />
//               </>
//             ) : properties.length > 0 ? (
//               properties.map((p, i) => (
//                 <HeroPropertyCard key={p._id} property={p} index={i} />
//               ))
//             ) : (
//               <>
//                 <div
//                   className="flex h-full flex-1 flex-col rounded-2xl"
//                   style={{
//                     backgroundColor: PURE_WHITE,
//                     border: `1px solid ${BLACK}20`,
//                   }}
//                 >
//                   <div className="flex flex-1 flex-col justify-center items-center px-4">
//                     <Building2 size={32} style={{ color: BLACK }} />
//                     <span className="mt-3 text-sm font-extrabold text-center" style={{ color: DARK }}>
//                       No Properties Available
//                     </span>
//                   </div>
//                 </div>
//                 <div
//                   className="flex h-full flex-1 flex-col rounded-2xl -mr-10"
//                   style={{
//                     backgroundColor: PURE_WHITE,
//                     border: `1px solid ${BLACK}20`,
//                   }}
//                 >
//                   <div className="flex flex-1 flex-col justify-center items-center px-4">
//                     <Crown size={32} style={{ color: DARK_GRAY }} />
//                     <span className="mt-3 text-sm font-extrabold text-center" style={{ color: DARK }}>
//                       Featured Soon
//                     </span>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* ---------- BOTTOM BAR : 01 —— 05 (Black Color) ---------- */}
//           <div className="absolute inset-x-0 bottom-0 flex h-14 items-center pr-5 md:h-16 md:pr-10">
//             <div className="flex items-center gap-3 md:gap-4 pl-1">
//               <span className="text-base md:text-lg font-extrabold" style={{ color: BLACK }}>
//                 {String(currentImageIndex + 1).padStart(2, "0")}
//               </span>
//               <div
//                 className="relative h-0.75 w-32 md:w-40 lg:w-56 overflow-hidden rounded-full"
//                 style={{ backgroundColor: "#E5E5E5" }}
//               >
//                 <div
//                   className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
//                   style={{
//                     width: `${((currentImageIndex + 1) / totalImages) * 100}%`,
//                     backgroundColor: BLACK,
//                   }}
//                 />
//               </div>
//               <span className="text-base md:text-lg font-extrabold" style={{ color: BLACK }}>
//                 {String(totalImages).padStart(2, "0")}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }











"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  ArrowRight,
  MapPin,
  Heart,
  ArrowUpRight,
  Gem,
  Layers,
  Building,
} from "lucide-react";

// ============================================
// BLACK & WHITE (MONOCHROME) SCHEME
// ============================================
const BLACK = "#000000";
const DARK_GRAY = "#333333";
const LIGHT_GRAY = "#F4F4F5";
const PURE_WHITE = "#FFFFFF";

// ============================================
// SAFE IMAGE HELPER
// ============================================
const getSafeImg = (img) => {
  if (!img) return null;
  if (typeof img === "string" && img.trim() !== "") return img.trim();
  if (typeof img === "object" && img?.url) return img.url.trim();
  return null;
};

const PLACEHOLDER = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

// ============================================
// STATUS DOT COLOR
// ============================================
const getStatusDotColor = (status) => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "available": return "bg-black";
    case "sold": return "bg-gray-600";
    case "rented": return "bg-gray-400";
    case "new": return "bg-gray-800";
    default: return "bg-black";
  }
};

const getStatusText = (status) => {
  const s = (status || "").toLowerCase().trim();
  switch (s) {
    case "available": return "Available";
    case "sold": return "Sold";
    case "rented": return "Rented";
    case "new": return "New";
    default: return status || "Available";
  }
};

// ============================================
// MAIN HERO SECTION COMPONENT
// ============================================
export default function HeroSection() {
  const heroImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop",
  ];

  const [properties, setProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedIds, setLikedIds] = useState(new Set());
  const totalImages = heroImages.length;

  // Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setPropertiesLoading(true);
        const res = await axios.get("/api/properties/get-all?page=1&limit=2&sortBy=isFeatured&sortOrder=desc");
        setProperties(res.data?.data?.slice(0, 2) || []);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
        setProperties([]);
      } finally {
        setPropertiesLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalImages]);

  const toggleLike = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ============================================================
     MODERN HORIZONTAL PROPERTY CARD
  ============================================================ */
  const ModernPropertyCard = ({ property, index }) => {
    const img = getSafeImg(property.thumbnail) || getSafeImg(property.images?.[0]) || PLACEHOLDER;
    const isLiked = likedIds.has(property._id);

    return (
      <Link
        href={`/properties/${property._id}`}
        className="group relative flex flex-col md:flex-row overflow-hidden rounded-2xl border border-black/10 bg-white/95 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_50px_-15px_rgba(0,0,0,0.25)]"
      >
        {/* Image Section */}
        <div className="relative h-48 w-full md:h-auto md:w-2/5 overflow-hidden">
          <Image
            src={img}
            alt={property.title || "Property"}
            fill
            loading={index === 0 ? "eager" : "lazy"}
            className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-20 group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          {/* Status Badge */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/80 px-2.5 py-1 backdrop-blur-sm">
            <span className={`h-1.5 w-1.5 rounded-full ${getStatusDotColor(property.status)}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider text-white">
              {getStatusText(property.status)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-1 text-lg font-bold text-black">
                {property.title || "Untitled Property"}
              </h3>
              <button
                onClick={(e) => toggleLike(property._id, e)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white transition-all hover:scale-110 hover:bg-gray-50"
              >
                <Heart size={14} className={isLiked ? "fill-black text-black" : "text-black"} />
              </button>
            </div>
            
            <div className="mt-2 flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin size={14} className="shrink-0" />
              <span className="truncate">{property.location || property.city || "Prime Location"}</span>
            </div>

            {property.propertyCode && (
              <div className="mt-3 inline-flex items-center rounded-md bg-gray-100 px-2 py-1">
                <span className="text-[10px] font-mono font-semibold text-gray-600">
                  ID: {property.propertyCode}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-black/5 pt-4">
            <span className="text-xs font-medium text-gray-500">Featured Listing</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRight size={16} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  /* ============================================================
     LOADING SKELETON (Horizontal)
  ============================================================ */
  const CardSkeleton = () => (
    <div className="flex flex-col md:flex-row overflow-hidden rounded-2xl border border-black/5 bg-white animate-pulse">
      <div className="h-48 w-full bg-gray-100 md:h-auto md:w-2/5" />
      <div className="flex flex-1 flex-col justify-center gap-3 p-6">
        <div className="h-5 w-3/4 rounded bg-gray-100" />
        <div className="h-4 w-1/2 rounded bg-gray-100" />
        <div className="mt-2 h-8 w-full rounded bg-gray-50" />
      </div>
    </div>
  );

  /* ============================================================
     MAIN RENDER
  ============================================================ */
  return (
    <section className="relative w-full min-h-screen bg-[#F4F4F5] overflow-hidden">
      
      {/* ==========================================
          1. CINEMATIC BACKGROUND SLIDER 
      ========================================== */}
      <div className="absolute inset-0 z-0 min-h-screen">
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img}
              alt={`Hero background ${index + 1}`}
              fill
              priority={index === 0}
              className={`object-cover transition-transform duration-8000 ease-linear grayscale-30 ${
                index === currentImageIndex ? "scale-105" : "scale-100"
              }`}
              sizes="100vw"
            />
            
            {/* ✅ FIXED: Multi-layer gradient overlay for complete coverage */}
            {/* Layer 1: Dark overlay for overall image darkening */}
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Layer 2: Extended bottom gradient - covers bottom 90% to ensure no gap and smooth blend */}
            <div 
              className="absolute inset-x-0 bottom-0 h-[90%]"
              style={{
                background: `linear-gradient(to top, #F4F4F5 0%, #F4F4F5 35%, transparent 100%)`
              }}
            />
            
            {/* Layer 3: Subtle top gradient for depth */}
            <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/40 to-transparent" />
          </div>
        ))}
      </div>

      {/* ==========================================
          2. MAIN CONTENT CONTAINER
      ========================================== */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-between px-4 pt-20 pb-8 sm:px-6 lg:px-8">
        
        {/* Top Text Section */}
        <div className="flex flex-col items-start justify-center md:pt-10 lg:pt-20">
          {/* Animated Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md shadow-sm">
            <Gem size={14} className="text-white" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Premium Real Estate
            </span>
          </div>

          {/* Massive Typography */}
          <h1 className="max-w-4xl text-5xl font-black leading-[1.05] tracking-tighter text-white sm:text-6xl md:text-7xl lg:text-8xl">
            Elevate Your <br />
            <span className="text-white/80">Living Experience.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-white sm:text-lg">
            Curated properties in the world's most sought-after locations. 
            Designed for those who appreciate the finer details of everyday luxury.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 mb-8 flex flex-wrap items-center gap-4">
            <Link
              href="/properties"
              className="group flex items-center gap-3 rounded-full bg-black px-8 py-4 text-sm font-bold text-white shadow-xl shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:bg-gray-900"
            >
              <span>Explore Properties</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight size={16} strokeWidth={2.5} />
              </span>
            </Link>

            <Link
              href="https://calendar.app.google/zf9eeGFTRRb44AKU6"
              className="flex items-center gap-2 rounded-full border-2 border-black/30 bg-white/10 px-8 py-4 text-sm font-bold text-black backdrop-blur-sm transition-all duration-300 hover:border-black hover:bg-white hover:text-black"
            >
              <span>Book Consultation</span>
            </Link>
          </div>
        </div>

        {/* ==========================================
            3. FLOATING GLASS DASHBOARD (Bottom)
        ========================================== */}
        <div className="mt-auto w-full pb-4">
          <div className="relative rounded-3xl border border-white/20 bg-linear-to-br from-white/90 via-white/80 to-white/70 p-6 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.25)] backdrop-blur-2xl sm:p-8 md:p-10">
            
            {/* Decorative Corner Elements */}
            <div className="absolute -top-3 left-8 h-6 w-16 rounded-full bg-black/5 backdrop-blur-sm" />
            <div className="absolute -top-3 right-8 h-6 w-16 rounded-full bg-black/5 backdrop-blur-sm" />
            
            {/* Dashboard Header */}
            <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
                  <Layers size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black sm:text-2xl">Featured Collection</h2>
                  <p className="text-sm text-gray-600">Handpicked for exceptional quality and location.</p>
                </div>
              </div>
              <Link 
                href="/properties" 
                className="group flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-gray-900 hover:shadow-lg"
              >
                View all listings 
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Property Cards Grid */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {propertiesLoading ? (
                <>
                  <CardSkeleton />
                  <CardSkeleton />
                </>
              ) : properties.length > 0 ? (
                properties.map((p, i) => (
                  <ModernPropertyCard key={p._id} property={p} index={i} />
                ))
              ) : (
                <>
                  <div className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50">
                    <Building size={32} className="text-gray-300" />
                    <span className="mt-2 text-sm font-semibold text-gray-400">No Properties Available</span>
                  </div>
                  <div className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white/50">
                    <Building size={32} className="text-gray-300" />
                    <span className="mt-2 text-sm font-semibold text-gray-400">Featured Soon</span>
                  </div>
                </>
              )}
            </div>

            {/* Slider Indicators (Integrated into dashboard) */}
            <div className="mt-8 flex items-center justify-center gap-3 border-t border-black/10 pt-6">
              <span className="text-xs font-bold text-gray-500">
                {String(currentImageIndex + 1).padStart(2, "0")}
              </span>
              <div className="flex gap-1.5">
                {heroImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      idx === currentImageIndex ? "w-8 bg-black" : "w-1.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-500">
                {String(totalImages).padStart(2, "0")}
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}