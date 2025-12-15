export type MissionId = 'ximending' | 'xinyi' | 'jiufen' | 'kenting'

export type Mission = {
  id: MissionId
  title: string
  subtitle: string
  scenePrompt: string
  vibePrompt: string
  wardrobePrompt: string
}

export const MISSIONS: Mission[] = [
  {
    id: 'ximending',
    title: '任務：霓虹街頭巡查',
    subtitle: '台北西門町｜街頭潮流、霓虹、人潮背景',
    scenePrompt:
      'Taipei Ximending at night, neon signs, lively street, modern Taiwanese city scene, candid travel photo.',
    vibePrompt:
      'Street fashion vibe, vibrant color accents, dynamic city lighting, slight film grain, energetic atmosphere.',
    wardrobePrompt:
      'Streetwear outfits that match a night city scene: layered tops, jackets, sneakers; stylish but natural.',
  },
  {
    id: 'xinyi',
    title: '任務：都會情報交接',
    subtitle: '台北信義｜摩登高樓、俐落都會、夜景燈光',
    scenePrompt:
      'Taipei Xinyi District evening, modern skyscrapers, clean urban lines, upscale city atmosphere.',
    vibePrompt:
      'Cool-toned city lights, crisp high-end travel photography, cinematic modern mood.',
    wardrobePrompt:
      'Smart-casual outfits suitable for an upscale district: clean silhouettes, minimal accessories, polished look.',
  },
  {
    id: 'jiufen',
    title: '任務：山城燈籠護送',
    subtitle: '九份老街｜雨霧、紅燈籠、復古巷弄、溫暖光影',
    scenePrompt:
      'Jiufen Old Street, misty rainy hillside town, warm lantern glow, narrow stone alley, cozy vintage vibe.',
    vibePrompt:
      'Soft reflections on wet stones, warm tones, atmospheric fog, gentle drizzle, cinematic warmth.',
    wardrobePrompt:
      'Layered jackets or raincoats, scarves, practical shoes; outfits fit a misty rainy old street.',
  },
  {
    id: 'kenting',
    title: '任務：海岸補給偵查',
    subtitle: '墾丁海邊｜陽光海灘、度假感、海風暖色',
    scenePrompt:
      'Kenting beach daytime, bright sunlight, turquoise water, sandy shore, airy composition, travel photography.',
    vibePrompt:
      'Relaxed vacation atmosphere, warm sunlight, natural skin tones, gentle sea breeze.',
    wardrobePrompt:
      'Casual summer outfits: light shirts, shorts/skirts, sandals; comfortable and cohesive as a party.',
  },
]


