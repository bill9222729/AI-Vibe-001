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
    'You are generating a single photorealistic cinematic RPG quest scene (NOT an illustration).',
    'The result should feel like a screenshot from a modern RPG game, but still look like a real camera photo.',
    '',
    'Use the provided reference photos as the exact identities of the people in the final image:',
    '- The FIRST image is the HERO.',
    '- The remaining images are COMPANIONS.',
    '- Keep facial identity consistent with the reference photos.',
    '- Everyone must appear together in the same frame.',
    '- Do NOT add extra people.',
    '- Natural proportions, realistic skin tones, realistic lighting and shadows.',
    '',
    'RPG theme requirements:',
    '- The party are adventurers on a quest in a real-world location.',
    '- Add subtle RPG vibes via outfits, props, and posture (e.g., travel satchel, map, small charm, utility belt).',
    '- Keep it tasteful and believable for the location (no exaggerated fantasy armor unless it still matches the scene).',
    '- No UI overlay, no subtitles, no text, no logos, no watermarks in the image.',
    '',
    'Party interaction (make it more affectionate and intimate, but still wholesome):',
    '- The party should look close and friendly: small group huddle, arms around shoulders, holding hands, a warm hug, leaning in for a selfie-like moment.',
    '- Smiling, relaxed eye contact between them, genuine camaraderie.',
    '- Keep it non-explicit and non-sexual; no nudity or suggestive poses.',
    '',
    `QuestTitle: ${mission.title}`,
    `Party: ${partyLine}`,
    '',
    'Scene:',
    mission.scenePrompt,
    mission.vibePrompt,
    'Make the environment more RPG-game-like while keeping the real location recognizable:',
    '- Add subtle magical ambience: faint glow runes, soft particle sparks, gentle aura light, quest lantern glow.',
    '- Include quest-like props that fit the location: map, small pouch, potion-like bottle, enchanted compass, parchment note.',
    '- Keep it cinematic and believable; avoid cartoon look.',
    '',
    'Wardrobe & styling:',
    mission.wardrobePrompt,
    'Ensure the whole party looks coherent together and matches the scene weather/time.',
    'Give each person a distinct but compatible RPG archetype vibe (e.g., leader/scout/mage) expressed through subtle styling.',
    '',
    'Composition:',
    '- Group photo: medium shot (waist-up) or full-body, everyone visible and in focus.',
    '- Background recognizable but not distracting.',
    '- High detail, high resolution, realistic camera look (35mm / full-frame).',
    '- Cinematic depth of field, natural motion, authentic candid moment.',
  ].join('\n')
}


