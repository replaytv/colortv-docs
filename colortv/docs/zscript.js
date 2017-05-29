'use strict';

function inIframe () {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

$(document).ready(() => {

    var pathname = window.location.pathname;
    var pathArray = pathname.split('/');
    var lastUrlSegment = pathArray[pathArray.length - 2];


    switch (lastUrlSegment) {
      case 'tvOsSdk':
        $('.button-github a').attr('href', 'https://github.com/replaytv/Color-tvOS-SDK');
        break;

      case 'unityTVOS':
        $('.button-github a').attr('href', 'https://bintray.com/colortv/unity-plugin/unity-plugin/view');
        break;

      case 'unityAndroidTV':
        $('.button-github a').attr('href', 'https://bintray.com/colortv/unity-plugin/unity-plugin/view');
        break;

      default:
        $('.button-github a').attr('href', 'https://github.com/color-tv')
    }

    let userID = getUrlParameter('id');

    // run highlight

    if (inIframe ()) {
      $('.header').addClass('in-frame');
    }


    $('pre code').each(function (i, block) {
      hljs.highlightBlock(block);
    });

    $('li a').each((i, elem) => {
        elem = $(elem);
        if (!elem.parent().hasClass("anchor")) {
            let newURL = `${elem.attr('href')}?id=${userID}`;
            elem.attr('href', newURL);
        }
    });

    $(window).on('scroll', function () {
        if($(window).scrollTop() > 1) {
            $('.header').addClass('scrolled')
        } else {
            $('.header').removeClass('scrolled')
        }
    });


    createSingleAndMultilanguageCodeBlocksWithButtons();

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

// I dedicate all this code, all my work, to my girlfriend, Magda, who will
// have to support me and our dog once it gets
// released into the public.
function createSingleAndMultilanguageCodeBlocksWithButtons() {
    let nextElement = $('.article .wrapper');
    let childrens = nextElement.children();

    for (let i = 0; i < childrens.length - 1; i++) {
        //reference to actual element in DOM
        let actual = $(childrens[i]);
        // filter to only blocks of code
        if (actual.is('pre')) {

            // we need to take all trailing code block
            // run loop until last element is code block. Then just check size of array
            let codeBlockMembers = [actual];

            for (let u = i; u < childrens.length - 1; u++) {
                // if next element is code block
                if ($(childrens[u + 1]).is('pre')) {
                    codeBlockMembers.push($(childrens[u + 1]));
                } else {
                    break;
                }
            }
            // omit elements that are already wrapped as code block
            i += codeBlockMembers.length - 1;
            // if we got two blocks of code next to each other
            if (codeBlockMembers.length > 1) {
                let multiLanguageWrapperHTML = `<div class="multiLanguageBlock"></div>`;
                // wrap all code blocks into one holder
                /**
                 * Dear maintainer:

                 Once you are done trying to 'optimize' this function,
                 and have realized what a terrible mistake that was,
                 please increment the following counter as a warning
                 to the next guy:

                 total_hours_wasted_here = 2
                 */
                switch (codeBlockMembers.length) {
                    case 0:
                        codeBlockMembers[0]
                            .wrapAll(multiLanguageWrapperHTML);
                        break;
                    case 1:
                        codeBlockMembers[0]
                            .add(codeBlockMembers[1])
                            .wrapAll(multiLanguageWrapperHTML);
                        break;
                    case 2:
                        codeBlockMembers[0]
                            .add(codeBlockMembers[1])
                            .add(codeBlockMembers[2])
                            .wrapAll(multiLanguageWrapperHTML);
                        break;
                    case 3:
                        codeBlockMembers[0]
                            .add(codeBlockMembers[1])
                            .add(codeBlockMembers[2])
                            .add(codeBlockMembers[3])
                            .wrapAll(multiLanguageWrapperHTML);
                        break;
                    case 4:
                        codeBlockMembers[0]
                            .add(codeBlockMembers[1])
                            .add(codeBlockMembers[2])
                            .add(codeBlockMembers[3])
                            .add(codeBlockMembers[4])
                            .wrapAll(multiLanguageWrapperHTML);
                        break;
                }
                // append button container for specific language button
                actual.parent().append(`<div class="buttonContainer"></div>`);
                // reference for button holder element
                let buttonContainer = $(actual.parent().children('.buttonContainer'));
                // add buttons to button holder
                codeBlockMembers.forEach((item) => {
                    let lang = detectLanguage(item.children().attr('class'));
                    buttonContainer.append(`<div class="buttonWhiteWithHover multiLangButton">${lang}</div>`);
                });

                let selectedBtn = 0;
                // add click events to show/hide codeBlocks
                buttonContainer.children().each((nr, obj) => {
                    $(obj).click(() => {
                        //hide all code blocks
                        codeBlockMembers.forEach((item) => {
                            $(item).css('display', 'none');
                        });
                        // display wanted block
                        codeBlockMembers[nr].css('display', 'block');
                        // change selected button colors
                        $(buttonContainer.children()[selectedBtn]).removeClass('activeUser');
                        selectedBtn = nr;
                        $(buttonContainer.children()[selectedBtn]).addClass('activeUser');
                        $(obj).hover();
                    });
                });
                initializeMultilanguageCodeBlock(codeBlockMembers, buttonContainer);


            }
            //// we got only one block of code. Just add button under block
            else {
                actual.wrap(`<div class="codeBlock"></div>`);
                let lang = detectLanguage(actual.children().attr('class'));
                actual.parent().append(`<div class="codeButton buttonStyle">${lang}</div>`);
            }
        }
    }
}
/**
 * After creating multilanguage code blocks displays first one and appropiate button
 * @param codeBlockMembers
 * @param buttonContainer
 */
function initializeMultilanguageCodeBlock(codeBlockMembers, buttonContainer) {
    //at the beggining hide all code blocks except for first one
    codeBlockMembers.forEach((item) => {
        $(item).css('display', 'none');
    });
    // display first code block
    codeBlockMembers[0].css('display', 'block');
    $(buttonContainer.children()[0]).addClass('activeUser');
}
/**
 * Return current section
 * @returns {String}
 */
function getCurrentSection() {
    return replaceAll(window.location.pathname, "/", " ").trim();
}
/**
 * Function send to specified serwer opinion about section
 * @param userID
 * @param section
 * @param isHelpful
 * @param description
 */
function sendDataToServer(userID, section, isHelpful, description) {
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
/**
 * Detects in which language block of code is written in.
 * @param classes
 * @returns {*}
 */
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
            case 'language-html':
                lang = 'HTML';
                break;
        }
    });
    return lang;
}