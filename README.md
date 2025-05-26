# test2
# <span style="color:#0056b3;">圖片藝廊主題客製化與內容管理系統</span>

這是一個基於 <span style="color:#007bff; font-weight:bold;">HTML</span>、<span style="color:#007bff; font-weight:bold;">CSS</span> 和 <span style="color:#007bff; font-weight:bold;">JavaScript</span> 開發的網頁專案，旨在提供一個互動式的圖片藝廊展示頁面，並搭配了兩個強大的輔助工具：一個用於生成 <span style="color:#007bff;">CSS 變數</span> 以客製化藝廊主題的生成器，以及一個用於管理和生成藝廊圖片內容 <span style="color:#007bff;">JSON 檔案</span> 的工具。這個專案讓使用者能夠輕鬆地管理藝廊的視覺風格和圖片內容，無需深入的程式碼知識。

## <span style="color:#0056b3;">專案概述</span>

本專案解決了傳統網站主題客製化需要手動修改 CSS 檔案的痛點。透過直觀的表單介面，使用者無需具備深厚的 CSS 知識，即可調整網站的視覺風格。即時預覽功能大大提升了設計效率，讓使用者能快速看到修改後的成果。

## <span style="color:#0056b3;">專案組成與功能</span>

本專案主要包含以下三個部分：

### 1. <span style="color:#007bff;">我的圖片藝廊 (`index.html`)</span>

* **功能**：這是核心的圖片展示頁面，動態地從 `images.json` 載入圖片並展示。
* **特色**：
    * <span style="color:#333; font-weight:bold;">響應式佈局</span>：圖片藝廊會根據螢幕尺寸自動調整佈局。
    * <span style="color:#333; font-weight:bold;">Lightbox 圖片放大</span>：點擊圖片會彈出 Lightbox 視窗顯示大圖及其標題和描述。
    * <span style="color:#333; font-weight:bold;">禁止右鍵功能</span>：預設禁用圖片的右鍵選單，保護圖片版權 (<span style="color:#888;">此功能可透過修改 `script.js` 移除</span>)。
    * <span style="color:#333; font-weight:bold;">主題樣式應用</span>：所有視覺元素（顏色、字體、背景等）都透過 `variables.css` 中的 CSS 變數來控制，實現高度客製化。

### 2. <span style="color:#007bff;">CSS 主題變數生成器 (`CSS 主題變數生成器.html`)</span>

* **功能**：一個互動式工具，用於生成和客製化藝廊頁面的 CSS 變數。
* **特色**：
    * <span style="color:#333; font-weight:bold;">即時預覽 (Real-time Preview)</span>：所有設定的更改會立即反映在頁面下方的預覽區塊，讓您輕鬆掌握設計效果。
    * <span style="color:#333; font-weight:bold;">多樣化客製化選項</span>：提供豐富的選項來調整藝廊的顏色、字體大小、背景圖片等。
    * <span style="color:#333; font-weight:bold;">顏色選擇器與文本框雙向同步</span>：方便您以視覺方式或輸入 HEX 值來設定顏色。
    * <span style="color:#333; font-weight:bold;">背景圖片 URL 格式處理</span>：自動處理背景圖片 URL 的 `url()` 格式，並提供輸入提示。
    * <span style="color:#333; font-weight:bold;">下載 `variables.css`</span>：一鍵生成包含所有自定義 CSS 變數的檔案，直接應用於 `index.html`。
    * <span style="color:#333; font-weight:bold;">使用者友善提示</span>：頁面提供清晰的使用說明。

### 3. <span style="color:#007bff;">圖片專案 JSON 生成器 (`圖片專案 JSON 生成器.html`)</span>

* **功能**：用於創建和編輯 `images.json` 檔案的輔助工具。
* **特色**：
    * <span style="color:#333; font-weight:bold;">圖形化介面</span>：可能提供輸入圖片路徑、標題和描述的表單。
    * <span style="color:#333; font-weight:bold;">JSON 輸出</span>：將輸入的圖片資訊轉換為 `images.json` 格式，供 `index.html` 載入。

## <span style="color:#0056b3;">專案檔案結構</span>
