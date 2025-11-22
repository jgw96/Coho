# Coho

**A modern, cross-platform Mastodon PWA built for performance and user experience.**

[![Status](https://img.shields.io/badge/Status-Public%20Alpha-orange)]()

Coho is a Progressive Web App (PWA) client for Mastodon. It emphasizes offline capabilities with a fast and simple user experience.

[**Get the App**](https://coho-mastodon.web.app)

<div>
  <img src="/public/assets/screenshots/desktop/cross-platform.png" alt="Desktop Screenshot" width="400px" />
  <img src="/public/assets/screenshots/mobile/fast-reliable.png" alt="Mobile Screenshot" width="400px" />
</div>

## Features

### Customizable & Modern
- **Material Design 3**: A fresh, modern look using the latest Material Design principles.
- **Theming**: Choose your primary color and switch between Dark and Light modes.
- **Responsive**: Fully responsive design that works great on mobile, tablet, and desktop.

### Cross-Platform, Fast & Offline
- **PWA**: Installable on all devices (iOS, Android, Windows, macOS, Linux).
- **Offline Support**: View cached content and interact with the app even without an internet connection.
- **Fast**: Built to be fast on any device, with any network connection.



# Technical

## 🛠️ Tech Stack

- **Frontend**: [Lit](https://lit.dev/) (Web Components), TypeScript
- **UI Components**: Custom MD3 components
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend**: Firebase Functions (TypeScript)

## 🚀 Getting Started

### Prerequisites
- Node.js (v22 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jgw96/Otter.git
   cd Otter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

### Building for Production

To create a production build with optimized assets:

```bash
npm run build
```

This command includes our custom image optimization script which significantly reduces bundle size.

## Project Structure

- `src/components/`: Reusable Lit web components (MD3 & others).
- `src/pages/`: Top-level application pages.
- `src/services/`: API interaction, state logic, and data management.
- `src/styles/`: Global styles and design tokens.
- `functions/`: Firebase Cloud Functions for backend logic.
- `public/`: Static assets, service worker, and manifest.

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MPL License.
