# PitchLine — design brief (role-based PWA)

Use this as the prompt for Claude Design or as a feature brief for Figma. It covers authentication, the landing page, role-based onboarding, and how the different dashboards relate to each other.

---

## 1. Roles and how they're consolidated

PitchLine has six real-world user types, but they collapse into **four onboarding paths and three dashboard shells**, because several roles need the same structure with different data.

| Real-world role | Onboarding path | Dashboard shell |
|---|---|---|
| Team representative / coach | Team rep | Team management dashboard |
| Adaptive / para-sports club rep | Team rep (one extra field: sport + disability category) | Team management dashboard |
| Fan | Fan | Fan dashboard |
| Diaspora relative / individual micro-sponsor | Fan (sponsorship is a feature inside the fan experience, not a separate role) | Fan dashboard |
| Scout / academy | Institutional | Institutional dashboard |
| League admin (county/school federation) | Institutional | Institutional dashboard |

**Why this grouping:**
- A coach and an adaptive-club rep are doing the identical job (register a team, submit results); splitting them into two onboarding flows would just duplicate screens for a one-field difference.
- A relative backing a player and a general fan following a team are the same behavior at different intensity. Sponsorship should be a feature a fan discovers, not a role they declare upfront — nobody wants to onboard as "sponsor," they onboard as a fan who then chooses to back someone.
- A scout and a league admin both want the same thing structurally: filterable, exportable data tables. They differ in which filters and permissions apply (a scout searches athletes, an admin manages fixtures), but they should live in the same shell so you build one data-dense interface, not two.

## 2. Authentication

- **Primary:** Continue with Google (one tap, pulls name + email)
- **Secondary:** Phone number entry → OTP confirmation code sent via SMS → verified
- Either path ends at the same "who are you" role-selection step — auth method is independent of role
- No password field anywhere in v1
- After OTP or Google confirmation, if this is a first-time user, they enter onboarding; returning users go straight to their dashboard shell

## 3. Landing page (pre-auth)

Single scroll, mobile-first, built to make three things obvious in the first screen:

1. What PitchLine is — one line: grassroots sport, real teams, real fans, right on your phone
2. Live proof it's real — a short strip of 3–4 live/recent scores from real registered teams (or placeholder demo data), scrolling or static cards
3. One clear primary action: "Get started" → auth screen

Below the fold: three short sections, one per audience, each with a single supporting line and icon, not paragraphs:
- For fans — follow your team, never miss a result
- For coaches — register your team in minutes, from any phone
- For scouts and sponsors — discover talent, back a team, see the impact

No pricing table on the landing page. No login-wall before showing what the product does.

## 4. Onboarding: role selection and branching

Immediately after auth, one screen: **"What brings you to PitchLine?"** with four large tappable cards (not a dropdown):

- I coach or manage a team
- I'm a fan
- I'm a scout or from an academy
- I represent a league, school, or federation

Selecting a card determines everything that follows. Each path is short — no more than 3–4 screens before reaching the dashboard.

### Path A — Team rep / coach
1. Team name, sport, county
2. "Is this a standard club or an adaptive/para-sports club?" toggle → if adaptive, one additional field for disability category
3. Confirm phone number (pre-filled if OTP was used) — this is where the account-creation confirmation SMS is triggered
4. Land on team management dashboard, empty state prompting "add your first fixture"

### Path B — Fan
1. Pick your favorite teams — searchable list by county/sport, multi-select, minimum one required to continue (this is the moment that seeds their entire feed)
2. Optional: "Want result alerts by SMS too, or just in-app?" toggle, defaulting to in-app only, since SMS costs money and most fans with the PWA installed don't need both
3. Land on fan dashboard, home feed pre-populated with the teams just selected

### Path C — Scout / academy
1. Organization name, focus sport(s), region of interest
2. Confirm this triggers a subscription step (can be "start trial" for MVP/demo purposes)
3. Land on institutional dashboard, defaulted to athlete/team search view

### Path D — League admin
1. Organization name (county sports office, school federation name), region covered
2. Confirm which existing registered teams fall under their jurisdiction (searchable multi-select, optional to skip and add later)
3. Land on institutional dashboard, defaulted to fixtures/standings management view

## 5. Dashboard shells

Three shells total. Design them as genuinely distinct visual modes, not the same template with different data, since the mental task each user is doing is different.

### Shell 1 — Fan dashboard
**Feel:** feed-based, card-driven, scrollable, social
- Home: followed teams' latest results, upcoming fixtures, discovery row for new teams
- Match screen: live score, MOTM vote, prediction entry if a round is open
- Prediction rounds: entry screen (pick amount, confirm via mobile money), live leaderboard, past results
- Sponsorship: pick a team or player, pick an amount, confirm via mobile money, receipt showing platform fee split
- Profile: followed teams list, notification preferences, sponsorship/prediction history

### Shell 2 — Team management dashboard
**Feel:** form-and-list driven, functional, built for someone managing a real team on a phone between practices
- Home: this team's upcoming fixture, quick "submit result" action front and center
- Fixtures: create/edit fixture, submit result form (score, scorer, cards, MOTM nominee)
- Roster (optional v2): player list
- Followers: count and basic engagement stats, so a rep can see their team's traction (this is a light version of analytics, motivating them to keep submitting results)

### Shell 3 — Institutional dashboard (scout / academy / league admin)
**Feel:** data-dense, table-and-filter driven, desktop-first even though it must still work on mobile
- Search/filter view: teams and athletes by region, age group, sport, position (scout/academy default)
- Fixtures and standings management view: create fixtures on behalf of teams, view league tables, export (league admin default)
- Both default views live in the same shell with a toggle/tab between "Discover" (scout mode) and "Manage" (admin mode) — a league admin may occasionally want to scout, and an academy may eventually want to sponsor a league, so keeping both modes accessible in one shell avoids rebuilding the same tables twice
- Export/report action prominent throughout, since that's the core paid feature for this shell
- Subscription/billing status visible in a persistent but unobtrusive location (e.g. account menu), not on every screen

## 6. Cross-cutting features to weave in, not bolt on

- **Prediction rounds** appear inside the fan dashboard's match screen, not as a separate app section — they should feel like a natural extension of watching a result come in
- **Monetization touchpoints** (sponsorship, prediction entry, subscription upsell) should appear contextually at the moment of relevant engagement, not as a persistent "upgrade" banner
- **Notifications** are in-app/push by default post-onboarding; SMS is reserved for the result alert and account confirmation only, as already defined in the platform architecture

## 7. What to hand to Claude Design or Figma as the actual prompt

> Design a mobile-first PWA called PitchLine for grassroots African sports. Build: (1) a single-scroll landing page with a live-score proof strip and one clear CTA, (2) an auth screen with Google sign-in and phone/OTP as options, (3) a four-way role-selection onboarding screen (team rep, fan, scout/academy, league admin) branching into short 3–4 screen flows per role as described above, and (4) three distinct dashboard shells: a card/feed-based fan dashboard with home feed, match/prediction screens, and a sponsorship payment flow; a form/list-based team management dashboard centered on fixture and result submission; and a data-dense institutional dashboard for scouts and league admins with a toggle between a "Discover" search view and a "Manage" fixtures/standings view. Visual direction: clean, high-contrast, optimized for low-end Android and patchy connections, community-rooted rather than styled after a single professional league.
