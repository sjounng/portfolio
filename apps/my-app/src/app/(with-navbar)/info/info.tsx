"use client";
import { motion } from "framer-motion";
import { useMemo } from "react";

// ============================================================================
// Types
// ============================================================================
interface TechBadge {
  name: string;
  color: string;
  logo: string;
  logoColor?: string;
}

interface Project {
  title: string;
  period: string;
  details?: string[];
}

interface Education {
  school: string;
  status: string;
  period: string;
}

interface TechStackCategory {
  title: string;
  badges: TechBadge[];
}

// ============================================================================
// Constants
// ============================================================================
const TECH_STACKS: Record<string, TechStackCategory> = {
  language: {
    title: "Language",
    badges: [
      { name: "C++", color: "00599C", logo: "cplusplus", logoColor: "white" },
      { name: "Java", color: "007396", logo: "java", logoColor: "white" },
      { name: "JavaScript", color: "F7DF1E", logo: "javascript", logoColor: "black" },
      { name: "TypeScript", color: "3178C6", logo: "typescript", logoColor: "white" },
      { name: "Python", color: "3776AB", logo: "python", logoColor: "white" },
    ],
  },
  frontend: {
    title: "Frontend",
    badges: [
      { name: "React", color: "61DAFB", logo: "React", logoColor: "black" },
      { name: "Tailwind CSS", color: "06B6D4", logo: "TailwindCSS", logoColor: "white" },
      { name: "Next.js", color: "000000", logo: "Next.js", logoColor: "white" },
    ],
  },
  backend: {
    title: "Backend",
    badges: [
      { name: "Spring Boot", color: "6DB33F", logo: "SpringBoot", logoColor: "white" },
      { name: "Node.js", color: "339933", logo: "Node.js", logoColor: "white" },
      { name: "FastAPI", color: "009688", logo: "FastAPI", logoColor: "white" },
    ],
  },
  devops: {
    title: "DevOps/Infra/DB",
    badges: [
      { name: "AWS", color: "FF9900", logo: "AmazonAWS", logoColor: "white" },
      { name: "Docker", color: "2496ED", logo: "Docker", logoColor: "white" },
      { name: "MySQL", color: "4479A1", logo: "MySQL", logoColor: "white" },
      { name: "PostgreSQL", color: "4169E1", logo: "PostgreSQL", logoColor: "white" },
    ],
  },
  collaboration: {
    title: "Collaboration",
    badges: [
      { name: "Git", color: "F05032", logo: "Git", logoColor: "white" },
      { name: "Jira", color: "0052CC", logo: "Jira", logoColor: "white" },
      { name: "Confluence", color: "172B4D", logo: "Confluence", logoColor: "white" },
    ],
  },
};

const PROJECTS: Project[] = [
  {
    title: "forif, SW팀 백엔드",
    period: "2025. 7. ~ 현재",
    details: [
      "forif web v2 백엔드 개발",
      "기존 데이터베이스 관리 및 유지 보수",
      "https://forif.org/",
    ],
  },
  {
    title: "AI 생성 이미지 판별 모델 개발",
    period: "2025. 9. ~ 2025. 11.",
    details: ["담당: 데이터 전처리, 모델 구현, github 관리", "Python, Pytorch, torchvision"],
  },
  {
    title: "팀 구성 웹 풀스택 개발",
    period: "2025. 3. ~ 2025. 7.",
    details: [
      "FE - React, Next.js",
      "BE - Next.js API Routes",
      "Deployment/Infra - AWS EC2, RDS",
    ],
  },
];

const PORTFOLIO: Project[] = [{ title: "개인 블로그", period: "2025.04 ~" }];

const EDUCATION_LIST: Education[] = [
  { school: "대진고등학교", status: "졸업", period: "2021 - 2023" },
  { school: "한양대학교 정보시스템학과", status: "재학중", period: "2024 ~" },
];

// ============================================================================
// Style Constants
// ============================================================================
const STYLES = {
  sectionTitle: "font-bold mb-2",
  subsectionTitle: "font-bold mt-6 mb-2",
  categoryTitle: "text-sm font-semibold mb-2 text-gray-600 dark:text-stone-400",
  itemTitle: "font-medium text-gray-900 dark:text-white",
  itemDetail: "text-xs text-gray-500 dark:text-stone-500",
  linkHover: "hover:underline",
} as const;

const ANIMATION = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 },
  },
  badge: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    duration: 0.4,
    stagger: 0.1,
  },
} as const;

// ============================================================================
// Helper Functions
// ============================================================================
const isUrl = (text: string): boolean => {
  return text.startsWith("http://") || text.startsWith("https://");
};

const createBadgeUrl = (badge: TechBadge): string => {
  const { name, color, logo, logoColor = "white" } = badge;
  return `https://img.shields.io/badge/${encodeURIComponent(name)}-${color}.svg?&style=for-the-badge&logo=${logo}&logoColor=${logoColor}`;
};

const calculateBadgeDelays = (stacks: Record<string, TechStackCategory>) => {
  const delays: Record<string, number[]> = {};
  let globalIndex = 0;

  for (const key of Object.keys(stacks)) {
    delays[key] = stacks[key].badges.map(() => globalIndex++ * ANIMATION.badge.stagger);
  }

  return delays;
};

// ============================================================================
// Sub Components
// ============================================================================
interface TechStackSectionProps {
  title: string;
  badges: TechBadge[];
  delays: number[];
}

const TechStackSection = ({ title, badges, delays }: TechStackSectionProps) => (
  <div>
    <h4 className={STYLES.categoryTitle}>{title}</h4>
    <div className="flex flex-wrap gap-2">
      {badges.map((tech, index) => (
        <motion.img
          key={tech.name}
          alt={tech.name}
          src={createBadgeUrl(tech)}
          className="h-8"
          initial={ANIMATION.badge.initial}
          animate={ANIMATION.badge.animate}
          transition={{ delay: delays[index], duration: ANIMATION.badge.duration }}
        />
      ))}
    </div>
  </div>
);

interface ContentItemProps {
  title: string;
  period: string;
  details?: string[];
}

const ContentItem = ({ title, period, details }: ContentItemProps) => (
  <div className="mb-3">
    <div className={STYLES.itemTitle}>
      {title} | {period}
    </div>
    {details && (
      <div className="ml-3 mt-1 space-y-0.5">
        {details.map((detail) => (
          <div key={detail} className={STYLES.itemDetail}>
            {isUrl(detail) ? (
              <a
                href={detail}
                target="_blank"
                rel="noopener noreferrer"
                className={`ml-4 ${STYLES.itemDetail} ${STYLES.linkHover}`}
              >
                {detail}
              </a>
            ) : (
              `• ${detail}`
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

interface EducationItemProps {
  school: string;
  status: string;
  period: string;
}

const EducationItem = ({ school, status, period }: EducationItemProps) => (
  <div className="mb-3">
    <div className={STYLES.itemTitle}>{school}</div>
    <div className={`${STYLES.itemDetail} mt-1`}>
      {status} | {period}
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================
export default function Info() {
  const badgeDelays = useMemo(() => calculateBadgeDelays(TECH_STACKS), []);

  return (
    <div className="container mx-auto mt-24 mb-24 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <motion.div {...ANIMATION.container}>
          {/* Introduction */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            안녕하세요,
            <br />
            저는 <span className="text-black dark:text-white">송준우 </span>
            입니다.
          </h1>
          <p className="text-lg text-gray-700 dark:text-stone-400 mb-6">
            풀스택 웹 개발자를 지망하고 있습니다. React와 Spring을 활용한 풀스택
            개발을 공부하며, TypeScript와 TailwindCSS로 더 나은 사용자 경험을
            만들어가는 개발자가 되고자 합니다.
          </p>

          <div className="space-y-4">
            {/* Tech Stacks */}
            <div className="space-y-4">
              <h3 className={STYLES.sectionTitle}>stack</h3>
              {Object.entries(TECH_STACKS).map(([key, category]) => (
                <TechStackSection
                  key={key}
                  title={category.title}
                  badges={category.badges}
                  delays={badgeDelays[key]}
                />
              ))}
            </div>

            {/* Projects */}
            <div>
              <h3 className={STYLES.sectionTitle}>project</h3>
              {PROJECTS.map((project) => (
                <ContentItem key={project.title} {...project} />
              ))}

              {/* Portfolio */}
              <div>
                <div className={STYLES.subsectionTitle}>portfolio</div>
                {PORTFOLIO.map((item) => (
                  <ContentItem key={item.title} {...item} />
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h3 className={STYLES.subsectionTitle}>education</h3>
              {EDUCATION_LIST.map((edu) => (
                <EducationItem key={edu.school} {...edu} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
