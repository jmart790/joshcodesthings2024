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
    icon: 'pokeball'
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
    icon: 'computer'
  },
  {
    id: 3,
    name: 'Roam Planner',
    year: '2026',
    tech: 'Vue 3, Pinia, Supabase, Netlify Functions, Leaflet',
    description:
      'An RV Trip Planning web app. Search 18,000+ verified RV parks, plot routes with drive times and weather, and share trips with friends. A Netlify Functions backend serves the Supabase campground data and every external API, keeping the app bundle footprint small.',
    logoClass: 'logo-roamplanner',
    demoLink: 'https://roamplanner.netlify.app',
    icon: 'map'
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
    icon: 'globe'
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
    icon: 'mobile'
  },
  {
    id: 6,
    name: 'Retro Gamer Lofi',
    year: '2026',
    tech: 'Nuxt 3, Vue 3, TypeScript, Netlify',
    description:
      'An Emulation Station themed site with a 24/7 live radio, the latest mixes, albums, a live merch shop, and a fan voting board for the next soundtrack. Nuxt server routes pull YouTube, Spotify, and merch data with no API keys, and it is tuned for accessibility and performance.',
    logoClass: 'logo-lofi',
    demoLink: 'https://retrogamerlofi.com',
    icon: 'cassette'
  }
];
