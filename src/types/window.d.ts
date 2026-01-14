export {};

declare global {
  interface Window {
    nevil?: {
      help: () => {
        about: string;
        links: Record<string, string>;
        stack: string[];
      };
    };
  }
}
