import { toSentenceCase } from "./toSentenceCase"

export function toWordCase(string) {
  return string
    .split(" ")
    .map((word) => toSentenceCase(word))
    .join(" ")
}
