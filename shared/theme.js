/**
 * shared/theme.js - 外觀主題管理器
 */
window.ThemeManager = {
    getTheme() {
        return localStorage.getItem('shift_theme_mode') || 'system';
    },
    setTheme(theme) {
        localStorage.setItem('shift_theme_mode', theme);
        this.applyTheme();
    },
    toggleTheme() {
        const current = this.getTheme();
        const next = { 'system': 'light', 'light': 'dark', 'dark': 'system' };
        const nextTheme = next[current] || 'dark';
        this.setTheme(nextTheme);
        return nextTheme;
    },
    applyTheme() {
        const theme = this.getTheme();
        let isDark = false;
        if (theme === 'system') {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        } else {
            isDark = (theme === 'dark');
        }

        // 同步加在 html 與 body 上，確保覆蓋完全
        if (isDark) {
            document.documentElement.classList.add('dark');
            if (document.body) document.body.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
            if (document.body) document.body.classList.remove('dark');
        }
    },
    init() {
        this.applyTheme();
        document.addEventListener('DOMContentLoaded', () => this.applyTheme());
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.getTheme() === 'system') this.applyTheme();
        });
    }
};

ThemeManager.init();