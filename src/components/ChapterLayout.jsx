import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react'
import AnimatedSection from './AnimatedSection'
import './ChapterLayout.css'

export default function ChapterLayout({
  chapterNum,
  title,
  description,
  jumpLinks = [],
  children,
  prevChapter,
  nextChapter,
}) {
  const location = useLocation()

  return (
    <motion.div
      className="page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Banner */}
      <section className="chapter-banner">
        <div className="chapter-banner__orbs" aria-hidden="true">
          <div className="chapter-banner__orb chapter-banner__orb--1" />
          <div className="chapter-banner__orb chapter-banner__orb--2" />
        </div>
        <div className="container chapter-banner__content">
          <AnimatedSection>
            <span className="badge">Chapter {chapterNum}</span>
            <h1 className="chapter-banner__title">{title}</h1>
            <p className="chapter-banner__desc">{description}</p>
            <p className="chapter-banner__breadcrumb">
              <Link to="/">Home</Link> / Chapter {chapterNum}
            </p>
          </AnimatedSection>

          {jumpLinks.length > 0 && (
            <AnimatedSection delay={0.15}>
              <div className="chapter-banner__jumps">
                {jumpLinks.map(link => (
                  <a key={link.href} href={`#${link.href}`} className="chapter-banner__jump">
                    {link.label}
                  </a>
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container chapter-content">
          {children}
        </div>
      </section>

      {/* Reference CTA */}
      <div className="container">
        <AnimatedSection>
          <div className="chapter-cta">
            <div className="chapter-cta__text">
              <h3>Need the full source list?</h3>
              <p>View the complete references page for all sources cited across the CLOIE showcase.</p>
            </div>
            <Link to="/references" className="btn btn-primary">
              <BookOpen size={16} /> View References
            </Link>
          </div>
        </AnimatedSection>
      </div>

      {/* Chapter Nav */}
      <div className="container">
        <AnimatedSection>
          <nav className="chapter-nav" aria-label="Chapter navigation">
            {prevChapter ? (
              <Link to={`/chapter${prevChapter}`} className="btn btn-outline">
                <ArrowLeft size={16} /> Previous: Chapter {prevChapter}
              </Link>
            ) : (
              <Link to="/" className="btn btn-outline">
                <ArrowLeft size={16} /> Back to Home
              </Link>
            )}

            <Link to="/" className="btn btn-ghost">
              Chapter Overview
            </Link>

            {nextChapter ? (
              <Link to={`/chapter${nextChapter}`} className="btn btn-primary">
                Next: Chapter {nextChapter} <ArrowRight size={16} />
              </Link>
            ) : (
              <Link to="/references" className="btn btn-primary">
                References <ArrowRight size={16} />
              </Link>
            )}
          </nav>
        </AnimatedSection>
      </div>

      <div style={{ height: 60 }} />
    </motion.div>
  )
}
