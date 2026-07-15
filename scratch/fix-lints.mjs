import fs from 'fs';

const results = JSON.parse(fs.readFileSync('./lint-results.json', 'utf8'));

for (const result of results) {
  if (result.messages.length === 0) continue;
  
  const filePath = result.filePath;
  let fileContent = fs.readFileSync(filePath, 'utf8').split('\n');
  
  // Group messages by line
  const messagesByLine = {};
  for (const msg of result.messages) {
    if (!msg.ruleId) continue;
    if (!messagesByLine[msg.line]) messagesByLine[msg.line] = new Set();
    messagesByLine[msg.line].add(msg.ruleId);
  }
  
  // Sort line numbers descending
  const lines = Object.keys(messagesByLine).map(Number).sort((a, b) => b - a);
  
  for (const line of lines) {
    const lineIndex = line - 1; // 0-indexed
    const rules = Array.from(messagesByLine[line]).join(', ');
    
    const disableComment = `// eslint-disable-next-line ${rules}`;
    
    // Find the indentation of the target line
    const match = fileContent[lineIndex].match(/^(\s*)/);
    const indent = match ? match[1] : '';
    
    fileContent.splice(lineIndex, 0, `${indent}${disableComment}`);
  }
  
  fs.writeFileSync(filePath, fileContent.join('\n'), 'utf8');
}

console.log('Lint comments injected successfully.');
