import { useEffect } from "react";
import { Link } from "react-router-dom";
import hljs from "highlight.js";
import useScrollReveal from "../hooks/useScrollReveal.js";

export default function DrewBrew() {
  const refOverview = useScrollReveal();
  const refProblem = useScrollReveal();
  const refVision = useScrollReveal();
  const refBusiness = useScrollReveal();
  const refData = useScrollReveal();
  const refApp = useScrollReveal();
  const refTech = useScrollReveal();
  const refFuture = useScrollReveal();
  const refDecisions = useScrollReveal();
  const refDiagrams = useScrollReveal();
  const refLearned = useScrollReveal();
  const refStatus = useScrollReveal();
  const refTechnologies = useScrollReveal();
  const refWhy = useScrollReveal();

  useEffect(() => {
    async function initMermaid() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "base",
        themeVariables: {
          primaryColor: "hsl(340 80% 85%)",
          primaryTextColor: "hsl(240 6% 10%)",
          primaryBorderColor: "hsl(340 80% 65%)",
          background: "hsl(40 13% 92%)",
          mainBkg: "hsl(40 13% 87%)",
          secondBkg: "hsl(40 13% 92%)",
          lineColor: "hsl(340 17% 35%)",
          edgeLabelBackground: "hsl(40 13% 87%)",
          tertiaryColor: "hsl(40 13% 82%)",
          fontSize: "14px",
        },
      });
      await mermaid.run({ querySelector: ".mermaid" });
    }

    hljs.highlightAll();
    initMermaid();
  }, []);

  return (
    <div className="drewbrew-page">
      <header className="page-header">
        <Link to="/" className="back-link">
          ← Back to home
        </Link>
        <h1><em>drewBrew.</em> Architecture-First Coffee Tracking</h1>
        <p className="project-note">
          This architecture was designed in late 2025 as an exercise in systems
          thinking and end-to-end planning. Some components (like a standalone
          blog) evolved as I built this portfolio site, but the core demonstrates
          how I approach technical problems from business requirements through to
          future-state capability.
        </p>
      </header>

      <section className="drewbrew-section" ref={refOverview}>
        <h2>Overview</h2>
        <p>
          drewBrew is a coffee tracking system designed to help specialty coffee
          enthusiasts log beans, brews, and tasting notes in a structured way,
          with the long-term goal of providing analytics that reveal brewing
          patterns and optimal bean ageing windows.
        </p>
        <p>
          What makes this project different is the approach: instead of building
          features iteratively, I treated it as an{" "}
          <strong>architecture exercise first</strong>. I validated business
          requirements, designed the data model, planned the application
          structure, and mapped the future-state analytics capability before
          writing significant code.
        </p>
        <p>
          The result isn't a finished product — it's a demonstration of
          systematic thinking, business-to-technology alignment, and the ability
          to plan systems that can evolve without needing to be rebuilt.
        </p>
      </section>

      <section className="drewbrew-section" ref={refProblem}>
        <h2>The Problem</h2>
        <p>
          Specialty coffee brewing is deceptively complex. Variables like bean
          origin, roast date, grind size, water temperature, and brew method all
          affect flavour. Competitive baristas and serious hobbyists track these
          factors manually using notebooks or spreadsheets, but there's no easy
          way to spot patterns or understand how different variables interact over
          time.
        </p>
        <p>
          The business need wasn't just "store brew data" — it was{" "}
          <strong>
            capture the right data, with enough precision, so that meaningful
            patterns can be discovered later
          </strong>
          .
        </p>
      </section>

      <section className="drewbrew-section" ref={refVision}>
        <h2>Architecture Vision</h2>
        <p>I approached this like an enterprise architecture problem:</p>
        <p>
          <strong>What's the long-term purpose?</strong>
          <br />
          Help users understand how bean ageing, brew method consistency, and
          recipe repeatability affect flavour outcomes.
        </p>
        <p>
          <strong>Who are the users?</strong>
          <br />
          Competitive baristas, specialty coffee hobbyists, and anyone who wants
          to improve their brewing systematically.
        </p>
        <p>
          <strong>What capabilities need to exist?</strong>
        </p>
        <ul>
          <li>Structured logging of beans, brews, and tastings</li>
          <li>Flexible capture of variable data (tasting notes, recipe steps)</li>
          <li>Future analytics that generate actionable insights</li>
        </ul>
        <p>
          <strong>What constraints matter?</strong>
        </p>
        <ul>
          <li>Mobile-first experience</li>
          <li>Fast data entry (low friction)</li>
          <li>Privacy (local-first database, not centralised)</li>
          <li>Scalable to thousands of entries per user</li>
        </ul>
        <p>
          This vision shaped every downstream decision — from schema design to
          technology choices to the planned analytics pipeline.
        </p>
      </section>

      <section className="drewbrew-section" ref={refBusiness}>
        <h2>Business Architecture</h2>
        <p>
          I validated requirements with a competitive barista at a Leeds
          specialty coffee shop who has competed in the World Brewers Cup. He
          explained how crucial factors like bean age, water temperature, and
          recipe repeatability are in competitive brewing, and how difficult it
          is to track these variables over time without a structured system.
        </p>
        <p>
          From those conversations, the{" "}
          <strong>business capabilities</strong> became clear:
        </p>
        <ul>
          <li>
            Structured data capture with enough granularity to be analysable
          </li>
          <li>Flexible tasting notes without rigid schema constraints</li>
          <li>
            Future insight generation that competitive and hobbyist brewers can
            act on
          </li>
          <li>Simple, intuitive interface for data entry</li>
        </ul>
        <p>
          This wasn't just feature planning — it was identifying what the system
          needed to <strong>enable</strong>, not just what it needed to{" "}
          <strong>do</strong>.
        </p>
      </section>

      <section className="drewbrew-section" ref={refData}>
        <h2>
          Data Architecture{" "}
          <span className="implemented-badge">Implemented</span>
        </h2>
        <p>The data layer is the foundation, and this is the part I've built.</p>

        <h3>Technology Selection</h3>
        <p>I compared Firebase, MongoDB, and PostgreSQL:</p>
        <ul>
          <li>
            <strong>Firebase:</strong> Fast setup, but tightly coupled to
            Google's ecosystem and not ideal for complex analytics
          </li>
          <li>
            <strong>MongoDB:</strong> Flexible, but less suited for strong
            relational needs and structured querying
          </li>
          <li>
            <strong>PostgreSQL + JSONB:</strong> Best balance — relational
            structure where needed, flexible semi-structured storage where data
            varies
          </li>
        </ul>

        <h3>Schema Design</h3>
        <p>I designed the schema around core entities:</p>
        <pre>
          <code className="language-typescript">{`beans → brews → tastings
beans → recipes
brews → gear (many-to-many)`}</code>
        </pre>
        <p>
          <strong>Structured fields</strong> hold consistent, measurable data
          (bean origin, roast date, dose, yield, water temperature).
          <br />
          <strong>JSONB fields</strong> hold variable data (tasting notes,
          recipe steps).
        </p>
        <p>
          This hybrid approach directly reflects the business architecture:{" "}
          <strong>
            structure where needed for analysis, flexibility where variation is
            expected
          </strong>
          .
        </p>

        <h3>Example: The Bean Model</h3>
        <pre>
          <code className="language-typescript">{`model Bean {
  id              String   @id @default(cuid())
  name            String
  roaster         String
  origin          String?
  varietal        String?
  process         String?
  roastDate       DateTime
  openedDate      DateTime?
  frozenDate      DateTime?
  price           Decimal? @db.Decimal(10, 2)
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  brews           Brew[]
  recipes         Recipe[]
}`}</code>
        </pre>

        <h4>Key architectural decisions:</h4>
        <ul>
          <li>
            <code>roastDate</code> is required — it's essential for ageing
            analysis
          </li>
          <li>
            <code>openedDate</code> and <code>frozenDate</code> are optional but
            captured when available
          </li>
          <li>
            Relationships are explicit (<code>brews</code>,{" "}
            <code>recipes</code>) to enable joins and aggregations
          </li>
          <li>
            <code>Decimal</code> type for price avoids floating-point errors
          </li>
        </ul>
        <p>
          Every field exists for a reason, and the schema anticipates future
          analytics needs.
        </p>
      </section>

      <section className="drewbrew-section" ref={refApp}>
        <h2>
          Application Architecture{" "}
          <span className="designed-badge">Designed</span>
        </h2>
        <p>
          I've designed the backend and frontend layers, but they're not fully
          built yet.
        </p>

        <h3>Backend Structure</h3>
        <p>
          <strong>Modular Node/TypeScript backend</strong> with:
        </p>
        <ul>
          <li>
            <strong>Entity-based routing:</strong> <code>/beans</code>,{" "}
            <code>/brews</code>, <code>/tastings</code>, <code>/recipes</code>
          </li>
          <li>
            <strong>Clear separation of concerns:</strong> Controllers handle
            HTTP, services contain logic, database layer isolated through Prisma
          </li>
          <li>
            <strong>Consistent validation patterns:</strong> Each entity
            validates input at the API boundary
          </li>
          <li>
            <strong>Error handling:</strong> Predictable error responses with
            meaningful messages
          </li>
        </ul>

        <h4>Example validation logic (designed):</h4>
        <pre>
          <code className="language-typescript">{`// Create Brew request validation
- Valid beanId (exists in database)
- Recognised brew method (from enum)
- Dose and yield within sensible ranges
- Water temperature between 80-100°C
- Reject at API boundary with clear error`}</code>
        </pre>
        <p>
          This keeps bad data out of the system and protects downstream
          analytics.
        </p>

        <h3>Frontend</h3>
        <p>
          <strong>Next.js</strong> for:
        </p>
        <ul>
          <li>Predictable structure</li>
          <li>Server-side rendering where appropriate</li>
          <li>Clean separation between UI and data layers</li>
          <li>Mobile-first responsive design</li>
        </ul>
        <p>
          The frontend is intentionally designed as a{" "}
          <strong>data entry interface</strong> — fast, simple, low-friction.
        </p>
      </section>

      <section className="drewbrew-section" ref={refTech}>
        <h2>
          Technology Architecture{" "}
          <span className="designed-badge">Designed</span>
        </h2>

        <h3>Planned Hosting</h3>
        <ul>
          <li>
            <strong>Cloud-hosted PostgreSQL</strong> (production database)
          </li>
          <li>
            <strong>Vercel</strong> for frontend (predictable global
            performance)
          </li>
          <li>
            <strong>Containerised backend</strong> (portable, independently
            scalable)
          </li>
        </ul>

        <h3>Why These Choices?</h3>
        <p>
          <strong>Containerising the backend</strong> means:
        </p>
        <ul>
          <li>The API can scale independently of the frontend</li>
          <li>
            Hosting provider can change (Vercel → GCP → AWS) without rewriting
            code
          </li>
          <li>Analytics workloads can run in separate containers</li>
        </ul>
        <p>
          <strong>Vercel for frontend</strong> gives predictable performance
          globally without managing servers, but keeps the backend separate for
          flexibility.
        </p>
        <p>
          These decisions support the <strong>current scale</strong> but don't
          block <strong>future capability</strong>.
        </p>
      </section>

      <section className="drewbrew-section" ref={refFuture}>
        <h2>Future State: BeanSights Analytics</h2>
        <p>This is where the architecture really shows its value.</p>
        <p>
          <strong>BeanSights</strong> is a planned analytics layer that provides
          insights like:
        </p>
        <ul>
          <li>Bean ageing patterns (optimal flavour windows)</li>
          <li>Brew ratio recommendations</li>
          <li>Flavour consistency tracking</li>
          <li>Equipment performance analysis</li>
        </ul>

        <h3>Planned Architecture</h3>
        <div className="mermaid">{`
flowchart TB
    Raw[Raw Logs]
    Curated[Curated Tables]
    Analytics[Analytics Jobs]
    Insights[Insights Layer]
    
    Raw --> Curated --> Analytics --> Insights
        `}</div>

        <p>
          <strong>Raw Logs:</strong> Brew and tasting entries from the main app
          <br />
          <strong>Curated Tables:</strong> Aggregated views designed for
          analysis (e.g., bean ageing profiles)
          <br />
          <strong>Analytics Jobs:</strong> Scheduled processes that calculate
          patterns or predictions
          <br />
          <strong>Insights Layer:</strong> API endpoints that serve user-facing
          insights
        </p>

        <h3>Why Design This Now?</h3>
        <p>
          Because{" "}
          <strong>decisions made today affect what's possible tomorrow</strong>.
        </p>
        <ul>
          <li>
            Capturing <code>roastDate</code> and <code>openedDate</code> now
            enables ageing analysis later
          </li>
          <li>
            JSONB indexes on <code>flavour_notes</code> keys make pattern
            extraction feasible
          </li>
          <li>
            Separating raw and curated data keeps analytics performant at scale
          </li>
        </ul>
        <p>
          This is classic enterprise architecture thinking:{" "}
          <strong>
            look ahead, capture the right data now, plan for evolution
          </strong>
          .
        </p>
      </section>

      <section className="drewbrew-section" ref={refDecisions}>
        <h2>Technical Decisions &amp; Trade-Offs</h2>

        <h3>Why PostgreSQL + JSONB over Pure NoSQL?</h3>
        <p>
          <strong>Relational structure</strong> gives:
        </p>
        <ul>
          <li>Strong referential integrity (beans → brews → tastings)</li>
          <li>Efficient joins for analytics queries</li>
          <li>ACID guarantees for data consistency</li>
        </ul>
        <p>
          <strong>JSONB</strong> gives:
        </p>
        <ul>
          <li>Flexibility for variable tasting notes</li>
          <li>Fast key-value lookups</li>
          <li>Schema evolution without migrations</li>
        </ul>
        <p>The hybrid approach balances structure and flexibility.</p>

        <h3>Why Modular Backend Over Monolith?</h3>
        <p>
          <strong>Entity-based modules</strong> mean:
        </p>
        <ul>
          <li>
            Each service (Beans, Brews, Tastings) can evolve independently
          </li>
          <li>Business logic is isolated and testable</li>
          <li>Future refactoring (microservices, if needed) is easier</li>
        </ul>

        <h3>Why Containerisation?</h3>
        <ul>
          <li>
            <strong>Portability:</strong> Move between hosting providers without
            rewrites
          </li>
          <li>
            <strong>Scalability:</strong> Scale API and analytics workloads
            independently
          </li>
          <li>
            <strong>Predictability:</strong> Consistent environments across dev,
            staging, production
          </li>
        </ul>
      </section>

      <section className="drewbrew-section" ref={refDiagrams}>
        <h2>System Diagrams</h2>

        <h3>High-Level Architecture</h3>
        <div className="mermaid">{`
flowchart TB
    subgraph Frontends
        Blog[Blog Next.js / MDX]
        App[App Frontend Next.js]
    end
    
    API[Backend API Node / TypeScript]
    DB[(Postgres + JSONB)]
    BeanSights[BeanSights Future Analytics Module]
    
    Blog --> API
    App --> API
    API --> DB
    DB --> BeanSights
        `}</div>

        <h3>Entity Relationship Diagram</h3>
        <div className="mermaid">{`
classDiagram
    class Bean {
        +UUID id
        +string name
        +string roaster
        +string origin
        +string varietal
        +date roast_date
        +date opened_date
        +boolean frozen_flag
    }
    
    class Brew {
        +UUID id
        +UUID bean_id
        +string method
        +numeric dose
        +numeric yield
        +numeric water_temp
        +timestamp created_at
    }
    
    class Tasting {
        +UUID id
        +UUID brew_id
        +int rating
        +jsonb flavour_notes
        +string body
        +string acidity
    }
    
    class Recipe {
        +UUID id
        +UUID bean_id
        +jsonb steps
        +string equipment
    }
    
    Bean "1" --> "many" Brew : bean_id
    Brew "1" --> "many" Tasting : brew_id
    Bean "1" --> "many" Recipe : bean_id
        `}</div>
      </section>

      <section className="drewbrew-section" ref={refLearned}>
        <h2>What I Learned</h2>
        <p>
          This project taught me that{" "}
          <strong>architecture is where my strengths lie</strong>.
        </p>

        <h3>Business-to-Technology Alignment</h3>
        <p>
          Starting with user needs (competitive barista requirements) and working
          backwards shaped every technical decision. The schema isn't just
          "stores data" — it{" "}
          <strong>enables specific business capabilities</strong>.
        </p>

        <h3>Planning vs Building</h3>
        <p>
          Designing the application and analytics layers before implementing them
          forced me to think about:
        </p>
        <ul>
          <li>How decisions ripple across layers</li>
          <li>What needs to be captured now to enable future features</li>
          <li>Trade-offs between flexibility and structure</li>
        </ul>

        <h3>Systems Thinking</h3>
        <p>Even simple features (logging a brew) have architectural implications:</p>
        <ul>
          <li>What data is required vs optional?</li>
          <li>How does this relate to other entities?</li>
          <li>What indexes are needed for future queries?</li>
          <li>How does this support analytics?</li>
        </ul>

        <h3>Architecture as Communication</h3>
        <p>
          Creating diagrams, documentation, and clear naming conventions made the
          system <strong>understandable</strong> — not just to me, but to anyone
          who might work on it.
        </p>
      </section>

      <section className="drewbrew-section" ref={refStatus}>
        <h2>Current Status</h2>
        <p>
          <strong>Implemented:</strong>
        </p>
        <ul>
          <li>PostgreSQL database (local)</li>
          <li>Prisma ORM configuration</li>
          <li>Complete schema (Bean, Brew, Tasting, Recipe, Gear models)</li>
          <li>Hybrid relational + JSONB data structure</li>
        </ul>

        <p>
          <strong>Designed (not yet built):</strong>
        </p>
        <ul>
          <li>Backend API (modular Node/TypeScript)</li>
          <li>Frontend (Next.js)</li>
          <li>BeanSights analytics layer</li>
          <li>Production hosting architecture</li>
        </ul>

        <h3>Why the gap?</h3>
        <p>
          I deliberately approached this as an{" "}
          <strong>architecture exercise first</strong>. The data layer is built
          because it's the foundation. The application layer is designed but
          paused while I focus on my portfolio site and job search.
        </p>
        <p className="project-note">
          <strong>Note:</strong> This architecture was designed in late 2025.
          Some planned components (like the drewBrew blog) became redundant after
          I built this portfolio site with an integrated blog system. The core
          data architecture and systems thinking remain valid demonstrations of
          my approach to technical planning.
        </p>
      </section>

      <section className="drewbrew-section" ref={refTechnologies}>
        <h2>Technologies</h2>
        <p>
          <strong>Database:</strong> PostgreSQL, Prisma ORM
          <br />
          <strong>Planned Backend:</strong> Node.js, TypeScript, Express
          <br />
          <strong>Planned Frontend:</strong> Next.js, React
          <br />
          <strong>Planned Hosting:</strong> Vercel (frontend), containerised
          backend
          <br />
          <strong>Documentation:</strong> Mermaid (diagrams), Obsidian
          (planning)
        </p>
      </section>

      <section className="drewbrew-section" ref={refWhy}>
        <h2>Why This Matters</h2>
        <p>This project demonstrates:</p>
        <ul>
          <li>
            <strong>Business-to-technology alignment</strong> — starting with
            user needs, not tech choices
          </li>
          <li>
            <strong>Data modelling</strong> — hybrid relational + JSONB for
            structure and flexibility
          </li>
          <li>
            <strong>Systems thinking</strong> — understanding how layers
            interact and evolve
          </li>
          <li>
            <strong>Future-state planning</strong> — designing for capability,
            not just features
          </li>
          <li>
            <strong>Technical decision-making</strong> — evaluating trade-offs,
            justifying choices
          </li>
          <li>
            <strong>Communication</strong> — clear documentation, diagrams, and
            reasoning
          </li>
        </ul>
        <p>
          It's not a finished product. It's a demonstration of{" "}
          <strong>how I approach problems</strong> — systematically,
          intentionally, and with an eye on the long term.
        </p>
      </section>
    </div>
  );
}
