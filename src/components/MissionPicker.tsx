import type { Mission, MissionId } from '../lib/missions'

export type MissionPickerProps = {
  missions: Mission[]
  value: MissionId
  onChange: (value: MissionId) => void
}

export function MissionPicker(props: MissionPickerProps) {
  const { missions, value, onChange } = props

  return (
    <div className="missionGrid">
      {missions.map((m) => {
        const active = m.id === value
        return (
          <button
            key={m.id}
            type="button"
            className={active ? 'missionCard missionCardActive' : 'missionCard'}
            onClick={() => onChange(m.id)}
          >
            <div className="missionTitle">{m.title}</div>
            <div className="missionSubtitle">{m.subtitle}</div>
          </button>
        )
      })}
    </div>
  )
}


