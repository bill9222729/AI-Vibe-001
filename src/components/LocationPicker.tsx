import type { LocationId, LocationOption } from '../lib/locations'

export type LocationPickerProps = {
  locations: LocationOption[]
  value: LocationId
  onChange: (value: LocationId) => void
}

export function LocationPicker(props: LocationPickerProps) {
  const { locations, value, onChange } = props

  return (
    <div className="locationPicker">
      {locations.map((loc) => (
        <label key={loc.id} className="radioRow">
          <input
            type="radio"
            name="location"
            value={loc.id}
            checked={value === loc.id}
            onChange={() => onChange(loc.id)}
          />
          <span className="radioLabel">{loc.name}</span>
        </label>
      ))}
    </div>
  )
}


