type ClassValue = string | undefined | null | false | ClassValue[]

export function cn(...inputs: ClassValue[]): string {
  return inputs
    .flat(Infinity)
    .filter(Boolean)
    .join(' ')
}
