function processGCode(input) {
  const lines = input.split('\n');
  const result = [];

  for (const line of lines) {
    if (line.startsWith(';TYPE:')) {
      result.push(line); // 주석 라인 그대로 유지
      continue;
    }

    // 정규식으로 X 좌표 찾고 +10 적용
    const modifiedLine = line.replace(/X([-+]?[0-9]*\.?[0-9]+)/g, (_, x) => {
      const newX = (parseFloat(x) + 10).toFixed(3);
      return `X${newX}`;
    });

    result.push(modifiedLine);
  }

  return result.join('\n');
}
