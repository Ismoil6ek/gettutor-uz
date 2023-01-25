/// <reference types="react-scripts" />
declare module "*.mp3";

export {};

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
    Pusher: any;
    Echo: any;
  }
}
