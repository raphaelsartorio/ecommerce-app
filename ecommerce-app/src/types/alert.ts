export interface Alert {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  link?: {
    text: string;
    to: string;
  };
}
