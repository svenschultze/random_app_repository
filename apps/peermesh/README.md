# PeerMesh Chat

A serverless, decentralized chat application built with Vue.js and WebRTC. PeerMesh Chat enables direct, peer-to-peer communication without relying on centralized servers to store your conversations.

## Features

- **Fully Client-Side**: No servers storing your messages or personal data
- **Peer-to-Peer Communication**: Direct WebRTC connections between users
- **Manual Pairing**: Connect via QR codes or shareable tokens
- **Real-Time Messaging**: Instant messaging with status indicators
- **Local Storage**: All data stored locally on your device
- **Accessibility**: Fully accessible with screen reader support

## How It Works

PeerMesh Chat uses WebRTC for direct browser-to-browser communication. Since WebRTC normally requires a signaling server to establish the initial connection, PeerMesh replaces this with a manual process:

1. When a user wants to initiate a conversation, they generate a connection token
2. This token can be shared via QR code or copy/paste
3. The other user enters this token to establish a direct WebRTC connection
4. Once connected, messages flow directly between browsers without intermediaries

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/peermesh-chat.git

# Navigate to the project directory
cd peermesh-chat

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Usage

1. **Create a Profile**: When you first open the app, create your profile with a username and optional avatar
2. **Connect with Others**: Go to the Pairing screen and either:
   - Generate a token to share with someone, or
   - Enter a token shared with you
3. **Chat**: Once connected, you can send and receive messages in real-time
4. **Manage Connections**: Use the Settings screen to manage connections and your profile

## Technical Details

- **Frontend**: Vue.js 3 with Composition API
- **P2P Technology**: WebRTC with simple-peer library
- **State Management**: Custom state management with Zustand
- **Storage**: IndexedDB/LocalStorage for persistent data
- **Build Tool**: Vite for fast development and optimized production builds

## Privacy & Security

- All data stays on your device - no servers storing your conversations
- Connections are established directly between peers
- Messages are sent directly through encrypted WebRTC data channels
- Profile information is only shared with established connections

## Development

```bash
# Run development server with hot-reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT

## Acknowledgments

- [simple-peer](https://github.com/feross/simple-peer) - WebRTC simplified
- [qrcode.vue](https://github.com/scopewu/qrcode.vue) - QR code generation
- [nanoid](https://github.com/ai/nanoid) - Unique ID generation
- [zustand](https://github.com/pmndrs/zustand) - State management
