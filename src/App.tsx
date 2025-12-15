import './App.css'
import { useMemo, useState } from 'react'

import { ImageUploader } from './components/ImageUploader'
import { LocationPicker } from './components/LocationPicker'
import { ResultPanel } from './components/ResultPanel'
import { fileToBase64Image } from './lib/fileToBase64'
import { generateTwoPersonSceneImage } from './lib/gemini'
import { LOCATIONS, type LocationId } from './lib/locations'
import { buildTwoPersonScenePrompt } from './lib/prompt'

function App() {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  const [userPhoto, setUserPhoto] = useState<File | null>(null)
  const [buddyPhoto, setBuddyPhoto] = useState<File | null>(null)
  const [locationId, setLocationId] = useState<LocationId>(LOCATIONS[0].id)

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null)

  const selectedLocation = useMemo(
    () => LOCATIONS.find((l) => l.id === locationId) ?? LOCATIONS[0],
    [locationId],
  )

  const canGenerate = userPhoto != null && buddyPhoto != null && !isGenerating

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">雙人同框地點合照（Gemini 影像生成）</h1>
          <p className="subtitle">
            上傳「本人照片 + 夥伴照片」，選地點後生成一張符合氛圍的同框照片。
          </p>
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <h2 className="cardTitle">1) API Key</h2>
          <div className="row">
            <label className="label" htmlFor="apiKey">
              Gemini API Key（可留空：若你的本機 API 有設 GEMINI_API_KEY，就會用後端環境變數）
            </label>
            <div className="apiKeyRow">
              <input
                id="apiKey"
                className="input"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="buttonSecondary"
                onClick={() => setShowApiKey((v) => !v)}
              >
                {showApiKey ? '隱藏' : '顯示'}
              </button>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="cardTitle">2) 上傳兩張人物照片</h2>
          <div className="twoCols">
            <ImageUploader
              label="本人照片"
              file={userPhoto}
              onFileChange={setUserPhoto}
            />
            <ImageUploader
              label="夥伴照片"
              file={buddyPhoto}
              onFileChange={setBuddyPhoto}
            />
          </div>
          <p className="hint">
            建議使用清晰正面照（JPG/PNG），檔案不要太大（例如 &lt; 8MB），生成效果較穩定。
          </p>
        </section>

        <section className="card">
          <h2 className="cardTitle">3) 選擇地點</h2>
          <LocationPicker
            locations={LOCATIONS}
            value={locationId}
            onChange={setLocationId}
          />
          <div className="locationNote">
            <div className="locationName">{selectedLocation.name}</div>
            <div className="locationDesc">{selectedLocation.description}</div>
          </div>
        </section>

        <section className="card">
          <h2 className="cardTitle">4) 生成</h2>
          <div className="row">
            <button
              type="button"
              className="buttonPrimary"
              disabled={!canGenerate}
              onClick={async () => {
                setError(null)
                setResultDataUrl(null)

                if (!userPhoto || !buddyPhoto) {
                  setError('請先上傳本人照片與夥伴照片。')
                  return
                }
                setIsGenerating(true)
                try {
                  const [userImg, buddyImg] = await Promise.all([
                    fileToBase64Image(userPhoto),
                    fileToBase64Image(buddyPhoto),
                  ])

                  const prompt = buildTwoPersonScenePrompt({
                    locationName: selectedLocation.name,
                    locationPrompt: selectedLocation.prompt,
                  })

                  const generated = await generateTwoPersonSceneImage({
                    apiKey: apiKey.trim(),
                    prompt,
                    userImage: userImg,
                    buddyImage: buddyImg,
                  })

                  const dataUrl = `data:${generated.mimeType};base64,${generated.base64}`
                  setResultDataUrl(dataUrl)
                } catch (e) {
                  const message =
                    e instanceof Error ? e.message : '生成失敗，請稍後再試。'
                  setError(message)
                } finally {
                  setIsGenerating(false)
                }
              }}
            >
              {isGenerating ? '生成中...' : '生成影像'}
            </button>

            <button
              type="button"
              className="buttonSecondary"
              onClick={() => {
                setError(null)
                setResultDataUrl(null)
              }}
              disabled={isGenerating}
            >
              清除結果
            </button>
          </div>

          {error ? <div className="errorBox">{error}</div> : null}
        </section>

        <section className="card">
          <h2 className="cardTitle">5) 結果</h2>
          <ResultPanel dataUrl={resultDataUrl} />
        </section>
      </main>

      <footer className="footer">
        <p className="footerText">
          這個 MVP 直接在瀏覽器呼叫 Gemini API。不要在公開環境中使用真實金鑰；如需更安全做法，可改成後端代理。
        </p>
      </footer>
    </div>
  )
}

export default App
