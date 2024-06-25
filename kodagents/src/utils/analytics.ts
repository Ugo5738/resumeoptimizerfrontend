import ReactGA from "react-ga4";

// Initialize GA (call this in your App.tsx)
export const initGA = (measurementId: string) => {
  ReactGA.initialize(measurementId);
};

// Page view tracking
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Event tracking
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// User tracking
export const setUserProperties = (properties: Record<string, any>) => {
  ReactGA.set(properties);
};

// Custom tracking for timing
export const trackTiming = (category: string, variable: string, value: number, label?: string) => {
  ReactGA.event({
    category: category,
    action: variable,
    label: label,
    value: value,
  });
};

// Custom tracking for exceptions
export const trackException = (description: string, fatal: boolean = false) => {
  ReactGA.event({
    category: 'Exception',
    action: description,
    label: fatal ? 'fatal' : 'non-fatal',
  });
};