import type { Companion } from './CompanionRoster'

export type PartyPickerProps = {
  companions: Companion[]
  selectedIds: string[]
  onChange: (ids: string[]) => void
  maxPartySize: number
}

export function PartyPicker(props: PartyPickerProps) {
  const { companions, selectedIds, onChange, maxPartySize } = props

  return (
    <div className="partyList">
      {companions.map((c) => {
        const checked = selectedIds.includes(c.id)
        const disabled = !checked && selectedIds.length >= maxPartySize
        return (
          <label key={c.id} className={disabled ? 'partyRow partyRowDisabled' : 'partyRow'}>
            <input
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={(e) => {
                const next = e.target.checked
                  ? [...selectedIds, c.id]
                  : selectedIds.filter((id) => id !== c.id)
                onChange(next)
              }}
            />
            <span className="partyName">{c.name || '未命名夥伴'}</span>
          </label>
        )
      })}
    </div>
  )
}


