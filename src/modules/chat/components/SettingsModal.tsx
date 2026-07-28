"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { AISettings } from "@/shared/types";
import { Key, Globe, Sparkles } from "lucide-react";

export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

/**
 * Settings Modal for configuring AI provider keys (Gemini, Mistral, Tavily, Serper).
 */
export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: SettingsModalProps) {
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
      <form onSubmit={handleSubmit} className="space-y-7">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-brand-orange" />
            <h3 className="font-semibold">AI provider</h3>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, primaryProvider: "gemini" })
              }
              className={`flex-1 rounded-xl border p-3 text-center text-sm font-semibold transition-all ${
                formData.primaryProvider === "gemini"
                  ? "border-brand-orange bg-[#fff2ee] text-brand-orange"
                  : "border-[#dfe4de] bg-white hover:bg-brand-paper"
              }`}
            >
              Gemini
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, primaryProvider: "mistral" })
              }
              className={`flex-1 rounded-xl border p-3 text-center text-sm font-semibold transition-all ${
                formData.primaryProvider === "mistral"
                  ? "border-brand-orange bg-[#fff2ee] text-brand-orange"
                  : "border-[#dfe4de] bg-white hover:bg-brand-paper"
              }`}
            >
              Mistral
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Key className="w-5 h-5 text-brand-orange" />
            <h3 className="font-semibold">AI access</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-gray">
                Gemini API key
              </label>
              <Input
                type="password"
                value={formData.geminiApiKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, geminiApiKey: e.target.value })
                }
                placeholder="Enter your Gemini API key"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-gray">
                Mistral API key
              </label>
              <Input
                type="password"
                value={formData.mistralApiKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, mistralApiKey: e.target.value })
                }
                placeholder="Enter your Mistral API key"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-brand-orange" />
            <h3 className="font-semibold">
              Search access{" "}
              <span className="font-normal text-brand-gray">(optional)</span>
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-gray">
                Tavily API key
              </label>
              <Input
                type="password"
                value={formData.tavilyApiKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tavilyApiKey: e.target.value })
                }
                placeholder="Enter your Tavily API key"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-brand-gray">
                Serper API key
              </label>
              <Input
                type="password"
                value={formData.serperApiKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, serperApiKey: e.target.value })
                }
                placeholder="Enter your Serper API key"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-[#e5e9e4] pt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
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
