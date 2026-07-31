"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { AISettings } from "@/shared/types";
import { Key, Globe, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";

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
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-2.5 sm:space-y-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-orange sm:h-5 sm:w-5" />
            <h3 className="text-xs font-bold text-brand-black sm:text-sm">
              AI provider
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, primaryProvider: "gemini" })
              }
              className={cn(
                "flex-1 rounded-xl border py-2 text-center text-xs font-semibold transition-all sm:py-2.5 sm:text-sm cursor-pointer",
                formData.primaryProvider === "gemini"
                  ? "border-brand-orange bg-[#fff2ee] text-brand-orange"
                  : "border-[#dfe4de] bg-white text-brand-gray hover:bg-brand-paper",
              )}
            >
              Gemini
            </button>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, primaryProvider: "mistral" })
              }
              className={cn(
                "flex-1 rounded-xl border py-2 text-center text-xs font-semibold transition-all sm:py-2.5 sm:text-sm cursor-pointer",
                formData.primaryProvider === "mistral"
                  ? "border-brand-orange bg-[#fff2ee] text-brand-orange"
                  : "border-[#dfe4de] bg-white text-brand-gray hover:bg-brand-paper",
              )}
            >
              Mistral
            </button>
          </div>
        </div>

        <div className="space-y-2.5 sm:space-y-3.5">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-brand-orange sm:h-5 sm:w-5" />
            <h3 className="text-xs font-bold text-brand-black sm:text-sm">
              AI access
            </h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-brand-gray sm:text-xs">
                Gemini API key
              </label>
              <Input
                type="password"
                value={formData.geminiApiKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, geminiApiKey: e.target.value })
                }
                placeholder="Enter your Gemini API key"
                className="h-9 px-3 py-1.5 text-[11px] placeholder:text-[11px] sm:h-11 sm:px-4 sm:py-2.5 sm:text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-brand-gray sm:text-xs">
                Mistral API key
              </label>
              <Input
                type="password"
                value={formData.mistralApiKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, mistralApiKey: e.target.value })
                }
                placeholder="Enter your Mistral API key"
                className="h-9 px-3 py-1.5 text-[11px] placeholder:text-[11px] sm:h-11 sm:px-4 sm:py-2.5 sm:text-xs"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2.5 sm:space-y-3.5">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-brand-orange sm:h-5 sm:w-5" />
            <h3 className="text-xs font-bold text-brand-black sm:text-sm">
              Search access{" "}
              <span className="font-normal text-brand-gray">(optional)</span>
            </h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-brand-gray sm:text-xs">
                Tavily API key
              </label>
              <Input
                type="password"
                value={formData.tavilyApiKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, tavilyApiKey: e.target.value })
                }
                placeholder="Enter your Tavily API key"
                className="h-9 px-3 py-1.5 text-[11px] placeholder:text-[11px] sm:h-11 sm:px-4 sm:py-2.5 sm:text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-semibold text-brand-gray sm:text-xs">
                Serper API key
              </label>
              <Input
                type="password"
                value={formData.serperApiKey || ""}
                onChange={(e) =>
                  setFormData({ ...formData, serperApiKey: e.target.value })
                }
                placeholder="Enter your Serper API key"
                className="h-9 px-3 py-1.5 text-[11px] placeholder:text-[11px] sm:h-11 sm:px-4 sm:py-2.5 sm:text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 border-t border-[#e5e9e4] pt-3.5 sm:pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="h-9 flex-1 px-3 text-xs sm:h-11 sm:px-4 sm:text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-9 flex-1 px-3 text-xs sm:h-11 sm:px-4 sm:text-sm"
          >
            Save Settings
          </Button>
        </div>
      </form>
    </Modal>
  );
}
