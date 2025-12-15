import cors from 'cors'
import express from 'express'
import { GoogleGenAI } from '@google/genai'

type Base64Image = {
  base64: string
  mimeType: string
}

type GenerateRequestBody = {
  apiKey?: string
  prompt: string
  model?: string
  userImage: Base64Image
  companions: Base64Image[]
}

const app = express()

app.use(cors({ origin: true }))
app.use(express.json({ limit: '25mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/generate', async (req, res) => {
  try {
    const body = req.body as Partial<GenerateRequestBody>

    if (!body?.prompt || typeof body.prompt !== 'string') {
      res.status(400).json({ error: 'Missing prompt' })
      return
    }
    if (!body.userImage?.base64 || !body.userImage?.mimeType) {
      res.status(400).json({ error: 'Missing userImage' })
      return
    }
    if (!Array.isArray(body.companions) || body.companions.length === 0) {
      res.status(400).json({ error: 'Missing companions' })
      return
    }
    if (body.companions.length > 4) {
      res
        .status(400)
        .json({ error: 'Too many companions. Max companions is 4.' })
      return
    }
    for (const c of body.companions) {
      if (!c?.base64 || !c?.mimeType) {
        res.status(400).json({ error: 'Invalid companions item' })
        return
      }
    }

    const apiKey = (body.apiKey ?? process.env.GEMINI_API_KEY ?? '').trim()
    if (!apiKey) {
      res.status(400).json({
        error:
          'Missing API key. Provide apiKey in request or set GEMINI_API_KEY env var.',
      })
      return
    }

    const model = (body.model ?? 'gemini-3-pro-image-preview').trim()
    const ai = new GoogleGenAI({ apiKey })

    const interaction = await ai.interactions.create({
      model,
      input: [
        { type: 'text', text: body.prompt },
        {
          type: 'image',
          data: body.userImage.base64,
          mime_type: body.userImage.mimeType,
        },
        ...body.companions.map((img) => ({
          type: 'image' as const,
          data: img.base64,
          mime_type: img.mimeType,
        })),
      ],
      response_modalities: ['image'],
    })

    const outputs = interaction.outputs ?? []
    const imageOutput = outputs.find(
      (o) =>
        (o as { type?: unknown }).type === 'image' &&
        typeof (o as { data?: unknown }).data === 'string' &&
        typeof (o as { mime_type?: unknown }).mime_type === 'string',
    ) as { data: string; mime_type: string } | undefined

    if (!imageOutput) {
      res.status(502).json({ error: 'No image output returned by model.' })
      return
    }

    res.json({ base64: imageOutput.data, mimeType: imageOutput.mime_type })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    res.status(500).json({ error: msg })
  }
})

const port = Number(process.env.PORT ?? 8787)
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`API server listening on http://localhost:${port}`)
})


