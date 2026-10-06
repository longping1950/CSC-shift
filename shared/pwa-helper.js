// shared/pwa-helper.js
const PWAHelper = {
    deferredPrompt: null,
    isIOS: /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()),
    isStandalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true,
    onInstallableChange: null,

    init(options = {}) {
        if (options.onInstallableChange) {
            this.onInstallableChange = options.onInstallableChange;
        }

        // 1. 自動註冊 Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                const swPath = options.swPath || './sw.js';
                navigator.serviceWorker.register(swPath).catch(err => console.warn('SW failed:', err));
            });
        }

        // 2. 攔截 Android / 桌面 Chrome 安裝提示
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            if (this.onInstallableChange && !this.isStandalone) {
                this.onInstallableChange(true);
            }
        });

        // 3. iOS 裝置且未安裝時，直接通知可安裝（以利彈出教學）
        if (this.isIOS && !this.isStandalone && this.onInstallableChange) {
            this.onInstallableChange(true);
        }
    },

    // 觸發安裝流程：Android 呼叫原生 prompt；iOS 執行傳入的客製教學回呼
    triggerInstall(onIOSPrompt) {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    if (this.onInstallableChange) this.onInstallableChange(false);
                }
                this.deferredPrompt = null;
            });
        } else if (this.isIOS && typeof onIOSPrompt === 'function') {
            onIOSPrompt();
        }
    }
};