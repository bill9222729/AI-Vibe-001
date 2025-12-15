export type Companion = {
  id: string
  name: string
  file: File
  previewUrl: string
}

export type CompanionRosterProps = {
  companions: Companion[]
  onAddFiles: (files: File[]) => void
  onRemove: (id: string) => void
  onRename: (id: string, name: string) => void
  maxSizeBytes?: number
}

const DEFAULT_MAX_SIZE_BYTES = 8 * 1024 * 1024

function isAllowedImageType(file: File) {
  return (
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/webp'
  )
}

export function CompanionRoster(props: CompanionRosterProps) {
  const { companions, onAddFiles, onRemove, onRename } = props
  const maxSizeBytes = props.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES

  return (
    <div className="roster">
      <div className="row">
        <input
          className="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => {
            const list = Array.from(e.target.files ?? [])
            const ok = list.filter(
              (f) => isAllowedImageType(f) && f.size <= maxSizeBytes,
            )
            onAddFiles(ok)
            e.currentTarget.value = ''
          }}
        />
        <div className="hint">
          可一次選多張。只接受 JPG/PNG/WebP，建議每張 &lt;{' '}
          {(maxSizeBytes / 1024 / 1024).toFixed(0)}MB。
        </div>
      </div>

      {companions.length === 0 ? (
        <div className="previewEmpty">尚未招募夥伴。先上傳幾張夥伴照片吧。</div>
      ) : (
        <div className="rosterGrid">
          {companions.map((c) => {
            return (
              <div key={c.id} className="rosterCard">
                <img
                  className="rosterImg"
                  src={c.previewUrl}
                  alt={c.name || '夥伴'}
                />
                <input
                  className="input"
                  value={c.name}
                  onChange={(e) => onRename(c.id, e.target.value)}
                  placeholder="夥伴名稱（可選）"
                />
                <button
                  type="button"
                  className="buttonSecondary"
                  onClick={() => onRemove(c.id)}
                >
                  移除
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


