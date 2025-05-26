// script.js
document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeButton = document.querySelector('.close-button');

    // --- 移除: 載入並應用主題設定 (不再由自身管理，而是由編輯器控制) ---
    // function applyThemeSettings() { /* ... */ }
    // applyThemeSettings();
    // --- 移除結束 ---


    // 從 JSON 檔案載入圖片資料
    fetch('images.json')
        .then(response => response.json())
        .then(images => {
            images.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.classList.add('gallery-item');

                const imageWrapper = document.createElement('div');
                imageWrapper.classList.add('image-wrapper');

                const img = document.createElement('img');
                img.src = image.path;
                img.alt = image.title;

                imageWrapper.appendChild(img);

                const infoDiv = document.createElement('div');
                infoDiv.classList.add('image-info');

                const titleH3 = document.createElement('h3');
                titleH3.textContent = image.title;

                const descriptionP = document.createElement('p');
                descriptionP.textContent = image.description;

                infoDiv.appendChild(titleH3);
                infoDiv.appendChild(descriptionP);

                galleryItem.appendChild(imageWrapper);
                galleryItem.appendChild(infoDiv);

                galleryItem.addEventListener('click', () => {
                    lightbox.style.display = 'block';
                    lightboxImg.src = image.path;
                    lightboxImg.alt = image.title;
                    lightboxCaption.innerHTML = `<h3>${image.title}</h3><p>${image.description}</p>`;
                });

                galleryContainer.appendChild(galleryItem);
            });
        })
        .catch(error => console.error('Error loading the images:', error));

    // 點擊關閉按鈕關閉 lightbox
    closeButton.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });

    // 點擊 lightbox 外部區域關閉 lightbox
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
});