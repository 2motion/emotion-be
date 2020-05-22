const path = require('path');
const fs = require('fs');

(() => {
  const envPath = path.resolve(__dirname, '.env');
  const envTemplatePath = path.resolve(__dirname, '.env.template');
  const envTemplate = fs.readFileSync(envTemplatePath, {encoding: 'utf-8'});
  const templateLines = envTemplate.split(/\r?\n/);
  let env = "";

  for (let i = 0; i < templateLines.length; i++) {
    const [name, placeholder] = templateLines[i].split('=');
    if (!process.env[name]) {
      continue;
    }

    env += `${name}=${process.env[name]}\n`;
  }

  fs.writeFileSync(envPath, env);
})();