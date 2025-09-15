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
  const [chatInput, setChatInput] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<string>('Auto');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [typedWelcome, setTypedWelcome] = useState('');
  const [typedInsight, setTypedInsight] = useState('');
  const [isTypingWelcome, setIsTypingWelcome] = useState(true);
  const [isTypingInsight, setIsTypingInsight] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [currentInsightIndex, setCurrentInsightIndex] = useState(0);
  const [completedInsights, setCompletedInsights] = useState<string[]>([]);
 const [activeVisualizationId, setActiveVisualizationId] = useState<string | null>(null);
 const [isComponentDropdownOpen, setIsComponentDropdownOpen] = useState(false);
 const [pinnedVisualizations, setPinnedVisualizations] = useState<Set<string>>(new Set());

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
    
    
    setIsLoading(true);
    
    try {
      // Generate data based on user input and selected component
      const prompt = selectedComponent
        ? `${chatInput} - Use ${selectedComponent} component`
        : chatInput;
        
      const data = await generateDataFromPrompt(prompt);
      addVisualization(data);
      
      // Set the new visualization as active
      if (data.id) {
        setActiveVisualizationId(data.id);
      }
      
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
      
    } catch (error) {
      console.error('Error generating data:', error);
    } finally {
      setIsLoading(false);
      setChatInput('');
      setSelectedComponent('Auto');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion);
  };
  
  const getComponentIcon = (component: string) => {
    switch (component) {
      case 'BarChart':
        return '📊';
      case 'LineChart':
        return '📈';
      case 'PieChart':
        return '🥧';
      case 'Table':
        return '📋';
      case 'Card':
        return '📊';
      case 'AreaChart':
        return '⛰️';
      case 'ScatterChart':
        return '📉';
      default:
        return '📊';
    }
  };
  
  const downloadVisualization = (viz: ComponentData & { id: string }) => {
    // Create a blob with the visualization data
    const dataStr = JSON.stringify(viz, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create a download link
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${viz.title || 'visualization'}-${viz.id}.json`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
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


        {/* Carousel-like Dashboard - when visualizations exist */}
        {visualizations.length > 0 && (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">📊 Your AI Dashboard</h2>
              <p className="text-gray-600">Click on any visualization to focus</p>
            </div>
            
            {/* Carousel Container */}
            <div className="relative overflow-hidden py-12">
              <div className="flex justify-center items-center relative" style={{ height: '500px' }}>
                {visualizations.map((viz, index) => {
                  // Calculate position relative to active visualization
                  const isActive = activeVisualizationId === viz.id;
                  const isActiveIndex = visualizations.findIndex(v => v.id === activeVisualizationId);
                  const currentIndex = index;
                  const position = currentIndex - (isActiveIndex === -1 ? 0 : isActiveIndex);
                  
                  // Determine styling based on position
                  let transformStyle = '';
                  let opacity = 1;
                  let blur = '';
                  let scale = 1;
                  let zIndex = 10;
                  
                  if (isActive) {
                    // Active visualization - centered
                    transformStyle = 'translateX(0)';
                    zIndex = 30;
                  } else if (position === -1) {
                    // Previous visualization - left with blur
                    transformStyle = 'translateX(-200px)';
                    opacity = 0.7;
                    blur = 'blur(2px)';
                    scale = 0.85;
                    zIndex = 20;
                  } else if (position === 1) {
                    // Next visualization - right with blur
                    transformStyle = 'translateX(200px)';
                    opacity = 0.7;
                    blur = 'blur(2px)';
                    scale = 0.85;
                    zIndex = 20;
                  } else {
                    // Other visualizations - hidden
                    transformStyle = position < 0 ? 'translateX(-400px)' : 'translateX(400px)';
                    opacity = 0;
                    zIndex = 5;
                  }
                  
                  return (
                    <div
                      key={viz.id}
                      id={`viz-${viz.id}`}
                      className={`absolute overflow-hidden transition-all duration-500 ease-in-out ${
                        isActive ? 'cursor-default' : 'cursor-pointer hover:scale-105'
                      }`}
                      style={{
                        width: '500px',
                        height: '400px',
                        transform: transformStyle,
                        opacity: opacity,
                        filter: blur,
                        transformOrigin: 'center',
                        zIndex: zIndex,
                        transition: 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)'
                      }}
                      onMouseEnter={() => setHoveredId(viz.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => setActiveVisualizationId(viz.id)}
                    >
                      {/* Background gradient */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 rounded-3xl"></div>
                      
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute -top-2 -left-2 -right-2 -bottom-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl animate-pulse"></div>
                      )}
                      
                      {/* Chart container */}
                      <div className={`relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 p-6 h-full ${
                        isActive
                          ? 'border-blue-300/60 bg-white/90'
                          : 'hover:scale-[1.01]'
                      }`} style={{ transform: `scale(${scale})` }}>
                        
                        {hoveredId === viz.id && isActive && (
                          <div className="absolute top-4 right-4 flex gap-2 z-10">
                            {/* Pin button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const newPinned = new Set(pinnedVisualizations);
                                if (pinnedVisualizations.has(viz.id)) {
                                  newPinned.delete(viz.id);
                                } else {
                                  newPinned.add(viz.id);
                                }
                                setPinnedVisualizations(newPinned);
                              }}
                              className={`${
                                pinnedVisualizations.has(viz.id)
                                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                  : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white'
                              } rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 opacity-90 hover:opacity-100`}
                              title={pinnedVisualizations.has(viz.id) ? "Unpin visualization" : "Pin visualization"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                              </svg>
                            </button>
                            
                            {/* Download button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                downloadVisualization(viz);
                              }}
                              className="bg-white/80 backdrop-blur-sm text-gray-700 rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 opacity-90 hover:opacity-100 hover:bg-white"
                              title="Download visualization"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                            
                            {/* Close button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeVisualization(viz.id);
                              }}
                              className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 opacity-90 hover:opacity-100"
                              title="Remove visualization"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                        
                        {renderVisualization(viz)}
                        
                        {/* Subtle decoration */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/5 to-purple-200/5 rounded-full blur-3xl -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-700"></div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Navigation arrows */}
                {visualizations.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-40"
                      onClick={() => {
                        const currentIndex = activeVisualizationId
                          ? visualizations.findIndex(v => v.id === activeVisualizationId)
                          : 0;
                        const prevIndex = (currentIndex - 1 + visualizations.length) % visualizations.length;
                        setActiveVisualizationId(visualizations[prevIndex].id);
                      }}
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-40"
                      onClick={() => {
                        const currentIndex = activeVisualizationId
                          ? visualizations.findIndex(v => v.id === activeVisualizationId)
                          : 0;
                        const nextIndex = (currentIndex + 1) % visualizations.length;
                        setActiveVisualizationId(visualizations[nextIndex].id);
                      }}
                    >
                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
              
              {/* Dots indicator */}
              {visualizations.length > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {visualizations.map((viz) => (
                    <button
                      key={viz.id}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeVisualizationId === viz.id
                          ? 'bg-blue-500 scale-125'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      onClick={() => setActiveVisualizationId(viz.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Persistent Bottom Chat Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="max-w-4xl mx-auto">
            {/* Chat Input with Component Selection */}
            <form onSubmit={handleChatSubmit} className="flex space-x-3 items-end">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsComponentDropdownOpen(!isComponentDropdownOpen)}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <span className="text-lg">
                        {selectedComponent === 'Auto' || !selectedComponent ? '🤖' : getComponentIcon(selectedComponent)}
                      </span>
                      {(selectedComponent && selectedComponent !== 'Auto') && <span className="text-gray-300 ml-1">/</span>}
                    </button>
                    
                    {isComponentDropdownOpen && (
                      <div className="absolute bottom-full left-0 mb-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedComponent('Auto');
                              setIsComponentDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <span>🤖</span>
                            <span>Auto</span>
                          </button>
                          {availableComponents.map((component) => (
                            <button
                              type="button"
                              key={component}
                              onClick={() => {
                                setSelectedComponent(component);
                                setIsComponentDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                            >
                              <span>{getComponentIcon(component)}</span>
                              <span>{component}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask AI to create any visualization... e.g., 'Show sales trends for last quarter'"
                  className="w-full border border-gray-300 rounded-3xl px-12 py-4 pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-40 shadow-sm"
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
                className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-8 py-4 rounded-3xl hover:from-green-600 hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-medium"
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