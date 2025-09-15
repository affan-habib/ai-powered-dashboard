import { GoogleGenerativeAI } from '@google/generative-ai';
import { ComponentData } from '../types/componentData';

export type { ComponentData };

// Initialize the Gemini API client


const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || '');

// Define available components
export const availableComponents = [
  'BarChart',
  'LineChart',
  'PieChart',
  'Table',
  'Card',
  'AreaChart',
  'ScatterChart'
];

// Function to generate data based on user input
export async function generateDataFromPrompt(prompt: string): Promise<ComponentData> {
  try {
    // Get the Gemini model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Create the prompt for the AI
    const aiPrompt = `
      Based on the following user request: "${prompt}"
      
      Please provide:
      1. The most appropriate chart/table type from this list: ${availableComponents.join(', ')}
      2. A title for the visualization
      3. Appropriate fake data that matches the request
      4. Data keys needed for the component
      
      Format your response as a JSON object with this structure:
      {
        "type": "component_type",
        "title": "Visualization Title",
        "data": [
          {"name": "Item1", "value": 100},
          {"name": "Item2", "value": 200}
        ],
        "dataKey": "value"
      }
      
      For tables, include a "columns" array with column definitions like:
      "columns": [
        {
          "accessorKey": "name",
          "header": "Name"
        },
        {
          "accessorKey": "value",
          "header": "Value"
        }
      ]
      
      For cards, return a single data object with the value.
      
      Important rules:
      - Always include a "name" field in each data object for charts
      - For chart data, include at least 3-7 data points
      - For numeric values, use realistic numbers based on the context
      - Return ONLY the JSON object, no additional text or markdown formatting
      - If the user doesn't specify a component type, choose the most appropriate one
    `;
    
    // Generate content
    const result = await model.generateContent(aiPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean and parse the JSON response
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);
    
    return parsedData;
  } catch (error) {
    console.error('Error generating data:', error);
    
    // Return default data in case of error
    return {
      type: 'BarChart',
      title: 'Sample Data',
      data: [
        { name: 'Item A', value: 400 },
        { name: 'Item B', value: 300 },
        { name: 'Item C', value: 200 }
      ],
      dataKey: 'value'
    };
  }
}