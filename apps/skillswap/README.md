# SkillSwap - Exchange Skills, Grow Together

SkillSwap is a web platform that connects people who want to learn with those who want to teach. Trade your expertise for knowledge you desire — no money involved. This peer-to-peer skill exchange platform helps users find matches based on complementary skills, schedule sessions, communicate, and grow together.

![SkillSwap Platform](https://placehold.co/600x400?text=SkillSwap+Platform)

## Features

- **User Authentication**: Register, login, and profile management
- **Skill Matching**: Advanced algorithm to match users with complementary skills
- **Personalized Dashboard**: Quick access to matches, sessions, and messages
- **Interactive Matching**: Find and filter potential skill exchange partners
- **Messaging System**: Direct communication with matches
- **Session Scheduling**: Schedule and manage skill exchange sessions
- **Video Chat Integration**: Conduct online learning sessions
- **Review System**: Provide and receive feedback after sessions

## Technologies Used

- **Frontend**: Vue 3 (Composition API)
- **Styling**: CSS with custom variables and responsive design
- **Routing**: Vue Router with route meta information
- **State Management**: Vue's Composition API with localStorage for persistence
- **UI/UX**: Modern, clean interface with accessibility features
- **Icons and Images**: Custom icons and responsive layout

## Project Structure

- `/public` - Static assets
- `/src` - Application source
  - `/assets` - Styles, images, etc.
  - `/components` - Reusable Vue components
  - `/views` - Page components for router
  - `/router` - Vue Router configuration
  - `App.vue` - Main application component
  - `main.js` - Application entry point

## Getting Started

### Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn

### Installation

1. Clone the repository
```sh
git clone https://github.com/yourusername/skillswap.git
cd skillswap
```

2. Install dependencies
```sh
npm install
```

3. Start development server
```sh
npm run dev
```

4. For production build
```sh
npm run build
```

## Implemented Views

1. **Landing/Home Page** - Introduction and call-to-action
2. **Registration** - Create account with email/password
3. **Onboarding** - Multi-step wizard (Profile, Skills, Preferences)
4. **Dashboard** - Central hub with overview of activity
5. **Matches** - Find and filter potential skill exchange partners
6. **Profile** - View and edit user profile

## Accessibility

SkillSwap is built with accessibility in mind:
- Semantic HTML elements
- ARIA attributes via `v-voix` directive
- Clear navigation structure
- Responsive design for all device sizes
- Keyboard navigation support

## Future Enhancements

- Real-time messaging with WebSockets
- Integration with external calendars
- Community forums for group learning
- Achievement badges and gamification elements
- Mobile app versions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from modern educational platforms
- Vue.js community for excellent documentation
- All contributors and testers