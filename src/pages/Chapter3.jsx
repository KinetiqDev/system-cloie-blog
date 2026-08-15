import ChapterLayout from '../components/ChapterLayout'
import AnimatedSection from '../components/AnimatedSection'

const jumpLinks = [
  { href: 'framework', label: 'Software Development Framework' },
  { href: 'requirements', label: 'Requirements' },
  { href: 'stack', label: 'Software and Hardware' },
  { href: 'feasibility', label: 'Feasibility Issues' },
]

const kanbanStages = [
  { title: 'Backlog', desc: 'All planned features, requirements, and refinements are listed and prioritized.' },
  { title: 'To Do', desc: 'Ready tasks are selected based on priority, dependencies, and milestone relevance.' },
  { title: 'In Progress', desc: 'Active implementation focuses on core modules before layered enhancements.' },
  { title: 'Testing', desc: 'Built tasks are validated for correctness, usability, and expected behavior.' },
  { title: 'Done', desc: 'Verified tasks are marked complete and retained as stable increments.' },
]

export default function Chapter3() {
  return (
    <ChapterLayout
      chapterNum={3}
      title="Methodology"
      description="Summary of CLOIE's software development framework, requirements, software and hardware needs, and feasibility issues."
      jumpLinks={jumpLinks}
      prevChapter={2}
    >
      <AnimatedSection>
        <article id="framework" className="chapter-article">
          <h2>3.1 Software Development Framework</h2>
          <p>Chapter 3 frames CLOIE development as a structured yet flexible process: tasks are visualized, prioritized continuously, and refined through feedback while staying aligned with capstone milestones. This aligns with Kanban's emphasis on workflow visibility and flow management (Anderson, 2010).</p>
          <div className="method-grid">
            {kanbanStages.map((stage, i) => (
              <div key={i} className="method-card">
                <h3>{stage.title}</h3>
                <p>{stage.desc}</p>
              </div>
            ))}
          </div>
          <figure className="figure-container">
            <img src="/Kanban-workflow-figure.png" alt="Kanban board workflow showing the five stages" className="figure-image" />
            <figcaption className="figure-caption">Figure 4. Kanban Board Workflow Stages</figcaption>
          </figure>
          <div className="key-insight">
            <h3>Why Kanban Was Selected</h3>
            <p>The capstone documentation highlights Kanban's fit for a small team with evolving requirements. It supports visible progress, continuous reprioritization, and incremental delivery without sprint overhead while still preserving milestone discipline.</p>
          </div>
        </article>
      </AnimatedSection>

      <AnimatedSection>
        <article id="requirements" className="chapter-article">
          <h2>3.2 Requirements</h2>
          <p>The requirements specification is organized into user expectations, required system behaviors, and quality constraints that keep CLOIE practical, secure, and maintainable.</p>
          <div className="requirement-grid">
            <div className="requirement-card">
              <h3>3.2.1 User Requirements</h3>
              <p>CLOIE supports role-specific workflows for all intended stakeholder groups:</p>
              <div className="chip-group">
                {['Faculty', 'Students', 'Graduating Students', 'Alumni', 'Industry Partners', 'Program Heads & Deans', 'System Admins'].map(r => (
                  <span key={r} className="chip">{r}</span>
                ))}
              </div>
              <ul style={{ marginTop: 12 }}>
                <li>Stakeholders require secure, role-based access and context-specific outputs.</li>
                <li>Users need clear forms, confidentiality protection, and efficient participation.</li>
                <li>Program-level customization must remain controlled and isolated by design.</li>
              </ul>
            </div>

            <div className="requirement-card">
              <h3>3.2.2 Functional Requirements</h3>
              <p>The system must deliver core end-to-end modules:</p>
              <ul>
                <li>User and access management</li>
                <li>Outcomes management (PLOs, GOs, course-level mappings)</li>
                <li>Evaluation instrument management with version control</li>
                <li>Evaluation cycle configuration and control</li>
                <li>Response collection, validation, and processing</li>
                <li>Analytics and consolidated reporting</li>
                <li>Qualitative feedback handling</li>
                <li>Administrative configuration and governance controls</li>
              </ul>
            </div>

            <div className="requirement-card">
              <h3>3.2.3 Non-Functional Requirements</h3>
              <p>Quality standards ensure the platform remains dependable:</p>
              <div className="chip-group">
                {['Usability', 'Performance', 'Security', 'Confidentiality', 'Reliability', 'Scalability', 'Availability', 'Responsiveness', 'Maintainability'].map(q => (
                  <span key={q} className="chip">{q}</span>
                ))}
              </div>
              <p style={{ marginTop: 10 }}>These constraints align with CLOIE's role as a multi-user, report-oriented, college-level monitoring system.</p>
            </div>
          </div>
        </article>
      </AnimatedSection>

      <AnimatedSection>
        <article id="stack" className="chapter-article">
          <h2>3.2.4 Software and Hardware Requirements</h2>
          <div className="stack-grid">
            <div className="stack-card">
              <h3>Software Requirements</h3>
              <h4>Development Software</h4>
              <ul>
                <li>Windows 10/11, Visual Studio Code, Git/GitHub</li>
                <li>Figma and modeling tools (Visual Paradigm/Draw.io)</li>
                <li>Browser testing via Chrome, Firefox, Edge, or Safari</li>
              </ul>
              <h4>Application Development Stack</h4>
              <ul>
                <li>Next.js and TypeScript</li>
                <li>Tailwind CSS and shadcn/ui</li>
                <li>React Hook Form, Zod, TanStack Query</li>
                <li>Chart.js, Recharts, wordcloud2.js, winkNLP, stopword</li>
                <li>PostgreSQL and Supabase</li>
                <li>Vitest and Playwright</li>
              </ul>
              <h4>Deployment Services</h4>
              <ul>
                <li>Cloud hosting suitable for web/PWA deployment</li>
                <li>Vercel-equivalent frontend deployment</li>
                <li>Supabase-equivalent managed backend/database services</li>
              </ul>
            </div>

            <div className="stack-card">
              <h3>Hardware Requirements</h3>
              <h4>For Development</h4>
              <ul>
                <li>Intel Core i5 / Ryzen 5 or higher</li>
                <li>At least 8 GB RAM</li>
                <li>At least 256 GB SSD</li>
                <li>Stable broadband internet connection</li>
              </ul>
              <h4>For End Users</h4>
              <ul>
                <li>Desktop, laptop, tablet, or smartphone</li>
                <li>Modern web browser</li>
                <li>Stable internet access</li>
              </ul>
              <p style={{ marginTop: 10 }}>This hardware profile supports cross-device access for all stakeholder groups.</p>
            </div>
          </div>
        </article>
      </AnimatedSection>

      <AnimatedSection>
        <article id="feasibility" className="chapter-article">
          <h2>3.3 Feasibility Issues</h2>
          <p>Feasibility analysis evaluates whether CLOIE is practical to build and adopt within capstone constraints.</p>
          <figure className="figure-container">
            <img src="/gantt-chart.png" alt="Project timeline showing development phases from March to September 2026" className="figure-image" />
            <figcaption className="figure-caption">Figure 5. Project Timeline (March–September 2026)</figcaption>
          </figure>
          <div className="feasibility-grid">
            {[
              ['3.3.1 Economic Feasibility', 'The proposed web/PWA direction is financially realistic for a student-led project because it avoids separate native implementations and leverages widely available tools and cloud services.'],
              ['3.3.2 Technical Feasibility', "CLOIE's required modules fit modern web architecture and relational data structures, with incremental delivery possible from core modules to advanced reporting features."],
              ['3.3.3 Operational Feasibility', 'The system aligns with existing academic practices at Assumption College of Davao and complements current institutional systems rather than replacing LMS/SIS workflows.'],
              ['3.3.4 Schedule Feasibility', 'The March to September 2026 timeline is workable through staged milestones, early core-module prioritization, and continuous Kanban-guided progress.'],
            ].map(([title, desc], i) => (
              <div key={i} className="feasibility-card">
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </article>
      </AnimatedSection>
    </ChapterLayout>
  )
}
