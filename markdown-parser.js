const fs = require('fs-extra');
const path = require('path');
const fm = require('front-matter');
const markdownIt = require('markdown-it');
const hljs = require('highlight.js');

class MarkdownParser {
    constructor() {
        this.md = markdownIt({
            html: true,
            linkify: true,
            typographer: true
        });

        const escapeHtml = this.md.utils.escapeHtml;

        // 自定义渲染：围栏代码块（```lang）
        const renderFence = (tokens, idx) => {
            const token = tokens[idx];
            const info = token.info ? token.info.trim() : '';
            const lang = info.split(/\s+/)[0] || '';
            const code = token.content || '';
            let highlighted;
            try {
                if (lang && hljs.getLanguage(lang)) {
                    highlighted = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
                } else {
                    highlighted = escapeHtml(code);
                }
            } catch (_) {
                highlighted = escapeHtml(code);
            }
            const langClass = lang ? ` language-${lang}` : '';
            return `<div class="code-block"><button class="copy-code-btn" type="button" aria-label="复制代码">复制</button><pre><code class="hljs${langClass}">${highlighted}</code></pre></div>`;
        };

        // 自定义渲染：缩进代码块（四空格）
        const renderCodeBlock = (tokens, idx) => {
            const code = tokens[idx].content || '';
            const highlighted = escapeHtml(code);
            return `<div class="code-block"><button class="copy-code-btn" type="button" aria-label="复制代码">复制</button><pre><code class="hljs">${highlighted}</code></pre></div>`;
        };

        this.md.renderer.rules.fence = renderFence;
        this.md.renderer.rules.code_block = renderCodeBlock;

        const defaultImageRender = this.md.renderer.rules.image || ((tokens, idx, options, env, self) => self.renderToken(tokens, idx, options));
        this.md.renderer.rules.image = (tokens, idx, options, env, self) => {
            const token = tokens[idx];
            if (token && typeof token.attrJoin === 'function') {
                token.attrJoin('class', 'progressive-media');
                if (typeof token.attrGet === 'function' && typeof token.attrSet === 'function' && !token.attrGet('loading')) {
                    token.attrSet('loading', 'lazy');
                }
            }
            return defaultImageRender(tokens, idx, options, env, self);
        };
    }

    /**
     * 解析Markdown文件，提取front-matter和内容
     * @param {string} filePath - Markdown文件路径
     * @returns {Object} 包含属性和内容的对象
     */
    parseFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = fm(content);

        // 移除正文中的第一个H1标题，避免与模板标题重复
        const bodyWithoutFirstH1 = this.removeFirstH1(parsed.body || '');

        const tokens = this.md.parse(bodyWithoutFirstH1, {});
        const toc = [];
        const slugCounts = {};

        tokens.forEach((token, index) => {
            if (token.type === 'heading_open') {
                const level = parseInt(token.tag.replace('h', ''), 10);
                if (level >= 2 && level <= 4) {
                    const inlineToken = tokens[index + 1];
                    const text = this.getInlineText(inlineToken);
                    let slug = this.slugify(text);

                    // Handle duplicate slugs
                    if (slugCounts[slug]) {
                        slugCounts[slug]++;
                        slug = `${slug}-${slugCounts[slug]}`;
                    } else {
                        slugCounts[slug] = 1;
                    }

                    token.attrSet('id', slug);
                    toc.push({ level, text, slug });
                }
            }
        });

        const html = this.md.renderer.render(tokens, this.md.options);

        return {
            attributes: parsed.attributes || {},
            body: parsed.body || '',
            html: html,
            toc: toc
        };
    }

    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\u4e00-\u9fa5-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    getInlineText(inlineToken) {
        if (!inlineToken) return '';
        if (Array.isArray(inlineToken.children) && inlineToken.children.length) {
            const text = inlineToken.children.map(child => {
                if (child.type === 'text' || child.type === 'code_inline') {
                    return child.content || '';
                }
                if (child.type === 'softbreak' || child.type === 'hardbreak') {
                    return ' ';
                }
                if (child.type === 'emoji') {
                    return child.markup || child.content || '';
                }
                return '';
            }).join('');
            return text.replace(/\s+/g, ' ').trim();
        }
        return (inlineToken.content || '').trim();
    }

    /**
     * 移除markdown内容中的第一个H1标题
     * @param {string} markdown - markdown内容
     * @returns {string} 移除第一个H1后的内容
     */
    removeFirstH1(markdown) {
        // 按行分割
        const lines = markdown.split('\n');
        let firstH1Found = false;
        const filteredLines = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // 检查是否是H1标题 (# 开头，但不是 ## 或更多#)
            if (!firstH1Found && /^# [^#]/.test(line)) {
                firstH1Found = true;
                continue; // 跳过这一行
            }

            filteredLines.push(lines[i]);
        }

        return filteredLines.join('\n');
    }

    /**
     * 获取所有Markdown文件
     * @param {string} dir - 目录路径
     * @returns {Array} Markdown文件路径数组
     */
    getMarkdownFiles(dir) {
        const files = fs.readdirSync(dir);
        const markdownFiles = [];

        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // 递归处理子目录
                markdownFiles.push(...this.getMarkdownFiles(fullPath));
            } else if (path.extname(file).toLowerCase() === '.md') {
                markdownFiles.push(fullPath);
            }
        });

        return markdownFiles;
    }
}

module.exports = MarkdownParser;
