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


  // 내부 함수
  function modifyPos(part) {
        const axis = part[0].toUpperCase();
        const value = parseFloat(part.slice(1));

        if (fields.includes(axis) && !isNaN(value)) {
            const offset = offsets[axis] || 0;
            const newValue = Number((value + offset).toFixed(3));
            return `${axis}${newValue}`;
        }

        return part;
  }
}


function copy() {
    convert();
    setTimeout(() => {
        navigator.clipboard.writeText(document.getElementById("output").value);
        alert("복사되었습니다.");
    });
}


// 이벤트 영역
{
    const inputArea = document.getElementById('input');
    const overlay = document.getElementById('overlay');
    
    // 파일 Drag 이벤트트
    ['dragenter', 'dragover'].forEach(eventName => {
    inputArea.addEventListener(eventName, e => {
        e.preventDefault();
        overlay.style.display = 'flex';
    }, false);
    });


    ['dragleave', 'drop'].forEach(eventName => {
    inputArea.addEventListener(eventName, e => {
        e.preventDefault();
        overlay.style.display = 'none';
    }, false);
    });


    inputArea.addEventListener("drop", (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
            const reader = new FileReader();
            reader.onload = function(evt) {
                inputArea.value = evt.target.result;
            };
            reader.onerror = function() {
                alert("파일을 읽는 도중 오류가 발생했습니다.");
            };

            reader.readAsText(file);
    });



}