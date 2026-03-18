# HomeServer

> Self-hosted VPS infrastructure for Drew's personal and project tooling

A single Hetzner VPS running Docker Compose services behind a Caddy reverse proxy. The goal is maximum utility per pound spent, not enterprise-grade ops.

---

## Why a VPS

One box, one monthly fee, everything useful becomes free:

- **n8n** - workflow automation for Engineering Gym question generation (and anything else)
- **Supabase (dev instance)** - proper dev environment, no more polluting production with test data
- **Uptime Kuma** - uptime monitoring for drewbs.dev and any other services
- **Staging environment** - a proper place to test drewbs.dev changes before they go live
- **Future:** self-hosted LLM for Engineering Gym explain-it-back checker and site chatbot

---

## Hardware

**Provider:** Hetzner
**Starting spec: CCX13** (AMD, dedicated vCPU)

| Spec         | Value                             |
| ------------ | --------------------------------- |
| vCPU         | 2 dedicated AMD                   |
| RAM          | 8 GB                              |
| SSD          | 80 GB                             |
| Traffic      | 20 TB/month                       |
| IPv4         | Yes (add €0.50 spare static IPv4) |
| Cost         | ~€12.49/month                     |
| Architecture | x86_64 (AMD)                      |

### Why CCX13 over the cheaper CAX11

The CAX11 (€3.29/month, ARM) would run the basic services fine. The CCX13 costs €9/month more and is worth it for two reasons:

1. **x86 AMD** - zero Docker image compatibility concerns, no ARM edge cases ever
2. **8GB dedicated RAM** - comfortable headroom for Supabase dev (which is a heavy stack) alongside n8n and everything else

### Upgrade path: CCX23 when LLM features are ready

When Engineering Gym explain-it-back checking and the site chatbot are actually being built, upgrade to CCX23:

| Spec | Value           |
| ---- | --------------- |
| vCPU | 4 dedicated AMD |
| RAM  | 16 GB           |
| Cost | ~€24.49/month   |

16GB RAM runs Llama 3.1 8B at 4-bit quantisation via Ollama at acceptable speed for quiz checking. Probably still marginal for real-time chatbot latency - revisit at build time.

**Don't upgrade early.** Pay for LLM capacity when you're building the LLM feature. Earn the complexity.

Hetzner resizes are straightforward - existing volumes persist, minimal downtime.

### ARM note

Rosetta runs on your Mac for local dev, not on the VPS. The VPS needs native ARM images if using a CAX instance. On CCX (x86) this is irrelevant. All chosen services (n8n, Supabase, Caddy, Uptime Kuma, Ollama) publish multi-arch images anyway, but the CCX removes the question entirely.

---

## Stack

- **Docker + Docker Compose** - all services run as containers
- **Caddy** - reverse proxy with automatic HTTPS via Let's Encrypt
- **Portainer** (optional) - web UI for managing Docker containers

---

## Services

| Service        | Purpose                             | Docs                           |
| -------------- | ----------------------------------- | ------------------------------ |
| n8n            | Workflow automation                 | [[docs/services/N8N]]          |
| Supabase (dev) | Development database                | [[docs/services/SUPABASE_DEV]] |
| Uptime Kuma    | Uptime monitoring                   | [[docs/services/UPTIME_KUMA]]  |
| Caddy          | Reverse proxy / HTTPS               | [[docs/setup/CADDY]]           |
| Ollama         | Self-hosted LLM (Phase 2)           | [[docs/services/OLLAMA]]       |
| Open WebUI     | Chat interface for Ollama (Phase 2) | [[docs/services/OLLAMA]]       |

---

## Docs

- [[docs/setup/INITIAL_SETUP]] - provisioning the server from scratch
- [[docs/setup/CADDY]] - reverse proxy and HTTPS config
- [[docs/setup/BACKUPS]] - volume backup strategy
- [[docs/setup/WATCHER]] - Obsidian vault watcher script for Mayu's Architecture Vault sync
- [[docs/LEARNING]] - LLM concepts and learning resources

---

## Related Projects

- [[../../projects/engineering-gym/README]] - Engineering Gym; n8n question generation workflow lives here
- [[../../drew-portfolio/specs/mayu-architecture-vault]] - Mayu's Architecture Vault; vault watcher feeds this
