// Cloudflare Worker: Scheduled Blog Post Publisher
// Cron: 0 6 * * 1,3,5 (Mon/Wed/Fri at 6am UTC -- 6am GMT / 7am BST)
//
// Flow:
// 1. Query Supabase for the lowest queue_position post with status='queued'
// 2. Update it to status='published', set published_at, clear queue_position
// 3. Resequence remaining queued posts to close gaps
// 4. Fire Cloudflare Pages deploy hook
// 5. POST result to Discord webhook
//
// Environment variables (set in Cloudflare Worker settings):
//   SUPABASE_URL            - e.g. https://wbwkwknpuxddfwiexydp.supabase.co
//   SUPABASE_SERVICE_KEY    - service_role key (NOT anon key -- needs write access)
//   CLOUDFLARE_DEPLOY_HOOK  - Pages deploy hook URL
//   DISCORD_WEBHOOK_URL     - Discord channel webhook URL

export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(publishNextPost(env))
  },

  // Also allow manual trigger via HTTP for testing
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname === '/trigger' && request.method === 'POST') {
      const authHeader = request.headers.get('Authorization')
      if (authHeader !== `Bearer ${env.MANUAL_TRIGGER_SECRET}`) {
        return new Response('Unauthorized', { status: 401 })
      }
      const result = await publishNextPost(env)
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response('Not found', { status: 404 })
  },
}

async function publishNextPost(env) {
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY, CLOUDFLARE_DEPLOY_HOOK, DISCORD_WEBHOOK_URL } = env

  const headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Accept-Profile': 'drew_portfolio',
    'Content-Profile': 'drew_portfolio',
    'Prefer': 'return=representation',
  }

  try {
    // 1. Find the next queued post (lowest queue_position)
    const findRes = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?status=eq.queued&order=queue_position.asc&limit=1`,
      { headers }
    )

    if (!findRes.ok) {
      throw new Error(`Failed to query queued posts: ${findRes.status} ${await findRes.text()}`)
    }

    const queued = await findRes.json()

    if (queued.length === 0) {
      await notifyDiscord(DISCORD_WEBHOOK_URL, {
        content: '📭 **Cron ran** — no posts in the queue. Nothing to publish.',
      })
      return { published: false, reason: 'queue_empty' }
    }

    const post = queued[0]

    // 2. Publish the post
    const publishRes = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${post.id}`,
      {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          status: 'published',
          published_at: new Date().toISOString(),
          queue_position: null,
        }),
      }
    )

    if (!publishRes.ok) {
      throw new Error(`Failed to publish post: ${publishRes.status} ${await publishRes.text()}`)
    }

    // 3. Resequence remaining queued posts to close the gap
    const remainingRes = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?status=eq.queued&order=queue_position.asc&select=id,queue_position`,
      { headers }
    )

    if (remainingRes.ok) {
      const remaining = await remainingRes.json()
      for (let i = 0; i < remaining.length; i++) {
        const newPosition = i + 1
        if (remaining[i].queue_position !== newPosition) {
          await fetch(
            `${SUPABASE_URL}/rest/v1/blog_posts?id=eq.${remaining[i].id}`,
            {
              method: 'PATCH',
              headers,
              body: JSON.stringify({ queue_position: newPosition }),
            }
          )
        }
      }
    }

    // 4. Fire Cloudflare Pages deploy hook
    const deployRes = await fetch(CLOUDFLARE_DEPLOY_HOOK, { method: 'POST' })

    if (!deployRes.ok) {
      await notifyDiscord(DISCORD_WEBHOOK_URL, {
        content: `⚠️ **Published "${post.title}"** but deploy hook failed (${deployRes.status}). Manual deploy needed.`,
      })
      return { published: true, deployed: false, post: post.title }
    }

    // 5. Notify success
    await notifyDiscord(DISCORD_WEBHOOK_URL, {
      content: `✅ **Published "${post.title}"** — deploy triggered. Site will rebuild shortly.`,
    })

    return { published: true, deployed: true, post: post.title }

  } catch (err) {
    await notifyDiscord(DISCORD_WEBHOOK_URL, {
      content: `❌ **Cron publish failed** — ${err.message}`,
    }).catch(() => {})

    return { published: false, error: err.message }
  }
}

async function notifyDiscord(webhookUrl, payload) {
  if (!webhookUrl) return

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
