import MarkdownIt from "markdown-it";

const parser = new MarkdownIt();

export const convertMdToHtml = (markdown: string) => {
  return parser.render(markdown);
};
