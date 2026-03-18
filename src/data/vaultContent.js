export const VAULT_ENTRIES = {
  ironiq: [
    {
      title: 'IronIQ - Master Plan',
      slug: 'readme',
      summary: 'A mobile-first workout tracker built for athletes who train across powerlifting, hypertrophy, and functional fitness -- offline-first with WatermelonDB, crew-based social, and smart analytics.',
      tags: ['architecture', 'expo', 'offline-first', 'overview', 'react-native', 'roadmap', 'schema', 'social', 'sql', 'supabase', 'sync', 'zustand'],
    },
  ],
  'engineering-gym': [
    {
      title: 'Engineering Gym',
      slug: 'readme',
      summary: 'Interactive quiz and knowledge-reinforcement system embedded in drewbs.dev',
      tags: ['architecture', 'ios', 'meta', 'n8n', 'ollama', 'overview', 'react', 'react-router', 'roadmap', 'schema', 'self-hosted', 'testing'],
    },
  ],
  homeserver: [
    {
      title: 'HomeServer - Infrastructure Overview',
      slug: 'readme',
      summary: 'A single Hetzner VPS running Docker Compose services behind Caddy: n8n, dev Supabase, monitoring, and a future self-hosted LLM, all scoped to maximum utility per pound spent.',
      tags: ['architecture', 'caddy', 'docker', 'n8n', 'ollama', 'overview', 'roadmap', 'self-hosted'],
    },
  ],
  quitrx: [
    {
      title: 'QuitRX - Master Plan',
      slug: 'readme',
      summary: 'A no-nonsense stop smoking tracker with honest stats, vape tracking as a first-class feature, and a local-first architecture where health data never leaves the device without consent.',
      tags: ['architecture', 'expo', 'ios', 'monetisation', 'offline-first', 'overview', 'react-native', 'roadmap', 'schema', 'zustand'],
    },
  ],
  drewbrew: [
    {
      title: 'drewBrew - Master Plan',
      slug: 'readme',
      summary: 'A mobile-first coffee tracking system designed architecture-first -- local database, structured logging, and a future analytics layer for specialty coffee enthusiasts.',
      tags: ['analytics', 'architecture', 'authentication', 'decisions', 'docker', 'edge-functions', 'expo', 'meta', 'node', 'offline-first', 'overview', 'postgresql', 'push-notifications', 'react', 'react-native', 'roadmap', 'schema', 'sql', 'supabase', 'sync', 'typescript'],
    },
  ],
  'drew-portfolio': [
    {
      title: 'drewbs.dev - Project Overview',
      slug: 'overview',
      summary: "A portfolio site that documents its own construction in real time -- the site is the work, the blog is the engineering log, and the vault you're reading is part of it.",
      tags: ['architecture', 'authentication', 'caddy', 'ci-cd', 'cloudflare', 'css', 'decisions', 'edge-functions', 'ios', 'javascript', 'meta', 'overview', 'postgresql', 'react', 'react-router', 'roadmap', 'schema', 'security', 'supabase', 'vite'],
    },
    {
      title: "Mayu's Architecture Vault - How It Works",
      slug: 'vault-architecture',
      summary: 'The architecture behind the vault itself -- why it exists, the two-gate sync pipeline, wikilink resolution at sync time, and the deliberate decision to seed statically before building the n8n infrastructure.',
      tags: ['architecture', 'authentication', 'ci-cd', 'decisions', 'meta', 'n8n', 'offline-first', 'ollama', 'postgresql', 'react', 'roadmap', 'schema', 'security', 'self-hosted', 'sql', 'supabase', 'sync'],
    },
  ],
}

export const VAULT_PROJECTS = [
  { slug: 'ironiq', title: 'IronIQ', description: 'Offline-first workout tracking for real athletes' },
  { slug: 'engineering-gym', title: 'Engineering Gym', description: 'Active learning system built on the blog' },
  { slug: 'homeserver', title: 'HomeServer', description: 'Self-hosted VPS infrastructure' },
  { slug: 'quitrx', title: 'QuitRX', description: 'No-nonsense stop smoking tracker' },
  { slug: 'drewbrew', title: 'drewBrew', description: 'Architecture-first coffee tracking' },
  { slug: 'drew-portfolio', title: 'drewbs.dev', description: 'The portfolio that documents itself' },
]
