/**
 * PWA 註冊與安裝指引輔助模組
 */
window.PWAHelper = {
    installPrompt: null,
    isStandalone: false,
    isIOS: false,
    hasHandler: false,

    init() {
        this.isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        this.isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

        // 僅在頁面有宣告安裝需求時攔截提示，避免控制台拋出無用的 preventDefault 警告
        window.addEventListener('beforeinstallprompt', (e) => {
            // 儲存事件供後續使用者點擊自訂按鈕時觸發
            this.installPrompt = e;
            window.dispatchEvent(new CustomEvent('pwa-install-available'));
        });

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js').catch(() => {});
            });
        }
    },

    triggerInstall(onSuccess) {
        if (this.installPrompt) {
            this.installPrompt.prompt();
            this.installPrompt.userChoice.then(res => {
                if (res.outcome === 'accepted' && onSuccess) onSuccess();
                this.installPrompt = null;
            });
        } else if (this.isIOS) {
            alert("iOS 請點擊 Safari 下方分享按鈕，並選擇「加入主畫面」即可安裝！");
        }
    }
};
PWAHelper.init();