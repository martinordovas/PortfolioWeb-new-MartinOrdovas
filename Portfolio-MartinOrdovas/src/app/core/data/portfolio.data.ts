import { NavItem, ProfileInfo, Project, Skill, SocialLink } from '../models/portfolio.model';

export const NAV_ITEMS: NavItem[] = [
  { id: 'inicio', label: '> home', href: '#inicio' },
  { id: 'sobreMi', label: '> about me', href: '#sobreMi' },
  { id: 'proyectos', label: '> projects', href: '#proyectos' },
  { id: 'contactame', label: '> contact', href: '#contactame' },
];

export const PROFILE_DATA: ProfileInfo = {
  name: 'Martín Ordovás Gracia',
  role: '> Full Stack Web, SQL and Java Developer.',
  bio: `I'm a DAM student who loves IT and programming, with a wide expertise in different coding languages and Operative Systems. I've been a Linux user for the last 8 years.`,
  location: 'Zaragoza, Spain',
  photoUrl: 'images/photo.jpg',
  statusMessage: `I'm currently open to junior roles and getting formation in a work environment. Feel free to reach out through any of these platforms!`,
};

export const SKILLS_DATA: Skill[] = [
  {
    name: 'Java - Spring Framework & Boot',
    icon: 'images/java.png',
    percentage: 90,
  },
  {
    name: 'SQL (MySQL)',
    icon: 'images/mysql.png',
    percentage: 70,
  },
  {
    name: 'C# / .NET',
    icon: 'images/csharp.png',
    percentage: 85,
  },
  {
    name: 'Web (Angular & Tailwind CSS)',
    icon: 'images/bootstrap.png',
    percentage: 95,
  },
  {
    name: 'Linux Admin',
    icon: 'images/tux.png',
    percentage: 70,
  },
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'portfolio',
    tabLabel: '> portfolio_v2',
    title: 'Personal Portfolio',
    subtitle: 'My current website, with a fluid, modern and responsive glassmorphism design.',
    bullets: [
      'Migrated to Angular 22 & Tailwind CSS with standalone architecture.',
      'High-performance custom HTML5 Canvas particle/starfield engine.',
      'Smooth scroll-snap locking for desktop & adaptive touch flow for mobile.',
      'Translucent glassmorphism with retro terminal aesthetic.'
    ],
    image: 'images/portfolio.png',
    githubUrl: 'https://github.com/martinordovas',
    demoUrl: 'https://mordovasgracia.vercel.app/',
    tags: ['Angular', 'Tailwind CSS', 'TypeScript', 'Canvas']
  },
  {
    id: 'java_project',
    tabLabel: '> java_project',
    title: 'jGym',
    subtitle: 'A complete JavaFX app designed to manage a fictional gym, with its employees and warehouse management.',
    bullets: [
      'Full JDBC connection with a MySQL database.',
      'Complete and structured Swing/JavaFX user interface.',
      'Role-based permissions and member tracking.'
    ],
    image: 'images/jgym.png',
    githubUrl: 'https://github.com/martinordovas',
    tags: ['Java', 'JavaFX', 'MySQL', 'JDBC']
  },
  {
    id: 'php_backend',
    tabLabel: '> php_backend',
    title: 'LaSalle Business Match 2026',
    subtitle: 'Complete webapp designed for managing a fictional job fair, with the ability to register and manage applicants.',
    bullets: [
      'JavaScript animations and cookie/session management.',
      'Sessions and improved security against SQL injections.',
      'PHP MySQLi database connection and dynamic applicant dashboards.'
    ],
    image: 'images/lsbm.png',
    githubUrl: 'https://github.com/martinordovas',
    tags: ['PHP', 'MySQL', 'JavaScript', 'Security']
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'github',
    name: '> GitHub',
    url: 'https://github.com/martinordovas',
    iconType: 'github',
  },
  {
    id: 'linkedin',
    name: '> LinkedIn',
    url: 'https://www.linkedin.com/in/mart%C3%ADn-ordov%C3%A1s-gracia-b9442023a/',
    iconType: 'linkedin',
  },
  {
    id: 'gmail',
    name: '> Gmail',
    url: 'mailto:martinordovas@gmail.com',
    iconType: 'email',
  },
];
