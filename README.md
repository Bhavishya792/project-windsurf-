# 🌱 EcoRise - Empowering Environmental Action

<div align="center">
  <img src="assets/logo.png" alt="EcoRise Logo" width="150">
  <h3>Where small actions create big impact 🌎</h3>
  <p><strong>Live Site:</strong> <a href="https://ecorise.netlify.app" target="_blank">ecorise.netlify.app</a></p>
</div>

EcoRise is a comprehensive web platform designed to inspire and empower individuals to take meaningful environmental action through education, community engagement, and practical tools for sustainable living.

## ✨ Features

### 🏠 Home Page
- **Interactive Scrolling Cards** - Browse through a rich collection of actionable sustainability tips that can be easily implemented in daily life
- **Google Maps Integration** - Find local recycling and composting centers with an interactive map that detects your location
- **Community Leaderboard** - Get inspired by top environmental contributors in your community and their impact metrics
- **Floating Camera Button** - Analyze any item's recyclability instantly by taking a photo with our AI-powered camera feature
- **Search Radius Control** - Adjust the search radius to find recycling and composting centers at your preferred distance

### 🤝 Volunteer Hub
- **Event Browser** - Discover environmental volunteer opportunities with rich details and visual presentation
- **One-Click Event Creation** - Create and share your own environmental initiatives with our streamlined event creation form
- **Interactive Map** - Find events near you with our location-based map visualization
- **Filtering System** - Filter events by category, difficulty, type, and commitment level
- **Participation Tracking** - Sign up for events with just one click and track your environmental impact
- **Availability Information** - See remaining spots for limited capacity events

### 🔧 Fix It Yourself (FIY)
- **AI-Powered Repair Assistant** - Get personalized repair guidance generated dynamically by Gemini AI based on your specific item
- **Photo Analysis** - Upload photos of broken items for more accurate repair recommendations
- **Curated Video Tutorials** - Learn repair skills through our collection of categorized repair guides from trusted sources
- **Difficulty Classification** - Find projects matching your skill level with our Easy, Medium, and Hard classification system
- **Tools & Safety Information** - Receive comprehensive guidance on required tools, step-by-step instructions, and safety precautions
- **Cost Savings Estimates** - See estimated cost savings from repairing vs. replacing items

### 📚 Interactive Guide
- **Dynamic Content** - Unlike static recycling wikis, our guide features interactive elements that make learning engaging
- **Visual Instructions** - Step-by-step visual guides make recycling procedures easy to understand
- **Material-Specific Information** - Detailed recycling instructions categorized by material types
- **Local Regulations** - Information adapted to common recycling regulations and best practices
- **Interactive Elements** - Engaging components that make learning about sustainability enjoyable

### 📅 Calendar Integration
- **Event Scheduling** - Keep track of all environmental events in one place with our interactive calendar
- **Month Navigation** - Easily navigate between dates and months to plan your environmental activities
- **Event Details** - View comprehensive information about each scheduled activity directly from the calendar
- **Calendar Modal** - Access your environmental schedule from anywhere in the application via the navigation bar

### 👤 User Profiles & Gamification
- **Achievement Badges** - Earn recognition badges for environmental activities completed on the platform
- **Progress Tracking** - Monitor your personal contribution to sustainability with detailed statistics
- **Activity History** - View a timeline of all your environmental actions and contributions
- **Social Sharing** - Share your achievements on social media to inspire others
- **Points System** - Accumulate points for each environmental action to climb the community leaderboard
- **Custom Settings** - Personalize your EcoRise experience with profile customization options

### 🧭 Navigation & Accessibility
- **Responsive Navigation Bar** - Access all features from any page with our intuitive navigation system
- **Calendar Quick Access** - Open the calendar modal from anywhere using the calendar icon in the navbar
- **Profile Button** - Quick access to your profile, achievements, and settings
- **Notification System** - Stay updated about environmental events and activities
- **Mobile Responsiveness** - Enjoy the full EcoRise experience on any device

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS version)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ecorise.git
   cd ecorise
   ```

2. **Configure Environment**
   - Create a `.env` file from the template
   ```bash
   cp .env.example .env
   ```
   - Add your API keys:
     - Google Maps API key for location services
     - Gemini AI API key for image analysis and repair guides

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start the Application**
   ```bash
   npm start
   ```
   The application will be available at http://localhost:8000

## 🔧 Project Structure

```
ecorise/
├── index.html          # Main landing page
├── volunteer.html      # Volunteer opportunities page
├── fiy.html            # Fix It Yourself repair guides
├── guide.html          # Environmental guidance
├── styles.css          # Global styling
├── script.js           # Main JavaScript file
├── volunteer.js        # Volunteer page functionality
├── fiy.js              # FIY page functionality
├── guide.js            # Guide page functionality
├── server.js           # Backend server for API handling
├── js/
│   ├── calendar.js           # Calendar functionality
│   ├── sidebar-injector.js   # Navigation component
│   ├── product-analysis.js   # Product analysis functionality
│   └── repair-guide-service.js # Repair guidance service
├── css/
│   ├── calendar.css    # Calendar styling
│   └── modals.css      # Modal styling
├── volunteer.css       # Volunteer page styling
├── fiy.css             # FIY page styling
├── guide.css           # Guide page styling
├── gemini-service.js   # AI integration for image analysis
├── sidebar-nav.html    # Navigation sidebar template
├── sidebar-injector.js # Sidebar injection logic
├── config.js           # Configuration settings
└── assets/             # Images and static resources
```

## 💡 How It Works

### Home Page & Product Analysis
The home page features a collection of scrolling cards with actionable sustainability tips. Users can find local recycling and composting centers through Google Maps integration that detects their location and allows radius adjustment. The floating camera button enables users to analyze any item's recyclability by taking a photo, with AI-powered recognition providing detailed recycling or disposal instructions.

### Fix It Yourself (FIY) System
Our AI-powered repair assistant leverages Gemini AI to provide personalized guidance for fixing items instead of replacing them. Users can describe their broken item, upload a photo, and receive dynamically generated step-by-step repair instructions, required tools, safety precautions, and estimated cost savings. The system also offers video recommendations for visual learning.

### Volunteer Event System
Users can browse existing environmental events or create their own with just a few clicks using our streamlined event creation form. The system allows filtering by category, difficulty, location, and event type to help users find the perfect opportunity to make an impact. Each event includes detailed information such as location, date, time, and available spots.

### Interactive Guide
Unlike static recycling wikis, our guide page features dynamic and interactive elements that make recycling information easy to understand and engaging. The content is visually rich and designed to make sustainable living accessible to everyone.

### Gamification System
EcoRise implements a comprehensive gamification system where users earn badges and points for environmental activities. Whether participating in events, repairing items, or engaging with educational content, users build their profile with achievements that can be shared on social media, creating both intrinsic motivation and social incentives for sustainable actions.

## 👥 Contributing

We welcome contributions from the community! Here's how to get involved:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔒 Security

- Keep your API keys secure and never commit them to version control
- The application uses client-side handling of events and user data
- Follow best practices for web application security

## 🔗 Live Demo

Visit our live application:
- Production site: [ecorise.netlify.app](https://ecorise.netlify.app)
- Preview deployment: [67e342d640b3b6756d74ed35--ecorise.netlify.app](https://67e342d640b3b6756d74ed35--ecorise.netlify.app)

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Join the Green Revolution!

EcoRise is more than just a web application - it's a movement toward sustainable living and environmental consciousness. Every small action adds up to significant change when we work together!

---

<div align="center">
  <p>Made with 💚 for our planet</p>
</div>
