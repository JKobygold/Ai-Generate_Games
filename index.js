require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Load all base templates from disk at server start
const baseTemplates = {
  jumper: fs.readFileSync(path.join(__dirname, 'templates', 'jumper.html'), 'utf-8'),
  runner: fs.readFileSync(path.join(__dirname, 'templates', 'runner.html'), 'utf-8'),
  rpg:    fs.readFileSync(path.join(__dirname, 'templates', 'rpg.html'), 'utf-8'),
  heist:  fs.readFileSync(path.join(__dirname, 'templates', 'heist.html'), 'utf-8')
};

app.post('/api/create-game', async (req, res) => {
  const { description, userHtml, template } = req.body;
  if (!description && !userHtml) return res.status(400).send('No description or HTML provided.');

  const baseCode = baseTemplates[template] || baseTemplates.jumper;

  const generationPrompt = `
You are a creative HTML5 game developer AI.

The user has provided a game description${userHtml ? " and some starter HTML." : "."}
Your task is to create a complete, playable HTML5 game fully adapted to their description, using the base code library below as a foundation for logic, not content.

---

🎯 Goals:
- Maximize transformation of the base game to match the theme and style of the user’s description.
- Change character emojis, platforms, NPCs, items, and text to reflect the theme.
- Rewrite colors, background styles, object names, and any visual feedback accordingly.
- If the user provides HTML, incorporate and respect it, but prioritize the description.

---

📝 User Description:
${description || "(No description provided)"}

${userHtml ? `💻 User HTML:\n${userHtml}` : ''}

---

📚 Base Game Code Library:
${baseCode}

---

🛠 Functional Requirements:
- Keep the core game mechanics from the base (e.g., movement, gravity, score tracking) unless instructed otherwise.
- Use emoji-based visuals unless the user description implies something different.
- All code must be self-contained and valid as a single HTML5 file.

---

🚫 Output Rules:
- Do NOT output markdown, explanations, or code comments.
- Output only a complete and runnable HTML5 file.

Generate your adapted game below:
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert game developer who creates playable HTML5 games with emoji and canvas-based logic.'
        },
        { role: 'user', content: generationPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const htmlCode = response.choices[0].message.content;

    // Now generate the explanation
    const explanationPrompt = `
The following HTML game was generated from this user prompt:
"${description}"

Please explain:
- the game's genre
- how the gameplay works
- how it relates to the original prompt
- any clever design choices

Be brief and clear. Output plain text only. Here is the HTML:
${htmlCode}
`;

    const explainResponse = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: explanationPrompt }],
      temperature: 0.5,
      max_tokens: 300
    });

    const explanation = explainResponse.choices[0].message.content;

    res.json({ htmlCode, explanation });
  } catch (err) {
    console.error("Error generating game or explanation:", err);
    res.status(500).send('Error generating game');
  }
});

app.post('/api/validate-game', (req, res) => {
  const { htmlCode } = req.body;
  if (!htmlCode) return res.status(400).send('No HTML code provided.');
  res.json({ validatedHtml: htmlCode });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`🚀 Game generator running at http://localhost:${port}`);
});
