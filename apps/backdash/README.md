# BackDash

![BackDash Logo](https://img.shields.io/badge/BackDash-Microservices%20Dashboard-3178C6?style=for-the-badge&logo=vue.js&logoColor=white)

BackDash is a powerful front-end only dashboard for visualizing and monitoring microservices. It provides a realistic simulation of a backend monitoring system **without requiring any actual backend infrastructure**. All data is randomly generated on the client side, giving you a fully interactive dashboard experience that refreshes with new data each time.

## 🌟 Features

- **100% Front-End**: No server or API calls required - everything runs in the browser
- **Random Data Generation**: New realistic metrics and logs are generated on each load
- **Interactive Dashboard**: Visualize service health, metrics, and performance
- **Dark Mode Support**: Switch between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices
- **Service Details**: Drill down into individual microservice metrics
- **Live Logs**: View simulated log entries with filtering capabilities
- **Service Comparisons**: Compare metrics across all microservices
- **Customizable Settings**: Configure refresh intervals, theme, and display preferences
- **Global Search**: Quickly find services, routes, and pages (Ctrl+K)

## 📊 Dashboard Visualizations

- **System Metrics**: CPU, Memory, Request Rate, Error Rate
- **Service Status**: Health indicators for all microservices
- **Performance Trends**: Time-series charts for key metrics
- **Route Analysis**: Performance data for individual API routes
- **Log Analysis**: Searchable and filterable logs
- **Insights**: Automatically generated observations and recommendations

## 🚀 Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

```bash
# Clone this repository
git clone https://github.com/yourusername/backdash.git

# Navigate to the project folder
cd backdash

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

### Build for Production

```bash
# Build the application for production
npm run build

# Preview the production build
npm run preview
```

## 🧩 Application Structure

```
/src
├── assets/           # CSS and static assets
├── components/       # Reusable Vue components
│   ├── charts/       # Chart components
│   └── ...
├── router/           # Vue Router configuration
├── store/            # Data store
├── utils/            # Utility functions
│   └── mockDataGenerator.js  # Data generation logic
├── views/            # Main page components
└── App.vue           # Root component
```

## 📱 Screen Tour

1. **Dashboard**: Main overview with system metrics and service status
2. **Service Details**: Detailed metrics and logs for individual services
3. **Logs View**: System-wide log viewer with filtering
4. **Comparison**: Compare metrics across all services
5. **Insights**: System-generated insights and recommendations

## 💡 Use Cases

- **Demonstrations**: Showcase a monitoring dashboard without a real backend
- **UI Development**: Design and test dashboard layouts with realistic data
- **Training**: Teach monitoring concepts without infrastructure setup
- **Prototyping**: Rapidly prototype dashboards with live-like data

## 🛠️ Technologies

- **Vue.js 3**: With Composition API
- **Vue Router**: For navigation and routing
- **Chart.js**: For data visualizations
- **CSS Utilities**: For styling and responsive design

## 🎨 Customization

BackDash provides several ways to customize your experience:

1. **Settings Panel**: Access via the gear icon in the top right
2. **Theme Toggle**: Switch between light and dark mode
3. **Auto-Refresh**: Configure automatic data refresh intervals
4. **Display Density**: Choose between standard and compact views

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

---

Built with ❤️ using Vue.js 3 and Chart.js
