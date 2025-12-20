export interface Project {
  id: number;
  name: string;
  year: string;
  tech: string;
  description: string;
  logoClass: string;
  video?: string;
  github?: string;
  demoLink?: string;
  icon?: string;
  bg?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'Real Pokedex',
    year: '2022',
    tech: 'Vue 3, PokeAPI',
    description:
      'Built with Vue 3 and PokeAPI to recreate an authentic game feel. A key challenge was performance with hundreds of unoptimized sprite GIFs. I solved this by implementing lazy loading for items near the viewport and ensuring only the active Pokemon renders its animated sprite.',
    logoClass: 'logo-pokedex',
    video: '/pokedex_demo.webm',
    github: 'https://github.com/jmart790/real-pokedex',
    demoLink: 'https://aprettydecentpokedex.netlify.app/',
    icon: 'pokeball',
    bg: '/pokemon-bg.png'
  },
  {
    id: 2,
    name: 'Josh Codes Things',
    year: '2024',
    tech: 'Vue 3, TypeScript',
    description:
      'My personal portfolio and playground for retro-inspired web experiments. Built with a focus on component architecture, pixel-perfect 90s aesthetics, and modern frontend tooling.',
    logoClass: 'logo-jct',
    github: 'https://github.com/jmart790/joshcodesthings2024',
    icon: 'computer',
    bg: '/joshcodesthings-bg.png'
  },
  {
    id: 3,
    name: '16-bit UI Library',
    year: '2025',
    tech: 'React, Storybook, TypeScript',
    description:
      'A retro 90s video game pixel art design system for React. Features pixel-perfect components, CSS reset, and custom font support to easily build authentic SNES/Genesis era web interfaces.',
    logoClass: 'logo-16bit',
    github: 'https://github.com/jmart790/16bit-ui',
    icon: 'pencil',
    bg: '/uilibrary-bg.png'
  },
  {
    id: 4,
    name: 'My Smart Dash',
    year: '2023',
    tech: 'Vue 3, Geolocation API',
    description:
      "A location-aware personal dashboard that consolidates useful utility modues. It aggregates data from multiple public APIs to display local weather, news, and relevant alerts based on the user's real-time position.",
    logoClass: 'logo-dashboard',
    github: 'https://github.com/jmart790/My_Dashboard',
    icon: 'globe',
    bg: '/mydashboard-bg.png'
  },
  {
    id: 5,
    name: 'PS App Replica',
    year: '2023',
    tech: 'Vue 3, Vuex',
    description:
      'A pixel-perfect web replica of the PlayStation Mobile App. Recreates the iOS navigation, animations, and visual polish using modern web standards.',
    logoClass: 'logo-psapp',
    github: 'https://github.com/jmart790/playstation-app-replica',
    icon: 'mobile',
    bg: '/playstation-bg.png'
  },
  {
    id: 6,
    name: 'Retro Gamer Lofi',
    year: '2024',
    tech: 'Gen AI (Midjourney, Suno, Kling)',
    description:
      'A multimedia project exploring the intersection of AI generation and nostalgia. I use a toolchain of AI models to generate infinite lofi beats and retro-style visuals, curated and edited in DaVinci Resolve.',
    logoClass: 'logo-lofi',
    demoLink: 'https://www.youtube.com/@RetroGamerLofi',
    icon: 'cassette',
    bg: '/retrogamerlofi-bg.png'
  }
];
