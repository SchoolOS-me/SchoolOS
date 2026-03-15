import { useEffect, useMemo, useState } from "react";
import "./AppInitializationLoader.css";

type AppInitializationLoaderProps = {
  onComplete: () => void;
};

const TOTAL_DURATION_MS = 1400;
const STEP_MS = 25;

const AppInitializationLoader = ({ onComplete }: AppInitializationLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const totalSteps = useMemo(() => Math.floor(TOTAL_DURATION_MS / STEP_MS), []);

  useEffect(() => {
    let steps = 0;
    const timer = window.setInterval(() => {
      steps += 1;
      const next = Math.min(100, Math.round((steps / totalSteps) * 100));
      setProgress(next);
      if (next >= 100) {
        window.clearInterval(timer);
        onComplete();
      }
    }, STEP_MS);

    return () => window.clearInterval(timer);
  }, [onComplete, totalSteps]);

  return (
    <div className="app-init-loader" role="status" aria-live="polite">
      <div className="app-init-loader__center">
        <img src="/logo.svg" alt="SchoolOS" className="app-init-loader__logo" />

        <div className="app-init-loader__progress">
          <div className="app-init-loader__track">
            <div className="app-init-loader__fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="app-init-loader__meta">
            <span>INITIALIZING</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      <p className="app-init-loader__footer">SchoolOS</p>
    </div>
  );
};

export default AppInitializationLoader;
