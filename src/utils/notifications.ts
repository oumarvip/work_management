import { db } from '../db/db';
import { calculateJobStatus } from './status';

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') return true;
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

export async function checkAndNotifyJobs() {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const jobs = await db.jobs.toArray();
  const now = Date.now();
  
  // Throttle notifications to avoid spam (last notification check stored in localStorage)
  const lastCheck = parseInt(localStorage.getItem('lastNotificationCheck') || '0');
  if (now - lastCheck < 3600000) return; // Once per hour

  let overdueCount = 0;
  let dueTodayCount = 0;

  jobs.forEach(job => {
    const status = calculateJobStatus(job.collectionDate, job.statusOverride);
    if (status === 'Overdue') overdueCount++;
    if (status === 'Due Today') dueTodayCount++;
  });

  if (overdueCount > 0) {
    new Notification('Work Management Alert', {
      body: `System detects ${overdueCount} OVERDUE protocol(s) requiring immediate attention.`,
      icon: '/pwa-192x192.png'
    });
  }

  if (dueTodayCount > 0) {
    new Notification('Work Management Update', {
      body: `You have ${dueTodayCount} service order(s) scheduled for TODAY.`,
      icon: '/pwa-192x192.png'
    });
  }

  localStorage.setItem('lastNotificationCheck', now.toString());
}
