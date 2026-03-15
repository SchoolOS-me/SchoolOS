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
      <div className="system-loading-overlay__bg" aria-hidden="true">
        <div className="system-loading-overlay__topbar">
          <span />
          <span />
        </div>
        <div className="system-loading-overlay__headerSkeleton">
          <span />
          <span />
        </div>
        <div className="system-loading-overlay__tabs">
          <span />
          <span />
          <span />
        </div>
        <div className="system-loading-overlay__table">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
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
