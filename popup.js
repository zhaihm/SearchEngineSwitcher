
document.addEventListener('DOMContentLoaded', function() {
    var elems = document.getElementsByTagName('img');
    for (var i = 0; i < elems.length; i++) {
        elems[i].addEventListener('click', function (event) {
            chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {text: 'get_keyword'}, function(keyword) {
                    // Url examples
                    //https://www.google.com/#q=content+script
                    //http://www.bing.com/search?q=content+script
                    //http://www.baidu.com/s?wd=content%20script
                    //http://stackoverflow.com/search?q=content+script
                    //https://github.com/search?q=visual+studio
                    //https://social.msdn.microsoft.com/Search/en-US?query=content%20script
                    keyword_list = keyword ? keyword.split(' ') : [];
                    for (var i = 0; i < keyword_list.length; i++) {
                        keyword_list[i] = encodeURIComponent(keyword_list[i]); // encode '+' and '%'
                    };
                    if (keyword_list.length == 0) {
                        keyword_list = getKeywordsFromUrl(tabs[0].url);
                        console.log(keyword_list);
                    }

                    switch (event.target.getAttribute('type')) {
                    case 'google':
                        chrome.tabs.update({url: keyword_list ? 'https://www.google.com/#q=' + keyword_list.join('+')
                                                              : 'https://www.google.com/'});
                        break;
                    case 'bing':
                        chrome.tabs.update({url: keyword_list ? 'http://www.bing.com/search?q=' + keyword_list.join('+')
                                                              : 'http://www.bing.com/'});
                        break;
                    case 'baidu':
                        chrome.tabs.update({url: keyword_list ? 'http://www.baidu.com/s?wd=' + keyword_list.join('%20')
                                                              : 'http://www.baidu.com/'});
                        break;
                    case 'stackoverflow':
                        chrome.tabs.update({url: keyword_list ? 'http://stackoverflow.com/search?q=' + keyword_list.join('+')
                                                              : 'http://stackoverflow.com/'});
                        break;
                    case 'github':
                        chrome.tabs.update({url: keyword_list ? 'https://github.com/search?q=' + keyword_list.join('+')
                                                              : 'https://github.com/'});
                        break;
                    case 'msdn':
                        chrome.tabs.update({url: keyword_list ? 'https://social.msdn.microsoft.com/Search/en-US?query=' + keyword_list.join('%20')
                                                              : 'https://social.msdn.microsoft.com/'});
                        break;
                    default:
                        console.error('unsupported search type');
                        break;
                    }
                });
            });
        });
    };
});

function getKeywordsFromUrl(url) {
    var begstr, ibeg, iend, spliter;

    var url_parsed = purl(url);
    var domain = url_parsed.attr('host');
    console.log("hostname=" + domain);

    if (domain.indexOf('google') != -1
        || domain.indexOf('bing') != -1
        || domain.indexOf('stackoverflow') != -1
        || domain.indexOf('github') != -1) {
        begstr = 'q=';
        spliter = '+';
    } else if (domain.indexOf('baidu') != -1) {
        begstr = 'wd=';
        spliter = '%20';
    } else if (domain.indexOf('msdn') != -1) {
        begstr = 'query=';
        spliter = '%20';
    } else {
        return [];
    }

    ibeg = url.indexOf(begstr) + begstr.length;
    if (ibeg == -1) {
        return [];
    }
    iend = url.indexOf('&', ibeg);

    var kwstr = (iend == -1)
                ? url.substr(ibeg)
                : url.substr(ibeg, iend - ibeg);
    console.log(begstr, ibeg, iend, spliter, kwstr);
    return kwstr.split(spliter);
}
