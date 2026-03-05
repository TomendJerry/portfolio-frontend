import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { AuditAPI } from './api';

export const trackVisitor = async (actionName = "PAGE_VISIT") => {
  try {
    // 1. Spam Protection & Filter (Opsional tapi Disarankan)
    // Mencegah log ganda jika user melakukan refresh cepat atau berpindah navigasi sangat cepat
    const lastAction = sessionStorage.getItem('last_audit_action');
    const lastTime = Number(sessionStorage.getItem('last_audit_time') || 0);
    const currentTime = Date.now();

    if (lastAction === actionName && (currentTime - lastTime) < 2000) {
      return; // Abaikan jika aksi sama dalam rentang 2 detik
    }

    // 2. Load Fingerprint
    const fp = await FingerprintJS.load();
    const result = await fp.get();

    const auditData = {
      visitorId: result.visitorId,
      browser_details: {
        resolution: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
        cores: Number(navigator.hardwareConcurrency) || 0,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        platform: navigator.platform,
        vendor: navigator.vendor || "Unknown"
      },
      action: actionName
    };

    // 3. Kirim ke Backend
    await AuditAPI.logAccess(auditData);
    
    // 4. Update History Session
    sessionStorage.setItem('last_audit_action', actionName);
    sessionStorage.setItem('last_audit_time', currentTime.toString());
    
  } catch (error) {
    // Gunakan peringatan saja agar tidak mengganggu pengalaman pengguna jika API audit down
    console.warn("Security Audit Note: Activity not logged.");
  }
};