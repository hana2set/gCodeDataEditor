function convert() {
    const input = document.getElementById('input').value;
    const offsets = {
        X: parseFloat(document.getElementById('offsetX').value) || 0,
        Y: parseFloat(document.getElementById('offsetY').value) || 0,
        Z: parseFloat(document.getElementById('offsetZ').value) || 0,
    };
    const output = processGCode(input, offsets);
    document.getElementById('output').value = output;
}

function processGCode(input, offsets = {}) {
  const lines = input.split('\n');
  const result = [];

  const fields = Object.keys(offsets).map(k => k.toUpperCase());

  for (const line of lines) {
    if (line.startsWith(';') || 
        !line.startsWith('G')) {
      result.push(line);
      continue;
    }

    let isItNotMain = false;

    const parts = line.trim().split(/\s+/); // 공백 기준 분할
    const modifiedParts = [];
    for (const part of parts) {
        if (part.startsWith(";")) {
            isItNotMain = true;
            break;
        }
        modifiedParts.push(modifyPos(part));
    }


    if (isItNotMain) {
        result.push(line);
    } else {
        result.push(modifiedParts.join(' '));
    }
  }

  return result.join('\n');


  function modifyPos(part) {
        const axis = part[0].toUpperCase();
        const value = parseFloat(part.slice(1));

        if (fields.includes(axis) && !isNaN(value)) {
            const offset = offsets[axis] || 0;
            const newValue = value + offset;
            return `${axis}${newValue}`;
        }

        return part; // 변경 없는 항목
  }
}
