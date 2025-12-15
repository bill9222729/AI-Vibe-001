import './App.css'
import { useEffect, useMemo, useState } from 'react'

import { ImageUploader } from './components/ImageUploader'
import { CompanionRoster, type Companion } from './components/CompanionRoster'
import { MissionPicker } from './components/MissionPicker'
import { PartyPicker } from './components/PartyPicker'
import { ResultPanel } from './components/ResultPanel'
import { fileToBase64Image } from './lib/fileToBase64'
import { generateTwoPersonSceneImage } from './lib/gemini'
import { MISSIONS, type MissionId } from './lib/missions'
import { buildRpgPartyPrompt } from './lib/rpgPrompt'

type StepId = 'hero' | 'roster' | 'party' | 'mission' | 'result'

const MAX_PARTY_COMPANIONS = 5

function App() {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  const [step, setStep] = useState<StepId>('hero')
  const [heroName, setHeroName] = useState('勇者')
  const [userPhoto, setUserPhoto] = useState<File | null>(null)
  const [heroPreviewUrl, setHeroPreviewUrl] = useState<string | null>(null)
  const [companions, setCompanions] = useState<Companion[]>([])
  const [partyIds, setPartyIds] = useState<string[]>([])
  const [missionId, setMissionId] = useState<MissionId>(MISSIONS[0].id)

  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resultDataUrl, setResultDataUrl] = useState<string | null>(null)

  const selectedMission = useMemo(
    () => MISSIONS.find((m) => m.id === missionId) ?? MISSIONS[0],
    [missionId],
  )

  const party = useMemo(
    () => companions.filter((c) => partyIds.includes(c.id)),
    [companions, partyIds],
  )

  const canGenerate = userPhoto != null && party.length > 0 && !isGenerating

  useEffect(() => {
    // Cleanup blob URLs when leaving the page.
    return () => {
      if (heroPreviewUrl) URL.revokeObjectURL(heroPreviewUrl)
      for (const c of companions) URL.revokeObjectURL(c.previewUrl)
    }
    // Intentionally run only on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="title">RPG 任務合照生成器（Gemini 影像生成）</h1>
          <p className="subtitle">
            先建立你的主角，再招募夥伴、組隊、選任務場景，最後生成隊伍合照。
          </p>
        </div>
      </header>

      <main className="grid">
        <section className="card">
          <h2 className="cardTitle">設定：API Key</h2>
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
          <div className="stepBar">
            <button
              type="button"
              className={step === 'hero' ? 'stepChip stepChipActive' : 'stepChip'}
              onClick={() => setStep('hero')}
            >
              1 主角
            </button>
            <button
              type="button"
              className={step === 'roster' ? 'stepChip stepChipActive' : 'stepChip'}
              onClick={() => setStep('roster')}
            >
              2 夥伴名冊
            </button>
            <button
              type="button"
              className={step === 'party' ? 'stepChip stepChipActive' : 'stepChip'}
              onClick={() => setStep('party')}
            >
              3 組隊
            </button>
            <button
              type="button"
              className={step === 'mission' ? 'stepChip stepChipActive' : 'stepChip'}
              onClick={() => setStep('mission')}
            >
              4 任務場景
            </button>
            <button
              type="button"
              className={step === 'result' ? 'stepChip stepChipActive' : 'stepChip'}
              onClick={() => setStep('result')}
            >
              5 生成/結果
            </button>
          </div>

          {step === 'hero' ? (
            <div className="stepBody">
              <h2 className="cardTitle">章節 1：建立主角</h2>
              <label className="label" htmlFor="heroName">
                角色名稱（可選）
              </label>
              <input
                id="heroName"
                className="input"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                placeholder="勇者"
              />
              <div className="spacer" />
              <ImageUploader
                label="上傳主角照片"
                file={userPhoto}
                previewUrl={heroPreviewUrl}
                onFileChange={(file) => {
                  setError(null)
                  if (heroPreviewUrl) URL.revokeObjectURL(heroPreviewUrl)
                  setUserPhoto(file)
                  setHeroPreviewUrl(file ? URL.createObjectURL(file) : null)
                }}
                previewFit="contain"
              />
              <div className="row">
                <button
                  type="button"
                  className="buttonPrimary"
                  disabled={!userPhoto}
                  onClick={() => setStep('roster')}
                >
                  前往夥伴名冊 →
                </button>
              </div>
            </div>
          ) : null}

          {step === 'roster' ? (
            <div className="stepBody">
              <h2 className="cardTitle">章節 2：招募夥伴（可上傳多張）</h2>
              <CompanionRoster
                companions={companions}
                onAddFiles={(files) => {
                  setCompanions((prev) => {
                    const next = [...prev]
                    for (const f of files) {
                      const id =
                        typeof crypto !== 'undefined' && 'randomUUID' in crypto
                          ? crypto.randomUUID()
                          : `${Date.now()}-${Math.random()}`
                      next.push({
                        id,
                        name: '',
                        file: f,
                        previewUrl: URL.createObjectURL(f),
                      })
                    }
                    return next
                  })
                }}
                onRemove={(id) => {
                  setCompanions((prev) => {
                    const target = prev.find((c) => c.id === id)
                    if (target) URL.revokeObjectURL(target.previewUrl)
                    return prev.filter((c) => c.id !== id)
                  })
                  setPartyIds((prev) => prev.filter((x) => x !== id))
                }}
                onRename={(id, name) => {
                  setCompanions((prev) =>
                    prev.map((c) => (c.id === id ? { ...c, name } : c)),
                  )
                }}
              />
              <div className="row">
                <button
                  type="button"
                  className="buttonSecondary"
                  onClick={() => setStep('hero')}
                >
                  ← 回主角
                </button>
                <button
                  type="button"
                  className="buttonPrimary"
                  disabled={companions.length === 0}
                  onClick={() => setStep('party')}
                >
                  前往組隊 →
                </button>
              </div>
            </div>
          ) : null}

          {step === 'party' ? (
            <div className="stepBody">
              <h2 className="cardTitle">章節 3：組隊（最多 {MAX_PARTY_COMPANIONS} 位夥伴）</h2>
              <div className="hint">
                你可以先上傳很多夥伴，這次任務只挑幾位出隊（避免一次送太多圖片導致請求過大）。
              </div>
              <div className="spacer" />
              <PartyPicker
                companions={companions}
                selectedIds={partyIds}
                onChange={setPartyIds}
                maxPartySize={MAX_PARTY_COMPANIONS}
              />
              <div className="row">
                <button
                  type="button"
                  className="buttonSecondary"
                  onClick={() => setStep('roster')}
                >
                  ← 回名冊
                </button>
                <button
                  type="button"
                  className="buttonPrimary"
                  disabled={partyIds.length === 0}
                  onClick={() => setStep('mission')}
                >
                  前往任務場景 →
                </button>
              </div>
            </div>
          ) : null}

          {step === 'mission' ? (
            <div className="stepBody">
              <h2 className="cardTitle">章節 4：選擇任務場景</h2>
              <MissionPicker
                missions={MISSIONS}
                value={missionId}
                onChange={setMissionId}
              />
              <div className="locationNote">
                <div className="locationName">{selectedMission.title}</div>
                <div className="locationDesc">{selectedMission.subtitle}</div>
              </div>
              <div className="row">
                <button
                  type="button"
                  className="buttonSecondary"
                  onClick={() => setStep('party')}
                >
                  ← 回組隊
                </button>
                <button
                  type="button"
                  className="buttonPrimary"
                  onClick={() => setStep('result')}
                >
                  前往生成 →
                </button>
              </div>
            </div>
          ) : null}

          {step === 'result' ? (
            <div className="stepBody">
              <h2 className="cardTitle">章節 5：生成任務合照</h2>
              <div className="questSummary">
                <div className="questLine">
                  <span className="questKey">主角：</span>
                  <span className="questVal">{heroName || '勇者'}</span>
                </div>
                <div className="questLine">
                  <span className="questKey">隊伍：</span>
                  <span className="questVal">
                    {party.length === 0
                      ? '尚未選擇'
                      : party.map((c) => c.name || '未命名夥伴').join('、')}
                  </span>
                </div>
                <div className="questLine">
                  <span className="questKey">任務：</span>
                  <span className="questVal">{selectedMission.title}</span>
                </div>
              </div>

              <div className="row">
                <button
                  type="button"
                  className="buttonPrimary"
                  disabled={!canGenerate}
                  onClick={async () => {
                    setError(null)
                    setResultDataUrl(null)

                    if (!userPhoto) {
                      setError('請先上傳主角照片。')
                      return
                    }
                    if (party.length === 0) {
                      setError('請先選擇出隊夥伴。')
                      return
                    }

                    setIsGenerating(true)
                    try {
                      const heroImg = await fileToBase64Image(userPhoto)
                      const companionImgs = await Promise.all(
                        party.map((p) => fileToBase64Image(p.file)),
                      )

                      const prompt = buildRpgPartyPrompt({
                        mission: selectedMission,
                        heroName: heroName || '勇者',
                        companionNames: party.map((c) => c.name || 'companion'),
                      })

                      const generated = await generateTwoPersonSceneImage({
                        apiKey: apiKey.trim(),
                        prompt,
                        userImage: heroImg,
                        companions: companionImgs,
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
                  {isGenerating ? '生成中...' : '開始生成'}
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
            </div>
          ) : null}
        </section>

        <section className="card">
          <h2 className="cardTitle">結果預覽</h2>
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
