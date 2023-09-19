import rss, { pagesGlobToRssItems } from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  return rss({
    title: 'Rhythm Nation',
    description: 'A community of music producers and enthusiasts',
    site: context.site?.toString() ?? '',
    // items: await pagesGlobToRssItems(
    //   import.meta.glob('/content/posts/*.{md,mdx}')
    // ),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date), // convert string to Date object
      description: post.data.description,
      link: `/blog/${post.slug}`,
      content: sanitizeHtml(parser.render(post.body)),
      image: post.data.image,
    })),
    // (optional) inject custom xml
    customData: `
<language>en-us</language>
    `,
  });
}