'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import BarChartComponent from '../../components/BarChartComponent';
import LineChartComponent from '../../components/LineChartComponent';
import PieChartComponent from '../../components/PieChartComponent';
import TableComponent from '../../components/TableComponent';
import CardComponent from '../../components/CardComponent';
import { salesData, userData, productData, tableData, cardData } from '../../data/mockData';

// Define table columns
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

const DashboardPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle chat submission logic here
    console.log('Chat message:', chatInput);
    setChatInput('');
  };

  return (
    <div className="container mx-auto py-8 relative">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <CardComponent
            key={index}
            title={card.title}
            value={card.value}
            description={card.description}
            trend={card.trend as 'up' | 'down' | undefined}
            trendValue={card.trendValue}
          />
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BarChartComponent 
          data={salesData} 
          dataKey="sales" 
          title="Sales Overview" 
        />
        <LineChartComponent 
          data={userData} 
          dataKey="users" 
          title="User Growth" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <PieChartComponent 
          data={productData} 
          dataKey="value" 
          title="Product Distribution" 
        />
        <TableComponent 
          data={tableData} 
          columns={columns} 
          title="User Management" 
        />
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
            <form onSubmit={handleChatSubmit} className="flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;