import { pipeline } from '@huggingface/transformers';

// Create a translation pipeline
const translator = await pipeline('translation', 'Xenova/nllb-200-distilled-600M', {
  device: 'cpu',
  dtype: 'fp32'
});

const output = await translator(`Hey everyone! My name is Wes Bos. I'm translating this from english to french and then back to english`, {
  src_lang: 'eng_Latn',
  tgt_lang: 'fra_Latn',
});

console.log(output);

// then back to english
const output2 = await translator(output.at(0)?.translation_text, {
  src_lang: 'fra_Latn',
  tgt_lang: 'eng_Latn',
});

console.log(output2);
