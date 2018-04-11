chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        var ualock = false;
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'x-ua-mark') {
                details.requestHeaders.splice(i, 1);
                ualock = true;
                break;
            }
        }
        if(ualock) {
            for (var i = 0; i < details.requestHeaders.length; ++i) {
                if (details.requestHeaders[i].name === 'User-Agent') {
                    var ua = "Mozilla/5.0 (Linux; Android 4.4.4; en-us; Nexus 4 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Mobile Safari/537.36";
                    details.requestHeaders[i].value = ua;
                    break;
                }
            }
        }
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ["*://m.iqiyi.com/*", "*://www.iqiyi.com/*"]},
    ["blocking", "requestHeaders"]);