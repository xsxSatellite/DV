export function toSentenceCase(sentence) {
  const firstCharacter = sentence.slice(0, 1).toUpperCase()
  const restCharacter = sentence.slice(1)

  return firstCharacter.concat(restCharacter)
}
