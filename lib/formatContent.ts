/**
 * Formats blog body content to ensure pasted image URLs, markdown syntax,
 * and HTML tags render properly and beautifully in the final output.
 */
export function formatBlogContent(rawContent: string): string {
  if (!rawContent) return '';

  let content = rawContent.trim();

  // 1. Process Markdown Images: ![alt](url)
  content = content.replace(
    /!\[(.*?)\]\((https?:\/\/[^\s\)]+|\/uploads\/[^\s\)]+)\)/gi,
    (_match, alt, url) => {
      const caption = alt && alt.trim() ? `<figcaption class="text-center text-xs text-slate-500 dark:text-slate-400 mt-2 italic">${alt.trim()}</figcaption>` : '';
      return `<figure class="my-6">
        <img src="${url}" alt="${alt || 'Article visual'}" class="rounded-xl shadow-md border border-slate-200 dark:border-slate-800 max-w-full h-auto mx-auto object-cover" loading="lazy" />
        ${caption}
      </figure>`;
    }
  );

  // 2. Process standalone raw image URLs (on their own line or wrapped in <p>...</p>)
  // Matches URLs ending with common image extensions or from known image CDNs (Unsplash, Cloudinary, Imgur, /uploads/)
  const imageRegex = /^(https?:\/\/[^\s<]+(?:\.(?:png|jpg|jpeg|webp|gif|svg)|\/uploads\/[^\s<]+|unsplash\.com[^\s<]+|cloudinary\.com[^\s<]+|imgur\.com[^\s<]+)(?:\?[^\s<]*)?)$/gim;

  content = content.replace(imageRegex, (url) => {
    const cleanUrl = url.trim();
    return `<figure class="my-6">
      <img src="${cleanUrl}" alt="Article visual" class="rounded-xl shadow-md border border-slate-200 dark:border-slate-800 max-w-full h-auto mx-auto object-cover" loading="lazy" />
    </figure>`;
  });

  // Handle cases where an image URL is wrapped inside a <p> tag: <p>https://...jpg</p>
  content = content.replace(
    /<p>\s*(https?:\/\/[^\s<]+(?:\.(?:png|jpg|jpeg|webp|gif|svg)|\/uploads\/[^\s<]+|unsplash\.com[^\s<]+)(?:\?[^\s<]*)?)\s*<\/p>/gi,
    (_match, url) => {
      return `<figure class="my-6">
        <img src="${url}" alt="Article visual" class="rounded-xl shadow-md border border-slate-200 dark:border-slate-800 max-w-full h-auto mx-auto object-cover" loading="lazy" />
      </figure>`;
    }
  );

  // 3. Process Markdown Headings if present
  content = content.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  content = content.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  content = content.replace(/^# (.*$)/gim, '<h2>$1</h2>');

  // 4. Process Markdown Bold & Italic if present
  content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');

  // 5. Process Markdown Links: [text](url)
  content = content.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-600 dark:text-orange-400 underline underline-offset-4 hover:opacity-80">$1</a>'
  );

  // 6. Process Markdown Blockquotes
  content = content.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

  // 7. Process Markdown Code Blocks: ```code```
  content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // 8. If content is purely plaintext without HTML tags, wrap lines in <p>
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(content);
  if (!hasHtmlTags) {
    content = content
      .split(/\n\n+/)
      .map((para) => `<p>${para.trim().replace(/\n/g, '<br />')}</p>`)
      .join('\n');
  }

  return content;
}
