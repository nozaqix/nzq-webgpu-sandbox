import { resolve } from 'path';
import { readFileSync } from 'fs';
import { defineConfig, Plugin } from 'vite';

const siteUrl = 'https://nzq-3dcg-showcase.pages.dev';

function ogpPlugin(): Plugin {
  const experiments: { slug: string; title: string; description: string; thumbnail: string }[] =
    JSON.parse(readFileSync(resolve(__dirname, 'experiments.json'), 'utf-8'));

  const bySlug = new Map(experiments.map((e) => [e.slug, e]));

  return {
    name: 'ogp-inject',
    transformIndexHtml: {
      order: 'pre',
      handler(_html, ctx) {
        const match = ctx.filename.match(/\/([^/]+)\/index\.html$/);
        const slug = match?.[1];
        const exp = slug ? bySlug.get(slug) : undefined;

        if (exp) {
          return [
            { tag: 'meta', attrs: { name: 'description', content: exp.description }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:title', content: `${exp.title} – nozaqi 3DCG showcase` }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:description', content: exp.description }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:image', content: `${siteUrl}/thumbnails/${exp.slug}.png` }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:url', content: `${siteUrl}/${exp.slug}/` }, injectTo: 'head' },
            { tag: 'meta', attrs: { property: 'og:type', content: 'article' }, injectTo: 'head' },
            { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
          ];
        }

        // Top page
        return [
          { tag: 'meta', attrs: { name: 'description', content: 'WebGPU / WebGL 3DCG experiments by nozaqi.' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:title', content: 'nozaqi 3DCG showcase' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:description', content: 'WebGPU / WebGL 3DCG experiments by nozaqi.' }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:image', content: `${siteUrl}/og-image.png` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${siteUrl}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:type', content: 'website' }, injectTo: 'head' },
          { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
        ];
      },
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [ogpPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'shoe-viewer': resolve(__dirname, 'shoe-viewer/index.html'),
        'particle-flow': resolve(__dirname, 'particle-flow/index.html'),
      },
    },
  },
});
