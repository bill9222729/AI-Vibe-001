export type BuildPromptParams = {
  locationName: string
  locationPrompt: string
}

export function buildTwoPersonScenePrompt(params: BuildPromptParams): string {
  const { locationName, locationPrompt } = params

  return [
    'You are generating a single photorealistic travel photo.',
    '',
    'Use the TWO provided reference photos as the two main subjects in the final image.',
    '- Keep their facial identity consistent with the reference photos.',
    '- Keep both people clearly visible in the same frame.',
    '- Do NOT add extra people.',
    '- Natural proportions, realistic skin tones, realistic lighting and shadows.',
    '',
    `Scene: ${locationName}`,
    locationPrompt,
    '',
    'Wardrobe & styling:',
    '- Choose outfits that match the location vibe.',
    '- Ensure both outfits look coherent together and suitable for the weather/time.',
    '',
    'Composition:',
    '- Medium shot or waist-up shot, both subjects in focus.',
    '- Background recognizable but not distracting.',
    '- High detail, high resolution, realistic camera look.',
  ].join('\n')
}


