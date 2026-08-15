import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react'
import AnimatedSection from '../components/AnimatedSection'
import './References.css'

const references = [
  { text: 'ABET. (2024). 99 additional programs accredited in 2023-2024 cycle.', url: 'https://www.abet.org/99-additional-programs-accredited-in-2023-2024-cycle/' },
  { text: 'Alenezi, M., & Akour, M. (2023). Digital transformation blueprint in higher education: A case study of PSU. Sustainability, 15(10), 8204.', url: 'https://doi.org/10.3390/su15108204' },
  { text: 'Alyasin, A., Nasser, R., El Hajj, M., & Harb, H. (2023). Assessing learning outcomes in higher education: From practice to systematization. TEM Journal, 12(3), 1593-1604.', url: 'https://doi.org/10.18421/TEM123-41' },
  { text: 'Assumption College of Davao. (2026). College Department.', url: 'https://www.acd.edu.ph/acd/college-department/' },
  { text: 'Babaran Jr., C. (2025). Development of a web-based platform for alumni employability and career tracking.', url: 'https://ejiss.com/index.php/journal/article/view/16' },
  { text: 'Basson, M., Du Plessis, T., & Brink, R. (2023). Visual representation of the mismatch between industry skills demand and higher education skills supply. IJWIL, 24(1), 117-139.', url: 'https://www.ijwil.org/files/IJWIL_24_1_117_139.pdf' },
  { text: 'Bennett, L. K. L., Sloan, K., & Varner, T. L. (2023). Faculty and assessment practitioner needs for student learning outcomes assessment.', url: 'https://doi.org/10.61669/001c.84194' },
  { text: 'Chen, L., Geng, X., Lu, M., Shimada, A., & Yamada, M. (2023). How students use learning analytics dashboards in higher education. SAGE Open, 13(3).', url: 'https://doi.org/10.1177/21582440231192151' },
  { text: 'Commission on Higher Education. (2014). Handbook on typology, outcomes-based education, and institutional sustainability assessment.', url: 'https://www.foi.gov.ph/agencies/ched/' },
  { text: 'Commission on Higher Education. (2020). CMO No. 4, series of 2020: Guidelines on the implementation of flexible learning.', url: 'https://chedro3.ched.gov.ph/wp-content/uploads/2020/09/CMO-No.-4-s.-2020-Guidelines-on-the-Implementation-of-Flexible-Learning.pdf' },
  { text: 'Commission on Higher Education. (2022). CMO No. 6, series of 2022: Sustaining flexible learning in higher education.', url: 'https://ofa.upd.edu.ph/wp-content/uploads/2022/06/CMO-NO-.-6-S.-2022.pdf' },
  { text: 'Commission on Higher Education Regional Office XI. (2024). HEIs with accredited programs.', url: 'https://ro11.ched.gov.ph/heis-with-accredited-programs/' },
  { text: 'Commission on Higher Education Regional Office XI. (2024). CHEDRO XI unveils online monitoring tool.', url: 'https://ro11.ched.gov.ph/2024/06/13/implementation-of-new-strategies/' },
  { text: 'Commission on Higher Education Regional Office XI. (2025). CHED RO XI orients HEI academic leaders on 2025 Program Monitoring System.', url: 'https://ro11.ched.gov.ph/2025/04/08/' },
  { text: 'Commission on Higher Education Regional Office XI. (2025, September 26). CODEE XI and CHEDRO XI hold 1st regional industry-government-academe fora.', url: 'https://ro11.ched.gov.ph/2025/09/26/' },
  { text: 'El Marsafawy, H., Roy, R., & Ali, F. (2022). Measuring learning outcomes: Bridging accreditation requirements and LMS functionalities. QA in Education, 30(4), 555-570.', url: 'https://doi.org/10.1108/QAE-11-2021-0186' },
  { text: 'Goss, H. (2022). Student learning outcomes assessment in higher education and in academic libraries: A review. J. of Academic Librarianship, 48(2), 102485.', url: 'https://doi.org/10.1016/j.acalib.2021.102485' },
  { text: 'Javed, S., & Alenezi, M. (2023). A case study on sustainable quality assurance in higher education. Sustainability, 15(10), 8136.', url: 'https://doi.org/10.3390/su15108136' },
  { text: 'Mahalingam, T. (2024). Bridging the gap between academia and industry. IJBPM, 25(4), 589-603.', url: 'https://doi.org/10.1504/IJBPM.2024.139482' },
  { text: 'Mariano Marcos State University Alumni Relations Office. (2026). Web-based graduate tracer survey.', url: 'https://alumni.mmsu.edu.ph/news/web-based-graduate-tracer-survey-of-the-alumni-relations' },
  { text: 'Marinoni, G., van\'t Land, H., & Jensen, T. (2020). The impact of COVID-19 on higher education around the world. IAU.', url: 'https://iau.global/all-publications/' },
  { text: 'Microsoft. (2024). Oklahoma State University simplified student outcomes assessment.', url: 'https://www.microsoft.com/en/customers/story/1755181021176347056-oklahoma-state-university-azure-higher-education-en-united-states' },
  { text: 'Nabablit, K. J. E., & Dajao, E. S. (2023). Development of a web-based graduate tracer information system. Springer LNNS, Vol. 694, pp. 601-611.', url: 'https://doi.org/10.1007/978-981-99-3091-3_50' },
  { text: 'Penn State OPAIR. (2024). Nuventive.', url: 'https://opair.psu.edu/assessment/nuventive/' },
  { text: 'Ramaswami, et al. (2023). Effectiveness of a learning analytics dashboard for increasing student engagement.', url: 'https://doi.org/10.18608/jla.2023.7935' },
  { text: 'Reyes et al. (2025). Evaluating employment outcomes and program relevance: A tracer study of Laguna University\'s College of Education graduates.', url: null },
  { text: 'Samuel, S., & Farrer, H. (2025). Integrating the PDCA cycle for continuous improvement. JCIHE, 17(2), Article 12.', url: 'https://doi.org/10.32674/yzwgmy25' },
  { text: 'Sarsale, M., Garcia, C., & Uy, I. M. (2024). Dimensions of program relevance towards employment success. JTLGE, 15(1).', url: 'https://doi.org/10.21153/jtlge2024vol15no1art1895' },
  { text: 'Swedish Higher Education Authority. (2025). Quality assurance and quality development 2024.', url: 'https://www.uka.se/download/18.110125911969f535f999/1746776376009/' },
  { text: 'Tutor, M. V., Orbeta, A. C., Jr., & Miraflor, J. M. B. (2019). The 4th Philippine Graduate Tracer Study. PIDS Discussion Paper No. 2019.', url: 'https://pidswebs.pids.gov.ph/CDN/PUBLICATIONS/pidsdps1926.pdf' },
  { text: 'UNESCO. (2026). Assessment for improved learning outcomes.', url: 'https://www.unesco.org/en/learning-assessments' },
  { text: 'UNESCO, Cedefop, ETF, & UNESCO-UIL. (2023). Global inventory of national and regional qualifications frameworks 2022, vol. I. UNESCO.', url: 'https://doi.org/10.54675/KUZZ6891' },
  { text: 'University of Guam. (2024). Nuventive Improvement assessment and program review management system.', url: 'https://www.uog.edu/_resources/files/faculty-senate/2024-Nuventive-Improvement-Assessment-and-Program-Review-Management-System.pdf' },
  { text: 'University of Mindanao. (2026). Educational organization quality policy and objectives.', url: 'https://www.umindanao.edu.ph/index.php/qpo' },
  { text: 'University of Mindanao. (2026). Quality Management Office (QMO).', url: 'https://umindanao.edu.ph/tour/facility/37' },
  { text: 'University of North Dakota. (2026). Planning & self-study software support.', url: 'https://und.edu/academics/provost/assessment-accreditation/planning-self-study.html' },
  { text: 'University of Oslo. (2024). Quality system for educational activities at UiO.', url: 'https://www.uio.no/english/about/regulations/studies/quality-assurance/' },
  { text: 'University of Santo Tomas Office of Alumni Relations. (2026). Thomasian Graduate Tracer Study (TGTS).', url: 'https://alumnirelations.ust.edu.ph/article?id=108&t=a' },
  { text: 'University of Southeastern Philippines. (2024). USeP: First SUC in Mindanao to receive PQA Level III recognition.', url: 'https://www.usep.edu.ph/blog/2024/07/24/' },
  { text: 'University of Southeastern Philippines OVPQUA. (2019). Quality Assurance Division.', url: 'https://www.usep.edu.ph/ovpqua/divisions-and-units/quality-assurance-division/' },
  { text: 'University of the Philippines. (2018). About the UP System quality assurance.', url: 'https://qa.up.edu.ph/about' },
  { text: 'University of the Philippines. (2025). QA Portal.', url: 'https://qaportal.up.edu.ph/' },
  { text: 'University of the Philippines. (2021). External quality assurance.', url: 'https://qa.up.edu.ph/external-quality-assurance' },
  { text: 'World Economic Forum. (2023). The future of jobs report 2023.', url: 'https://www.weforum.org/publications/the-future-of-jobs-report-2023/' },
]

export default function References() {
  return (
    <motion.div
      className="page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <section className="refs-banner">
        <div className="refs-banner__orbs" aria-hidden="true">
          <div className="refs-banner__orb refs-banner__orb--1" />
          <div className="refs-banner__orb refs-banner__orb--2" />
        </div>
        <div className="container refs-banner__content">
          <AnimatedSection>
            <span className="badge">References</span>
            <h1 className="refs-banner__title">Sources and Bibliography</h1>
            <p className="refs-banner__desc">This page presents the full capstone reference list used as the source bibliography for the CLOIE showcase.</p>
            <div className="refs-banner__meta">
              <span className="chip">APA 7 style</span>
              <span className="chip">Full capstone bibliography</span>
              <span className="chip">Based on capstone documentation</span>
            </div>
            <p className="refs-banner__breadcrumb">
              <Link to="/">Home</Link> / References
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AnimatedSection>
            <article className="chapter-article">
              <h2>Full Capstone Reference List</h2>
              <p>The entries below mirror the references documented in the capstone source file used for this showcase.</p>
              <ol className="reference-list">
                {references.map((ref, i) => (
                  <li key={i}>
                    {ref.text}{' '}
                    {ref.url && (
                      <a href={ref.url} target="_blank" rel="noopener noreferrer">
                        {ref.url} <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
                      </a>
                    )}
                  </li>
                ))}
              </ol>
            </article>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <nav className="chapter-nav" style={{ marginTop: 32 }}>
              <Link to="/" className="btn btn-outline">
                <ArrowLeft size={16} /> Back to Home
              </Link>
              <Link to="/" className="btn btn-ghost">
                Chapter Overview
              </Link>
              <Link to="/chapter3" className="btn btn-primary">
                Back to Chapter 3 <ArrowRight size={16} />
              </Link>
            </nav>
          </AnimatedSection>
        </div>
      </section>

      <div style={{ height: 40 }} />
    </motion.div>
  )
}
