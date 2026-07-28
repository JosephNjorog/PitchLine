# PitchLine

A cost-conscious, USSD-plus-PWA sports platform for grassroots participation, fan engagement, and monetization, built for the Africa's Talking Women in Tech Hackathon (Sports, Music and Entertainment theme).

## Table of contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Channel strategy](#channel-strategy)
- [Core data model](#core-data-model)
- [Registration and account creation flow](#registration-and-account-creation-flow)
- [Result submission and notification flow](#result-submission-and-notification-flow)
- [Feature scope](#feature-scope)
- [Tech stack](#tech-stack)
- [Africa's Talking API usage](#africas-talking-api-usage)
- [MVP build order](#mvp-build-order)
- [Monetization](#monetization)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Roadmap](#roadmap)

## Overview

PitchLine solves a data and visibility gap in African grassroots sport: county leagues, school competitions, amateur clubs, and adaptive/para-sports programs generate real activity with no digital footprint. Existing sports tech targets the already-digitized professional tier; PitchLine targets the layer underneath, using USSD only where a data connection can't be assumed, and a PWA for everything that benefits from a richer, free-to-run interface.

Full problem statement, solution narrative, feature list, and UI direction: see [`PITCHLINE_PRODUCT.md`](./PITCHLINE_PRODUCT.md).

## Architecture

```
                ┌─────────────────────────┐        ┌─────────────────────────┐
                │   Team rep / coach      │        │  Fan / sponsor / scout  │
                │  USSD or PWA register   │        │   PWA: browse, follow,  │
                │  + submit results       │        │   vote, pay             │
                └───────────┬─────────────┘        └────────────┬────────────┘
                            │                                    │
                            ▼                                    ▼
                    ┌───────────────────────────────────────────────────┐
                    │              Core API + database                  │
                    │   teams · fixtures · results · followers · votes  │
                    │   sponsorships · accounts                         │
                    └───────────────┬───────────────────┬───────────────┘
                                    │                   │
                                    ▼                   ▼
                        ┌───────────────────┐  ┌──────────────────────┐
                        │   SMS (minimal)    │  │   PWA (everything    │
                        │  result alert +    │  │   else)              │
                        │  account-created   │  │  stats, polls,       │
                        │  confirmation      │  │  sponsorship,        │
                        │  + PWA invite link │  │  admin dashboard     │
                        └───────────────────┘  └──────────────────────┘
```

Two entry points feed one core data layer. USSD and SMS are kept to the smallest possible footprint by design, since both are billed per session/message; the PWA carries the bulk of the product experience at effectively zero marginal cost per user.

## Channel strategy

A channel is used only if at least one of these is true:

1. It must reach someone with no smartphone or no data bundle.
2. It's a critical, time-sensitive push the user didn't ask to check for.
3. It's the entry point that gets someone into the system in the first place.

Everything else runs on the PWA.

| Channel | Used for | Not used for |
|---|---|---|
| USSD | Team/club registration, fixture/result submission, "find a club near me" lookup | Browsing, voting, payments, admin |
| SMS | Result alert to followers, account-creation confirmation, first-follow PWA invite link | Digests, trivia, MOTM voting, standings |
| PWA | Registration, browsing, following, live polls/voting, standings, sponsorship and prediction payments, admin/scout/sponsor dashboards, push notifications via service worker | — |

## Core data model

Conceptual entities (see `PITCHLINE_PRODUCT.md` for the product-level description):

- **Account** — a user, whether registered via USSD (phone-first) or PWA (may include email); always has a phone number for SMS confirmation
- **Team / club** — includes a `category` field distinguishing standard clubs from adaptive/para-sports clubs, and a `sport` and `county` for lookup
- **Fixture** — scheduled or completed match between two teams
- **Result** — score, scorer(s), cards, MOTM nominee, linked to a fixture
- **Follower** — link between an account and a team
- **Vote** — MOTM or poll response linked to an account and a fixture
- **Sponsorship** — a payment from an account to a team or player, with amount and platform fee recorded
- **Prediction entry** — an account's prediction for a fixture, with entry fee and outcome

## Registration and account creation flow

Registration is now supported on both channels, converging on the same account record:

1. **Via USSD:** a coach or fan dials the shortcode, enters name, phone number, and (for teams) county/sport/category through a short USSD menu.
2. **Via PWA:** a user fills a short web form (name, phone number, optional email, team/club details if registering a team).
3. On successful creation through either channel, the core API writes the account record and immediately triggers **one confirmation SMS**: "Your PitchLine account is set up. [PWA link]." This is the single unifying step — regardless of registration channel, the person ends up with the PWA link in hand.
4. If a team/club was registered, the confirmation also includes the team's unique follow code, so the rep can share it with their own fan base.

This keeps USSD as a valid, low-friction path for anyone without reliable data, while making the PWA the primary path for anyone who does have it, without fragmenting the account model between channels.

## Result submission and notification flow

1. Coach submits a result via USSD or the PWA.
2. Core API writes the result and looks up all followers of both teams.
3. Exactly one SMS is sent per follower: score, scorer, MOTM nominee if available.
4. If this is a follower's first-ever SMS from PitchLine, the message also includes the PWA install link.
5. All further engagement on that result (polls, voting, discussion, stats) happens inside the PWA, not over further SMS.

## Feature scope

See [`PITCHLINE_PRODUCT.md`](./PITCHLINE_PRODUCT.md#4-feature-set) for the full, categorized feature list (registration, fan engagement, monetization, institutional tools). This README focuses on the technical shape of delivering those features.

## Tech stack

- **Backend:** Node.js or Python service exposing a REST API for the USSD gateway, SMS webhook, and PWA frontend to consume
- **Database:** PostgreSQL (or equivalent relational store) for teams, fixtures, results, followers, votes, sponsorships, accounts
- **USSD/SMS:** Africa's Talking USSD and SMS APIs
- **PWA:** React or Vue frontend with a service worker for installability and push notifications
- **Payments:** M-Pesa STK push (or card checkout) for sponsorship and prediction entry fees, run through the PWA rather than airtime deduction
- **Optional:** Africa's Talking Insights API for phone-number validation/fraud checks at registration

## Africa's Talking API usage

| API | Where it's used |
|---|---|
| USSD | Registration, result submission, club lookup |
| SMS | Result push to followers, account-creation confirmation, first-follow PWA invite |
| Airtime/Payments | Stretch goal only — PWA-based M-Pesa checkout is the primary payment rail |
| Insights | Optional fraud/validity check on phone numbers at registration |

## MVP build order

1. Core API and database schema (accounts, teams, fixtures, results, followers, votes, sponsorships)
2. USSD flow: registration, result submission, club lookup
3. PWA: registration form, browse teams/fixtures/standings, follow a team
4. SMS: account-creation confirmation, result push with PWA link on first follow
5. PWA: live poll/MOTM voting for the demo match
6. Stretch: PWA sponsorship/prediction checkout via M-Pesa
7. Stretch: admin/scout dashboard with participation export

## Monetization

Three independent revenue rails, detailed in [`PITCHLINE_PRODUCT.md`](./PITCHLINE_PRODUCT.md):

1. **Fans** — micro-sponsorship cut, prediction league rake, premium tier subscription
2. **Institutions** — subscription for county sports associations and school federations to manage leagues and export participation reports
3. **Sponsors/scouts** — sponsored alerts and polls, subscription access to the participation database

## Getting started

```bash
# clone and install
git clone <repo-url>
cd pitchline
npm install        # or: pip install -r requirements.txt

# set environment variables (see below)
cp .env.example .env

# run the API
npm run dev

# run the PWA
cd pwa && npm install && npm run dev
```

## Environment variables

```
AT_API_KEY=
AT_USERNAME=
AT_USSD_SHORTCODE=
AT_SMS_SENDER_ID=
DATABASE_URL=
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_SHORTCODE=
JWT_SECRET=
```

## Roadmap

- [ ] Core API + schema
- [ ] USSD registration and result submission
- [ ] PWA registration with SMS confirmation
- [ ] Result push notifications
- [ ] PWA browse/follow/standings
- [ ] Live MOTM voting
- [ ] M-Pesa sponsorship and prediction checkout
- [ ] Admin/scout dashboard with export
- [ ] Para-sports club onboarding push
- [ ] County federation subscription tier
