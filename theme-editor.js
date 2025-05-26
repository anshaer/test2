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
    let iframeBody = null; // 儲存 iframe 內部文檔的 body 元素

    // 在 iframe 載入完成後執行
    previewIframe.onload = () => {
        iframeLoaded = true;
        // 獲取 iframe 內部的 :root 元素 (document.documentElement)
        iframeRoot = previewIframe.contentWindow.document.documentElement;
        iframeBody = previewIframe.contentWindow.document.body;

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
            const cssVar = input.dataset.cssVar; // 獲取 data-css-var 屬性值
            let value = input.value;

            // 對於背景圖片 URL，如果是空字符串則設置為 'none'
            if (input.id === 'backgroundImageUrl' && value === '') {
                value = 'none';
            } else if (input.id === 'backgroundImageUrl' && value !== 'none') {
                value = `url('${value}')`; // 將 URL 包裝成 url() 函數
            }

            currentSettings[cssVar.replace('--', '')] = value; // 移除 --
        });
        applySettingsToIframe(currentSettings);
    }

    // 實際應用設定到 iframe 的 CSS 變數
    function applySettingsToIframe(settings) {
        if (!iframeLoaded || !iframeRoot) return;

        for (const key in settings) {
            if (settings.hasOwnProperty(key)) {
                // 對於 `hoverShadow`, `lightboxBgColor`, `lightboxCaptionBgColor`
                // 由於它們在 CSS 中是 rgba 格式 (例如 rgba(var(--hover-shadow), 0.2))
                // 我們只傳遞顏色值 (例如 #333333)，透明度由 CSS 處理。
                // 對於背景圖片相關的變數，直接設定
                if (key.startsWith('body-background-')) {
                     iframeRoot.style.setProperty(`--${key}`, settings[key]);
                } else {
                     iframeRoot.style.setProperty(`--${key}`, settings[key]);
                }
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

    // 下載 HTML
    downloadHtmlBtn.addEventListener('click', () => {
        if (!iframeLoaded || !iframeRoot) return alert('預覽頁面尚未載入完成。');

        const htmlContent = previewIframe.contentWindow.document.documentElement.outerHTML;
        // 移除 style.css 和 script.js 的預設值，因為主題是應用在變數上
        // 這裡需要獲取iframe的完整html，包含當前生效的css變量
        // 但直接獲取 outerHTML 會包含編輯器動態添加的樣式，不是原始樣式。
        // 最好的方法是基於原始 index.html 模板，替換其中的 CSS 變數默認值
        // 但那樣需要載入原始文件內容，較為複雜。
        // 簡單做法：將 iframe 內當前計算出的 CSS 變數值注入到 style 標籤中
        // 或者直接下載一個包含所有當前 CSS 變數的 style.css
        // 我們選擇下載一個包含所有當前變數的 style.css

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

    // 下載 CSS
    downloadCssBtn.addEventListener('click', async () => {
        if (!iframeLoaded || !iframeRoot) return alert('預覽頁面尚未載入完成。');

        // 讀取原始 style.css 內容
        const response = await fetch('style.css');
        let cssContent = await response.text();

        // 獲取當前 iframe 中的所有 CSS 變數值
        const currentCssVars = {};
        const computedStyle = getComputedStyle(iframeRoot); // 獲取計算後的樣式
        for (const key in defaultSettings) { // 遍歷所有預設變數
            const cssVarName = `--${key}`;
            let value = computedStyle.getPropertyValue(cssVarName).trim();

            // 如果背景圖片 URL 變成了 url("none")，則轉換回 "none" 或空字符串
            if (key === 'body-background-image') {
                if (value.startsWith('url("') && value.endsWith('")') && value.includes('none')) {
                    value = 'none'; // 實際應該是 ''
                } else if (value.startsWith('url("') && value.endsWith('")')) {
                    value = value.substring(5, value.length - 2); // 提取 URL
                }
            }
            currentCssVars[cssVarName] = value;
        }

        // 替換 CSS 內容中的 :root 變數
        const rootRegex = /:root\s*\{([\s\S]*?)\}/;
        cssContent = cssContent.replace(rootRegex, (match, p1) => {
            let newVars = '';
            for (const varName in currentCssVars) {
                let varValue = currentCssVars[varName];
                // 對於透明度，如果變數是 `rgba(..., 0.X)` 且我們只存顏色，
                // 這裡需要判斷並修正，例如，如果原來的 CSS 是 rgba(var(--color), 0.2)
                // 我們只替換 --color 的值，而不是整個 rgba
                // 這裡我們假設 style.css 中 rgba 裡面的 alpha 值是固定的，我們只更新顏色部分。
                if (varName === '--hover-shadow') varValue = `${varValue}`; // 保持原始 style.css 的邏輯，不需要 rgba
                if (varName === '--lightbox-bg-color') varValue = `${varValue}`;
                if (varName === '--lightbox-caption-bg-color') varValue = `${varValue}`;
                if (varName === '--body-background-image' && varValue === 'none') {
                    varValue = 'none'; // 確保為 none
                } else if (varName === '--body-background-image' && varValue.startsWith('url(')) {
                    // 如果用戶輸入了有效的 URL，並且它被轉換為 url('') 形式
                    // 則保留 url('') 形式
                    // 否則，如果是 'none'，則保持 'none'
                }
                 newVars += `    ${varName}: ${varValue};\n`;
            }
            return `:root {\n${newVars}}`;
        });

        // 處理背景圖片 URL，如果用戶輸入了，需要將其轉換回 url('') 形式
        const backgroundImageUrlInput = document.getElementById('backgroundImageUrl');
        let finalImageUrl = backgroundImageUrlInput.value;
        if (finalImageUrl !== '') {
            cssContent = cssContent.replace(`--body-background-image: none;`, `--body-background-image: url('${finalImageUrl}');`);
        } else {
             cssContent = cssContent.replace(`--body-background-image: url('${finalImageUrl}');`, `--body-background-image: none;`);
        }


        downloadFile('style.css', cssContent, 'text/css');
    });

    // 下載 JS (script.js)
    downloadJsBtn.addEventListener('click', async () => {
        // script.js 基本上不需要因為主題而改變，除非您想將主題預設值寫死進去
        // 為了簡單和保持彈性，我們下載原始的 script.js
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
    // 如果 iframe 已經載入，則直接載入設定
    if (previewIframe.contentWindow && previewIframe.contentWindow.document.readyState === 'complete') {
        previewIframe.onload(); // 手動觸發 onload
    }

    // 監聽 beforeunload 事件，將當前設定保存到 Local Storage
    window.addEventListener('beforeunload', () => {
        const currentSettings = {};
        editorPanel.querySelectorAll('[data-css-var]').forEach(input => {
            const propName = input.id;
            let value = input.value;
            if (propName === 'backgroundImageUrl' && value === '') {
                value = 'none'; // 儲存 'none' 或空字符串
            } else if (propName === 'backgroundImageUrl') {
                value = `url('${value}')`;
            }
            currentSettings[propName] = value;
        });
        localStorage.setItem('galleryThemeSettings', JSON.stringify(currentSettings));
    });
});