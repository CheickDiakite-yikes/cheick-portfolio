import { Download } from "lucide-react";

const skills = {
  "Languages & Platforms": [
    "React",
    "TypeScript",
    "Python",
    "SQL (PostgreSQL)",
    "Object Storage",
    "Google Cloud Platform",
    "Vertex AI",
  ],
  "AI / ML": [
    "OpenAI",
    "Gemini",
    "DeepSeek",
    "Claude",
    "OpenRouter",
    "Llama",
    "RAG",
    "Orchestrator Architectures",
    "Prompt Engineering",
  ],
  Business: [
    "Financial Modeling",
    "LBOs",
    "M&A",
    "DCFs",
    "B2B GTM",
    "Fundraising",
    "Investor Relations",
    "Investment Banking",
    "Private Equity",
  ],
};

const experience = [
  {
    title: "AI Researcher and Tester (Gemini API & AI Studio Early Access Program)",
    company: "Google",
    location: "Remote",
    date: "Dec 2025 - Current",
    points: ["shhhh (NDA)."],
    transactions: [],
  },
  {
    title: "Founding Product & Lead AI Engineer (Techstars)",
    company: "DiDi Inc.",
    location: "Boston, MA",
    date: "May 2024 - Current",
    points: [
      "US-based Venture and Techstars-backed B2B AI Startup for Private Equity with $440K 2025E Revenue.",
      "Develop and launch AI tools on GCP and Gemini for investment due diligence and memos; cut memo first-draft time 70-90%.",
      "Designed RAG pipelines on Replit PostgreSQL and implemented hybrid search (semantic + keyword) to reduce hallucinations by 40%.",
      "Converted pilots to paid enterprise design-partners across 15 firms (e.g., HIG, Moelis) by translating 110+ user interviews into roadmap execution.",
    ],
    transactions: [],
  },
  {
    title: "Private Equity Associate",
    company: "Siguler Guff & Company",
    location: "Boston, MA",
    date: "Oct 2023 - Apr 2024",
    points: [
      "Evaluated and sensitized 50+ business and financial models of LMM private companies for co-investment opportunities.",
      "Pitched 12+ investment ideas for a $7.5B fund managed by 13 investment professionals.",
      "Advised underlying companies and managers on strategic products and M&A expansion.",
      "Led team's first internal AI product/workflow integration to improve process efficiency.",
    ],
    transactions: [
      "$UND fund of funds investment in fund's first software investment (Closed).",
      "$UND majority investment in a supplier of windows, doors, and hardware for high-end custom homes (Closed).",
      "$UND majority investment in a full-service elevator company (Closed).",
    ],
  },
  {
    title: "Tech Investment Banking Analyst",
    company: "SVB Securities",
    location: "Boston, MA",
    date: "Sep 2021 - Aug 2023",
    points: [
      "Built comps/precedents/LBOs and authored CIMs, teasers, board decks; managed model Q&A, NDAs, and data room hygiene.",
      "Supported 25+ sell-side mandate pitches by building market maps, buyer universes (150+ strategics and sponsors), and valuation packs.",
      "Partnered with MDs to pressure-test positioning (ICP, win/loss drivers, NRR/GRR, margins) and anticipate diligence Q&A.",
    ],
    transactions: [
      "$8.0B infrastructure software transaction for a sponsor (Closed).",
      "$600M facilities management software transaction for a sponsor (Closed).",
      "$2.0B fintech transaction for a sponsor (Failed).",
    ],
  },
  {
    title: "WM Analyst",
    company: "Morgan Stanley",
    location: "Boston, MA",
    date: "Jun 2020 - Sep 2021",
    points: [
      "Analyzed public securities and capital markets to deliver investment insights for clients and advisors.",
      "Performed portfolio analysis to ensure advisor/client alignment and support reporting workflows.",
    ],
    transactions: [],
  },
];

const sideSections = {
  projects: [
    {
      title: "Full-Stack AI Products",
      date: "Nov 2024 - Current",
      detail: "Code and ship hackathon-winning apps using Gemini, OpenAI, and TypeScript - cheickdiakite.com/portfolio.",
    },
    {
      title: "Chasing Green (Stock Investing & Trading Book)",
      date: "Dec 2020 - Feb 2021",
      detail: "Authored and published a beginner learning guide on investing and trading as a self-directed senior project.",
    },
  ],
  education: [
    "Bentley University, Waltham, MA",
    "B.S. Economics-Finance, Minor in Computer Science",
    "GPA: 3.8",
  ],
  awards: [
    "Google DeepMind Hackathon Winner, Nano Banana (Gemini-2.5-Flash-Image) Hackathon (Oct 2025)",
    "Series 7 & 79, Investment Banking Representatives and General Securities Representative Exam (Dec 2021)",
    "Series 66, Uniform Combined State Law Exam (Aug 2021)",
  ],
  athletics: ["Bentley University Varsity Football Team (DII Running Back), Aug 2017 - May 2020"],
};

export default function Resume() {
  return (
    <div className="max-w-5xl mx-auto bg-white p-8 md:p-12 shadow-brutal-lg border-2 border-black my-8 relative">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />

      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-10 border-b-4 border-black pb-8">
        <div>
          <h1 className="font-serif text-4xl md:text-6xl mb-2">Cheick Diakite</h1>
          <p className="font-mono text-xs tracking-[0.18em] uppercase opacity-80">AI Product & Engineering</p>
          <p className="font-mono text-xs mt-4 opacity-70">Boston, MA</p>
          <a href="mailto:contact@cheickdiakite.com" className="font-mono text-xs underline underline-offset-4 hover:opacity-70">
            contact@cheickdiakite.com
          </a>
        </div>

        <a
          href="mailto:contact@cheickdiakite.com?subject=Resume%20Request"
          className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 font-mono text-xs hover:bg-stone-800 transition-colors w-fit"
        >
          <Download size={14} />
          REQUEST PDF
        </a>
      </div>

      <section className="mb-10">
        <h2 className="font-serif text-2xl mb-3">About Summary</h2>
        <p className="font-mono text-sm leading-relaxed opacity-90">
          AI-native Google DeepMind Hackathon Winner combining $11B+ in IB/PE M&A transaction experience with hands-on AI engineering. Former Banker/Investor turned Techstars-backed Founder who has architected and built LLM-powered agents and workflows and evaluated 130+ private market deals. Proven ability to bridge technical feasibility and business viability, translating "boardroom strategy" into shipped code and 0→1 product execution. Looking to apply this "boardroom-to-code" fluency to drive strategy and innovation within a top-tier AI focused organization over the next several years.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl mb-6 flex items-center gap-4">
          <span className="w-4 h-4 bg-black inline-block" /> Skill Matrix
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group} className="border-2 border-black p-4">
              <h3 className="font-mono text-xs uppercase tracking-[0.16em] mb-4">{group}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span key={item} className="border border-black px-2 py-1 font-mono text-[11px]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-serif text-2xl mb-6 flex items-center gap-4">
          <span className="w-4 h-4 bg-black inline-block" /> Experience Log
        </h2>
        <div className="space-y-8 pl-8 border-l-2 border-black/10 ml-2">
          {experience.map((item) => (
            <div key={`${item.title}-${item.date}`} className="relative">
              <div className="absolute -left-[37px] top-1 w-3 h-3 rounded-full bg-black border-2 border-white" />
              <div className="flex flex-col md:flex-row md:justify-between md:items-baseline gap-1 mb-2">
                <h3 className="font-bold text-lg font-mono leading-tight">{item.title}</h3>
                <span className="font-mono text-xs opacity-50">{item.date}</span>
              </div>
              <p className="font-serif italic opacity-70 mb-3">
                {item.company} · {item.location}
              </p>
              <ul className="space-y-2">
                {item.points.map((point) => (
                  <li key={point} className="font-mono text-sm leading-relaxed opacity-90">
                    - {point}
                  </li>
                ))}
              </ul>
              {item.transactions.length > 0 && (
                <div className="mt-4">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] mb-2 opacity-70">Selected Transactions</p>
                  <ul className="space-y-1">
                    {item.transactions.map((transaction) => (
                      <li key={transaction} className="font-mono text-xs opacity-80">
                        - {transaction}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="font-serif text-2xl mb-4">Projects</h2>
          <div className="space-y-4">
            {sideSections.projects.map((project) => (
              <div key={project.title} className="border-2 border-black p-4">
                <h3 className="font-bold font-mono">{project.title}</h3>
                <p className="font-mono text-xs opacity-60 mb-2">{project.date}</p>
                <p className="font-mono text-sm opacity-90">{project.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section>
            <h2 className="font-serif text-2xl mb-3">Education</h2>
            <div className="border-2 border-black p-4 space-y-1">
              {sideSections.education.map((line) => (
                <p key={line} className="font-mono text-sm">
                  {line}
                </p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-3">Awards</h2>
            <div className="border-2 border-black p-4 space-y-2">
              {sideSections.awards.map((award) => (
                <p key={award} className="font-mono text-sm">
                  {award}
                </p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl mb-3">Athletics</h2>
            <div className="border-2 border-black p-4">
              {sideSections.athletics.map((line) => (
                <p key={line} className="font-mono text-sm">
                  {line}
                </p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
