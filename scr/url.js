$(document).ready(function(){
    var currentUrl = window.location.href;

    // Находим все textarea внутри элементов с классом URL
    var textAreaFields = $('.URL textarea');

    // Проверяем, найдены ли поля
    if (textAreaFields.length) {
        textAreaFields.each(function() {
            $(this).val(currentUrl);
        });
    } else {
    }
});
