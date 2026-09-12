//Everything the About page shows. Edit this file, not the page, to update
//your CV. Text is plain strings; arrays render as lists in order.
//
//Nothing here should be private: it is public on the site. Keep phone
//numbers and street addresses out.

export const about = {
  name: "Tristan Mikiewicz",
  tagline: "Software engineer who cooks.",
  //Drop a headshot in public/ and set this to "/tristan.jpg". Until then the
  //page shows initials.
  photo: null,
  location: "New Jersey",

  //Short facts shown as chips under the name.
  facts: [
    "23 years old",
    "Born in the Philippines",
    "In the US since 2011",
    "B.S. Computer Science, Stevens '26",
  ],

  links: {
    email: "tristanmikie@gmail.com",
    github: "https://github.com/g1lbert1",
    linkedin: "https://linkedin.com/in/tristan-mikiewicz",
    //Served from public/. The file is gitignored, so on a deployed build it
    //has to be uploaded separately (or set this to null to hide the button).
    resume: "/Mikiewicz-Tristan-Updated-Res.pdf",
  },

  story: [
    "I'm Tristan. I was born in the Philippines and moved to the United States in 2011, and I've been building things ever since I first figured out you could make a computer do what you told it to.",
    "I graduated from Stevens Institute of Technology with a B.S. in Computer Science. What I care about most is developing projects that are genuinely cool to use and that give me room to be creative, whether that's a full-stack web app, a machine learning pipeline, or a search engine for engineering documents.",
    "I have a lot of projects underway right now, so keep an eye on this page and my GitHub. New things land regularly.",
  ],

  whyThisSite: {
    heading: "Why a cooking site?",
    paragraphs: [
      "Health and fitness are a big part of my life, and they're one of the main reasons this site exists. Eating well and training hard go together, and I got tired of choosing between food that tastes good and food that fits my goals.",
      "So I share recipes that are fun and a little unique, but that still line up with the way I train and eat. If your goals look anything like mine, go check out the recipes.",
    ],
    cta: { label: "Browse the recipes", to: "/recipes" },
  },

  experience: [
    {
      company: "Sharp Electronics",
      role: "Web Development Intern",
      //Add dates here when you want them shown, e.g. "Jun 2025 – Present".
      period: null,
      bullets: [
        "Develop and maintain enterprise web pages using HTML, CSS (Bootstrap), and JavaScript.",
        "Updated and enhanced 50+ pages with UI improvements, bug fixes, and reusable components, keeping a large production site consistent.",
        "Improved site functionality by reworking navigation, page layouts, and shared components across many pages.",
        "Contributed to SEO and Answer Engine Optimization work by improving metadata, page structure, and content organization to raise search visibility.",
      ],
    },
  ],

  education: {
    school: "Stevens Institute of Technology",
    location: "Hoboken, NJ",
    degree: "Bachelor of Science in Computer Science",
    year: "2026",
    coursework: [
      "Artificial Intelligence",
      "Natural Language Processing",
      "Knowledge Discovery and Data Mining",
      "Database Management Systems I & II",
    ],
  },

  projects: [
    {
      name: "Cooking with Tristan",
      tagline: "This site",
      stack: ["React", "GraphQL", "Apollo", "Node", "MongoDB", "Auth0", "Tailwind"],
      url: "https://github.com/g1lbert1/cookingwtristan",
      bullets: [
        "Full-stack recipe blog: a React frontend on Vite talking to an Apollo GraphQL API backed by MongoDB.",
        "Auth0 login with role-based admin tools for creating, editing, and deleting recipes.",
        "Server-side validation, rate limiting, and locked-down CORS on the API.",
      ],
    },
    {
      name: "AI Search System for Structural Engineering",
      tagline: "Senior design",
      stack: ["React", "Python", "RAG"],
      url: null,
      bullets: [
        "Engineered a RAG-based search engine by restructuring unstructured technical datasets into formats built for AI ingestion and indexing.",
        "Built a Python scraping pipeline to clean and vectorize documentation, with semantic search and metadata tagging for high-precision retrieval.",
        "Shipped a fast React frontend and Node.js backend focused on accessibility and page speed for real-time querying.",
      ],
    },
    {
      name: "BallKnowledge",
      tagline: "Mock sportsbook app",
      stack: ["React", "Express", "MongoDB Atlas"],
      url: "https://github.com/g1lbert1/BallKnowledge",
      bullets: [
        "Full-stack sports betting platform integrating real-time sports APIs for live odds and match results.",
        "Cloud MongoDB Atlas schema handling concurrent user data and transactional betting logs.",
        "Secure API endpoints with XSS mitigations.",
      ],
    },
    {
      name: "LoL Match Predictor",
      tagline: "ML classification project",
      stack: ["Python", "TensorFlow", "Riot Games API"],
      url: "https://github.com/g1lbert1/LoL_project",
      bullets: [
        "End-to-end machine learning pipeline predicting match outcomes with 76% accuracy.",
        "Automated ingestion of 15,000+ entries from the Riot Games API, with data cleaning and feature engineering on high-dimensional data.",
        "Evaluated Random Forest and neural network models for predictive classification.",
      ],
    },
  ],

  skills: [
    {
      group: "Web",
      items: ["HTML5", "CSS3", "Tailwind", "JavaScript (ES6+)", "React", "Node / Express", "SEO", "ADA / WCAG"],
    },
    {
      group: "Programming & AI",
      items: ["Python (Flask)", "C", "C++", "RAG architectures", "Vector indexing", "TensorFlow", "Erlang (intermediate)", "OCaml (intermediate)"],
    },
    {
      group: "Data & tools",
      items: ["MongoDB", "PostgreSQL", "GraphQL", "Git", "Docker", "Photoshop (basic)", "MS Office"],
    },
  ],
};
