export function getNonEmptyStringData(formData) {
  const data = {}

  for (const [key, value] of Object.entries(formData)) {
    if (value.length > 0) data[key] = value
  }

  return data
}
