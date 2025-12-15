export type LocationId = 'ximending' | 'xinyi' | 'jiufen' | 'kenting'

export type LocationOption = {
  id: LocationId
  name: string
  description: string
  prompt: string
}

export const LOCATIONS: LocationOption[] = [
  {
    id: 'ximending',
    name: '台北西門町',
    description: '街頭潮流、人潮與霓虹招牌的年輕街區氛圍。',
    prompt:
      'Taipei Ximending at night, neon signs, lively but not overcrowded background, street fashion vibe, candid travel photo, modern Taiwanese street scene, vibrant color accents, slight film grain, dynamic city lighting.',
  },
  {
    id: 'xinyi',
    name: '台北信義商圈',
    description: '摩登都會、俐落高樓、乾淨且高級的城市感。',
    prompt:
      'Taipei Xinyi District evening, modern skyscrapers, clean urban lines, upscale city atmosphere, cool-toned city lights, stylish smart-casual outfits, crisp high-end travel photography.',
  },
  {
    id: 'jiufen',
    name: '九份老街',
    description: '山城雨霧、紅燈籠、復古巷弄與溫暖光影。',
    prompt:
      'Jiufen Old Street, misty rainy hillside town, warm lantern glow, narrow stone alley, cozy vintage vibe, light drizzle, soft reflections, layered jackets or raincoats, cinematic warm tones.',
  },
  {
    id: 'kenting',
    name: '墾丁海邊',
    description: '陽光海灘、度假感、海風與溫暖色調。',
    prompt:
      'Kenting beach daytime, bright sunlight, turquoise water, gentle sea breeze, relaxed vacation atmosphere, casual summer outfits, natural skin tones, airy composition, travel photography style.',
  },
]


