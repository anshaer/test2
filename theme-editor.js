// theme-editor.js
document.addEventListener('DOMContentLoaded', () => {
    const previewIframe = document.getElementById('previewIframe');
    const editorPanel = document.querySelector('.editor-panel');
    const downloadHtmlBtn = document.getElementById('downloadHtml');
    const downloadCssBtn = document.getElementById('downloadCss');
    const downloadJsBtn = document.getElementById('downloadJs');
    const resetSettingsBtn = document.getElementById('resetSettings');

    // 預設顏色設定 (與 style.css :root 中的初始值保持一致)
    const defaultColorSettings = {
        primaryColor: '#0056b3',
        backgroundColor: '#f0f2f5',
        containerBgColor: '#ffffff',
        itemBgColor: '#ffffff',
        textColor: '#333333',
        secondaryTextColor: '#555555',
        borderColor: '#e0e0e0',
        hoverShadow: '#333333', // 這裡只存顏色
        lightboxBgColor: '#000000', // 這裡只存顏色
        lightboxCaptionBgColor: '#000000', // 這裡只存顏色
        lightboxTextColor: '#eeeeee',
        closeButtonColor: '#ffffff'
    };

    // 預設背景圖片設定
    const defaultBackgroundSettings = {
        backgroundImageUrl: '', // 空字符串表示沒有背景圖片
        backgroundSize: 'auto',
        backgroundPosition: 'center center',
        backgroundRepeat: 'repeat'
    };

    // 合併所有預設設定
    const defaultSettings = {
        ...defaultColorSettings,
        ...defaultBackgroundSettings
    };

    let iframeLoaded = false; // 標誌，確保 iframe 載入後才操作
    let iframeRoot = null; // 儲存 iframe 內部文檔的 :root 元素
    // let iframeBody = null; // 不再需要這個變數

    // 在 iframe 載入完成後執行
    previewIframe.onload = () => {
        iframeLoaded = true;
        // 獲取 iframe 內部的 :root 元素 (document.documentElement)
        iframeRoot = previewIframe.contentWindow.document.documentElement;

        // 載入 localStorage 中保存的設定 (如果有的話)
        loadSavedSettings();
    };

    // 載入保存的設定並應用到編輯器 UI 和預覽
    function loadSavedSettings() {
        const savedSettings = localStorage.getItem('galleryThemeSettings');
        const settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;

        // 將設定應用到編輯器 UI
        editorPanel.querySelectorAll('[data-css-var]').forEach(input => {
            const propName = input.id;
            if (settings[propName] !== undefined) {
                input.value = settings[propName];
            }
        });

        // 將設定應用到預覽 iframe
        applySettingsToIframe(settings);
    }

    // 將當前編輯器 UI 的設定應用到 iframe
    function applyCurrentSettingsToIframe() {
        if (!iframeLoaded || !iframeRoot) return;

        const currentSettings = {};
        editorPanel.querySelectorAll('[data-css-var]').forEach(input => {
            const propName = input.id; // 例如 'primaryColor'
            let value = input.value;

            // 對於背景圖片 URL，如果是空字符串則設置為 'none'
            if (propName === 'backgroundImageUrl' && value === '') {
                value = 'none';
            } else if (propName === 'backgroundImageUrl' && value !== 'none') {
                value = `url('${value}')`; // 將 URL 包裝成 url() 函數
            }

            currentSettings[propName] = value; // 這裡直接使用 id 作為 key，而不是 data-css-var，方便直接對應 defaultSettings
        });
        applySettingsToIframe(currentSettings);
    }

    // 實際應用設定到 iframe 的 CSS 變數
    function applySettingsToIframe(settings) {
        if (!iframeLoaded || !iframeRoot) return;

        for (const key in settings) {
            if (settings.hasOwnProperty(key)) {
                // `key` 是例如 `primaryColor`, `backgroundColor`
                // CSS 變數名是 `--primary-color`, `--background-color`
                iframeRoot.style.setProperty(`--${key}`, settings[key]);
            }
        }
    }


    // 監聽編輯器面板的輸入變化，即時更新預覽
    editorPanel.addEventListener('input', applyCurrentSettingsToIframe);
    editorPanel.addEventListener('change', applyCurrentSettingsToIframe); // 對於 select 元素

    // --- 下載功能 ---
    function downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // 清理 URL
    }

    // 下載 HTML (保持不變，因為 HTML 結構沒有變動)
    downloadHtmlBtn.addEventListener('click', () => {
        let finalHtml = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的圖片藝廊</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>我的圖片藝廊</h1>
    <div id="gallery-container" class="gallery-container">
        </div>

    <div id="lightbox" class="lightbox">
        <span class="close-button">&times;</span>
        <img class="lightbox-content" id="lightbox-img" src="" alt="">
        <div id="lightbox-caption" class="lightbox-caption"></div>
    </div>

    <script src="script.js"></script>
</body>
</html>`;
        downloadFile('index.html', finalHtml, 'text/html');
    });

    // 下載 CSS (修正邏輯)
    downloadCssBtn.addEventListener('click', async () => {
        if (!iframeLoaded || !iframeRoot) return alert('預覽頁面尚未載入完成。');

        // 讀取原始 style.css 內容
        const response = await fetch('style.css');
        let cssContent = await response.text();

        // 獲取當前編輯器 UI 中的所有 CSS 變數值
        const currentEditorSettings = {};
        editorPanel.querySelectorAll('[data-css-var]').forEach(input => {
            currentEditorSettings[input.id] = input.value;
        });

        // 替換 CSS 內容中的 :root 變數
        const rootRegex = /:root\s*\{([\s\S]*?)\}/;
        cssContent = cssContent.replace(rootRegex, (match, p1) => {
            let newVars = '';
            for (const propName in defaultSettings) { // 遍歷所有預設變數名稱
                let varValue = currentEditorSettings[propName]; // 從當前編輯器中獲取值

                // 如果值為空字符串，且是背景圖片 URL，則設置為 'none'
                if (propName === 'backgroundImageUrl' && varValue === '') {
                    varValue = 'none';
                } else if (propName === 'backgroundImageUrl' && varValue !== 'none') {
                    varValue = `url('${varValue}')`; // 確保 URL 格式正確
                }

                // 構建 CSS 變數行
                newVars += `    --${propName}: ${varValue};\n`;
            }
            return `:root {\n${newVars}}`;
        });

        downloadFile('style.css', cssContent, 'text/css');
    });

    // 下載 JS (script.js 保持下載原始檔案)
    downloadJsBtn.addEventListener('click', async () => {
        const response = await fetch('script.js');
        const jsContent = await response.text();
        downloadFile('script.js', jsContent, 'application/javascript');
    });


    // 重置設定
    resetSettingsBtn.addEventListener('click', () => {
        // 重置編輯器 UI
        editorPanel.querySelectorAll('[data-css-var]').forEach(input => {
            const propName = input.id;
            if (defaultSettings[propName] !== undefined) {
                input.value = defaultSettings[propName];
            }
        });
        // 對於背景圖片 URL，重置為空字符串
        document.getElementById('backgroundImageUrl').value = '';

        // 應用預設設定到 iframe 預覽
        applySettingsToIframe(defaultSettings);
        // 清除 Local Storage
        localStorage.removeItem('galleryThemeSettings');
        alert('設定已重置！');
    });

    // 初始載入時，確保 iframe 載入完成再載入設定
    if (previewIframe.contentWindow && previewIframe.contentWindow.document.readyState === 'complete') {
        previewIframe.onload(); // 手動觸發 onload
    }

    // 監聽 beforeunload 事件，將當前設定保存到 Local Storage
    window.addEventListener('beforeunload', () => {
        const currentSettings = {};
        editorPanel.querySelectorAll('[data-css-var]').forEach(input => {
            const propName = input.id;
            let value = input.value;
            // 只有背景圖片URL需要特別處理儲存格式
            if (propName === 'backgroundImageUrl') {
                currentSettings[propName] = value; // 儲存為原始 URL 或空字串
            } else {
                currentSettings[propName] = value;
            }
        });
        localStorage.setItem('galleryThemeSettings', JSON.stringify(currentSettings));
    });
});
