export interface NavItem {
  id: string;
  label: string;
  href: string;
}

export interface Skill {
  name: string;
  icon: string;
  percentage: number;
}

export interface Project {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  bullets: string[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  tags?: string[];
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  iconType: 'github' | 'linkedin' | 'email';
}

export interface ProfileInfo {
  name: string;
  role: string;
  bio: string;
  location: string;
  photoUrl: string;
  statusMessage: string;
}
