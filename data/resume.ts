export type TodoPlaceholder = `TODO: ${string}`;

export interface ResumeLinks {
  linkedinUrl: string;
  githubUrl: string;
  photoUrl: string;
}

export interface EducationEntry {
  institution: string;
  location?: string;
  period: string;
  credential: string;
  details: string[];
}

export interface AutomationHighlight {
  id: string;
  title: string;
  description: string;
  stack: string[];
  notes: string[];
}

export interface Project {
  id: string;
  title: string;
  eyebrow: string;
  impact: string;
  description: string;
  stack: string[];
  metrics: string[];
  notes: string[];
  linkUrl: string;
  photoUrl: string;
}

export interface LeadershipEntry {
  role: string;
  organization: string;
  period: string;
  description: string;
  metrics: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  date?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Achievement {
  title: string;
  description: string;
  metrics: string[];
}

export interface JourneyMilestone {
  period: string;
  title: string;
  description: string;
}

export interface ContactCopy {
  heading: string;
  body: string;
  cta: string;
}

export interface Resume {
  name: string;
  headline: string;
  location: string;
  email: string;
  phone: string;
  links: ResumeLinks;
  profile: string;
  education: EducationEntry[];
  automationHighlights: AutomationHighlight[];
  projects: Project[];
  leadership: LeadershipEntry[];
  certifications: Certification[];
  skills: SkillGroup[];
  achievements: Achievement[];
  journeyMilestones: JourneyMilestone[];
  contactFormUrl: string;
  contactCopy: ContactCopy;
}

export const resume: Resume = {
  name: "Gangesh Gupta",
  headline: "AI/ML & Workflow Automation",
  location: "Surat, Gujarat",
  email: "gangeshofficial3@gmail.com",
  phone: "+91 82995 22455",
  links: {
    linkedinUrl: "https://www.linkedin.com/in/gangesh-gupta-397ba13b7/",
    githubUrl: "https://github.com/gangesh3",
    photoUrl: "/images/profile-gangesh.webp",
  },
  profile:
    "B.Tech student at SVNIT focused on practical AI/ML projects and workflow automation. Builds n8n automations for Telegram-controlled AI-agent interaction and personalized cold-email outreach, alongside Python applications, computer-vision concepts, and embedded systems. Grand Robo Prix 2026 runner-up as part of a line-follower robot team.",
  education: [
    {
      institution: "Sardar Vallabhbhai National Institute of Technology (SVNIT)",
      location: "Surat",
      period: "2025 – 2029",
      credential: "B.Tech, Industrial Chemistry",
      details: ["First-year CGPA: 7.71/10"],
    },
    {
      institution: "Oxford Public School (CBSE)",
      period: "2024 / 2022",
      credential: "CBSE",
      details: ["Class XII: 83% (2024)", "Class X: 92.8% (2022)"],
    },
  ],
  automationHighlights: [
    {
      id: "telegram-hermes-agent",
      title: "VPS + Telegram-Controlled Hermes Agent",
      description:
        "Connected a VPS-hosted Hermes Agent with Telegram for remote, command-based interaction.",
      stack: ["VPS", "Telegram", "Hermes Agent"],
      notes: [],
    },
    {
      id: "automated-cold-email-system",
      title: "Automated Cold-Email System",
      description:
        "Built an end-to-end n8n workflow for personalized cold-outreach emails, reducing repetitive manual work.",
      stack: ["n8n", "Workflow design", "Debugging"],
      notes: [],
    },
  ],
  projects: [
    {
      id: "line-follower-robot",
      title: "Line-Follower Robot",
      eyebrow: "Grand Robo Prix 2026 Runner-Up",
      impact:
        "Helped a team-built line-following robot secure second place in the Grand Robo Prix 2026.",
      description:
        "Built a sensor-guided robot with ESP32; contributed to circuit setup, testing, debugging, and movement optimization.",
      stack: ["ESP32", "Sensors"],
      metrics: ["Runner-up", "Second place"],
      notes: [
        "Team contribution included circuit setup, testing, debugging, and movement optimization.",
      ],
      linkUrl: "https://lnkd.in/p/dYznyJxK",
      photoUrl: "/images/grand-robo-prix.webp",
    },
    {
      id: "air-drawer",
      title: "Air Drawer",
      eyebrow: "Computer Vision • Hand Tracking",
      impact: "Built an interactive webcam drawing experience controlled by hand-tracking gestures.",
      description:
        "Created a gesture-controlled virtual drawing application using webcam input and hand-tracking concepts.",
      stack: ["Computer Vision", "Hand Tracking", "Webcam"],
      metrics: [],
      notes: ["Interactive webcam-based drawing application."],
      linkUrl: "https://gangesh3.github.io/gangeshbuilds/",
      photoUrl: "/images/air-drawer.webp",
    },
    {
      id: "real-time-chat-application",
      title: "Real-Time Chat Application",
      eyebrow: "Python • Sockets • Tkinter",
      impact: "Built a client-server chat application with separated server and client functionality.",
      description:
        "Developed socket-based message communication with a Tkinter graphical interface and tested messaging behavior.",
      stack: ["Python", "Sockets", "Tkinter"],
      metrics: [],
      notes: ["Server and client functionality were separated; messaging behavior was tested."],
      linkUrl:
        "https://www.linkedin.com/safety/go/?url=https%3A%2F%2Flnkd.in%2FgV3KFurS&urlhash=rJlZ&mt=Tvb_LmFWq_mTru6PNy6Yatk9z5v0eB9J2IxEAeF5HI8g613mtutDYvoyGttmWp25mT0FJA15kRORepchzBXjhAz6-_QOgjhHcmyoWLlaRqwsQK4a96xe2WQUvv8&isSdui=true&lipi=urn%3Ali%3Apage%3Ad_flagship3_detail_base%3BjFJxTf6yShmiaJoMYYTq6g%3D%3D",
      photoUrl: "/images/real-time-chat.webp",
    },
  ],
  leadership: [
    {
      role: "Sponsorship Executive",
      organization: "Mindbend – SVNIT Technical Fest",
      period: "Jan – Feb 2026",
      description:
        "Coordinated food-stall vendors and external partners, handled communication and negotiations, and helped increase the number of food stalls.",
      metrics: ["30%"],
    },
    {
      role: "Managerial Committee Member",
      organization: "Sparsh – SVNIT Annual Fest",
      period: "Mar – Apr 2026",
      description:
        "Supported planning and coordination for SVNIT Got Talent and Sparsh Dancing Night; managed outreach emails to invite guests and judges.",
      metrics: [],
    },
  ],
  certifications: [
    {
      title: "Artificial Intelligence Fundamentals",
      issuer: "IBM SkillsBuild",
    },
    {
      title: "Introduction to AI",
      issuer: "Google / Coursera",
    },
    {
      title: "Google Prompting Essentials",
      issuer: "Google",
    },
    {
      title: "5-Day AI Agents: Intensive Vibe Coding Course",
      issuer: "Google & Kaggle",
      date: "June 2026",
    },
  ],
  skills: [
    {
      category: "Programming",
      items: ["Python", "C"],
    },
    {
      category: "Automation",
      items: ["n8n", "Workflow design and debugging"],
    },
    {
      category: "AI/ML",
      items: [
        "AI fundamentals",
        "Prompt engineering",
        "Computer-vision concepts",
        "Hand tracking",
        "AI-agent workflows",
      ],
    },
    {
      category: "Tools",
      items: [
        "Git",
        "GitHub",
        "PyCharm",
        "VS Code",
        "ESP32",
        "Tkinter",
        "MS Excel",
        "PowerPoint",
        "Canva",
        "DaVinci Resolve",
      ],
    },
  ],
  achievements: [
    {
      title: "Grand Robo Prix 2026",
      description: "Runner-up / second place as part of a line-follower robot team.",
      metrics: ["Runner-up", "Second place"],
    },
  ],
  journeyMilestones: [
    {
      period: "2022",
      title: "Class X — Oxford Public School (CBSE)",
      description: "Scored 92.8%.",
    },
    {
      period: "2024",
      title: "Class XII — Oxford Public School (CBSE)",
      description: "Scored 83%.",
    },
    {
      period: "2025 – 2029",
      title: "B.Tech, Industrial Chemistry — SVNIT",
      description: "First-year CGPA: 7.71/10.",
    },
    {
      period: "Jan – Feb 2026",
      title: "Sponsorship Executive — Mindbend",
      description: "Helped increase the number of food stalls by 30%.",
    },
    {
      period: "Mar – Apr 2026",
      title: "Managerial Committee Member — Sparsh",
      description: "Supported event planning, coordination, and guest and judge outreach.",
    },
    {
      period: "2026",
      title: "Grand Robo Prix",
      description: "Runner-up / second place as part of a line-follower robot team.",
    },
    {
      period: "June 2026",
      title: "5-Day AI Agents: Intensive Vibe Coding Course",
      description: "Completed the Google & Kaggle course.",
    },
  ],
  contactFormUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSco9GmAXmaHASzYTkeIwivvHWEbNgz1qeMN2cBDfsorUYm70g/viewform?usp=publish-editor",
  contactCopy: {
    heading: "Let's build something practical.",
    body: "Interested in AI/ML, workflow automation, or hands-on technical projects? Get in touch.",
    cta: "Start a conversation",
  },
};
