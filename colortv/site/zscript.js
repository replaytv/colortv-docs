'use strict';

$(document).ready(() => {
    // run highlight
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
        // add block with language under block of code
        let classes = $(block).attr('class');
        let lang = detectLanguage(classes);
        $(block).parent().wrap(`<div class="codeBlock"></div>`);
        $(block).parent().parent().append(`<div class="codeButton buttonStyle">${lang}</div>`);
    });


    $('#noHelpSectionButton').on('click', (e) => {
        $('.helpfulSectionButtonBlock').css('display', 'none');
        $('.helpfulSectionLabel').css('display', 'none');
        $('.helpfulSectionWhyNot').css('display', 'block');
        setTimeout(() => {
            $('.helpfulSectionWhyNot').css('opacity', '1');
        });
    });
    $('#yesHelpSectionButton').on('click', (e) => {

        $('.helpfulSectionButtonBlock').css('display', 'none');
        $('.helpfulSectionLabel').css('display', 'none');
        $('.helpfulSectionThanks').css('display', 'block');
        setTimeout(() => {
            $('.helpfulSectionThanks').css('opacity', '1');
        });
    });

    $('#opinionSubmit').on('click', (e) => {

        let textarea = $('.helpful textarea');
        // Get rid of / for example /section/
        let section = replaceAll(window.location.pathname, "/", " ").trim();
        // check if there is minimal number of characters
        if (textarea.val().length < 10) {
            $('.helpful .helpfulSectionWhyNotTextAreaError').css('display', 'block');
            return;
        }
        let opinion = textarea.val();
        // hide textarea and show thanks
        $('.helpful .helpfulSectionWhyNot').css('display', 'none');
        $('.helpful .helpfulSectionThanks').css('display', 'block');
        // for opacity transition
        setTimeout(() => {
            $('.helpful .helpfulSectionThanks').css('opacity', '1');
        });
        sendDataToServer();
    });
});
function getDataUserIdFromURL() {

}

function sendDataToServer() {

}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function detectLanguage(classes) {
    "use strict";
    classes = classes.split(" ");
    let lang;
    classes.forEach((item) => {
        switch (item) {
            case 'language-objectivec':
                lang = 'Objective-C';
                break;
            case 'language-objc':
                lang = 'Objective-C';
                break;
            case 'language-csharp':
                lang = 'C#';
                break;
            case 'language-groovy':
                lang = 'Groovy';
                break;
            case 'language-java':
                lang = 'Java';
                break;
            case 'language-xml':
                lang = 'XML';
                break;
        }
    });
    return lang;
}