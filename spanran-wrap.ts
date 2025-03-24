const titles = document.querySelectorAll<HTMLHeadingElement>('h1, h2');

const wordSegmenter = new Intl.Segmenter([], { granularity: 'word' });
const letterSegmenter = new Intl.Segmenter([], { granularity: 'grapheme' });


function getRandomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function wrapLettersInSpans(title: HTMLHeadingElement) {
  const text = title.innerText;
  const wordsSegments = Array.from(wordSegmenter.segment(text));
  title.innerHTML = '';
  for(const wordSegment of wordsSegments) {
    const word = wordSegment.segment;
    const wordSpan = document.createElement('span');
    wordSpan.classList.add(wordSegment.isWordLike ? 'word' : wordSegment.segment === ' ' ? 'space' : 'punctuation');
    // wrap each word's letters
    const lettersSegments = Array.from(letterSegmenter.segment(word));
    for(const letterSegment of lettersSegments) {
      const letter = letterSegment.segment;
      const letterSpan = document.createElement('span');
      letterSpan.classList.add('letter');
      letterSpan.style.setProperty('--left', getRandomBetween(-10, 10) + 'deg');
      letterSpan.style.setProperty('--right', getRandomBetween(-10, 10) + 'deg');
      // letterSpan.style.setProperty('animation-delay', (Math.random() * 5) + 'ms');
      letterSpan.innerText = letter;
      wordSpan.appendChild(letterSpan);
    }
    title.appendChild(wordSpan);
  }
  // title.innerHTML = '';
  // for(const letter of text) {
  //   const span = document.createElement('span');
  //   span.classList.add('letter');
  //   const innerSpan = document.createElement('span');
  //   innerSpan.innerText = letter;
  //   span.appendChild(innerSpan);
  //   // span.style.display = 'inline-block';
  //   span.style.rotate = `${Math.random() * 10 - 5}deg`;
  //   title.appendChild(span);
  // }
}

// setInterval(() => {

for (const title of titles) {
  wrapLettersInSpans(title);
}

  // }, 500);
