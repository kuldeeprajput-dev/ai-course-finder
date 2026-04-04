'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AISettings } from '@/types';
import { Key, Globe, Sparkles } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [formData, setFormData] = useState<AISettings>(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-brand-orange" />
            <h3 className="font-bold">AI Provider</h3>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, primaryProvider: 'gemini' })}
              className={`flex-1 brutal-border p-3 text-center font-bold transition-all ${
                formData.primaryProvider === 'gemini'
                  ? 'bg-brand-orange text-white shadow-none -translate-x-0.5 -translate-y-0.5'
                  : 'bg-white hover:bg-brand-paper'
              }`}
            >
              Gemini
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, primaryProvider: 'mistral' })}
              className={`flex-1 brutal-border p-3 text-center font-bold transition-all ${
                formData.primaryProvider === 'mistral'
                  ? 'bg-brand-orange text-white shadow-none -translate-x-0.5 -translate-y-0.5'
                  : 'bg-white hover:bg-brand-paper'
              }`}
            >
              Mistral
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-brand-orange" />
            <h3 className="font-bold">API Keys</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold mb-1">Gemini API Key</label>
              <Input
                type="password"
                value={formData.geminiApiKey || ''}
                onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                placeholder="Enter your Gemini API key"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Mistral API Key</label>
              <Input
                type="password"
                value={formData.mistralApiKey || ''}
                onChange={(e) => setFormData({ ...formData, mistralApiKey: e.target.value })}
                placeholder="Enter your Mistral API key"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-brand-orange" />
            <h3 className="font-bold">Search API Keys (Optional)</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold mb-1">Tavily API Key</label>
              <Input
                type="password"
                value={formData.tavilyApiKey || ''}
                onChange={(e) => setFormData({ ...formData, tavilyApiKey: e.target.value })}
                placeholder="Enter your Tavily API key"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Serper API Key</label>
              <Input
                type="password"
                value={formData.serperApiKey || ''}
                onChange={(e) => setFormData({ ...formData, serperApiKey: e.target.value })}
                placeholder="Enter your Serper API key"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            Save Settings
          </Button>
        </div>
      </form>
    </Modal>
  );
}
