# Deep Learning

A beginner-friendly educational website by **Dr. Chi-Ning (Nick) Chang** introducing neural networks through illustrated explanations, guided diagrams, and selected interactive demonstrations. It is designed for use across courses and does not require programming knowledge.

## Website

**[Open the Deep Learning website](https://chiningchang.github.io/Deep-Learning/)**

## Explore the chapters

| Chapter | What learners explore |
| --- | --- |
| **Artificial Neural Networks (ANN)** | Layers, weights, biases, activation functions, and learning from prediction errors. Includes a step-by-step animation of weight and bias updates and a small trainable network. |
| **Convolutional Neural Networks (CNN)** | A cat-image classification diagram, explained through input, convolution, pooling, fully connected layers, and output. |
| **Recurrent Neural Networks (RNN)** | How information passes through a sequence, plus an illustrated explanation of vanishing gradients. |
| **Long Short-Term Memory (LSTM)** | How forget, input, and output gates help manage information over time. |
| **Transformer and Generative AI** | The original encoder–decoder architecture, attention, text generation, GPT and BERT, prompting, and learning from human feedback. |

The overview is in [`index.html`](index.html). Each chapter has its own page and navigation links.

## Teaching features

- Original instructional diagrams with numbered, clickable explanations and previous/next controls.
- Redrawn CNN, RNN, LSTM, and Transformer animations with synchronized explanations, Play/Pause, and Replay controls. Each step lasts about eight seconds.
- Short **In plain language** notes explaining technical terms near the relevant material.
- A prominent introduction to Vaswani et al. (2017), *Attention Is All You Need*, with links to the original publication.
- A black, white, and gold design inspired by VCU’s color palette.
- Responsive layouts, descriptive image text, and native buttons that support keyboard interaction.
- Full-size image links for projection or closer reading.

The ANN demonstrations calculate their displayed results in the browser. The other chapters emphasize conceptual explanations of the supplied diagrams. Illustrative examples are labeled; the site does not connect to an external AI service or submit learner responses.

## Run locally

No installation, build process, API key, or backend is required.

1. Download or clone this repository.
2. Open `index.html` in a browser.

You can also serve the folder locally:

```bash
git clone https://github.com/chiningchang/Deep-Learning.git
cd Deep-Learning
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Host with GitHub Pages

The files are arranged for static hosting from the repository root.

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main** and **/ (root)**, then save.
4. Wait for GitHub Pages to finish publishing.

The project’s GitHub Pages address is [https://chiningchang.github.io/Deep-Learning/](https://chiningchang.github.io/Deep-Learning/).

All chapter, script, stylesheet, and image references use relative paths so they work under the `/Deep-Learning/` project path. The `.nojekyll` file allows the static files to be served without Jekyll processing.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Website overview and chapter navigation |
| `ann.html` | ANN lesson and interactive activities |
| `cnn.html`, `rnn.html`, `lstm.html` | Illustrated architecture lessons |
| `transformer.html` | Transformer and generative AI lesson |
| `style.css` | Shared styling and responsive layouts |
| `app.js` | ANN structure, neuron, and activation-function activities |
| `animation.js` | Forward pass, comparison, backpropagation, and parameter-update animation |
| `training.js` | Small browser-based ANN training demonstration |
| `concept-animations.js`, `concept-animations.css` | Shared conceptual animations and step-synchronized captions |
| `diagram-guide.js` | Numbered diagram explanations and navigation |
| `assets/` | Instructional figures |
| `CREDITS.md` | Teaching-material and figure attributions |

## Maintain or extend the site

Edit the chapter HTML files to revise explanations. Keep IDs used by the ANN scripts when editing its interactive sections.

Guided figures contain an `application/json` block with their explanations. The `data-spot-index` values on numbered markers and text buttons match that block’s item order. Marker positions are percentages of the image area, so they remain aligned as the image resizes.

Animation captions and timing are in the `configs` object in `concept-animations.js`. The animations are conceptual illustrations, not trained models or computed feature maps. They start only when Play is pressed and respect reduced-motion preferences.

To add another chapter, create an HTML page, use the shared stylesheet, and add it to the chapter navigation on every page and the overview. Preserve the original diagrams’ attributions when updating or replacing images.

## Sources and acknowledgments

Teaching content draws on Dr. Chang’s neural-network course materials. The site uses adapted instructional figures from published work and educational resources; individual figure captions retain source links. See [`CREDITS.md`](CREDITS.md) for details. Third-party figures retain their respective source attributions and rights.
