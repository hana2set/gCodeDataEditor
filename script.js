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

    const parts = line.trim().split(/\s+/); // 공백 기준 분할
    const modifiedParts = parts.map(part => {
      const axis = part[0].toUpperCase();
      const value = parseFloat(part.slice(1));

      if (fields.includes(axis) && !isNaN(value)) {
        const offset = offsets[axis] || 0;
        const newValue = (value + offset).toFixed(3);
        return `${axis}${newValue}`;
      }

      return part; // 변경 없는 항목
    });

    result.push(modifiedParts.join(' '));
  }

  return result.join('\n');
}
