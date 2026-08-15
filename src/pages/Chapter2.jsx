import ChapterLayout from '../components/ChapterLayout'
import AnimatedSection from '../components/AnimatedSection'

const jumpLinks = [
  { href: 'literature', label: 'Related Literature' },
  { href: 'studies', label: 'Related Studies' },
  { href: 'systems', label: 'Related Systems' },
  { href: 'synthesis', label: 'Synthesis' },
]

const literature = [
  { tag: '2.1.1', title: 'Outcome-Based Education in Higher Education', desc: 'OBE emphasizes measurable competencies and requires institutions to define outcomes, gather evidence, and use findings for improvement (ABET, 2024; University of the Philippines, 2025).', points: ['Shifts evaluation from content coverage to demonstrated attainment', 'Supports CLOIE\'s focus on PLO/GO/CILO monitoring'] },
  { tag: '2.1.2', title: 'Learning Outcomes Assessment', desc: 'Outcomes assessment requires direct and indirect evidence workflows beyond grades, including mapped indicators and attainment thresholds (Goss, 2022).', points: ['Assessment becomes difficult when evidence is scattered', 'CLOIE addresses this through structured consolidation'] },
  { tag: '2.1.3', title: 'Quality Assurance in Higher Education', desc: 'Quality assurance depends on systematic documentation, review practices, and reliable indicators rather than compliance-only routines (Javed & Alenezi, 2023; University of the Philippines, 2025).', points: ['Evidence organization is central to credible QA', 'CLOIE aligns with QA-oriented reporting needs'] },
  { tag: '2.1.4', title: 'Continuous Quality Improvement in Academic Programs', desc: 'CQI frameworks like PDCA rely on recurring data interpretation to move from reporting toward actionable enhancement (Samuel & Farrer, 2025).', points: ['Evidence quality determines usefulness of improvement cycles', 'CLOIE strengthens the "check" stage through consolidated outputs'] },
  { tag: '2.1.5', title: 'Curriculum Relevance and Industry Alignment', desc: 'Labor-market shifts require periodic recalibration of outcomes and competencies using external stakeholder insights (World Economic Forum, 2023; Mahalingam, 2024).', points: ['Industry-informed review can reveal hidden competency gaps', 'CLOIE integrates graduate and employer perspectives'] },
  { tag: '2.1.6', title: 'Graduate Employability as Program-Relevance Indicator', desc: 'Employability and tracer evidence help validate whether program outcomes remain meaningful beyond classroom completion (Sarsale et al., 2024; Reyes et al., 2025).', points: ['Post-graduation alignment is a practical relevance measure', 'CLOIE extends monitoring into readiness and workplace fit'] },
]

const studies = [
  { tag: '2.2.1', title: 'Studies on Learning Outcomes Assessment', desc: 'Research shows outcomes review remains difficult when tools and evidence are disconnected (Goss, 2022; El Marsafawy et al., 2022; Alyasin et al., 2023).', what: 'outcomes assessment workflows', found: 'manual and scattered approaches are inefficient', why: 'CLOIE provides repeatable evidence consolidation' },
  { tag: '2.2.2', title: 'Studies on Curriculum Alignment and Industry Demands', desc: 'External review, especially from industry, helps identify curriculum gaps (Mahalingam, 2024; World Economic Forum, 2023).', what: 'curriculum relevance mechanisms', found: 'stakeholder participation improves alignment quality', why: 'CLOIE integrates industry and graduate evidence' },
  { tag: '2.2.3', title: 'Studies on Graduate Employability and Tracer Studies', desc: 'Tracer findings reveal areas where graduate outcomes and employment alignment still diverge (Sarsale et al., 2024; Reyes et al., 2025; Nabablit & Dajao, 2023).', what: 'post-graduation relevance and alignment', found: 'employability signals can reveal outcome gaps', why: 'CLOIE links outcomes monitoring to external readiness' },
  { tag: '2.2.4', title: 'Studies on Stakeholder-Based Evaluation', desc: 'No single respondent group provides a complete quality picture; multi-stakeholder evidence produces stronger interpretation (Mahalingam, 2024; Sarsale et al., 2024; Reyes et al., 2025).', what: 'comparative value of stakeholder inputs', found: 'combined respondent perspectives improve credibility', why: 'CLOIE is designed around multi-source evaluation' },
  { tag: '2.2.5', title: 'Studies on Learning Analytics', desc: 'Dashboard-driven analytics improve interpretation when they move beyond storage toward actionable patterns (Chen et al., 2023; Ramaswami et al., 2023).', what: 'dashboard use and engagement effects', found: 'analytics is useful when it supports interpretation', why: 'CLOIE includes reporting for evidence-based decisions' },
  { tag: '2.2.6', title: 'Studies on Digital Assessment and Monitoring Platforms', desc: 'Digital systems consistently improve data organization, usability, and reporting compared with manual processes (El Marsafawy et al., 2022; Nabablit & Dajao, 2023).', what: 'practical platform outcomes', found: 'centralized systems improve monitoring quality', why: 'CLOIE operationalizes these strengths at college scope' },
]

const systems = [
  { title: '2.3.1 Nuventive / Penn State Assessment Management System', does: 'Centralizes learning outcomes documentation, curriculum mapping, reporting, and action planning.', relevance: 'Shows how outcomes evidence and dashboards can coexist in one continuous assessment environment.' },
  { title: '2.3.2 Oklahoma State University Assessment Platform', does: 'Combines Nuventive with cloud analytics for scalable reporting and high program adoption.', relevance: 'Demonstrates that centralized assessment workflows can be implemented and adopted effectively.' },
  { title: '2.3.3 University of the Philippines QA Portal', does: 'Integrates internal/external QA flows, evidence submission, review schedules, and multi-source survey environments.', relevance: 'Confirms that Philippine HEIs can operationalize centralized quality systems and stakeholder feedback channels.' },
  { title: '2.3.4 CHED / Regional Monitoring Systems', does: 'Supports region-level digital monitoring, submission workflows, and analytics-based oversight.', relevance: 'Reinforces the policy and governance relevance of structured, transparent data workflows.' },
  { title: '2.3.5 Graduate Tracer / Outcomes Monitoring Systems', does: 'Collects and organizes alumni evidence over time through dedicated digital platforms.', relevance: 'Supports CLOIE\'s goal of linking outcomes monitoring with post-graduation relevance indicators.' },
]

export default function Chapter2() {
  return (
    <ChapterLayout
      chapterNum={2}
      title="Review of Related Literature, Studies, and Systems"
      description="Summary of the conceptual, empirical, and systems-level foundations that justify the development of CLOIE."
      jumpLinks={jumpLinks}
      prevChapter={1}
      nextChapter={3}
    >
      <AnimatedSection>
        <article id="literature" className="chapter-article">
          <h2>2.1 Related Literature</h2>
          <p>The literature establishes the conceptual basis of CLOIE: outcomes should be measurable, evidence should be organized, and academic decisions should be supported by recurring stakeholder-informed review cycles.</p>
          <div className="topic-grid">
            {literature.map((item, i) => (
              <div key={i} className="topic-card">
                <span className="topic-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <ul>
                  {item.points.map((p, j) => <li key={j}>{p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </article>
      </AnimatedSection>

      <AnimatedSection>
        <article id="studies" className="chapter-article">
          <h2>2.2 Related Studies</h2>
          <p>The reviewed studies provide empirical support for CLOIE by showing the limits of fragmented workflows and the value of integrated analytics, stakeholder evidence, and centralized reporting.</p>
          <div className="topic-grid">
            {studies.map((item, i) => (
              <div key={i} className="topic-card">
                <span className="topic-tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <ul>
                  <li><strong>What was examined:</strong> {item.what}</li>
                  <li><strong>What was found:</strong> {item.found}</li>
                  <li><strong>Why it matters:</strong> {item.why}</li>
                </ul>
              </div>
            ))}
          </div>
        </article>
      </AnimatedSection>

      <AnimatedSection>
        <article id="systems" className="chapter-article">
          <h2>2.3 Related Systems</h2>
          <p>The systems review demonstrates operational feasibility: institutions already use centralized platforms for outcomes documentation, analytics, and quality processes.</p>
          <div className="system-grid">
            {systems.map((item, i) => (
              <div key={i} className="system-card">
                <h3>{item.title}</h3>
                <p><strong>What it does:</strong> {item.does}</p>
                <p><strong>Relevance to CLOIE:</strong> {item.relevance}</p>
              </div>
            ))}
          </div>
        </article>
      </AnimatedSection>

      <AnimatedSection>
        <article id="synthesis" className="chapter-article">
          <h2>2.4 Synthesis of Reviewed Literature, Studies, and Systems</h2>
          <p>Chapter 2 concludes that CLOIE is justified because the reviewed evidence consistently points to the need for a focused, integrated, and decision-oriented outcomes monitoring platform at college/program level.</p>
          <div className="synthesis-panel">
            <h3>Chapter 2 Takeaways</h3>
            <ul>
              <li><strong>What the literature established:</strong> modern higher education expects structured evidence for quality and accreditation decisions.</li>
              <li><strong>What the studies confirmed:</strong> manual and fragmented workflows weaken interpretation, consistency, and actionability.</li>
              <li><strong>What the systems demonstrated:</strong> centralized platforms can operationalize outcomes documentation and reporting at scale.</li>
              <li><strong>What remains insufficiently addressed:</strong> a scoped platform that combines outcomes monitoring, multi-stakeholder feedback, and integrated reporting in one college-level environment.</li>
              <li><strong>Why CLOIE is justified:</strong> it targets this integration gap while remaining practical and aligned with institutional QA needs.</li>
            </ul>
          </div>
        </article>
      </AnimatedSection>
    </ChapterLayout>
  )
}
