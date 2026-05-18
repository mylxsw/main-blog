module.exports = {
    site: {
        title: '程序猿成长计划',
        description: '技术分享 & 读书，我们共同成长！',
        author: 'mylxsw',
        url: 'https://aicode.cc', // RSS需要的站点URL
        logo: 'https://aicode.cc/logo.svg',
        copyrightYear: new Date().getFullYear()
    },
    theme: {
        /**
         * 可选配色方案：modern（蓝紫）、zen（雾霭灰紫）、sunrise（暖橙粉）、midnight（冷色蓝紫）、forest（森系绿）、ocean（碧海蓝）、latte（奶咖米）、minimal（极简黑白/彩虹黑）
         */
        palette: 'minimal'
    },
    pagination: {
        pageSize: 9,
        maxVisiblePages: 11,
    },
    home: {
        /**
         * 首页文章列表中排除的分类名称或 slug。
         * 被排除的文章仍会出现在各自分类页、标签页、RSS 和搜索索引中。
         */
        excludeCategories: ['AI 日报']
    },
    navigation: {
        /**
         * 导航栏是否固定在页面顶部（true 固定，false 随页面滚动）
         */
        sticky: false,
        /**
         * 导航栏“关于”按钮的跳转地址（支持外部链接）
         */
        aboutUrl: 'https://gulu.ai',
        categories: {
            /**
             * 指定导航栏中直接展示的分类名称，按照数组顺序显示。
             * 未列出的分类会被归入“更多”下拉菜单中。
             */
            topLevel: ['AI 日报', '技术分享', '读书'],
            /**
             * 自定义“更多”菜单的文案。
             */
            moreLabel: '更多',
            /**
             * 未指定分类的文章会被归入的默认分类名称。
             */
            defaultCategoryName: '其它',
            /**
             * 可选：为分类页配置背景图。
             * key 可以是分类名称或 slug。
             */
            backgrounds: {
                // '技术洞察': '/assets/categories/tech.jpg'
            }
        }
    },
    seo: {
        /**
         * sitemap 与 robots 等文件使用的默认更新频率
         */
        changeFrequency: 'weekly',
        /**
         * sitemap 中首页的优先级
         */
        homePriority: 1.0,
        /**
         * sitemap 中普通页面的默认优先级
         */
        defaultPriority: 0.6
    },
    advertising: {
        disabled: true,
        /**
         * Google AdSense 等广告联盟要求的 ads.txt 中的发布者 ID。
         * 请替换为真实 ID。
         */
        publisherId: 'pub-6795823110480470'
    },
    footer: {
        /**
         * 备案信息设置。例如 { text: '京ICP备00000000号-1', link: 'https://beian.miit.gov.cn/' }
         */
        icp: {
            text: '鲁ICP备14009006号-1',
            link: 'https://beian.miit.gov.cn/'
        },
        /**
         * 额外的版权说明，如 "Made with ❤ by XXX"
         */
        note: 'Make with ❤ by mylxsw & codex',
        /**
         * 页脚外部链接列表，例如 [{ label: '项目仓库', url: 'https://github.com/...', description: 'GitHub' }]
         */
        externalLinks: [
            { label: 'AIdea', url: 'https://aidea.aicode.cc', description: 'AI Chat' },
            { label: '微信公众号', url: 'https://mp.weixin.qq.com/mp/appmsgalbum?__biz=MzA3NTU1NDk4Mg==&action=getalbum&album_id=4168897503414140947&scene=126&sessionid=1758786267888#wechat_redirect', description: '' },
            { label: '人人链向未来', url: 'https://wy.is' },
        ],
        /**
         * 社交平台链接配置，示例：
         * [
         *   { label: 'GitHub', url: 'https://github.com/yourname', icon: 'github' }
         * ]
         * 支持的 icon: github, x, telegram, wechat, email, linkedin, rss
         */
        social: [
            { label: 'GitHub', url: 'https://github.com/mylxsw', icon: 'github' },
            { label: 'X', url: 'https://x.com/mylxsw', icon: 'x' },
            { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mylxsw/', icon: 'linkedin' }
        ],
    },
    analytics: {
        /**
         * 自定义统计脚本，将插入到 <head> 标签内（支持HTML片段）
         */
        head: '<meta name="google-adsense-account" content="ca-pub-6795823110480470">',
        /**
         * 自定义统计脚本，将插入到 </body> 前（支持HTML片段）
         */
        bodyEnd: `<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?3d87496c74732089ca666fb733ce41e8";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>`
    },
    i18n: {
        showLanguageSwitcher: false,
        defaultLanguage: 'zh',
        languages: {
            zh: {
                label: '简体中文',
                locale: 'zh-CN',
                routePrefix: '',
                navigation: {
                    moreLabel: '更多',
                    defaultCategoryName: '其它',
                },
                translations: {
                    nav: {
                        home: '首页',
                        about: '关于',
                        rss: 'RSS',
                        more: '更多',
                        filter: '筛选文章',
                        toggleMenu: '切换导航菜单',
                        language: '语言'
                    },
                    filters: {
                        title: '筛选文章',
                        searchPlaceholder: '搜索文章...',
                        sectionLabel: '文章筛选',
                        allTags: '全部'
                    },
                    buttons: {
                        closeFilter: '关闭筛选',
                        copy: '复制',
                        copyCode: '复制代码',
                        copySuccess: '已复制'
                    },
                    theme: {
                        toggleDark: '切换为暗色模式',
                        toggleLight: '切换为亮色模式'
                    },
                    pagination: {
                        previous: '上一页',
                        next: '下一页'
                    },
                    messages: {
                        empty: '暂无内容。',
                        rssCta: '📡 订阅 RSS',
                        searchError: '搜索索引加载失败，请稍后再试。',
                        searchNoResults: '没有找到匹配的文章。',
                        rssDescription: '一基于Markdown的静态博客'
                    },
                    recommendations: {
                        aria: '相关推荐',
                        title: '你可能还会喜欢'
                    },
                    content: {
                        untitled: '无标题'
                    },
                    categories: {
                        description: '收录了 {{count}} 篇文章',
                        pageTitleSuffix: '分类'
                    },
                    tags: {
                        description: '共 {{count}} 篇与该标签相关的文章',
                        pageTitleSuffix: '标签'
                    },
                    toc: {
                        title: '目录'
                    },
                    summary: {
                        title: '要点速览'
                    }
                }
            },
            en: {
                label: 'English',
                locale: 'en-US',
                routePrefix: 'en',
                navigation: {
                    moreLabel: 'More',
                    defaultCategoryName: 'Others',
                },
                translations: {
                    nav: {
                        home: 'Home',
                        about: 'About',
                        rss: 'RSS',
                        more: 'More',
                        filter: 'Filter Posts',
                        toggleMenu: 'Toggle navigation menu',
                        language: 'Language'
                    },
                    filters: {
                        title: 'Filter Posts',
                        searchPlaceholder: 'Search posts...',
                        sectionLabel: 'Post filters',
                        allTags: 'All'
                    },
                    buttons: {
                        closeFilter: 'Close filters',
                        copy: 'Copy',
                        copyCode: 'Copy code',
                        copySuccess: 'Copied'
                    },
                    theme: {
                        toggleDark: 'Switch to dark mode',
                        toggleLight: 'Switch to light mode'
                    },
                    pagination: {
                        previous: 'Previous',
                        next: 'Next'
                    },
                    messages: {
                        empty: 'No content yet.',
                        rssCta: '📡 Subscribe to RSS',
                        searchError: 'Failed to load search index, please try again later.',
                        searchNoResults: 'No posts matched your search.',
                        rssDescription: 'A static blog powered by Markdown'
                    },
                    recommendations: {
                        aria: 'Recommended posts',
                        title: 'You may also enjoy'
                    },
                    content: {
                        untitled: 'Untitled'
                    },
                    categories: {
                        description: '{{count}} posts collected here',
                        pageTitleSuffix: 'Categories'
                    },
                    tags: {
                        description: '{{count}} posts tagged with this topic',
                        pageTitleSuffix: 'Tags'
                    },
                    toc: {
                        title: 'Table of Contents'
                    },
                    summary: {
                        title: 'Key Takeaways'
                    }
                }
            }
        }
    }
};
