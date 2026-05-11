const fs = require('fs');
const https = require('https');

const html = fs.readFileSync('index.html', 'utf8');

const claudeMd = fs.existsSync('CLAUDE.md') ? fs.readFileSync('CLAUDE.md', 'utf8') : '';

const prompt = 'You are an expert web developer. Read this project briefing carefully before making any changes:\n\n' + claudeMd + '\n\nHere is the current index.html:\n\n' + html + '\n\nFollow the briefing exactly. Fix the issues in priority order. Return ONLY the complete improved HTML file. No markdown, no code blocks, no explanation.';

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