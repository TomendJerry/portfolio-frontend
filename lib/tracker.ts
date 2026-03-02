import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { AuditAPI } from './api';

export const trackVisitor = async (actionName = "PAGE_VISIT") => {
    try {
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
  
      // PERBAIKAN: Memanggil fungsi yang sudah didefinisikan di lib/api.ts
      await AuditAPI.logAccess(auditData);
      
    } catch (error) {
      console.error("Audit tracking failed:", error);
    }
  };