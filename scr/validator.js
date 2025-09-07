(function() {
    'use strict';
    
    if (window.FormValidatorV3) {
        console.log('Form Validator already loaded');
        return;
    }
    
    console.log('🚀 LOADING FORM VALIDATOR');
    
    // КОНФИГУРАЦИЯ 
    const CONFIG = {
        // Числовые ID из name="formParams[userCustomFields][ID]"
        fieldsToValidate: [
            '773237',    
            '10765549' 
        ],
        
        offerToFormMapping: {
            '3342904': '2181256067',
            '7559832': '2181256068'
        },
        
        errorMessages: {
            popup: 'Необходимо выбрать дату старта в поп-апе',
            select: 'Выберите значение из списка',
            noOffer: 'Выберите один из вариантов заказа'
        },
        
        emptySelectValues: ['', 'Выберите дату старта', 'Выберите...', 'Не выбрано']
    };
    
    // Утилиты
    function log(message, data) {
        if (data !== undefined) {
            console.log('🔧 VALIDATOR:', message, data);
        } else {
            console.log('🔧 VALIDATOR:', message);
        }
    }
    
    function showError(form, message) {
        const errorBlock = form.querySelector('.form-result-block');
        if (errorBlock) {
            errorBlock.innerHTML = `<div class="error-message">${message}</div>`;
            errorBlock.className = 'form-result-block error';
            errorBlock.style.display = 'block';
            
            // Прокрутка к ошибке
            setTimeout(() => {
                errorBlock.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 100);
            
            log('Error shown and scrolled to:', message);
        }
    }
    
    function hideError(form) {
        const errorBlock = form.querySelector('.form-result-block');
        if (errorBlock) {
            errorBlock.classList.remove('error');
            errorBlock.style.display = 'none';
            errorBlock.innerHTML = '';
        }
    }
    
    function getSelectedOfferId(form) {
        const selectedRadio = form.querySelector('input[name="formParams[offer_id][]"]:checked');
        if (selectedRadio) {
            const label = selectedRadio.closest('.form-position');
            return label ? label.getAttribute('data-offer-id') : null;
        }
        return null;
    }
    
    function validateSelectField(field) {
        return field.value && !CONFIG.emptySelectValues.includes(field.value);
    }
    
    function createFieldSelector(fieldId) {
        return `select[name="formParams[userCustomFields][${fieldId}]"]`;
    }
    
    function findFieldsInForm(form) {
        const foundFields = [];
        
        CONFIG.fieldsToValidate.forEach(fieldId => {
            const selector = createFieldSelector(fieldId);
            const field = form.querySelector(selector);
            
            if (field) {
                foundFields.push({
                    id: fieldId,
                    element: field,
                    selector: selector
                });
                log('Field found:', fieldId, 'value:', field.value);
            } else {
                log('Field not found:', fieldId, 'selector:', selector);
            }
        });
        
        return foundFields;
    }
    
    function checkPopupForm(formDataId) {
        log('Searching popup form:', formDataId);
        
        const popupForm = document.querySelector(`form[data-id="${formDataId}"]`);
        if (!popupForm) {
            log('Popup form NOT FOUND:', formDataId);
            return false;
        }
        
        log('Popup form found:', popupForm.id);
        
        const fields = findFieldsInForm(popupForm);
        if (fields.length === 0) {
            log('No validation fields found in popup');
            return false;
        }
        
        // Проверяем все найденные поля
        for (let fieldData of fields) {
            if (!validateSelectField(fieldData.element)) {
                log('Popup field validation FAILED:', fieldData.id);
                return false;
            }
        }
        
        log('All popup fields are valid');
        return true;
    }
    
    // Главная функция валидации
    function validateForm(form) {
        log('Validating form:', form.id || 'no-id');
        
        const isMainForm = !!form.querySelector('input[name="formParams[offer_id][]"]');
        
        if (isMainForm) {
            log('MAIN FORM detected');
            
            const selectedOfferId = getSelectedOfferId(form);
            log('Selected offer:', selectedOfferId || 'NONE');
            
            // Проверка 1: Выбрана ли опция?
            if (!selectedOfferId) {
                log('NO OFFER SELECTED - blocking');
                showError(form, CONFIG.errorMessages.noOffer);
                return false;
            }
            
            // Проверка 2: Нужна ли проверка поп-апа?
            if (CONFIG.offerToFormMapping[selectedOfferId]) {
                const popupFormId = CONFIG.offerToFormMapping[selectedOfferId];
                log('Checking popup for offer:', selectedOfferId, '→', popupFormId);
                
                if (!checkPopupForm(popupFormId)) {
                    log('POPUP VALIDATION FAILED - blocking');
                    showError(form, CONFIG.errorMessages.popup);
                    return false;
                }
            } else {
                log('No popup validation required for this offer');
            }
        } else {
            log('POPUP FORM detected');
            
            const fields = findFieldsInForm(form);
            
            for (let fieldData of fields) {
                if (!validateSelectField(fieldData.element)) {
                    log('Popup field empty:', fieldData.id);
                    showError(form, CONFIG.errorMessages.select);
                    return false;
                }
            }
        }
        
        log('VALIDATION PASSED');
        hideError(form);
        return true;
    }
    
    // Перехват событий
    document.addEventListener('click', function(e) {
        if (e.target.type === 'submit' || (e.target.tagName === 'BUTTON' && e.target.type !== 'button')) {
            log('Submit button clicked:', e.target.id);
            
            const form = e.target.closest('form');
            if (form && !validateForm(form)) {
                log('BLOCKING button click');
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }
            log('ALLOWING button click');
        }
    }, true);
    
    document.addEventListener('submit', function(e) {
        log('Form submit event');
        if (!validateForm(e.target)) {
            log('BLOCKING form submit');
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
        log('ALLOWING form submit');
    }, true);
    
    const style = document.createElement('style');
    style.textContent = `
        .form-result-block.error {
            background-color: #f8d7da !important;
            border: 1px solid #f5c6cb !important;
            color: #721c24 !important;
            padding: 10px !important;
            border-radius: 4px !important;
            margin-bottom: 15px !important;
            display: block !important;
        }
        .error-message {
            margin: 0 !important;
            font-weight: bold !important;
            font-size: 14px !important;
        }
    `;
    document.head.appendChild(style);
    
    window.FormValidatorV3 = { initialized: true, validateForm };
    log('VALIDATOR READY');
    
})();
