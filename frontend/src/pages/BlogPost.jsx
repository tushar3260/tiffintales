import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { articles } from "./blogData";
import { FaClock, FaUser, FaTag, FaArrowLeft, FaWhatsapp, FaFacebook, FaTwitter } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const categoryColors = {
  "Local Guide":       "bg-blue-100 text-blue-700",
  "Student Life":      "bg-green-100 text-green-700",
  "Chef Stories":      "bg-purple-100 text-purple-700",
  "Health & Nutrition":"bg-red-100 text-red-700",
  "Food Culture":      "bg-amber-100 text-amber-700",
};

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = articles.find((a) => a.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!article) {
    return (
      <>
        <TopNav />
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <span className="text-6xl mb-4">📰</span>
          <h1 className="text-2xl font-bold text-zinc-800 mb-2">Article Not Found</h1>
          <p className="text-zinc-400 mb-6">This article doesn't exist or may have been moved.</p>
          <button
            onClick={() => navigate("/blog")}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition"
          >
            ← Back to Blog
          </button>
        </div>
      </>
    );
  }

  const related = articles.filter(
    (a) => a.category === article.category && a.slug !== article.slug
  ).slice(0, 3);

  const shareUrl = `https://tiffintalesindia.me/blog/${article.slug}`;
  const shareText = encodeURIComponent(article.title);

  return (
    <>
      <TopNav />

      {/* Article Schema for SEO */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "datePublished": article.date,
        "dateModified": article.date,
        "author": {
          "@type": "Person",
          "name": article.author,
          "jobTitle": article.authorRole
        },
        "publisher": {
          "@type": "Organization",
          "name": "Tiffin Tales",
          "url": "https://tiffintalesindia.me",
          "logo": {
            "@type": "ImageObject",
            "url": "https://tiffintalesindia.me/kaamkaitem.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": shareUrl
        },
        "keywords": article.tags.join(", ")
      })}} />

      <div className="bg-white min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-b border-orange-100 py-14 px-6">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => navigate("/blog")}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-orange-500 transition mb-6 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition" />
              Back to Blog
            </button>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${categoryColors[article.category] || "bg-zinc-100 text-zinc-600"}`}>
                {article.category}
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1">
                <FaClock className="text-orange-300" /> {article.readTime}
              </span>
              <span className="text-xs text-zinc-400">{article.date}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-tight mb-5">
              {article.title}
            </h1>

            <p className="text-zinc-500 text-lg leading-relaxed mb-6">{article.excerpt}</p>

            {/* Author */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {article.author.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="font-semibold text-zinc-800 text-sm">{article.author}</p>
                <p className="text-xs text-zinc-400">{article.authorRole}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-12">
          <article className="prose prose-zinc prose-headings:font-bold prose-headings:text-zinc-900 prose-h2:text-2xl prose-h3:text-xl prose-p:text-zinc-600 prose-p:leading-relaxed prose-li:text-zinc-600 prose-strong:text-zinc-800 prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline prose-table:text-sm prose-th:bg-orange-50 prose-th:text-zinc-700 prose-td:text-zinc-600 max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </article>

          {/* Tags */}
          <div className="mt-10 pt-8 border-t border-zinc-100">
            <div className="flex flex-wrap items-center gap-2">
              <FaTag className="text-orange-400 text-sm" />
              {article.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigate("/blog")}
                  className="text-xs px-3 py-1 bg-zinc-50 text-zinc-600 hover:bg-orange-50 hover:text-orange-600 rounded-full border border-zinc-100 hover:border-orange-200 transition"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          {/* Share */}
          <div className="mt-8 p-6 bg-orange-50 rounded-2xl border border-orange-100">
            <p className="font-semibold text-zinc-800 mb-3">Share this article:</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition"
              >
                <FaWhatsapp /> WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
              >
                <FaFacebook /> Facebook
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white text-sm font-semibold rounded-xl hover:bg-sky-600 transition"
              >
                <FaTwitter /> Twitter
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 p-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl text-white text-center">
            <h3 className="text-xl font-black mb-2">Ready to try real home-cooked tiffin? 🍱</h3>
            <p className="text-white/80 text-sm mb-4">
              Subscribe to Tiffin Tales and get fresh homemade meals delivered daily in Mathura & Vrindavan.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate("/meals")}
                className="px-6 py-2.5 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-50 transition text-sm"
              >
                Browse Meals →
              </button>
              <button
                onClick={() => navigate("/subscribe")}
                className="px-6 py-2.5 bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 border border-white/30 transition text-sm"
              >
                View Subscription Plans
              </button>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="border-t border-zinc-100 bg-zinc-50">
            <div className="max-w-6xl mx-auto px-6 py-12">
              <h2 className="text-xl font-bold text-zinc-800 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((rel) => (
                  <article
                    key={rel.slug}
                    onClick={() => navigate(`/blog/${rel.slug}`)}
                    className="cursor-pointer bg-white rounded-2xl p-5 border border-zinc-100 hover:border-orange-200 hover:shadow-md transition group"
                  >
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryColors[rel.category] || "bg-zinc-100 text-zinc-600"}`}>
                      {rel.category}
                    </span>
                    <h3 className="mt-3 font-bold text-zinc-800 text-sm leading-snug group-hover:text-orange-600 transition line-clamp-3">
                      {rel.title}
                    </h3>
                    <p className="mt-2 text-xs text-zinc-400 flex items-center gap-1">
                      <FaClock /> {rel.readTime}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
