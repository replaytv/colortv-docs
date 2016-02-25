'use strict';

$(document).ready(() => {

    let userID = getUrlParameter('id');

    $('a').each((i, elem) => {
        elem = $(elem);
        let newURL = `${elem.attr('href')}?id=${userID}`;
        elem.attr('href', newURL);

    });
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
        $('.initialPart').css('display', 'none');
        $('.helpfulSectionLabel').css('display', 'none');
        $('.helpfulSectionWhyNot').css('display', 'block');
        setTimeout(() => {
            $('.helpfulSectionWhyNot').css('opacity', '1');
        });
    });

    $('#yesHelpSectionButton').on('click', (e) => {
        $('.initialPart').css('display', 'none');
        $('.helpfulSectionLabel').css('display', 'none');
        $('.helpfulSectionThanks').css('display', 'block');
        setTimeout(() => {
            $('.helpfulSectionThanks').css('opacity', '1');
        });
        let userID = getUrlParameter('id');
        sendDataToServer(userID, getCurrentSection(), true);
    });

    $('#opinionSubmit').on('click', (e) => {

        let textarea = $('.helpful textarea');
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
        let userID = getUrlParameter('id');
        sendDataToServer(userID, getCurrentSection(), false, opinion);
    });
});

// Get rid of / for example /section/
function getCurrentSection() {
    return replaceAll(window.location.pathname, "/", " ").trim();
}
function sendDataToServer(userID, section, isHelpful, description) {

    //section = section || 'getting started';
    //console.log('USERID', userID);
    //console.log('section', section);
    //console.log('isHelpful', isHelpful);
    //console.log('Description', description);

    $.ajax({
        url: 'https://api.colortv.com/',
        type: 'GET',
        crossDomain: true,
        success: (resp,b,details) => {
            let status = details.status;
            console.log(status);
        },
        error: function () {
            alert('Failed!');
        }
    });


}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
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