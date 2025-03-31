import { KokoroTTS } from "kokoro-js";
const model_id = "onnx-community/Kokoro-82M-v1.0-ONNX";

const tts = await KokoroTTS.from_pretrained(model_id, {
  dtype: "fp32", device: "webgpu",
});

const voicesSelect = document.querySelector<HTMLSelectElement>("#tts #voices");
const app = document.querySelector<HTMLDivElement>("#tts");

function populateVoices() {
  const voices = tts.voices
  const selectOptionHTML = Object.entries(voices).map(([key, value]) => `<option value="${key}" ${key === 'bm_george' ? 'selected' : ''}>${value.name} ${value.traits ? `- ${value.traits}` : ""}</option>`).join("");
  console.log(selectOptionHTML);
  voicesSelect.innerHTML = selectOptionHTML;
}

populateVoices();
const text = app?.querySelector<HTMLTextAreaElement>("#text")?.value;
const audioElement = app?.querySelector<HTMLAudioElement>("#audio");
const stats = app?.querySelector<HTMLParagraphElement>(".stats");


async function generate() {
  stats.textContent = "Generating...";
  const start = performance.now();
  const audio = await tts.generate(text, {
    voice: voicesSelect?.value || "af_heart",
  });
  const end = performance.now();
  const blob = audio.toBlob();
  const url = URL.createObjectURL(blob);

  stats.textContent = `Done in ~${Math.round((end - start) / 1000)}s`;
  audioElement.src = url;
  audioElement.play();
}

const generateButton = app?.querySelector<HTMLButtonElement>("#generate");
generateButton?.addEventListener("click", generate);

