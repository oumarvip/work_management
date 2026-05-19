
export class NotificationService {
  static async requestPermission() {
    if (!('Notification' in window)) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async send(title: string, body: string) {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    
    // In a real PWA, you'd use registration.showNotification for background support
    new Notification(title, {
      body,
      icon: '/vite.svg', // Default icon
      badge: '/vite.svg',
      tag: 'work-mgmt-notify'
    });
  }
}
