function getTelegramUserId() {
    try {
        const src = window.location.href;
        console.log('Current URL:', src);
        
        if (!src.includes('#')) {
            throw new Error('No hash in URL');
        }
        
        const hashPart = decodeURIComponent(src.split('#')[1]);
        console.log('Hash part:', hashPart);
        
        if (!hashPart.includes('tgWebAppData=')) {
            throw new Error('tgWebAppData not found in hash');
        }
        
        const tgDataPart = hashPart.split('tgWebAppData=')[1];
        console.log('TG data part:', tgDataPart);
        
        if (!tgDataPart.includes('user=')) {
            throw new Error('user data not found');
        }
        
        const userPart = tgDataPart.split('user=')[1].split('&')[0];
        const decodedUserPart = decodeURIComponent(userPart);
        console.log('User part:', decodedUserPart);
        
        const userData = JSON.parse(decodedUserPart);
        console.log('Parsed user data:', userData);
        
        return userData.id;
        
    } catch (error) {
        console.error('Error parsing Telegram data:', error);
        return null;
    }
}

function fillTelegramId() {
    const userId = getTelegramUserId();
    const nameHolder = 'tgid';
    
    if (!userId) {
        console.error('Could not get Telegram user ID');
        return;
    }
    
    console.log('Telegram User ID:', userId);
    
    const labelElement = document.querySelector('span.label-value');
    
    if (!labelElement) {
        console.error('Label element not found');
        return;
    }
    
    if (labelElement.textContent.trim() !== nameHolder) {
        console.error(`Label text "${labelElement.textContent.trim()}" does not match "${nameHolder}"`);
        return;
    }
    
    const customFieldInput = labelElement.closest('.custom-field');
    if (!customFieldInput) {
        console.error('Custom field container not found');
        return;
    }
    
    const inputElement = customFieldInput.querySelector('input');
    if (!inputElement) {
        console.error('Input element not found');
        return;
    }
    
    console.log('Found input element:', inputElement);
    inputElement.value = userId;
    
    inputElement.dispatchEvent(new Event('change', { bubbles: true }));
    inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    
    console.log('Successfully set user ID:', userId);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fillTelegramId);
} else {
    // DOM уже загружен
    fillTelegramId();
}

// Дополнительная попытка через небольшой таймаут на случай динамической загрузки
setTimeout(fillTelegramId, 1000);