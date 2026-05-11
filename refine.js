const fs = require('fs');
const https = require('https');

const html = fs.readFileSync('index.html', 'utf8');

const prompt = 'You are an expert web developer refining a trading command centre web app called TradingWithPurpose. Here is the current index.html:\n\n' + html + '\n\nYour job is to improve this file. PRIORITY 1 - FIX THE TABS: The app has 6 tabs. Tab switching uses onclick handlers calling switchTab() function. Tabs are NOT working. Fix by ensuring all functions are globally accessible - use type="text/javascript" on the script tag and attach event listeners after DOM loads. PRIORITY 2 - Fix up to 3 additional bugs or UX improvements. RULES: Return ONLY the complete improved HTML file. No markdown, no code blocks, no explanation. Keep dark theme, IBM Plex Mono font, localStorage functionality and TRADINGWITHPURPOSE branding intact.';

const payload = JSON.stringify({
  model: 'qwen/qwen-2.5-coder-32b-instruct',
  max_tokens: 16000,
  messages: [{ role: 'user', content: prompt }]
});

const options = {
  hostname: 'openrouter.ai',
  path: '/api/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
    'HTTP-Referer': 'https://github.com/HamzahParkar/Command-Centre',
    'X-Title': 'TradingWithPurpose Command Centre'
  }
};

const req = https.request(options, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      if (!response.choices || !response.choices[0]) {
        console.error('Unexpected response:', JSON.stringify(response));
        process.exit(1);
      }
      let improved = response.choices[0].message.content.trim();
      if (improved.startsWith('```html')) {
        improved = improved.replace(/^```html\n?/, '').replace(/\n?```$/, '');
      } else if (improved.startsWith('```')) {
        improved = improved.replace(/^```\n?/, '').replace(/\n?```$/, '');
      }
      if (!improved.includes('<!DOCTYPE html>') && !improved.includes('<html')) {
        console.error('Response does not look like valid HTML');
        process.exit(1);
      }
      fs.writeFileSync('index.html', improved);
      console.log('Refinement complete');
    } catch (err) {
      console.error('Failed:', err);
      process.exit(1);
    }
  });
});

req.on('error', err => { console.error(err); process.exit(1); });
req.write(payload);
req.end();