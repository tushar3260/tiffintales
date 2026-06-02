import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { articles } from "./blogData";
import { FaClock, FaUser, FaTag, FaSearch } from "react-icons/fa";

const categoryColors = {
  "Local Guide":       "bg-blue-100 text-blue-700",
  "Student Life":      "bg-green-100 text-green-700",
  "Chef Stories":      "bg-purple-100 text-purple-700",
  "Health & Nutrition":"bg-red-100 text-red-700",
  "Food Culture":      "bg-amber-100 text-amber-700",
};

const Blog = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...new Set(articles.map((a) => a.category))];

  const filtered = articles.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || a.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const featured = articles[0];

  return (
    <>
      <TopNav />

      {/* SEO-friendly article schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Tiffin Tales Blog",
        "description": "Articles about home-cooked food, tiffin culture, nutrition, home chef stories, and local food guides for Mathura & Vrindavan.",
        "url": "https://tiffintalesindia.me/blog",
        "publisher": {
          "@type": "Organization",
          "name": "Tiffin Tales",
          "url": "https://tiffintalesindia.me"
        }
      })}} />

      <div className="bg-white min-h-screen light-page">
        {/* Hero */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100 py-14 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-xs font-bold rounded-full uppercase tracking-widest mb-4">
              🍱 Tiffin Tales Blog
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 mb-3">
              Food Stories, Tips & Local Guides
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
              Honest guides on home-cooked food, tiffin culture in Mathura & Vrindavan, nutrition tips, home chef stories, and everything in between.
            </p>

            {/* Search */}
            <div className="mt-8 max-w-xl mx-auto relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-zinc-200 bg-white text-zinc-800 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-14">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                  activeCategory === cat
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-orange-300 hover:text-orange-500"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured Article */}
          {activeCategory === "All" && !search && (
            <div
              onClick={() => navigate(`/blog/${featured.slug}`)}
              className="mb-12 cursor-pointer group bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 hover:border-orange-300 rounded-3xl overflow-hidden transition hover:shadow-xl"
            >
              <div className="p-8 sm:p-10">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[featured.category] || "bg-zinc-100 text-zinc-600"}`}>
                    ⭐ Featured · {featured.category}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <FaClock className="text-orange-300" /> {featured.readTime}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 mb-3 group-hover:text-orange-600 transition leading-snug">
                  {featured.title}
                </h2>
                <p className="text-zinc-500 leading-relaxed mb-5 max-w-3xl">{featured.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <FaUser className="text-orange-400" />
                    <span>{featured.author}</span>
                    <span className="text-zinc-300">·</span>
                    <span>{featured.date}</span>
                  </div>
                  <span className="text-orange-500 font-semibold text-sm group-hover:underline">
                    Read Article →
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Article Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-zinc-400">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg font-semibold">No articles found</p>
              <p className="text-sm mt-2">Try a different search term or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(activeCategory === "All" && !search ? filtered.slice(1) : filtered).map((article) => (
                <article
                  key={article.slug}
                  onClick={() => navigate(`/blog/${article.slug}`)}
                  className="cursor-pointer group bg-white border border-zinc-100 hover:border-orange-200 rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col"
                >
                  {/* Color header */}
                  <div className={`h-2 w-full ${
                    article.category === "Local Guide" ? "bg-blue-400" :
                    article.category === "Student Life" ? "bg-green-400" :
                    article.category === "Chef Stories" ? "bg-purple-400" :
                    article.category === "Health & Nutrition" ? "bg-red-400" :
                    "bg-amber-400"
                  }`} />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[article.category] || "bg-zinc-100 text-zinc-600"}`}>
                        {article.category}
                      </span>
                      <span className="text-xs text-zinc-400 flex items-center gap-1">
                        <FaClock className="text-orange-300" /> {article.readTime}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-zinc-900 mb-2 group-hover:text-orange-600 transition leading-snug line-clamp-3 flex-1">
                      {article.title}
                    </h2>
                    <p className="text-sm text-zinc-500 leading-relaxed mb-4 line-clamp-3">{article.excerpt}</p>

                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-50">
                      <div className="text-xs text-zinc-400 flex items-center gap-1">
                        <FaUser className="text-orange-300" />
                        <span>{article.author}</span>
                      </div>
                      <span className="text-orange-500 font-semibold text-xs group-hover:underline">
                        Read →
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Tags cloud */}
          <div className="mt-14 pt-10 border-t border-zinc-100">
            <h3 className="font-bold text-zinc-800 mb-4 flex items-center gap-2"><FaTag className="text-orange-400" /> Popular Topics</h3>
            <div className="flex flex-wrap gap-2">
              {[...new Set(articles.flatMap((a) => a.tags))].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearch(tag)}
                  className="px-3 py-1.5 bg-zinc-50 text-zinc-600 hover:bg-orange-50 hover:text-orange-600 text-xs rounded-full border border-zinc-100 hover:border-orange-200 transition"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
