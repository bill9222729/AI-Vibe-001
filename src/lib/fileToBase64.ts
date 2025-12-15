export type Base64Image = {
  base64: string
  mimeType: string
}

function assertIsImageFile(file: File) {
  if (!file.type.startsWith('image/')) {
    throw new Error('請上傳圖片檔（JPG/PNG/WebP）。')
  }
}

export async function fileToBase64Image(file: File): Promise<Base64Image> {
  assertIsImageFile(file)

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('讀取檔案失敗。'))
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('讀取檔案失敗。'))
        return
      }
      resolve(reader.result)
    }
    reader.readAsDataURL(file)
  })

  // data:[mimeType];base64,[base64]
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) {
    throw new Error('不支援的圖片格式。')
  }

  const [, mimeType, base64] = match
  if (!mimeType.startsWith('image/')) {
    throw new Error('請上傳圖片檔（JPG/PNG/WebP）。')
  }

  return { base64, mimeType }
}


