import type { Base64Image } from './fileToBase64'

export type GenerateTwoPersonSceneParams = {
  apiKey: string
  prompt: string
  userImage: Base64Image
  buddyImage: Base64Image
  model?: string
}

export type GeneratedImage = {
  base64: string
  mimeType: string
}

export async function generateTwoPersonSceneImage(
  params: GenerateTwoPersonSceneParams,
): Promise<GeneratedImage> {
  const { apiKey, prompt, userImage, buddyImage } = params
  const model = params.model ?? 'gemini-3-pro-image-preview'

  let resp: Response
  try {
    resp = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: apiKey.trim() || undefined,
        prompt,
        model,
        userImage,
        buddyImage,
      }),
    })
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : '無法連線到本機 API（/api/generate）。'
    throw new Error(
      `無法連線到本機 API（/api/generate）。請確認已啟動後端（yarn dev 或 yarn dev:api）。\n${msg}`,
    )
  }

  const raw = await resp.text()
  let payload: unknown = null
  try {
    payload = raw ? (JSON.parse(raw) as unknown) : null
  } catch {
    payload = null
  }

  if (!resp.ok) {
    const errFromJson =
      payload &&
      typeof payload === 'object' &&
      'error' in payload &&
      typeof (payload as { error?: unknown }).error === 'string'
        ? (payload as { error: string }).error
        : null

    const snippet = raw ? `\n回應內容：${raw.slice(0, 200)}` : ''
    throw new Error(
      errFromJson ?? `API 錯誤：HTTP ${resp.status}${snippet}`,
    )
  }

  if (!payload || typeof payload !== 'object') {
    const snippet = raw ? `\n回應內容：${raw.slice(0, 200)}` : ''
    throw new Error(`後端回傳非 JSON。${snippet}`)
  }

  const base64 = (payload as { base64?: unknown }).base64
  const mimeType = (payload as { mimeType?: unknown }).mimeType

  if (typeof base64 !== 'string' || typeof mimeType !== 'string') {
    throw new Error('後端回傳格式不正確（缺少 base64/mimeType）。')
  }

  return { base64, mimeType }
}


