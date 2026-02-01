import React, { useState } from "react";
import { Upload } from "lucide-react";
import { ImageUploader } from "../components/studio/ImageUploader";
import { Controls } from "../components/studio/Controls";
import { ResultView } from "../components/studio/ResultView";
import { Button } from "../components/ui/Button";
import { GenerationConfig, GeneratedImages } from "../types";
import {
  CreditService,
  GenerationHistoryService,
} from "../services/appStorage";
import {
  generateFrontView,
  generateRemainingViews,
} from "../../services/geminiService";

export const StudioPage: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [resultImages, setResultImages] = useState<GeneratedImages>({
    front: null,
    left: null,
    right: null,
    back: null,
  });
  const [unlockedAngles, setUnlockedAngles] = useState(false);
  const [history, setHistory] = useState<
    Array<{ config: GenerationConfig; result: GeneratedImages }>
  >([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleUnlockAngles = async () => {
    // Check credits
    const creditsNeeded = 2;
    if (!CreditService.useCredits(creditsNeeded)) {
      alert("Insufficient credits! Need 2 credits to unlock 360° view.");
      return;
    }

    setIsUnlocking(true);

    try {
      const additionalViews = await generateRemainingViews(
        originalImage,
        "Generate additional angles",
      );

      setResultImages((prev) => ({
        ...prev,
        ...additionalViews,
      }));
      setUnlockedAngles(true);
    } catch (error) {
      console.error("Failed to unlock angles:", error);
      alert("Failed to generate additional angles. Please try again.");
      // Refund credits on failure
      CreditService.addCredits(creditsNeeded);
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleBookNow = () => {
    // Navigate to appointments page or show booking modal
    alert("Booking feature coming soon!");
  };

  const handleGenerate = async (prompt: string, config: GenerationConfig) => {
    if (!originalImage) return;

    // Check credits
    const creditsNeeded = 1;
    if (!CreditService.useCredits(creditsNeeded)) {
      alert("Insufficient credits! Please top up.");
      return;
    }

    setIsLoading(true);

    try {
      const generatedResult = await generateFrontView(prompt, originalImage);

      setResultImages(generatedResult);

      // Save to history
      const newHistory = history.slice(0, currentIndex + 1);
      newHistory.push({ config, result: generatedResult });
      setHistory(newHistory);
      setCurrentIndex(newHistory.length - 1);

      // Save to localStorage
      GenerationHistoryService.add({
        originalImage,
        resultImages: generatedResult,
        config,
        prompt,
        unlockedAngles,
        creditsUsed: creditsNeeded,
      });
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setResultImages(history[currentIndex - 1].result);
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setResultImages(history[currentIndex + 1].result);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!originalImage ? (
          // Upload Interface - Centered
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="text-center mb-12">
              <p className="text-brand-600 text-lg font-medium mb-2 tracking-wide uppercase">
                AI Powered Styling
              </p>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-brand-900 mb-4 leading-tight">
                Discover Your
                <br />
                Perfect Look
              </h1>
              <p className="text-xl text-brand-600 max-w-2xl mx-auto leading-relaxed">
                The modern way to visualize your next hairstyle. Instant,
                photorealistic, and personalized.
              </p>
            </div>

            <div className="w-full max-w-3xl">
              <ImageUploader onImageSelect={setOriginalImage} />
            </div>
          </div>
        ) : (
          // Preview & Generation UI
          <>
            <div className="text-center mb-8">
              <h1 className="font-serif text-4xl font-bold text-brand-900 mb-2 leading-relaxed">
                Virtual Hair Studio
              </h1>
              <p className="text-brand-600 leading-relaxed">
                Customize your hairstyle with the controls below
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Image Preview */}
              <div className="bg-white rounded-2xl border-2 border-brand-200 p-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-brand-50">
                  <img
                    src={originalImage}
                    alt="Your photo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setOriginalImage("")}
                  >
                    <Upload className="w-4 h-4" />
                    Change Photo
                  </Button>
                </div>
              </div>

              {/* Results */}
              <ResultView
                originalImage={originalImage}
                resultImages={resultImages}
                isLoading={isLoading}
                isUnlocking={isUnlocking}
                unlockedAngles={unlockedAngles}
                onUnlock={handleUnlockAngles}
                onBookNow={handleBookNow}
              />
            </div>
          </>
        )}
      </div>

      {/* Controls pinned to bottom - only show when image is selected */}
      {originalImage && (
        <Controls
          onGenerate={handleGenerate}
          isLoading={isLoading}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={currentIndex > 0}
          canRedo={currentIndex < history.length - 1}
        />
      )}
    </div>
  );
};
