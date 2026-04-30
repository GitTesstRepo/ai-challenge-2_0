export type ActivityItem = {
  id: string
  title: string
  category: string
  date: string
  points: number
  metricType: 'sessions' | 'learning'
}

export type LeaderUser = {
  id: string
  firstName: string
  lastName: string
  position: string
  departmentCode: string
  avatarUrl: string
  activities: ActivityItem[]
}

const CATEGORIES = [
  'Education',
  'Public Speaking',
  'University Partnership',
]

const POSITIONS = [
  'Position I',
  'Position II',
  'Position III',
  'Position IV',
  'Position V',
]

const FIRST_NAMES = [
  'Aiden',
  'Amelia',
  'Aria',
  'Avery',
  'Benjamin',
  'Charlotte',
  'Chloe',
  'Daniel',
  'Eleanor',
  'Elijah',
  'Ella',
  'Emma',
  'Ethan',
  'Grace',
  'Harper',
  'Henry',
  'Isla',
  'Jack',
  'Jacob',
  'James',
  'Leo',
  'Liam',
  'Lily',
  'Lucas',
  'Mason',
  'Mia',
  'Noah',
  'Nora',
  'Olivia',
  'Owen',
  'Scarlett',
  'Sofia',
  'Sophia',
  'Theodore',
  'William',
]

const LAST_NAMES = [
  'Adams',
  'Allen',
  'Baker',
  'Bennett',
  'Brooks',
  'Campbell',
  'Carter',
  'Clark',
  'Collins',
  'Cook',
  'Davis',
  'Edwards',
  'Evans',
  'Fisher',
  'Flores',
  'Garcia',
  'Gonzalez',
  'Gray',
  'Green',
  'Hall',
  'Harris',
  'Hughes',
  'Jackson',
  'Johnson',
  'Kelly',
  'King',
  'Lee',
  'Lewis',
  'Lopez',
  'Martinez',
  'Miller',
  'Moore',
  'Nelson',
  'Parker',
  'Perez',
  'Price',
  'Reed',
  'Rivera',
  'Roberts',
  'Robinson',
  'Rodriguez',
  'Scott',
  'Simmons',
  'Stewart',
  'Taylor',
  'Thomas',
  'Turner',
  'Walker',
  'White',
  'Williams',
  'Wilson',
  'Wright',
]

const DEPARTMENTS = [
  'DPT-A1',
  'DPT-B2',
  'DPT-C3',
  'DPT-D4',
  'DPT-E5',
  'DPT-F6',
  'DPT-G7',
]

const CATEGORY_TITLE_PATTERNS: Record<string, string[]> = {
  Education: ['[LAB] Lecture', '[LAB] Workshop', '[LAB] Knowledge Session'],
  'Public Speaking': ['[REG] Offline Meetup', '[REG] Roundtable', '[EDU] Public Forum'],
  'University Partnership': [
    '[UNI] Partnership Session',
    '[UNI] Campus Meetup',
    '[UNI] Collaboration Roundtable',
  ],
}

const GENERATED_AVATAR_COUNT = 250

function mulberry32(seed: number): () => number {
  return function seeded() {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(list: T[], random: () => number): T {
  return list[Math.floor(random() * list.length)]
}

function intBetween(min: number, max: number, random: () => number): number {
  return Math.floor(random() * (max - min + 1)) + min
}

function shuffled<T>(list: T[], random: () => number): T[] {
  const cloned = [...list]
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[cloned[i], cloned[j]] = [cloned[j], cloned[i]]
  }
  return cloned
}

function userCategorySubset(random: () => number): string[] {
  const roll = random()
  const categoryCount = roll < 0.3 ? 1 : roll < 0.75 ? 2 : 3
  return shuffled(CATEGORIES, random).slice(0, categoryCount)
}

function pad2(value: number): string {
  return String(value).padStart(2, '0')
}

function randomDate(random: () => number): string {
  const year = 2025
  const month = intBetween(1, 12, random)
  const day = intBetween(1, 28, random)
  return `${year}-${pad2(month)}-${pad2(day)}`
}

function avatarPathForUserIndex(userIndex: number): string {
  const fileIndex = ((userIndex - 1) % GENERATED_AVATAR_COUNT) + 1
  return `/avatars/avatar-${String(fileIndex).padStart(3, '0')}.png`
}

function activityTitle(category: string, random: () => number): string {
  const patterns = CATEGORY_TITLE_PATTERNS[category] ?? ['[REG] Session']
  return `${pick(patterns, random)} ${String.fromCharCode(65 + intBetween(0, 25, random))}`
}

function quarterFromDate(isoDate: string): string {
  const month = Number(isoDate.slice(5, 7))
  if (month <= 3) return 'Q1'
  if (month <= 6) return 'Q2'
  if (month <= 9) return 'Q3'
  return 'Q4'
}

export function extractYear(dateIso: string): string {
  return dateIso.slice(0, 4)
}

export function extractQuarter(dateIso: string): string {
  return quarterFromDate(dateIso)
}

export function createLeaderboardData(count = 250): LeaderUser[] {
  const random = mulberry32(24042026)
  const usedNames = new Set<string>()

  const users: LeaderUser[] = []

  for (let i = 1; i <= count; i += 1) {
    let firstName = pick(FIRST_NAMES, random)
    let lastName = pick(LAST_NAMES, random)
    let fullName = `${firstName} ${lastName}`

    while (usedNames.has(fullName)) {
      firstName = pick(FIRST_NAMES, random)
      lastName = pick(LAST_NAMES, random)
      fullName = `${firstName} ${lastName}`
    }

    usedNames.add(fullName)
    const position = pick(POSITIONS, random)
    const departmentCode = pick(DEPARTMENTS, random)
    const activityCount = intBetween(8, 18, random)
    const userCategories = userCategorySubset(random)

    const activities: ActivityItem[] = []

    // Seed one activity per user category so each chosen icon type is visible.
    for (let j = 0; j < userCategories.length; j += 1) {
      const date = randomDate(random)
      const category = userCategories[j]
      const points = intBetween(8, 64, random)
      const metricType = random() > 0.68 ? 'learning' : 'sessions'
      const title = activityTitle(category, random)

      activities.push({
        id: `u${i}-a${j + 1}`,
        title,
        category,
        date,
        points,
        metricType,
      })
    }

    for (let j = userCategories.length; j < activityCount; j += 1) {
      const date = randomDate(random)
      const category = pick(userCategories, random)
      const points = intBetween(8, 64, random)
      const metricType = random() > 0.68 ? 'learning' : 'sessions'
      const title = activityTitle(category, random)

      activities.push({
        id: `u${i}-a${j + 1}`,
        title,
        category,
        date,
        points,
        metricType,
      })
    }

    users.push({
      id: `user-${i}`,
      firstName,
      lastName,
      position,
      departmentCode,
      avatarUrl: avatarPathForUserIndex(i),
      activities,
    })
  }

  return users
}

export const categoryOptions = ['All Categories', ...CATEGORIES]
export const quarterOptions = ['All Quarters', 'Q1', 'Q2', 'Q3', 'Q4']
export const yearOptions = ['All Years', '2025']
