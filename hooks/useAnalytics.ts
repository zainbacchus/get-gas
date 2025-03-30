declare global {
  interface Window {
    gtag: (
      command: string,
      action: string,
      params?: {
        [key: string]: any;
      }
    ) => void;
  }
}

export const useAnalytics = () => {
  const trackButtonClick = (buttonName: string, buttonLocation: string) => {
    window.gtag('event', 'button_click', {
      button_name: buttonName,
      button_location: buttonLocation,
    });
  };

  return {
    trackButtonClick,
  };
}; 