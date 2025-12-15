import type { Mission } from './missions'

export type BuildRpgPromptParams = {
  mission: Mission
  heroName: string
  companionNames: string[]
}

export function buildRpgPartyPrompt(params: BuildRpgPromptParams): string {
  const { mission, heroName, companionNames } = params
  const partyLine =
    companionNames.length > 0
      ? `${heroName} with companions: ${companionNames.join(', ')}`
      : heroName

  return [
    'You are generating a single photorealistic travel photo in an RPG quest style.',
    '',
    'Use the provided reference photos as the exact identities of the people in the final image:',
    '- The FIRST image is the HERO.',
    '- The remaining images are COMPANIONS.',
    '- Keep facial identity consistent with the reference photos.',
    '- Everyone must appear together in the same frame.',
    '- Do NOT add extra people.',
    '- Natural proportions, realistic skin tones, realistic lighting and shadows.',
    '',
    `QuestTitle: ${mission.title}`,
    `Party: ${partyLine}`,
    '',
    'Scene:',
    mission.scenePrompt,
    mission.vibePrompt,
    '',
    'Wardrobe & styling:',
    mission.wardrobePrompt,
    'Ensure the whole party looks coherent together and matches the scene weather/time.',
    '',
    'Composition:',
    '- Group photo: medium shot (waist-up) or full-body, everyone visible and in focus.',
    '- Background recognizable but not distracting.',
    '- High detail, high resolution, realistic camera look.',
  ].join('\n')
}


