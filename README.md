# 雙人同框地點合照（React + Vite + Gemini）

一個本機可跑的 Web App：使用者上傳 **本人照片** + **夥伴照片**、選擇地點後，透過 **Gemini 影像生成**產出兩人同時出現在該地點、且穿著/風格/氛圍符合地點特色的一張圖片。

## 功能
- 上傳 2 張人物照片（本人 + 夥伴）並預覽
- 從 4 個地點擇一（西門町、信義、九份、墾丁）
- 在前端貼上 Gemini API Key（可選；若你有設 `GEMINI_API_KEY` 環境變數，這欄可留空）
- 呼叫 `@google/genai`（Google Gen AI JS SDK）生成影像
- 預覽生成結果並下載

## 使用方式（本機）
1. 安裝依賴：

```bash
yarn
```

2. 準備 Gemini API Key（建議用環境變數，避免前端暴露）：

- 方式 A：用環境變數（建議）
  - 參考 `env.example` 自行建立一份環境檔（例如 `.env`）並填入 `GEMINI_API_KEY`
  - 或直接在 shell export：`export GEMINI_API_KEY=...`

3. 啟動開發伺服器（會同時啟動：本機 API + Vite）：

```bash
yarn dev
```

4. 打開瀏覽器後：
- 貼上你的 Gemini API Key（可選）
- 上傳兩張照片
- 選擇地點
- 點「生成影像」

## 重要注意事項
- **CORS**：瀏覽器直連 Gemini API 容易遇到 CORS 阻擋，因此本專案改成 **本機 Express 代理**：前端呼叫 `/api/generate`，由伺服器端呼叫 Gemini。
- **安全性**：建議把 `GEMINI_API_KEY` 放在本機環境變數（後端使用），避免在前端輸入。
- **照片品質**：建議使用清晰正面照（JPG/PNG/WebP），檔案大小不要太大（例如 < 8MB）。
## 主要程式碼位置
- `src/App.tsx`：主流程 UI 與狀態管理
- `src/lib/gemini.ts`：Gemini 呼叫封裝（`ai.interactions.create` 多模態輸入 → 解析 `image` outputs）
- `src/lib/locations.ts`：地點與對應氛圍提示詞
- `src/lib/prompt.ts`：prompt 組裝策略
 - `server/index.ts`：本機 Express API（避免 CORS）
