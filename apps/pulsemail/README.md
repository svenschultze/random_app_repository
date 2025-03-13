# PulseMail

A mobile-first email application that prioritizes intuitive touch interactions, minimalism, and speed on small screens. This demo app showcases a modern email interface with gesture controls and a responsive design.

## Features

- **Card-based Email Previews:** Emails appear as individual cards showing sender, subject, snippet, and timestamp.
- **Swipe Gestures:** Swipe left to delete, swipe right to toggle read/unread status.
- **Pull-to-Refresh:** Pull down to refresh your inbox.
- **Compose Interface:** Clean, distraction-free interface for composing emails.
- **Mobile-First Design:** Optimized for small screens with touch-friendly UI elements.
- **Accessibility Support:** Full keyboard navigation and screen reader support through vue-voix.
- **Randomly Generated Data:** Demo data is randomly generated on every load.

## Views

1. **Inbox/List View:** Main view displaying emails grouped by time (Today, Yesterday, Earlier).
2. **Email Detail View:** Displays a single email with action buttons for reply, forward, etc.
3. **Compose Email View:** Interface for creating new emails or replying to existing ones.
4. **Settings View:** Options for customizing the app's behavior and appearance.
email detail view 
## Project Setup

```sh
npm install
```

### Development Server

```sh
npm run dev
```

### Production Build

```sh
npm run build
```

### Preview Production Build

```sh
npm run preview
```

## Technologies Used

- Vue 3 with Composition API
- Vue Router for navigation
- CSS for styling (no external UI libraries)
- vue-voix for accessibility features

## Design Principles

- **Minimalism:** Focus on essential information and actions
- **Touch-Optimized:** Large touch targets and swipe gestures
- **Accessibility:** Built with accessibility in mind from the ground up
- **Performance:** Fast loading and interaction experience

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Future Enhancements

- Online/offline mode with local storage
- Rich text editing in compose view
- Real-time notifications
- Contact management
- Search with advanced filters
- Multiple account support
