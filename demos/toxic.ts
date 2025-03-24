import { pipeline } from "@huggingface/transformers";
let classifier = await pipeline(
  "text-classification",
  "Xenova/toxic-bert",
  {
    dtype: "fp32"
  }
);

function parseResult(result: { label: string, score: number }) {
  return `${result.label} ${Math.round(result.score * 100)}%`;
}

const sentences = [
  "if you code javascript, you are a bad person and you should feel bad",
  "I hate hot dogs",
  "I hate canadians",
  "i want to kill you",
  "i want to off you",
  "f you you little shite",
  "the french are the worst",
  "the french are the best",
  "I love you so much",
]


for (const sentence of sentences) {
  const start = performance.now();
  const result = await classifier(sentence, { top_k: 2 });
  const end = performance.now();
  console.log(`${sentence} (${Math.round(end - start)}ms)`);
  console.log(result.map(parseResult));
  console.log(`\n`);
}
