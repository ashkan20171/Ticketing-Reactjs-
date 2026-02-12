# Ashkan Ticketing v15 (Enterprise UX)

## New
- Toast Queue (max 5, auto-dismiss)
- Confirm Dialog System (promise-based)
- Command Palette (Ctrl+K)
  - Navigate: tickets/dashboard/settings/users/logs
  - Toggle theme
  - Create new ticket
  - Logout with confirmation
- Confirm integrated into:
  - Clear logs
  - Toggle user active


## v16
- Added My Dashboard for all users (/my-dashboard) with charts and range filter.


## v16.1
- Fixed user view: My Dashboard link visible for non-admin
- Updated mock tickets to include user@example.com so list isn't empty


## v17
- Login page: sidebar/panel hidden
- Added Profile page (/profile) for all users (prefs + displayName)
- Quick Stats on Tickets page (toggle via Profile)
- UserPrefs persisted per-user in localStorage


## v17.3
- Login page: body grid collapses to single column (no empty sidebar space)
- Main area centers content only on /login
