import { pipeline } from '@huggingface/transformers';

async function generateCaptions() {
  // Initialize the captioner
  const captioner = await pipeline('image-to-text', 'Xenova/vit-gpt2-image-captioning', {
    device: 'wasm',
  });

  // const caption = await captioner()

  // Get all image elements
  const imageContainers = document.querySelectorAll('.image');

  // Process each image
  for (const container of imageContainers) {
    const img = container.querySelector('img');
    const captionElement = container.querySelector('.caption');

    if (img && captionElement) {
      try {
        // Get the image URL
        const imageUrl = img.src;

        // Generate caption
        const start = performance.now();
        const output = await captioner(imageUrl);
        const end = performance.now();
        console.log(`Caption generation took ${end - start}ms`);

        // Update the caption text
        // The model typically returns an array with the first element containing the caption
        const generatedText = Array.isArray(output) ? output[0].generated_text : output.generated_text;
        captionElement.textContent = `${generatedText} (${Math.round(end - start)}ms)`;
      } catch (error) {
        console.error('Error generating caption:', error);
        captionElement.textContent = 'Error generating caption';
      }
    }
  }
}

// Wait for the DOM to be loaded before running
document.addEventListener('DOMContentLoaded', () => {
  generateCaptions();
});
