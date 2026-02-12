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


## v19
- Enterprise SLA (Business hours + pause on pending + holidays)
- SLA badge on ticket list
- SLA KPIs on My Dashboard

> Note: install chart dependency if needed: npm i recharts


## v20
- Settings UI: Enterprise SLA policy editor + working calendar + holidays
- SettingsProvider supports slaPolicy/workCalendar updates


## v21
- Ticket Details: Enterprise SLA widget (countdown + progress)
- Timeline widget
- mockTickets now include messages + timestamps + priority


## v22
- Auto SLA monitoring (every 5s)
- Notifications (toast) for at-risk and breached
- Auto escalation on breach (priority bump + system message + audit log)


## v23
- Notification Center (bell + unread badge + dropdown)
- Notifications persisted in localStorage
- SLA monitor pushes notifications (at-risk & breached)
