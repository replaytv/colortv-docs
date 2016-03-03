'use strict';

$(document).ready(() => {

    let userID = getUrlParameter('id');

    $('li a').each((i, elem) => {
        elem = $(elem);
        if (!elem.parent().hasClass("anchor")) {
            let newURL = `${elem.attr('href')}?id=${userID}`;
            elem.attr('href', newURL);
        }
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
        hideInitialPart();
        showTextArea();
    });

    $('#yesHelpSectionButton').on('click', (e) => {
        let userID = getUrlParameter('id');
        sendDataToServer(userID, getCurrentSection(), true);
    });

    $('#opinionSubmit').on('click', (e) => {

        let textarea = $('.helpful textarea');
        // check if there is minimal number of characters
        if (textarea.val().length < 10) {
            showTextAreaError();
            return;
        }
        let opinion = textarea.val();
        // hide textarea and show thanks
        hideTextArea();
        showThanksSection();
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
    if (userID === undefined) {
        console.error("User ID not found");
    }
    $.ajax({
        url: 'https://api.colortv.com/',
        type: 'GET',
        crossDomain: true,
        success: (resp, b, details) => {
            let status = details.status;
            hideInitialPart();
            (status >= 400) ? showError() : showThanksSection();
        },
        error: function () {
            alert('Failed!');
        }
    });


}
function showTextAreaError() {
    let selector = $('.helpful .helpfulSectionWhyNotTextAreaError');
    selector.css('display', 'block');
    setTimeout(() => {
        selector.css('opacity', '1');
    });
}
function showError() {
    let selector = $('.helpful .helpfulSectionError');
    selector.css('display', 'block');
    setTimeout(() => {
        selector.css('opacity', '1');
    });
}
function hideError() {
    let selector = $('.helpful .helpfulSectionError');
    selector.css('opacity', '0');
    setTimeout(() => {
        selector.css('display', 'none');
    }, 1000);
}
function showTextArea() {
    $('.helpfulSectionWhyNot').css('display', 'block');
    setTimeout(() => {
        $('.helpfulSectionWhyNot').css('opacity', '1');
    });
}
function hideTextArea() {
    $('.helpfulSectionWhyNot').css('opacity', '0');
    setTimeout(() => {
        $('.helpfulSectionWhyNot').css('display', 'none');
    }, 1000);
}
function hideInitialPart() {
    $('.initialPart').css('display', 'none');
}
function showThanksSection() {
    $('.helpfulSectionThanks').css('display', 'block');
    setTimeout(() => {
        $('.helpfulSectionThanks').css('opacity', '1');
    });
}
function hideThanksSection() {
    $('.helpfulSectionThanks').css('opacity', '0');
    setTimeout(() => {
        $('.helpfulSectionThanks').css('display', 'none');
    }, 1000);
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
        item = item.toLowerCase();
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
            case 'language-javascript':
                lang = 'JavaScript';
                break;
            case 'language-swift':
                lang = 'Swift';
                break;
            case 'language-objective-c':
                lang = 'Objective-C';
                break;
            case 'nginx':
                lang = 'Nginx';
                break;
        }
    });
    return lang;
}