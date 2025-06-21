"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useGlfx } from "@/lib/use-glfx";

// Simplified filter types
type FilterType =
  | "brightness"
  | "contrast"
  | "saturation"
  | "sepia"
  | "vignette"
  | "swirl"
  | "bulgePinch";

const filterConfigs = {
  brightness: {
    name: "Brightness",
    params: { amount: { min: -1, max: 1, default: 0, step: 0.01 } },
  },
  contrast: {
    name: "Contrast",
    params: { amount: { min: -1, max: 1, default: 0, step: 0.01 } },
  },
  saturation: {
    name: "Saturation",
    params: { amount: { min: -1, max: 1, default: 0, step: 0.01 } },
  },
  sepia: {
    name: "Sepia",
    params: { amount: { min: 0, max: 1, default: 0.5, step: 0.01 } },
  },
  vignette: {
    name: "Vignette",
    params: {
      size: { min: 0, max: 1, default: 0.5, step: 0.01 },
      amount: { min: 0, max: 1, default: 0.5, step: 0.01 },
    },
  },
  swirl: {
    name: "Swirl",
    params: {
      angle: { min: -25, max: 25, default: 3, step: 0.1 },
    },
  },
  bulgePinch: {
    name: "Bulge / Pinch",
    params: {
      strength: { min: -1, max: 1, default: 0.5, step: 0.01 },
    },
  },
};

export default function ImageEditor({ imageUrl }) {
  const [selectedFilter, setSelectedFilter] =
    useState<FilterType>("brightness");
  const [filterParams, setFilterParams] = useState<any>({});
  const [texture, setTexture] = useState<any>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(
    null
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const glfxStatus = useGlfx();

  // Initialize filter params when filter changes
  useEffect(() => {
    const initialParams = {};
    Object.entries(filterConfigs[selectedFilter].params).forEach(
      ([key, param]) => {
        initialParams[key] = param.default;
      }
    );
    setFilterParams(initialParams);
  }, [selectedFilter]);

  // Initialize canvas when image loads
  useEffect(() => {
    if (!imageUrl || glfxStatus !== "success") return;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      setOriginalImage(img);

      if (!window.fx) return;

      try {
        const glfxCanvas = window.fx.canvas();
        const glfxTexture = glfxCanvas.texture(img);

        const maxWidth = containerRef.current?.clientWidth || 800;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        glfxCanvas.width = Math.floor(img.width * scale);
        glfxCanvas.height = Math.floor(img.height * scale);

        setTexture(glfxTexture);
        setCanvas(glfxCanvas);

        if (canvasRef.current?.parentNode) {
          canvasRef.current.parentNode.replaceChild(
            glfxCanvas,
            canvasRef.current
          );
          canvasRef.current = glfxCanvas;
        }

        glfxCanvas.draw(glfxTexture).update();
      } catch (e) {
        console.error("Error initializing glfx:", e);
      }
    };

    img.src = imageUrl;
  }, [imageUrl, glfxStatus]);

  // Apply filter when params change
  useEffect(() => {
    if (!canvas || !texture) return;

    try {
      canvas.draw(texture);

      switch (selectedFilter) {
        case "brightness":
          canvas.brightnessContrast(filterParams.amount, 0);
          break;
        case "contrast":
          canvas.brightnessContrast(0, filterParams.amount);
          break;
        case "saturation":
          canvas.hueSaturation(0, filterParams.amount);
          break;
        case "sepia":
          canvas.sepia(filterParams.amount);
          break;
        case "vignette":
          canvas.vignette(filterParams.size, filterParams.amount);
          break;
        case "swirl":
          canvas.swirl(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 3,
            filterParams.angle
          );
          break;
        case "bulgePinch":
          canvas.bulgePinch(
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 3,
            filterParams.strength
          );
          break;
      }

      canvas.update();
    } catch (e) {
      console.error("Error applying filter:", e);
    }
  }, [filterParams, selectedFilter, canvas, texture]);

  // Screenshot-based save method
  const handleSaveImage = async () => {
    if (!editorRef.current) return;

    try {
      // Use html2canvas to capture what's visible on screen
      const screenshotCanvas = await html2canvas(
        editorRef.current.querySelector(".canvas-container"),
        {
          useCORS: true,
          backgroundColor: null,
          scale: 2, // Higher quality
        }
      );

      // Create download link
      const link = document.createElement("a");
      link.download = "edited-image.png";
      link.href = screenshotCanvas.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Error capturing screenshot:", e);
      alert("Failed to save. Try the Standard Editor instead.");
    }
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row" ref={editorRef}>
      <div className="flex-1" ref={containerRef}>
        <div className="canvas-container overflow-hidden rounded-lg bg-black">
          <canvas ref={canvasRef} className="h-auto max-w-full" />
        </div>
        <div className="mt-2 flex justify-between">
          <div className="text-gray-500 text-xs">WebGL Editor</div>
          <Button variant="outline" size="sm" onClick={handleSaveImage}>
            Save Image
          </Button>
        </div>
      </div>

      <Card className="bg-gray-100 w-full md:w-64">
        <div className="p-4">
          <div className="mb-4">
            <Label htmlFor="filter-select">Filter:</Label>
            <Select
              value={selectedFilter}
              onValueChange={(v) => setSelectedFilter(v as FilterType)}
            >
              <SelectTrigger id="filter-select">
                <SelectValue placeholder="Select a filter" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(filterConfigs).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {Object.entries(filterConfigs[selectedFilter].params).map(
              ([param, config]) => (
                <div key={param} className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor={`param-${param}`}>{param}:</Label>
                    <span className="text-sm">
                      {filterParams[param]?.toFixed(2)}
                    </span>
                  </div>
                  <Slider
                    id={`param-${param}`}
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={[filterParams[param] || config.default]}
                    onValueChange={(value) =>
                      setFilterParams({ ...filterParams, [param]: value[0] })
                    }
                  />
                </div>
              )
            )}
          </div>

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => {
              const initialParams = {};
              Object.entries(filterConfigs[selectedFilter].params).forEach(
                ([key, param]) => {
                  initialParams[key] = param.default;
                }
              );
              setFilterParams(initialParams);
            }}
          >
            Reset
          </Button>
        </div>
      </Card>
    </div>
  );
}
