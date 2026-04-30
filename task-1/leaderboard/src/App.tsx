import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import {
  categoryOptions,
  createLeaderboardData,
  extractQuarter,
  extractYear,
  quarterOptions,
  yearOptions,
  type ActivityItem,
} from './data'

type RankedUser = {
  id: string
  firstName: string
  lastName: string
  position: string
  departmentCode: string
  avatarUrl: string
  sessionCount: number
  learningCount: number
  partnershipCount: number
  totalPoints: number
  filteredActivities: ActivityItem[]
}

function pointsLabel(value: number): string {
  return value.toLocaleString('en-US')
}

function dateLabel(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  return `${String(day).padStart(2, '0')}-${monthNames[month - 1]}-${year}`
}

function App() {
  const [selectedYear, setSelectedYear] = useState('All Years')
  const [selectedQuarter, setSelectedQuarter] = useState('All Quarters')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [query, setQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const categoryRef = useRef<HTMLDivElement | null>(null)
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const users = useMemo(() => createLeaderboardData(250), [])

  const rankedUsers = useMemo<RankedUser[]>(() => {
    return users
      .map((user) => {
        const filteredActivities = user.activities.filter((activity) => {
          const matchesYear =
            selectedYear === 'All Years' || extractYear(activity.date) === selectedYear
          const matchesQuarter =
            selectedQuarter === 'All Quarters' ||
            extractQuarter(activity.date) === selectedQuarter
          const matchesCategory =
            selectedCategory === 'All Categories' ||
            activity.category === selectedCategory

          return matchesYear && matchesQuarter && matchesCategory
        })

        const totalPoints = filteredActivities.reduce((sum, item) => sum + item.points, 0)
        const learningCount = filteredActivities.filter(
          (item) => item.category === 'Education',
        ).length
        const sessionCount = filteredActivities.filter(
          (item) => item.category === 'Public Speaking',
        ).length
        const partnershipCount = filteredActivities.filter(
          (item) => item.category === 'University Partnership',
        ).length

        return {
          ...user,
          sessionCount,
          learningCount,
          partnershipCount,
          filteredActivities,
          totalPoints,
        }
      })
      .filter((user) => user.totalPoints > 0)
      .filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
        const haystack = `${fullName} ${user.position} ${user.departmentCode}`.toLowerCase()
        return haystack.includes(query.trim().toLowerCase())
      })
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints) return b.totalPoints - a.totalPoints
        if (b.sessionCount !== a.sessionCount) return b.sessionCount - a.sessionCount
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      })
  }, [users, selectedYear, selectedQuarter, selectedCategory, query])

  const podium = rankedUsers.slice(0, 3)
  const orderedPodium = [podium[1], podium[0], podium[2]].filter(Boolean) as RankedUser[]
  const hasResults = rankedUsers.length > 0

  const getRank = (userId: string) => rankedUsers.findIndex((u) => u.id === userId) + 1

  const onToggleExpand = (userId: string) => {
    setExpandedId((prev) => (prev === userId ? null : userId))
  }

  useEffect(() => {
    if (!isCategoryOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!categoryRef.current) return
      if (categoryRef.current.contains(event.target as Node)) return
      setIsCategoryOpen(false)
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCategoryOpen(false)
    }

    window.addEventListener('mousedown', onPointerDown)
    window.addEventListener('keydown', onEscape)

    return () => {
      window.removeEventListener('mousedown', onPointerDown)
      window.removeEventListener('keydown', onEscape)
    }
  }, [isCategoryOpen])

  return (
    <main className="page">
      <section className="leaderboard-wrap">
        <header className="page-heading">
          <h1>Company Leader Board 2025</h1>
        </header>

        <section className="main-panel">
        <header className="title-group">
          <h2>Leaderboard</h2>
          <p>Top performers based on contributions and activity</p>
        </header>

        <section className="toolbar" aria-label="Leaderboard filters">
          <label className="select-wrap">
            <select
              value={selectedYear}
              onChange={(event) => setSelectedYear(event.target.value)}
            >
              {yearOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="select-wrap">
            <select
              value={selectedQuarter}
              onChange={(event) => setSelectedQuarter(event.target.value)}
            >
              {quarterOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div className="custom-select" ref={categoryRef}>
            <button
              type="button"
              className="select-button"
              onClick={() => setIsCategoryOpen((value) => !value)}
              aria-expanded={isCategoryOpen}
              aria-controls="category-menu"
            >
              <span>{selectedCategory}</span>
              <span className="chev" aria-hidden="true">
                <ChevronDown />
              </span>
            </button>

            {isCategoryOpen ? (
              <ul id="category-menu" className="menu" role="listbox">
                {categoryOptions.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(option)
                        setIsCategoryOpen(false)
                      }}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <label className="search-wrap">
            <span className="search-icon" aria-hidden="true">
              <SearchIcon />
            </span>
            <input
              ref={searchInputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search employee..."
              type="text"
              aria-label="Search employee"
            />
            <button
              type="button"
              className={`search-clear ${query ? 'is-visible' : ''}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setQuery('')
                searchInputRef.current?.focus()
              }}
              aria-label="Clear search"
              tabIndex={query ? 0 : -1}
            >
              <ClearIcon />
            </button>
          </label>
        </section>

        {hasResults ? (
          <section className="podium" aria-label="Top performers podium">
          {orderedPodium.map((user) => {
            const rank = getRank(user.id)

            return (
              <article key={user.id} className={`podium-card rank-${rank}`}>
                <div className="avatar-wrap">
                  <img src={user.avatarUrl} alt="" />
                  <span className={`rank-badge rank-badge-${rank}`}>{rank}</span>
                </div>

                <h2>
                  {user.firstName} {user.lastName}
                </h2>
                <p>
                  {user.position} ({user.departmentCode})
                </p>

                <div className="points-pill">
                  <StarIcon />
                  <strong>{pointsLabel(user.totalPoints)}</strong>
                </div>

                <div className="podium-step" aria-hidden="true">
                  <span className="podium-step-number">{rank}</span>
                </div>
              </article>
            )
          })}
          </section>
        ) : (
          <section className="empty-state" aria-live="polite">
            <InfoIcon />
            <p>No activities found matching the current filters.</p>
          </section>
        )}

        <section className="rows" aria-label="Leaderboard list">
          {rankedUsers.map((user, index) => {
            const rank = index + 1
            const isExpanded = expandedId === user.id

            return (
              <article key={user.id} className={`row-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="row-main">
                  <div className="left">
                    <div className="rank-cell">{rank}</div>
                    <img className="row-avatar" src={user.avatarUrl} alt="" />
                    <div className="identity">
                      <h3>
                        {user.firstName} {user.lastName}
                      </h3>
                      <p>
                        {user.position} ({user.departmentCode})
                      </p>
                    </div>
                  </div>

                  <div className="right">
                    <div className="metrics">
                      {user.learningCount > 0 ? (
                        <div
                          className="metric-item"
                          title="Education"
                          aria-label="Education"
                        >
                          <CapIcon />
                          <span>{user.learningCount}</span>
                        </div>
                      ) : null}

                      {user.sessionCount > 0 ? (
                        <div
                          className="metric-item"
                          title="Public Speaking"
                          aria-label="Public Speaking"
                        >
                          <ScreenIcon />
                          <span>{user.sessionCount}</span>
                        </div>
                      ) : null}

                      {user.partnershipCount > 0 ? (
                        <div
                          className="metric-item"
                          title="University Partnership"
                          aria-label="University Partnership"
                        >
                          <SmileIcon />
                          <span>{user.partnershipCount}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="total">
                      <small>TOTAL</small>
                      <strong>
                        <StarIcon />
                        {pointsLabel(user.totalPoints)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="expand-btn"
                      onClick={() => onToggleExpand(user.id)}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? 'Collapse row details' : 'Expand row details'}
                    >
                      {isExpanded ? <ChevronUp wide /> : <ChevronDown wide />}
                    </button>
                  </div>
                </div>

                {isExpanded ? (
                  <div className="row-details">
                    <h4>RECENT ACTIVITY</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>ACTIVITY</th>
                          <th>CATEGORY</th>
                          <th>DATE</th>
                          <th>POINTS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.filteredActivities
                          .slice()
                          .sort((a, b) => b.date.localeCompare(a.date))
                          .map((activity) => (
                            <tr key={activity.id}>
                              <td>{activity.title}</td>
                              <td>
                                <span className="category-pill">{activity.category}</span>
                              </td>
                              <td>{dateLabel(activity.date)}</td>
                              <td className="points-cell">+{activity.points}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </article>
            )
          })}
        </section>
        </section>
      </section>
    </main>
  )
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7 17 17M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 10v6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="7.4" r="1" fill="currentColor" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m16.65 16.65 4.35 4.35" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.2 14.7 8l6.3.9-4.6 4.5 1.1 6.3L12 16.7 6.5 19.7l1.1-6.3L3 8.9 9.3 8 12 2.2Z"
        fill="currentColor"
      />
    </svg>
  )
}

function ScreenIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect
        x="4.5"
        y="4.5"
        width="15"
        height="10"
        rx="1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M7.5 8.8h9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 14.5V18.5M9.5 18.5h5M8 20h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CapIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2 9.5 12 4l10 5.5L12 15 2 9.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M6 12.5v3.6c0 1.2 2.7 2.4 6 2.4s6-1.2 6-2.4v-3.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

function SmileIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
      <path d="M8 14c.8 1.3 2.2 2 4 2s3.2-.7 4-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDown({ wide = false }: { wide?: boolean }) {
  const strokeWidth = 2
  const path = 'm6 9 6 6 6-6'
  const style = wide
    ? ({ transform: 'scaleX(1.5)', transformOrigin: 'center' } as const)
    : undefined

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={style}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  )
}

function ChevronUp({ wide = false }: { wide?: boolean }) {
  const strokeWidth = 2
  const path = 'm6 15 6-6 6 6'
  const style = wide
    ? ({ transform: 'scaleX(1.5)', transformOrigin: 'center' } as const)
    : undefined

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" style={style}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth={strokeWidth} />
    </svg>
  )
}

export default App
