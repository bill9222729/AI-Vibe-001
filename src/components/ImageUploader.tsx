import { useEffect, useMemo, useState } from 'react'

export type ImageUploaderProps = {
  label: string
  file: File | null
  onFileChange: (file: File | null) => void
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

export function ImageUploader(props: ImageUploaderProps) {
  const { label, file, onFileChange } = props
  const maxSizeBytes = props.maxSizeBytes ?? DEFAULT_MAX_SIZE_BYTES
  const [error, setError] = useState<string | null>(null)

  const previewUrl = useMemo(() => {
    if (!file) return null
    return URL.createObjectURL(file)
  }, [file])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  return (
    <div className="uploader">
      <div className="uploaderLabel">{label}</div>

      <input
        className="fileInput"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => {
          setError(null)
          const next = e.target.files?.[0] ?? null
          if (!next) {
            onFileChange(null)
            return
          }
          if (!isAllowedImageType(next)) {
            setError('僅支援 JPG / PNG / WebP。')
            onFileChange(null)
            return
          }
          if (next.size > maxSizeBytes) {
            setError(`檔案過大，請小於 ${(maxSizeBytes / 1024 / 1024).toFixed(0)}MB。`)
            onFileChange(null)
            return
          }
          onFileChange(next)
        }}
      />

      {error ? <div className="errorInline">{error}</div> : null}

      {previewUrl ? (
        <div className="previewWrap">
          <img className="previewImg" src={previewUrl} alt={`${label} 預覽`} />
        </div>
      ) : (
        <div className="previewEmpty">尚未選擇圖片</div>
      )}
    </div>
  )
}


