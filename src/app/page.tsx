'use client';

import React, { useState, useEffect } from 'react';
import { availableComponents, generateDataFromPrompt } from '@/utils/aiDataGenerator';
import useVisualizationStore from '@/store/visualizationStore';
import BarChartComponent from '@/components/BarChartComponent';
import LineChartComponent from '@/components/LineChartComponent';
import PieChartComponent from '@/components/PieChartComponent';
import TableComponent from '@/components/TableComponent';
import CardComponent from '@/components/CardComponent';
import AreaChartComponent from '@/components/AreaChartComponent';
import { ComponentData } from '@/types/componentData';

// Predefined insights and suggestions
const insights = [
  "📈 Your dashboard shows 23% growth in user engagement this month",
  "🎯 Sales performance has improved by 15% compared to last quarter", 
  "⚡ System performance metrics are optimal across all regions",
  "👥 User acquisition rate has increased by 8% in the past week"
];

const quickSuggestions = [
  { text: "Show user analytics for last 30 days", icon: "👥" },
  { text: "Display revenue trends this quarter", icon: "💰" },
  { text: "Create performance metrics dashboard", icon: "📊" },
  { text: "Show top performing products", icon: "🏆" },
  { text: "Display customer satisfaction scores", icon: "😊" },
  { text: "Show website traffic analytics", icon: "🌐" }
];

const DashboardPage = () => {
  const { visualizations, addVisualization, removeVisualization } = useVisualizationStore();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [chatMessages, setChatMessages] = useState<Array<{type: 'user' | 'ai', content: string, timestamp: Date}>>([]);
  const [typedWelcome, setTypedWelcome] = useState('');
  const [typedInsight, setTypedInsight] = useState('');
  const [isTypingWelcome, setIsTypingWelcome] = useState(true);
  const [isTypingInsight, setIsTypingInsight] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [completedInsights, setCompletedInsights] = useState<string[]>([]);
  const [activeVisualizationId, setActiveVisualizationId] = useState<string | null>(null);

  // Typing effect for welcome message with styled parts
  useEffect(() => {
    const welcomeText = "👋 Hi Mr. Affan Habib, welcome back!";
    let index = 0;
    setTypedWelcome('');
    
    const typingInterval = setInterval(() => {
      if (index < welcomeText.length) {
        setTypedWelcome(welcomeText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setIsTypingWelcome(false);
        // Show insights after welcome message is typed
        setTimeout(() => {
          setShowInsights(true);
          setIsTypingInsight(true);
        }, 800);
      }
    }, 80); // Adjust typing speed here

    return () => clearInterval(typingInterval);
  }, []);

  // Function to render styled welcome text
  const renderStyledWelcome = (text: string) => {
    if (!text) return null;
    
    // Split the text to style different parts
    const parts = [
      { text: "👋 Hi ", style: "text-gray-600" },
      { text: "Mr. Affan Habib", style: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold" },
      { text: ", welcome back!", style: "text-gray-600" }
    ];
    
    let currentIndex = 0;
    return parts.map((part, partIndex) => {
      const partEnd = currentIndex + part.text.length;
      const visibleText = text.slice(currentIndex, Math.min(partEnd, text.length));
      currentIndex = partEnd;
      
      if (visibleText) {
        return (
          <span key={partIndex} className={part.style}>
            {visibleText}
          </span>
        );
      }
      return null;
    });
  };

  // Typing effect for insights - show all one by one
  useEffect(() => {
    if (!showInsights || !isTypingInsight) return;
    if (currentInsightIndex >= insights.length) return; // Stop when all insights are shown

    const currentInsightText = insights[currentInsightIndex];
    let index = 0;
    setTypedInsight('');
    
    const insightTypingInterval = setInterval(() => {
      if (index < currentInsightText.length) {
        setTypedInsight(currentInsightText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(insightTypingInterval);
        setIsTypingInsight(false);
        
        // Add completed insight to the list
        setCompletedInsights(prev => [...prev, currentInsightText]);
        
        // Show badges after first insight is completed
        if (currentInsightIndex === 0) {
          setTimeout(() => setShowBadges(true), 1500);
        }
        
        // Move to next insight after 2 seconds if there are more insights
        setTimeout(() => {
          if (currentInsightIndex < insights.length - 1) {
            setCurrentInsightIndex(prev => prev + 1);
            setIsTypingInsight(true);
          }
        }, 2000);
      }
    }, 50);

    return () => clearInterval(insightTypingInterval);
  }, [showInsights, isTypingInsight, currentInsightIndex]);

  // Keep welcome message always visible - removed auto-hide timer

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatInput.trim()) return;
    
    // Add user message to chat
    const userMessage = { type: 'user' as const, content: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    
    try {
      // Generate data based on user input and selected component
      const prompt = selectedComponent 
        ? `${chatInput} - Use ${selectedComponent} component`
        : chatInput;
        
      const data = await generateDataFromPrompt(prompt);
      addVisualization(data);
      
      // Set the new visualization as active
      setActiveVisualizationId(data.id);
      
      // Scroll to the new visualization after a short delay
      setTimeout(() => {
        const element = document.getElementById(`viz-${data.id}`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            inline: 'center',
            block: 'nearest'
          });
        }
      }, 100);
      
      // Add AI response to chat
      const aiMessage = { 
        type: 'ai' as const, 
        content: `Created ${data.type} visualization: "${data.title}"`, 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error generating data:', error);
      const errorMessage = { 
        type: 'ai' as const, 
        content: 'Sorry, I encountered an error generating that visualization. Please try again.', 
        timestamp: new Date() 
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setChatInput('');
      setSelectedComponent('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion);
    setIsChatOpen(true);
  };

  const renderVisualization = (viz: ComponentData & { id: string }) => {
    switch (viz.type) {
      case 'BarChart':
        return (
          <BarChartComponent
            data={viz.data}
            dataKey={viz.dataKey || 'value'}
            title={viz.title}
          />
        );
      case 'LineChart':
        return (
          <LineChartComponent
            data={viz.data}
            dataKey={viz.dataKey || 'value'}
            title={viz.title}
          />
        );
      case 'AreaChart':
        return (
          <AreaChartComponent
            data={viz.data}
            dataKey={viz.dataKey || 'value'}
            title={viz.title}
          />
        );
      case 'PieChart':
        return (
          <PieChartComponent
            data={viz.data}
            dataKey={viz.dataKey || 'value'}
            title={viz.title}
          />
        );
      case 'Table':
        return (
          <TableComponent
            data={viz.data}
            columns={viz.columns || []}
            title={viz.title}
          />
        );
      case 'Card':
        return (
          <CardComponent
            title={viz.title}
            value={viz.data[0]?.value || 'N/A'}
          />
        );
      default:
        return (
          <BarChartComponent
            data={viz.data}
            dataKey={viz.dataKey || 'value'}
            title={viz.title}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-12 pb-32">
        {/* Centered Welcome Section */}
        {visualizations.length === 0 && (
          <div className="min-h-screen flex flex-col items-center justify-center -mt-12">
            {/* Welcome Message */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-6 min-h-[3rem]">
                {renderStyledWelcome(typedWelcome)}
                {isTypingWelcome && <span className="cursor-blink text-blue-600 ml-1">|</span>}
              </h1>
              
              {showInsights && (
                <div className="animate-fade-in">
                  <p className="text-xl text-gray-600 mb-8">Here are your latest insights:</p>
                  
                  {/* Two Column Insights with Center Divider */}
                  <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                      {/* Center Divider */}
                      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent transform -translate-x-1/2"></div>
                      
                      {/* Left Column */}
                      <div className="space-y-4">
                        {completedInsights.filter((_, index) => index % 2 === 0).map((insight, index) => (
                          <div key={index * 2} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                            <p className="text-gray-700 font-medium text-sm">
                              {insight}
                            </p>
                          </div>
                        ))}
                        
                        {/* Currently typing insight - left side */}
                        {isTypingInsight && completedInsights.length % 2 === 0 && (
                          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm min-h-[3rem] flex items-center">
                            <p className="text-gray-700 font-medium text-sm">
                              {typedInsight}
                              <span className="cursor-blink text-blue-600 ml-1">|</span>
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Right Column */}
                      <div className="space-y-4">
                        {completedInsights.filter((_, index) => index % 2 === 1).map((insight, index) => (
                          <div key={index * 2 + 1} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                            <p className="text-gray-700 font-medium text-sm">
                              {insight}
                            </p>
                          </div>
                        ))}
                        
                        {/* Currently typing insight - right side */}
                        {isTypingInsight && completedInsights.length % 2 === 1 && (
                          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm min-h-[3rem] flex items-center">
                            <p className="text-gray-700 font-medium text-sm">
                              {typedInsight}
                              <span className="cursor-blink text-blue-600 ml-1">|</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Centered Quick Actions */}
            {showBadges && (
              <div className="text-center animate-fade-in">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">✨ Quick Actions</h3>
                <div className="flex flex-wrap justify-center gap-2 max-w-3xl">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm hover:from-white/90 hover:to-white/80 rounded-full px-3 py-2 border border-white/50 shadow-sm hover:shadow-md transition-all duration-300 group animate-slide-up text-sm"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="text-base group-hover:scale-110 transition-transform duration-300">
                          {suggestion.icon}
                        </span>
                        <span className="font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent group-hover:from-gray-900 group-hover:to-black">
                          {suggestion.text}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


        {/* Horizontal Scrollable Dashboard - when visualizations exist */}
        {visualizations.length > 0 && (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">📊 Your AI Dashboard</h2>
              <p className="text-gray-600">Scroll horizontally to explore your visualizations</p>
            </div>
            
            {/* Horizontal Scroll Container */}
            <div className="relative">
              <div className="flex gap-8 overflow-x-auto pb-6 px-4 scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {visualizations.map((viz, index) => (
                  <div 
                    key={viz.id}
                    id={`viz-${viz.id}`}
                    className={`relative overflow-hidden group flex-shrink-0 transition-all duration-500 ${
                      activeVisualizationId === viz.id 
                        ? 'scale-105 ring-4 ring-blue-500/30' 
                        : 'scale-100'
                    }`}
                    style={{ width: '500px', minWidth: '500px' }}
                    onMouseEnter={() => setHoveredId(viz.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setActiveVisualizationId(viz.id)}
                  >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 rounded-3xl"></div>
                    
                    {/* Active indicator */}
                    {activeVisualizationId === viz.id && (
                      <div className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl animate-pulse"></div>
                    )}
                    
                    {/* Chart container */}
                    <div className={`relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 h-full cursor-pointer ${
                      activeVisualizationId === viz.id 
                        ? 'border-blue-300/60 bg-white/90' 
                        : 'group-hover:scale-[1.01]'
                    }`}>
                      {/* Chart number indicator */}
                      <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>
                      
                      {hoveredId === viz.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeVisualization(viz.id);
                          }}
                          className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl p-2.5 shadow-lg hover:shadow-xl transition-all duration-300 z-10 opacity-90 hover:opacity-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                      
                      {renderVisualization(viz)}
                      
                      {/* Subtle decoration */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/5 to-purple-200/5 rounded-full blur-3xl -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-700"></div>
                    </div>
                  </div>
                ))}
                
                {/* Add new chart placeholder */}
                <div className="flex-shrink-0 w-80 h-96 border-2 border-dashed border-gray-300 rounded-3xl flex items-center justify-center bg-white/50 backdrop-blur-sm group hover:border-blue-400 transition-colors duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-gray-500 font-medium mb-2">Create New Chart</p>
                    <p className="text-sm text-gray-400">Use the chat below</p>
                  </div>
                </div>
              </div>
              
              {/* Custom scrollbar */}
              <style jsx>{`
                .flex::-webkit-scrollbar {
                  height: 8px;
                }
                .flex::-webkit-scrollbar-track {
                  background: #f1f5f9;
                  border-radius: 4px;
                }
                .flex::-webkit-scrollbar-thumb {
                  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
                  border-radius: 4px;
                }
                .flex::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(90deg, #2563eb, #7c3aed);
                }
              `}</style>
            </div>
          </div>
        )}

      </div>

      {/* Persistent Bottom Chat Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {/* Component Selection */}
            <div className="mb-3">
              <div className="flex flex-wrap gap-2 justify-center">
                {availableComponents.map((component) => (
                  <button
                    key={component}
                    onClick={() => setSelectedComponent(component === selectedComponent ? '' : component)}
                    className={`px-3 py-1 text-xs rounded-full transition-all ${
                      selectedComponent === component
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {component}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="flex space-x-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask AI to create any visualization... e.g., 'Show sales trends for last quarter'"
                  className="w-full border border-gray-300 rounded-2xl px-6 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400 shadow-sm"
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium"
                disabled={isLoading || !chatInput.trim()}
              >
                {isLoading ? '⏳' : '✨ Generate'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;