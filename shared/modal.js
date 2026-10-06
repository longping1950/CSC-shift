/**
 * shared/modal.js - 全域共用對話框模組
 */
window.AppModal = {
    element: null, content: null, title: null, message: null, inputContainer: null, input: null, btnCancel: null, btnConfirm: null,
    
    init() {
        if (document.getElementById('app-modal')) {
            this.bindElements();
            return;
        }

        // 自動動態注入 Modal DOM，主頁面 HTML 不再需要手寫這段
        const modalHtml = `
            <div id="app-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm hidden opacity-0 transition-opacity duration-200">
                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-11/12 max-w-sm overflow-hidden" id="app-modal-content">
                    <div class="p-5">
                        <h3 id="app-modal-title" class="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">提示</h3>
                        <p id="app-modal-message" class="text-slate-600 dark:text-slate-300 text-sm mb-4">內容</p>
                        <div id="app-modal-input-container" class="hidden mb-4">
                            <input type="password" id="app-modal-input" class="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-center font-bold focus:outline-none focus:border-blue-500 transition-colors" placeholder="請輸入密碼">
                        </div>
                        <div class="flex justify-end gap-3 mt-2">
                            <button id="app-modal-btn-cancel" class="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors hidden">取消</button>
                            <button id="app-modal-btn-confirm" class="px-4 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">確定</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        this.bindElements();
        window.alert = (msg) => this.alert(msg);
    },

    bindElements() {
        this.element = document.getElementById('app-modal');
        this.content = document.getElementById('app-modal-content');
        this.title = document.getElementById('app-modal-title');
        this.message = document.getElementById('app-modal-message');
        this.inputContainer = document.getElementById('app-modal-input-container');
        this.input = document.getElementById('app-modal-input');
        this.btnCancel = document.getElementById('app-modal-btn-cancel');
        this.btnConfirm = document.getElementById('app-modal-btn-confirm');
    },

    show(title, message, isPrompt = false, callback = null) {
        if (!this.element) this.init();
        this.title.innerHTML = title;
        this.message.innerHTML = message;
        
        if (isPrompt) {
            this.inputContainer.classList.remove('hidden');
            this.input.value = '';
            this.btnCancel.classList.remove('hidden');
        } else {
            this.inputContainer.classList.add('hidden');
            this.btnCancel.classList.add('hidden');
        }

        this.element.classList.remove('hidden');
        void this.element.offsetWidth;
        this.element.classList.remove('opacity-0');

        const cleanup = () => {
            this.btnConfirm.onclick = null;
            this.btnCancel.onclick = null;
            this.input.onkeydown = null;
            this.hide();
        };

        this.btnConfirm.onclick = () => {
            cleanup();
            if (callback) callback(isPrompt ? this.input.value : true);
        };
        this.btnCancel.onclick = () => {
            cleanup();
            if (callback) callback(null);
        };
        this.input.onkeydown = (e) => {
            if (e.key === 'Enter') this.btnConfirm.click();
        };
        if (isPrompt) setTimeout(() => this.input.focus(), 100);
    },

    hide() {
        if (!this.element) return;
        this.element.classList.add('opacity-0');
        setTimeout(() => { if (this.element) this.element.classList.add('hidden'); }, 200);
    },

    alert(message) {
        this.show('提示', message, false);
    },

    prompt(title, message, callback) {
        this.show(title, message, true, callback);
    }
};

document.addEventListener('DOMContentLoaded', () => AppModal.init());