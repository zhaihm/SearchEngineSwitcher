// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'get_keyword') {
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        var elem = document.getElementById('kw') // baidu
                    || document.getElementById('sb_form_q') // bing
                    || document.getElementById('lst-ib') // google
                    || document.getElementsByName('q')[1] // stackoverflow's big search box
                    || document.getElementsByName('q')[0] // stackoverflow's small search box or github
                    || document.getElementById('SearchTextBox') // msdn
                    ;
        sendResponse(elem.value);
    }
});
