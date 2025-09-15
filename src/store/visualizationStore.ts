import { create } from 'zustand';
import { ComponentData } from '../types/componentData';

interface VisualizationState {
  visualizations: (ComponentData & { id: string })[];
  addVisualization: (visualization: ComponentData) => void;
  removeVisualization: (id: string) => void;
  clearVisualizations: () => void;
}

const useVisualizationStore = create<VisualizationState>((set) => ({
  visualizations: [],
  addVisualization: (visualization) =>
    set((state) => ({
      visualizations: [...state.visualizations, { ...visualization, id: Date.now().toString() }],
    })),
  removeVisualization: (id) =>
    set((state) => ({
      visualizations: state.visualizations.filter((viz) => viz.id !== id),
    })),
  clearVisualizations: () => set({ visualizations: [] }),
}));

export default useVisualizationStore;