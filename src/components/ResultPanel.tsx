export type ResultPanelProps = {
  dataUrl: string | null
}

function inferExtensionFromDataUrl(dataUrl: string): string {
  if (dataUrl.startsWith('data:image/png')) return 'png'
  if (dataUrl.startsWith('data:image/webp')) return 'webp'
  if (dataUrl.startsWith('data:image/jpeg')) return 'jpg'
  return 'png'
}

export function ResultPanel(props: ResultPanelProps) {
  const { dataUrl } = props

  if (!dataUrl) {
    return <div className="resultEmpty">尚無結果，請先生成。</div>
  }

  const ext = inferExtensionFromDataUrl(dataUrl)
  const filename = `two-person-${Date.now()}.${ext}`

  return (
    <div className="resultPanel">
      <div className="resultImageWrap">
        <img className="resultImage" src={dataUrl} alt="生成結果" />
      </div>
      <div className="row">
        <a className="buttonPrimary linkButton" href={dataUrl} download={filename}>
          下載圖片
        </a>
      </div>
    </div>
  )
}


