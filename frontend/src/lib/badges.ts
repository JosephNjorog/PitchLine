export interface BadgeStats {
  followedCount: number
  predictionCount: number
  sponsorshipCount: number
}

export interface BadgeDefinition {
  id: string
  icon: string
  title: string
  description: string
  isEarned: (stats: BadgeStats) => boolean
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-follow',
    icon: '⭐',
    title: 'First Follow',
    description: 'Follow your first team',
    isEarned: (s) => s.followedCount >= 1,
  },
  {
    id: 'team-collector',
    icon: '🗺️',
    title: 'Team Collector',
    description: 'Follow 3 or more teams',
    isEarned: (s) => s.followedCount >= 3,
  },
  {
    id: 'first-prediction',
    icon: '🎯',
    title: 'First Prediction',
    description: 'Submit your first score prediction',
    isEarned: (s) => s.predictionCount >= 1,
  },
  {
    id: 'prediction-regular',
    icon: '🔮',
    title: 'Prediction Regular',
    description: 'Submit 3 or more predictions',
    isEarned: (s) => s.predictionCount >= 3,
  },
  {
    id: 'first-sponsor',
    icon: '🤝',
    title: 'First Sponsor',
    description: 'Back a team or player',
    isEarned: (s) => s.sponsorshipCount >= 1,
  },
  {
    id: 'community-champion',
    icon: '🏆',
    title: 'Community Champion',
    description: 'Follow a team, predict a score, and back a player',
    isEarned: (s) => s.followedCount >= 1 && s.predictionCount >= 1 && s.sponsorshipCount >= 1,
  },
]
