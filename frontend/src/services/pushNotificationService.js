import notificationsService from './notificationsService';

const pushNotificationService = {
  isSupported: () => 'Notification' in window && 'serviceWorker' in navigator,
  requestPermission: async () => {
    if (!pushNotificationService.isSupported()) return 'unsupported';
    return Notification.requestPermission();
  },
  subscribe: async () => {
    const permission = await pushNotificationService.requestPermission();
    if (permission !== 'granted') return null;
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: '' });
      await notificationsService.subscribePush(sub.toJSON());
      return sub;
    } catch (e) { return null; }
  },
  unsubscribe: async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) { await sub.unsubscribe(); await notificationsService.unsubscribePush(); }
    } catch {}
  },
};
export default pushNotificationService;
