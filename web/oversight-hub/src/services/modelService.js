/**
 * Model Management Service
 *
 * Provides model availability, selection, and information to the UI
 */

class ModelService {
  constructor() {
    this.models = [];
    this.selectedModel = null;
    this.loadingModels = false;
  }

  /**
   * Get available models from the backend
   */
  async getAvailableModels() {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE_URL}/api/models`, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('Could not fetch available models, using defaults');
        return this.getDefaultModels();
      }

      const data = await response.json();
      this.models = data.models || this.getDefaultModels();
      return this.models;
    } catch (error) {
      console.warn('Error fetching models:', error);
      return this.getDefaultModels();
    }
  }

  /**
   * Get model details by name
   */
  getModel(modelName) {
    return this.models.find((m) => m.name === modelName);
  }

  /**
   * Get recommended models (sorted by preference)
   */
  getRecommendedModels() {
    // Sort by: local first, free, medium size
    return this.models.sort((a, b) => {
      // Local (Ollama) first
      const aLocal = a.provider === 'ollama' ? 0 : 1;
      const bLocal = b.provider === 'ollama' ? 0 : 1;
      if (aLocal !== bLocal) return aLocal - bLocal;

      // Free models first
      const aFree = a.isFree ? 0 : 1;
      const bFree = b.isFree ? 0 : 1;
      if (aFree !== bFree) return aFree - bFree;

      // Prefer medium models
      const sizeOrder = { small: 1, medium: 0, large: 2 };
      return (sizeOrder[a.size] || 2) - (sizeOrder[b.size] || 2);
    });
  }

  /**
   * Get models suitable for RTX 5070
   */
  getModelsForRTX5070() {
    return this.models.filter((m) => {
      // RTX 5070 has 12GB VRAM
      if (m.provider === 'ollama') {
        return m.estimatedVramGb <= 12;
      }
      return true; // Cloud models don't use local VRAM
    });
  }

  /**
   * Get provider status
   */
  async getProviderStatus() {
    try {
      const response = await fetch('http://localhost:8000/api/models/status', {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        return this.getDefaultStatus();
      }

      return await response.json();
    } catch (error) {
      console.warn('Error fetching provider status:', error);
      return this.getDefaultStatus();
    }
  }

  /**
   * Get cost estimate for a model
   */
  estimateCost(modelName, tokenCount = 1000000) {
    const model = this.getModel(modelName);
    if (!model) return 0;

    // Based on typical pricing
    const pricePerMillionTokens = {
      'gemini-2.5-flash': 0.05, // $0.05 per 1M input tokens
      ollama: 0, // Local, free
      huggingface: 0, // Free tier
    };

    const price = pricePerMillionTokens[model.provider] || 0;
    return (price * tokenCount) / 1000000;
  }

  /**
   * Get default models (client-side fallback)
   */
  getDefaultModels() {
    return [
      {
        name: 'neural-chat:13b',
        displayName: 'Neural Chat 13B (Local)',
        provider: 'ollama',
        isFree: true,
        size: 'large',
        estimatedVramGb: 12,
        description: 'Excellent for blog generation. Optimized for RTX 5070.',
        icon: '🖥️',
      },
      {
        name: 'mistral:13b',
        displayName: 'Mistral 13B (Local)',
        provider: 'ollama',
        isFree: true,
        size: 'large',
        estimatedVramGb: 12,
        description: 'High-quality model. Great for RTX 5070.',
        icon: '🖥️',
      },
      {
        name: 'neural-chat:7b',
        displayName: 'Neural Chat 7B (Local)',
        provider: 'ollama',
        isFree: true,
        size: 'medium',
        estimatedVramGb: 7,
        description: 'Fast and good quality. Works on smaller GPUs.',
        icon: '🖥️',
      },
      {
        name: 'mistralai/Mistral-7B-Instruct-v0.1',
        displayName: 'Mistral 7B (HuggingFace)',
        provider: 'huggingface',
        isFree: true,
        size: 'medium',
        estimatedVramGb: 0,
        description: 'Free tier available. Requires HF token.',
        icon: '🌐',
      },
      {
        name: 'gemini-2.5-flash',
        displayName: 'Gemini 2.5 Flash (Google)',
        provider: 'gemini',
        isFree: false,
        size: 'large',
        estimatedVramGb: 0,
        description: 'Reliable fallback. ~$0.05 per 1M tokens.',
        icon: '☁️',
      },
    ];
  }

  /**
   * Get default provider status
   */
  getDefaultStatus() {
    return {
      ollama: {
        available: false,
        url: 'http://localhost:11434',
        models: 0,
      },
      huggingface: {
        available: false,
        hasToken: false,
        models: 0,
      },
      gemini: {
        available: false,
        hasKey: false,
        models: 0,
      },
    };
  }
}

// Export as singleton
export const modelService = new ModelService();
