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
    demoLink: 'https://aprettydecentpokedex.netlify.app/'
  },
  {
    id: 2,
    name: 'Sega Genesis',
    year: '1989',
    tech: 'Motorola 68000',
    description: 'A 16-bit home video game console developed and sold by Sega. It was a major competitor to the SNES.',
    logoClass: 'logo-sega'
  },
  {
    id: 3,
    name: 'Neo Geo',
    year: '1990',
    tech: 'Arcade Board',
    description: 'Known for its high-end arcade specs brought to the home console market. Very expensive but powerful.',
    logoClass: 'logo-neogeo'
  },
  {
    id: 4,
    name: 'Nintendo 64',
    year: '1996',
    tech: 'MIPS R4300i',
    description: 'Named for its 64-bit central processing unit. Released with Super Mario 64.',
    logoClass: 'logo-n64'
  },
  {
    id: 5,
    name: 'Dreamcast',
    year: '1998',
    tech: 'Hitachi SH-4',
    description: 'The final home console from Sega, featuring a built-in modem for internet play.',
    logoClass: 'logo-dreamcast'
  }
];
