# EcoRise - Sustainable Living Platform

A web application for promoting sustainable living, recycling awareness, and community engagement in environmental initiatives.

## Features

- Product Recyclability Analysis using AI
- Interactive Event Calendar
- Community Activities and Badges
- User Profiles and Progress Tracking
- Recycling Tips and Education

## Setup Instructions

1. **Install Node.js**
   - Download and install Node.js LTS version from [nodejs.org](https://nodejs.org/)
   - Restart your computer after installation

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Add your API keys:
     - Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
     - Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

3. **Install Dependencies**
   ```bash
   # Install global dependencies
   npm install -g http-server

   # Install project dependencies
   npm install
   ```

4. **Start the Application**
   ```bash
   npm start
   ```
   The application will be available at http://localhost:8000

## Project Structure

- `index.html` - Main application page
- `script.js` - Core JavaScript functionality
- `styles.css` - Application styling
- `gemini-service.js` - AI image analysis service
- `volunteer.html/js/css` - Volunteer section
- `fiy.html/js/css` - Find It Yourself section

## Security Notes

- Never commit your actual API keys to version control
- Keep your `.env` file secure and local
- Use environment variables for all sensitive data

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
