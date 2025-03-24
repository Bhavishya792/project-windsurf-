# 🌱 EcoRise - Empowering Environmental Action

<div align="center">
  <img src="assets/logo.png" alt="EcoRise Logo" width="150">
  <h3>Where small actions create big impact 🌎</h3>
</div>

EcoRise is a comprehensive web platform designed to inspire and empower individuals to take meaningful environmental action through education, community engagement, and practical tools for sustainable living.

## ✨ Features

### 🏠 Home Page
- **Interactive Environmental Tips** - Browse through a curated collection of actionable sustainability tips
- **Community Leaderboard** - Get inspired by top environmental contributors in your community
- **Image Recognition** - Analyze items for recyclability using our AI-powered camera feature

### 🤝 Volunteer Hub
- **Event Browser** - Discover environmental volunteer opportunities in your area
- **Interactive Map** - Find events near you with our location-based map
- **Event Creation** - Create and share your own environmental initiatives with a simple form
- **Participation Tracking** - Sign up for events and track your environmental impact

### 🔧 Fix It Yourself (FIY)
- **AI Repair Assistant** - Get personalized repair guidance for your items
- **Video Tutorials** - Learn repair skills through our curated collection of repair guides
- **Difficulty Classification** - Find projects matching your skill level (Easy, Medium, Hard)
- **Tools & Safety Information** - Get comprehensive guidance on required tools and safety precautions

### 📅 Calendar Integration
- **Event Scheduling** - Keep track of all environmental events in one place
- **Interactive Calendar** - Easily navigate between dates and months
- **Event Details** - View comprehensive information about each scheduled activity

### 👤 User Profiles
- **Environmental Impact Tracking** - Monitor your personal contribution to sustainability
- **Achievement Badges** - Earn recognition for your environmental actions
- **Profile Customization** - Personalize your EcoRise experience

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
     - Google Maps API key
     - Gemini AI API key for image analysis

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
├── js/
│   ├── calendar.js     # Calendar functionality
│   └── sidebar-injector.js  # Navigation component
├── css/
│   └── calendar.css    # Calendar styling
├── volunteer.css       # Volunteer page styling
├── fiy.css             # FIY page styling
├── gemini-service.js   # AI integration for image analysis
└── assets/             # Images and static resources
```

## 💡 How It Works

### Volunteer Event System
Users can browse existing environmental events or create their own using our streamlined event creation form. The system allows filtering by difficulty, location, and event type to help users find the perfect opportunity to make an impact.

### Fix It Yourself (FIY) Feature
Our AI-powered repair assistant provides personalized guidance for fixing items instead of replacing them. Users can describe their broken item, upload a photo, and receive step-by-step repair instructions, required tools, and safety precautions.

### Environmental Calendar
The interactive calendar helps users track upcoming environmental events and activities. Each day with events is clearly marked, making it easy to plan participation in community initiatives.

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

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Join the Green Revolution!

EcoRise is more than just a web application - it's a movement toward sustainable living and environmental consciousness. Every small action adds up to significant change when we work together!

---

<div align="center">
  <p>Made with 💚 for our planet</p>
</div>
