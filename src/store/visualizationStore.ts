import { create } from 'zustand';
import { ComponentData } from '../types/componentData';

interface VisualizationState {
  visualizations: (ComponentData & { id: string })[];
  addVisualization: (visualization: ComponentData) => string;
  removeVisualization: (id: string) => void;
  clearVisualizations: () => void;
}

const useVisualizationStore = create<VisualizationState>((set, get) => ({
  visualizations: [],
  addVisualization: (visualization) => {
    const id = Date.now().toString();
    set((state) => ({
      visualizations: [...state.visualizations, { ...visualization, id }],
    }));
    return id;
  },
  removeVisualization: (id) =>
    set((state) => ({
      visualizations: state.visualizations.filter((viz) => viz.id !== id),
    })),
  clearVisualizations: () => set({ visualizations: [] }),
}));

export default useVisualizationStore;