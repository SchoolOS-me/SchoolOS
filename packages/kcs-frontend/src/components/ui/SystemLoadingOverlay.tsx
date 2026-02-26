import "./SystemLoadingOverlay.css";

type SystemLoadingOverlayProps = {
  title?: string;
  subtitle?: string;
};

const SystemLoadingOverlay = ({
  title = "Fetching school data...",
  subtitle = "Please wait while we sync records",
}: SystemLoadingOverlayProps) => {
  return (
    <div className="system-loading-overlay" role="status" aria-live="polite">
      <div className="system-loading-overlay__card">
        <div className="system-loading-overlay__spinnerWrap">
          <div className="system-loading-overlay__spinnerBg" />
          <div className="system-loading-overlay__spinner" />
        </div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  );
};

export default SystemLoadingOverlay;
