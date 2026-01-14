import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export interface TechStack {
  _id?: ObjectId;
  name: string;
  category: "languages" | "backend" | "frontend" | "tools" | "concepts";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Project {
  _id?: ObjectId;
  title: string;
  description: string;
  longDescription?: string;
  role?: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  highlights?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Experience {
  _id?: ObjectId;
  type: "work" | "leadership" | "project";
  title: string;
  org: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
  links?: PortfolioLink[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PersonalInfo {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  linkedIn?: string;
  github?: string;
  twitter?: string;
  profileImage?: string;
}

export type PortfolioLink = {
  label: string;
  href: string;
};

export type PortfolioStat = {
  label: string;
  value: string;
};

export type PortfolioTimelineItem = {
  id: string;
  type: "work" | "leadership" | "project";
  title: string;
  org: string;
  period: string;
  summary: string;
  highlights: string[];
  tags: string[];
  links?: PortfolioLink[];
};

export type PortfolioAchievement = {
  id: string;
  title: string;
  year: string;
  category: "competition" | "project" | "milestone";
  description: string;
};

export type PortfolioThought = {
  id: string;
  text: string;
};

export type PortfolioNavItem = {
  id: string;
  label: string;
};

export type PortfolioQuickFact = {
  label: string;
  value: string;
};

export type PortfolioConsoleLink = {
  label: string;
  href: string;
};

export type PortfolioContent = {
  _id?: ObjectId;
  slug: "default";

  hero: {
    name: string;
    headline: string;
    subheadline: string;
    metaLine: string;
    avatarAlt: string;
    githubUsername?: string;
    links: PortfolioLink[];
    stats: PortfolioStat[];
  };

  overview: {
    title: string;
    paragraphs: string[];
    ctas: PortfolioLink[];
  };

  contactCard: {
    title: string;
    items: { label: string; value: string }[];
  };

  experience: {
    title: string;
    subtitle: string;
    items: PortfolioTimelineItem[];
  };

  projectsSection: {
    title: string;
    subtitle: string;
  };

  techSection: {
    title: string;
    subtitle: string;

    quickFacts?: {
      title: string;
      items: PortfolioQuickFact[];
    };
  };

  achievements: {
    title: string;
    subtitle: string;
    items: PortfolioAchievement[];
  };

  thoughts: {
    title: string;
    subtitle: string;
    items: PortfolioThought[];
    shareAttribution?: string;
  };

  aboutMe: {
    title: string;
    subtitle: string;
    strengthsTitle: string;
    strengths: string[];
    learningTitle: string;
    learning: string[];
  };

  contactSection: {
    title: string;
    subtitle: string;
    cardTitle?: string;
    primaryCta: PortfolioLink;
    secondaryCta?: PortfolioLink;
    resumeTitle: string;
    resumeBody: string;
    resumeCta: PortfolioLink;
  };

  footer: {
    rightText: string;
  };

  createdAt?: Date;
  updatedAt?: Date;

  navbar?: {
    name: string;
    mobileSubtitle: string;
    desktopSubtitle: string;
    items: PortfolioNavItem[];
  };

  consoleHint?: {
    enabled: boolean;
    consoleTitle: string;
    commandsTitle: string;
    commands: string[];
    about: string;
    links: PortfolioConsoleLink[];
    stack: string[];
  };
};

// TechStack operations
export async function getTechStacks() {
  try {
    const db = await getDatabase();
    const techStacks = await db.collection<TechStack>("techStacks").find({}).sort({ createdAt: -1 }).toArray();
    return techStacks;
  } catch (error) {
    console.error("Error fetching tech stacks:", error);
    throw error;
  }
}

export async function addTechStack(techStack: TechStack) {
  try {
    const db = await getDatabase();
    const result = await db.collection<TechStack>("techStacks").insertOne({
      ...techStack,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error("Error adding tech stack:", error);
    throw error;
  }
}

export async function updateTechStack(id: string, patch: Partial<Pick<TechStack, "name" | "category">>) {
  try {
    const db = await getDatabase();
    const update: Partial<TechStack> = { ...patch, updatedAt: new Date() };
    const result = await db.collection<TechStack>("techStacks").updateOne({ _id: new ObjectId(id) }, { $set: update });
    return result;
  } catch (error) {
    console.error("Error updating tech stack:", error);
    throw error;
  }
}

export async function deleteTechStack(id: string) {
  try {
    const db = await getDatabase();
    const result = await db.collection("techStacks").deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.error("Error deleting tech stack:", error);
    throw error;
  }
}

// Project operations
export async function getProjects() {
  try {
    const db = await getDatabase();
    const projects = await db.collection<Project>("projects").find({}).sort({ createdAt: -1 }).toArray();
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function addProject(project: Project) {
  try {
    const db = await getDatabase();
    const result = await db.collection<Project>("projects").insertOne({
      ...project,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
}

export async function updateProject(id: string, project: Partial<Project>) {
  try {
    const db = await getDatabase();
    const result = await db.collection<Project>("projects").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...project,
          updatedAt: new Date(),
        },
      }
    );
    return result;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    const db = await getDatabase();
    const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

// Personal Info operations
export async function getPersonalInfo() {
  try {
    const db = await getDatabase();
    const info = await db.collection<PersonalInfo>("personalInfo").findOne({});
    return info;
  } catch (error) {
    console.error("Error fetching personal info:", error);
    throw error;
  }
}

export async function updatePersonalInfo(info: PersonalInfo) {
  try {
    const db = await getDatabase();
    const result = await db.collection<PersonalInfo>("personalInfo").updateOne({}, { $set: info }, { upsert: true });
    return result;
  } catch (error) {
    console.error("Error updating personal info:", error);
    throw error;
  }
}

// Portfolio content operations
export async function getPortfolioContent() {
  try {
    const db = await getDatabase();
    const content = await db.collection<PortfolioContent>("portfolioContent").findOne({ slug: "default" });
    return content;
  } catch (error) {
    console.error("Error fetching portfolio content:", error);
    throw error;
  }
}

export async function upsertPortfolioContent(content: Omit<PortfolioContent, "_id" | "createdAt" | "updatedAt">) {
  try {
    const db = await getDatabase();
    const now = new Date();
    const result = await db.collection<PortfolioContent>("portfolioContent").updateOne(
      { slug: "default" },
      {
        $set: {
          ...content,
          slug: "default",
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true }
    );
    return result;
  } catch (error) {
    console.error("Error upserting portfolio content:", error);
    throw error;
  }
}

// Experience operations
export async function getExperiences() {
  try {
    const db = await getDatabase();
    const experiences = await db.collection<Experience>("experiences").find({}).sort({ createdAt: -1 }).toArray();
    return experiences;
  } catch (error) {
    console.error("Error fetching experiences:", error);
    throw error;
  }
}

export async function addExperience(experience: Omit<Experience, "_id" | "createdAt" | "updatedAt">) {
  try {
    const db = await getDatabase();
    const result = await db.collection<Experience>("experiences").insertOne({
      ...experience,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result;
  } catch (error) {
    console.error("Error adding experience:", error);
    throw error;
  }
}

export async function updateExperience(id: string, experience: Partial<Omit<Experience, "_id">>) {
  try {
    const db = await getDatabase();
    const result = await db.collection<Experience>("experiences").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...experience,
          updatedAt: new Date(),
        },
      }
    );
    return result;
  } catch (error) {
    console.error("Error updating experience:", error);
    throw error;
  }
}

export async function deleteExperience(id: string) {
  try {
    const db = await getDatabase();
    const result = await db.collection("experiences").deleteOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.error("Error deleting experience:", error);
    throw error;
  }
}
