import React from "react";
import { AlertCircle, RefreshCw, ShieldAlert, WifiOff } from "lucide-react";
import { CONTENT } from "../../../constants/content";
import { cn } from "../../../utils/cn";
import { Button } from "../Button/Button";
import { Loader } from "../Loader/Loader";

const stateIcons = {
  error: AlertCircle,
  unauthorized: ShieldAlert,
  offline: WifiOff,
};

const StateMessage = ({ icon: Icon, title, description, onRetry, retryLabel }) => (
  <section
    className="flex min-h-48 flex-col items-center justify-center rounded-[var(--k2-radius-lg)] border border-[color:var(--k2-color-border-default)] bg-[color:var(--k2-color-surface-subtle)] px-[var(--k2-space-xl)] py-[var(--k2-space-2xl)] text-center"
    role="status"
  >
    {Icon && (
      <Icon
        aria-hidden="true"
        className="mb-[var(--k2-space-sm)] size-8 text-[color:var(--k2-color-primary)]"
      />
    )}
    <h2 className="text-base font-semibold text-[color:var(--k2-color-text-primary)]">
      {title}
    </h2>
    {description && <p className="mt-[var(--k2-space-xs)] text-sm text-gray-600">{description}</p>}
    {onRetry && (
      <Button
        asMotion={false}
        className="mt-[var(--k2-space-lg)]"
        onClick={onRetry}
        type="button"
        variant="outline"
      >
        <RefreshCw aria-hidden="true" className="mr-2 size-4" />
        {retryLabel}
      </Button>
    )}
  </section>
);

export const K2AsyncStateView = ({
  state,
  children,
  className,
  onRetry,
  messages = CONTENT.common.asyncState,
  renderEmpty,
  renderError,
  renderUnauthorized,
  renderOffline,
}) => {
  if (!Object.hasOwn(stateIcons, state) && ![
    "loading",
    "content",
    "refreshing",
    "empty",
    "offlineWithCachedData",
  ].includes(state)) {
    throw new Error(`Unsupported K2 async state: ${state}`);
  }

  if (state === "content") {
    return <>{children}</>;
  }

  if (state === "refreshing") {
    return (
      <div aria-busy="true" className={cn("relative", className)}>
        <div className="mb-[var(--k2-space-sm)] flex items-center gap-[var(--k2-space-sm)] text-sm text-gray-600" role="status">
          <Loader size="sm" />
          {messages.refreshing}
        </div>
        {children}
      </div>
    );
  }

  if (state === "offlineWithCachedData") {
    return (
      <div className={className}>
        <div className="mb-[var(--k2-space-sm)] flex items-center gap-[var(--k2-space-sm)] rounded-[var(--k2-radius-md)] bg-[color:var(--k2-color-surface-subtle)] p-[var(--k2-space-md)] text-sm text-gray-700" role="status">
          <WifiOff aria-hidden="true" className="size-4" />
          {messages.offlineCached}
        </div>
        {children}
      </div>
    );
  }

  if (state === "loading") {
    return (
      <div
        aria-busy="true"
        className={cn("flex min-h-48 items-center justify-center", className)}
        role="status"
      >
        <Loader />
        <span className="sr-only">{messages.loading}</span>
      </div>
    );
  }

  if (state === "empty") {
    return renderEmpty ? renderEmpty() : (
      <StateMessage {...messages.empty} />
    );
  }

  const renderers = {
    error: renderError,
    unauthorized: renderUnauthorized,
    offline: renderOffline,
  };
  const renderer = renderers[state];
  if (renderer) {
    return renderer();
  }

  return (
    <StateMessage
      {...messages[state]}
      icon={stateIcons[state]}
      onRetry={state === "unauthorized" ? undefined : onRetry}
      retryLabel={messages.retry}
    />
  );
};
