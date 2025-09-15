'use client';

import React, { useState } from 'react';
import { availableComponents, generateDataFromPrompt } from '../../utils/aiDataGenerator';
import useVisualizationStore from '../../store/visualizationStore';
import BarChartComponent from '../../components/BarChartComponent';
import LineChartComponent from '../../components/LineChartComponent';
import PieChartComponent from '../../components/PieChartComponent';
import TableComponent from '../../components/TableComponent';
import CardComponent from '../../components/CardComponent';
import AreaChartComponent from '../../components/AreaChartComponent';
import { ComponentData } from '../../types/componentData';

const DashboardPage = () => {
  const { visualizations, addVisualization, removeVisualization } = useVisualizationStore();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedComponent, setSelectedComponent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
    } catch (error) {
      console.error('Error generating data:', error);
    } finally {
      setIsLoading(false);
      setChatInput('');
      setSelectedComponent('');
    }
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
    <div className="container mx-auto py-8 relative">
      <h1 className="text-3xl font-bold mb-8">AI Data Visualizations</h1>
      
      {/* Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {visualizations.map((viz) => (
          <div 
            key={viz.id}
            className="relative"
            onMouseEnter={() => setHoveredId(viz.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {hoveredId === viz.id && (
              <button
                onClick={() => removeVisualization(viz.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-all duration-300 z-10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {renderVisualization(viz)}
          </div>
        ))}
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 transition-all duration-300 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {/* Chat Input */}
      {isChatOpen && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="p-4">
            {/* Component Selection Badges */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Select a component type (optional):</p>
              <div className="flex flex-wrap gap-2">
                {availableComponents.map((component) => (
                  <button
                    key={component}
                    onClick={() => setSelectedComponent(component === selectedComponent ? '' : component)}
                    className={`px-3 py-1 text-sm rounded-full ${
                      selectedComponent === component
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {component}
                  </button>
                ))}
              </div>
            </div>
            
            <form onSubmit={handleChatSubmit} className="flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="e.g., users in latest 30 days..."
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                disabled={isLoading || !chatInput.trim()}
              >
                {isLoading ? 'Generating...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;