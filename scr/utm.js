$(document).ready(function(){
    // Массив UTM параметров для обработки
    var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    
    // Обрабатываем каждый UTM параметр
    utmParams.forEach(function(param) {
        var regex = new RegExp('[\\?&]' + param + '=([^&#]+)');
        var match = regex.exec(window.location.href);
        if (match && match.length) {
            $('.' + param + ' input').val(decodeURIComponent(match[1]));
        }
    });
});
