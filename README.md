# 🤖 AI Analytics Dashboard

A modern, interactive AI-powered dashboard that generates beautiful data visualizations from natural language prompts. Built with Next.js, TypeScript, and Google's Generative AI.

![AI Dashboard](https://img.shields.io/badge/AI-Powered-blue) ![Next.js](https://img.shields.io/badge/Next.js-15.5.3-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## ✨ Features

- 🎯 **Natural Language Processing**: Create visualizations using simple text prompts
- 📊 **Multiple Chart Types**: Bar charts, line charts, pie charts, area charts, tables, and cards
- 💬 **Chat Interface**: Intuitive chat-like interface for interacting with AI
- 🎨 **Modern UI**: Beautiful glassmorphism design with smooth animations
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- ⚡ **Real-time Insights**: Dynamic insights that rotate every few seconds
- 🚀 **Quick Actions**: Pre-built suggestion buttons for common visualizations
- 🎭 **Interactive Elements**: Hover effects, smooth transitions, and micro-interactions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Generative AI API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-analytics-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your Google AI API key:
   ```env
   NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see your AI dashboard!

## 🎮 How to Use

### Welcome Experience
- When you first land on the dashboard, you'll see a personalized greeting: "Hi Mr. Affan Habib, welcome back!"
- Dynamic insights will rotate every 4 seconds, showing you the latest updates
- The welcome message auto-hides after 10 seconds

### Quick Actions
Use the suggested prompts to quickly generate visualizations:
- 👥 "Show user analytics for last 30 days"
- 💰 "Display revenue trends this quarter"
- 📊 "Create performance metrics dashboard"
- 🏆 "Show top performing products"
- 😊 "Display customer satisfaction scores"
- 🌐 "Show website traffic analytics"

### Chat Interface
1. Click the floating chat button (bottom right)
2. Type any visualization request in natural language
3. Optionally select a specific chart type
4. Watch as AI creates your visualization instantly!

### Example Prompts
- "Show sales data for the last quarter"
- "Create a pie chart of user demographics"
- "Display monthly revenue trends"
- "Show top 5 products by performance"
- "Create a table of customer feedback scores"

## 🛠️ Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 with custom glassmorphism effects
- **AI**: Google Generative AI (Gemini)
- **Charts**: Recharts & Chart.js
- **State Management**: Zustand
- **Tables**: Tanstack React Table
- **Fonts**: Geist Sans & Geist Mono

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with custom effects
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main dashboard page
├── components/            # Reusable UI components
│   ├── AreaChartComponent.tsx
│   ├── BarChartComponent.tsx
│   ├── CardComponent.tsx
│   ├── LineChartComponent.tsx
│   ├── PieChartComponent.tsx
│   └── TableComponent.tsx
├── store/                 # State management
│   └── visualizationStore.ts
├── types/                 # TypeScript type definitions
│   ├── chart.ts
│   └── componentData.ts
└── utils/                 # Utility functions
    └── aiDataGenerator.ts
```

## 🎨 Design Features

### Glassmorphism UI
- Semi-transparent backgrounds with backdrop blur
- Subtle borders and shadows
- Smooth gradients and animations

### Interactive Elements
- Hover effects on all interactive components
- Smooth transitions and micro-animations
- Gradient text effects and buttons

### Modern Typography
- Geist font family for clean, modern text
- Gradient text effects for headings
- Proper text hierarchy and spacing

## 🔧 Customization

### Adding New Chart Types
1. Create a new component in `src/components/`
2. Add the chart type to `availableComponents` in `aiDataGenerator.ts`
3. Update the `renderVisualization` function in `page.tsx`

### Customizing Insights
Edit the `insights` array in `src/app/page.tsx` to show your own custom insights.

### Modifying Quick Suggestions
Update the `quickSuggestions` array in `src/app/page.tsx` with your preferred prompts.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
The app can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Digital Ocean App Platform

## 🛣️ Roadmap

- [ ] **Database Integration**: Connect to real-time data sources
- [ ] **User Authentication**: Multi-user support with personalized dashboards
- [ ] **Dashboard Templates**: Pre-built dashboard templates for different industries
- [ ] **Export Features**: Export visualizations as images or PDF reports
- [ ] **Advanced Analytics**: ML-powered insights and predictions
- [ ] **Team Collaboration**: Share dashboards and collaborate on insights
- [ ] **Custom Themes**: Multiple color themes and customization options
- [ ] **API Integration**: Connect to popular data sources (Google Analytics, Salesforce, etc.)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Affan Habib** - AI Dashboard Developer

---

⭐ **Star this repository if you found it helpful!**
