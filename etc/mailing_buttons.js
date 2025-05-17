console.log('Инициализация скрипта mailing_copy_buttons.js')

// Проверяем, содержит ли URL подстроку /notifications/control/mailings/update
if (window.location.pathname.includes('/notifications/control/mailings/update')) {
    // Находим целевой контейнер
    const targetContainer = document.querySelector('#yw0');

    // Проверяем высоту контейнера
    if (targetContainer && targetContainer.offsetHeight > 1200) {
        // Находим div с классом buttons
        const buttonsDiv = document.querySelector('.buttons');

        // Проверяем, существует ли buttonsDiv
        if (buttonsDiv) {
            // Клонируем div со всем содержимым
            const clonedDiv = buttonsDiv.cloneNode(true);

            // Удаляем все теги <br> из скопированного div
            clonedDiv.querySelectorAll('br').forEach(br => br.remove());

            // Удаляем старый класс buttons и добавляем buttons_copy
            clonedDiv.classList.remove('buttons');
            clonedDiv.classList.add('buttons_copy');

            // Добавляем стили для прилипания к верхней части экрана и выравнивания по правому краю
            clonedDiv.style.marginTop = '10px';
            clonedDiv.style.position = 'fixed';
            clonedDiv.style.top = '0px';
            clonedDiv.style.right = '10px';
            clonedDiv.style.left = 'auto'; // Убираем left для корректного выравнивания
            clonedDiv.style.width = '39%';
            clonedDiv.style.backgroundColor = '#fff'; // Фон для предотвращения просвечивания
            clonedDiv.style.zIndex = '1000'; // Поверх других элементов
            clonedDiv.style.padding = '10px'; // Отступ для эстетики
            clonedDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'; // Тень для визуального отделения

            // Обрабатываем уникальные ID, чтобы избежать конфликтов
            clonedDiv.querySelectorAll('[id]').forEach(element => {
                element.id = element.id + '_copy';
            });

            // Привязываем события к скопированной кнопке btn-save-mailing с использованием jQuery
            const $clonedSaveButton = $(clonedDiv).find('.btn-save-mailing');
            $clonedSaveButton.on('click', function() {
                clickedButton = $(this).attr('name');
            });
            $clonedSaveButton.on('mouseover', function() {
                allowRedirect = true;
            });

            // Вставляем копию в начало targetContainer
            targetContainer.insertBefore(clonedDiv, targetContainer.firstChild);
        } else {
            console.error('Элемент с классом buttons не найден');
        }
    } else {
        console.error('Контейнер #yw0 не найден или его высота не превышает 1200 пикселей');
    }
}
