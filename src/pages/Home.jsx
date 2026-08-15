import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Target, FileText, Users, Lock, BarChart3, TrendingUp,
  School, GraduationCap, Briefcase, ClipboardList,
  Building2, UserCheck, ArrowRight, BookOpen,
} from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import './Home.css'

const problems = [
  { icon: '🧩', title: 'Fragmented Monitoring', desc: 'Manual and scattered workflows make it hard to track outcomes consistently across courses and programs.' },
  { icon: '📑', title: 'Accreditation Evidence Pressure', desc: 'Institutions need organized and auditable evidence to support accreditation and quality assurance cycles.' },
  { icon: '💬', title: 'Stakeholder Feedback Consolidation', desc: 'Feedback from students, alumni, and industry is difficult to combine meaningfully without centralized tools.' },
  { icon: '🔍', title: 'Continuous Improvement Readiness', desc: 'Academic leaders need clear summaries to identify outcome gaps, interpret trends, and guide program-level actions.' },
]

const features = [
  { icon: <Target size={28} />, title: 'PLO and GO Management', desc: 'Encode and organize outcomes by program to support clear mapping and long-term monitoring.' },
  { icon: <FileText size={28} />, title: 'Standardized Instruments', desc: 'Use structured evaluation tools for students, graduating students, alumni, and industry partners.' },
  { icon: <Users size={28} />, title: 'Stakeholder-Based Evaluation', desc: 'Capture multi-source evidence to strengthen judgments on program relevance and readiness.' },
  { icon: <Lock size={28} />, title: 'Confidential Data Handling', desc: 'Support anonymized and aggregated reporting to protect respondents and encourage honest feedback.' },
  { icon: <BarChart3 size={28} />, title: 'Outcome Reporting', desc: 'Generate consolidated summaries that can assist program review and accreditation preparation.' },
  { icon: <TrendingUp size={28} />, title: 'Continuous Improvement', desc: 'Use evaluation outputs to inform evidence-based actions in recurring quality cycles.' },
]

const benefits = [
  {
    variant: 'blue',
    icon: <School size={24} />,
    title: 'Higher Education Institutions',
    items: ['Stronger quality assurance support', 'More organized evidence for program review', 'Centralized and systematic outcomes monitoring'],
  },
  {
    variant: 'gold',
    icon: <GraduationCap size={24} />,
    title: 'Students',
    items: ['Better-aligned academic programs', 'Improved relevance of learning outcomes', 'Stronger support for graduate readiness'],
  },
  {
    variant: 'blue',
    icon: <UserCheck size={24} />,
    title: 'Educators',
    items: ['Easier review of outcomes and feedback', 'Structured evidence for instructional alignment', 'Better support for reflection and enhancement'],
  },
  {
    variant: 'gold',
    icon: <ClipboardList size={24} />,
    title: 'Administrators',
    items: ['Clearer summaries for decision-making', 'Faster identification of gaps and strengths', 'Improved readiness for accreditation tasks'],
  },
]

const stakeholders = [
  { icon: '👩‍🏫', title: 'Faculty Members', desc: 'Encode outcomes and review program-level evaluation summaries.' },
  { icon: '🎓', title: 'Students', desc: 'Provide feedback on learning outcomes and course alignment.' },
  { icon: '📜', title: 'Graduating Students', desc: 'Contribute exit-survey evidence on program effectiveness.' },
  { icon: '🧑‍💼', title: 'Alumni', desc: 'Share post-graduation insights on relevance and employability.' },
  { icon: '🏢', title: 'Industry Partners', desc: 'Assess workplace readiness and competency alignment.' },
  { icon: '👩‍💼', title: 'Program Heads & Deans', desc: 'Use consolidated reports for quality assurance and planning.' },
]

const chapters = [
  { num: 1, title: 'Introduction', desc: 'Background, objectives, significance, scope and delimitation, timeline context, operational terms, and conceptual framework.' },
  { num: 2, title: 'Review of Literature', desc: 'The conceptual and empirical foundations that justify CLOIE, including system benchmarks and synthesized insights.' },
  { num: 3, title: 'Methodology', desc: 'Development framework, requirements summary, planned software/hardware stack, and feasibility analysis.' },
]

const team = [
  { name: 'Andy Zane B. Egut', role: 'Full-Stack Developer', bio: 'Leads technical implementation, interface behavior, and system feature execution.', img: '/member1.png' },
  { name: 'Abbegail D. Abebon', role: 'Technical Writer & System Analyst', bio: 'Handles documentation, analysis, and requirement structuring.', img: '/member2.png' },
  { name: 'Ms. Christine Marie D. Ordaneza, LPT', role: 'Capstone Consultant', bio: 'Guides methodology, scope quality, and academic compliance.', img: '/consultant.png' },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function Home() {
  return (
    <motion.div
      className="page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero__bg-orbs" aria-hidden="true">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
        </div>
        <div className="hero__watermark" aria-hidden="true" />
        <div className="container hero__content">
          <AnimatedSection>
            <motion.div
              className="hero__logo-wrap"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <img src="/cloie-logo.png" alt="CLOIE logo" className="hero__logo" />
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="hero__title">
              PROJECT CLOIE
            </h1>
            <p className="hero__tagline">
              The Development of a System for Comprehensive Learning Outcomes and Instructional Evaluation
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="hero__desc">
              A blog-style academic showcase presenting the Project CLOIE capstone for structured outcomes monitoring, stakeholder-based evaluation, and continuous quality improvement.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <p className="hero__subline">
              ITE 1 – Web System Technologies 1 · Capstone Documentation Summaries
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="hero__chips">
              <span className="chip">3 chapter summaries</span>
              <span className="chip">6 stakeholder groups</span>
              <span className="chip">March – September 2026</span>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <div className="hero__actions">
              <Link to="/chapter1" className="btn btn-primary">
                <BookOpen size={18} />
                Read Chapters 1–3
              </Link>
              <a href="#about" className="btn btn-outline">
                Explore the Project
                <ArrowRight size={16} />
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="section">
        <div className="container">
          <AnimatedSection>
            <h2 className="section-title">About Project CLOIE</h2>
            <p className="section-subtitle">A centralized, college-level proposal for evaluating outcomes and consolidating stakeholder evidence.</p>
          </AnimatedSection>

          <div className="grid-2 about__grid">
            <AnimatedSection delay={0.1}>
              <div className="about__text">
                <p><strong>Project CLOIE</strong> is proposed as a digital evaluation platform for monitoring Program Learning Outcomes (PLOs) and Graduate Outcomes (GOs) across academic programs.</p>
                <p>The project positions outcomes monitoring as a structured academic process by integrating stakeholder feedback, report generation, and support for Plan-Do-Check-Act cycles.</p>
                <ul className="about__highlights">
                  <li>Supports program-level outcomes monitoring and review</li>
                  <li>Collects evidence from students, graduates, alumni, and industry</li>
                  <li>Generates structured summaries for QA and accreditation support</li>
                  <li>Focuses on evaluation and reporting, not LMS/SIS or grading</li>
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} direction="left">
              <div className="about__panel">
                <span className="about__panel-icon">🎓</span>
                <h3 className="about__panel-title">Academic-Focused by Design</h3>
                <p>CLOIE is presented as a capstone proposal website emphasizing clarity, institutional credibility, and chapter-based academic storytelling.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section id="problem" className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <h2 className="section-title">Why the Project Matters</h2>
            <p className="section-subtitle">CLOIE addresses documented gaps in manual outcomes monitoring, evidence consolidation, and decision-ready reporting.</p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="problem__lead">Assumption College of Davao needs a more systematic mechanism to centralize evaluation data, support accreditation preparation, and strengthen curriculum relevance.</p>
          </AnimatedSection>

          <motion.div
            className="grid-2"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {problems.map((item, i) => (
              <motion.div key={i} className="card card--problem" variants={fadeUp}>
                <span className="card-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="section">
        <div className="container">
          <AnimatedSection>
            <h2 className="section-title">Key Features of CLOIE</h2>
            <p className="section-subtitle">Structured outcomes monitoring, stakeholder evidence, and data-supported decision workflows.</p>
          </AnimatedSection>

          <motion.div
            className="grid-3"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {features.map((item, i) => (
              <motion.div key={i} className="card card--feature" variants={fadeUp}>
                <div className="card__icon-wrap">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== BENEFITS ===== */}
      <section id="benefits" className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <h2 className="section-title">Who Benefits from CLOIE</h2>
            <p className="section-subtitle">Supporting institutional quality goals while improving evidence access for key academic groups.</p>
          </AnimatedSection>

          <motion.div
            className="grid-2 benefits__grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {benefits.map((item, i) => (
              <motion.div
                key={i}
                className={`card card--benefit card--benefit-${item.variant}`}
                variants={fadeUp}
              >
                <div className="card__icon-wrap card__icon-wrap--sm">{item.icon}</div>
                <h3>{item.title}</h3>
                <ul className="benefits__list">
                  {item.items.map((text, j) => (
                    <li key={j}>{text}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== STAKEHOLDERS ===== */}
      <section id="stakeholders" className="section">
        <div className="container">
          <AnimatedSection>
            <h2 className="section-title">Intended Users & Stakeholders</h2>
            <p className="section-subtitle">Designed for the academic groups directly involved in outcomes evaluation and program review.</p>
          </AnimatedSection>

          <motion.div
            className="grid-3 stakeholders__grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {stakeholders.map((item, i) => (
              <motion.div key={i} className="card card--stakeholder" variants={fadeUp}>
                <span className="card-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== CHAPTERS ===== */}
      <section id="chapters" className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <h2 className="section-title">Capstone Chapter Summaries</h2>
            <p className="section-subtitle">Move from project overview to structured chapter summaries designed for web readability.</p>
          </AnimatedSection>

          <motion.div
            className="grid-3 chapters__grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {chapters.map((ch, i) => (
              <motion.div key={i} className="card card--chapter" variants={fadeUp}>
                <span className="badge">Chapter {ch.num}</span>
                <h3>{ch.title}</h3>
                <p>{ch.desc}</p>
                <Link to={`/chapter${ch.num}`} className="btn btn-primary btn--sm">
                  Read Summary <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}

            <motion.div className="card card--chapter card--refs" variants={fadeUp}>
              <span className="badge badge-gold">Resources</span>
              <h3>References</h3>
              <p>Browse the APA-style source list behind the Chapter 1 to 3 summaries.</p>
              <Link to="/references" className="btn btn-primary btn--sm">
                Open References <ArrowRight size={14} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== SPONSOR ===== */}
      <section id="sponsor" className="section">
        <div className="container">
          <AnimatedSection>
            <h2 className="section-title">Project Client / Academic Lead</h2>
            <p className="section-subtitle">The academic leadership and institutional direction behind PROJECT CLOIE.</p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="sponsor__wrap">
              <div className="card card--sponsor">
                <img src="/client.png" alt="Client" className="team__photo" />
                <h3 className="team__name">Ms. Roselyn M. Biala, MIT</h3>
                <span className="team__role team__role--gold">Project Client / Academic Lead</span>
                <p className="team__bio">Provides academic direction and ensures PROJECT CLOIE aligns with institutional requirements, outcomes-based education principles, and accreditation standards.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ===== TEAM ===== */}
      <section id="team" className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <h2 className="section-title">A² Team</h2>
            <p className="section-subtitle">The proponents and academic guidance behind PROJECT CLOIE.</p>
          </AnimatedSection>

          <motion.div
            className="grid-3 team__grid"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            {team.map((member, i) => (
              <motion.div key={i} className="card card--team" variants={fadeUp}>
                <img src={member.img} alt={member.name} className="team__photo" />
                <h3 className="team__name">{member.name}</h3>
                <span className="team__role">{member.role}</span>
                <p className="team__bio">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
