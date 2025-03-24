interface GazeData {
  x: number;
  y: number;
  eyeFeatures?: any;
}

interface WebGazer {
  setGazeListener(listener: (data: GazeData | null) => void): WebGazer;
  begin(): Promise<void>;
  setRegression(type: string): WebGazer;
  setTracker(type: string): WebGazer;
  showPredictionPoints(show: boolean): void;
  showVideo(show: boolean): void;
  showFaceOverlay(show: boolean): void;
  showFaceFeedbackBox(show: boolean): void;
  pause(): void;
  resume(): void;
  isReady(): boolean;
  setVideoElement(video: HTMLVideoElement | null): Promise<WebGazer>;
  setVideoElementCanvas(canvas: HTMLCanvasElement | null): Promise<WebGazer>;
}

declare global {
  interface Window {
    webgazer: WebGazer;
  }
}

declare module 'webgazer' {
  interface WebGazer {
    setRegression(type: string): WebGazer;
    setTracker(type: string): WebGazer;
    setGazeListener(listener: (data: { x: number; y: number } | null) => void): WebGazer;
    begin(): Promise<void>;
    showCalibrationPoints(show: boolean): void;
    isReady(): boolean;
    setVideoElement(video: HTMLVideoElement | null): Promise<WebGazer>;
    setVideoElementCanvas(canvas: HTMLCanvasElement | null): Promise<WebGazer>;
  }

  const webgazer: WebGazer;
  export default webgazer;
}
