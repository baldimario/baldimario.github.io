const Pagination = defineComponent({
    props: ["page_path"],
    components: {
    },
    setup() {
        const posts = ref([])
        const post_map = ref({})
        const page = ref(0)
        const post_per_page = 5
        const last_page = ref(0)
        return {
            posts,
            post_map,
            page,
            post_per_page,
            last_page
        }
    },
    mounted() {
        ghfs.ls('posts', /.*\.md$/g).then((data) => {
            this.posts = data
            this.last_page = Math.floor(data.length / this.post_per_page)

            this.posts.sort((a, b) => {
                const dateA = a.name.split('-').slice(0, 3).join('-');
                const dateB = b.name.split('-').slice(0, 3).join('-');

                if (/^[0-9\-]+$/.test(dateA) && /^[0-9\-]+$/.test(dateB)) {
                    return dateB.localeCompare(dateA);
                }
                return 1;
            });

            for(post of this.posts) {
                if (!(post.path in this.post_map)) {
                    this.getPost(post)
                }
            }
        })
    },
    methods: {
        loadPost(post_path) {
            this.$emit('loadPost', post_path)
        },
        formatMdFileName(filename) {
            let newname = filename.replace(/([A-Z])/g, ' $1').trim().replace('.md', '');
            return newname.charAt(0).toUpperCase() + newname.slice(1);
        },
        getPost(post) {
            return ghfs.cat(post.path).then((data) => {
                this.post_map[post.path] = data
            })
        },
        getPostRaw(post) {
            return post.path in this.post_map ? this.post_map[post.path] : null
        },
        getPostMetadata(post) {
            let post_raw = this.getPostRaw(post);
            if (!post_raw) return null
            const lines = post_raw.split('\n');
            const start = lines.findIndex(line => line.trim().startsWith('---'));
            const end = lines.findIndex((line, index) => index > start && line.trim().startsWith('---'));
            if (start !== 0) {
                return {}
            } else {
                const content = lines.slice(start+1, end).join('\n');
                return JSON.parse(content);
            }
        },
        getPostContent(post) {
            let post_raw = this.getPostRaw(post);
            if (!post_raw) return null
            const lines = post_raw.split('\n');
            const start = lines.findIndex(line => line.trim().startsWith('---'));
            const end = lines.findIndex((line, index) => index > start && line.trim().startsWith('---'));
            if (start !== 1) {
                return lines.join('\n')
            } else {
                const content = lines.slice(end+1).join('\n');
                return content;
            }
        },
        getPostImage(post) {
            let metadata = this.getPostMetadata(post);
            return metadata && metadata.image ? metadata.image : 'https://placehold.co/400x350/444/FFF?text=Image%20:D';
        },
        getPostAuthor(post) {
            let metadata = this.getPostMetadata(post);
            return metadata ? metadata['author'] : '';
        },
        getPostDescription(post) {
            let metadata = this.getPostMetadata(post);
            return metadata ? metadata['description'] : "";
        },
        getPostTitle(post) {
            let metadata = this.getPostMetadata(post);
            return metadata && metadata.title ? metadata.title : this.formatMdFileName(post.name)
        },
        getPostAge(post) {
            let metadata = this.getPostMetadata(post);
            if (!metadata) return '';
            const date = new Date(metadata['datetime']);
            const today = new Date();
            const timeDiff = Math.abs(today.getTime() - date.getTime());
            const daysAgo = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
            const weeksAgo = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 7));
            const monthsAgo = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 30));
            const yearsAgo = Math.ceil(timeDiff / (1000 * 60 * 60 * 24 * 365));
            if (daysAgo === 0) {
              return 'Today';
            } else if (daysAgo <= 7) {
              return daysAgo + ' days ago';
            } else if (daysAgo <= 30) {
              return Math.ceil(daysAgo / 7)-1 + ' weeks ago';
            } else if (monthsAgo <= 12) {
              return monthsAgo-1 + ' months ago';
            } else {
              return yearsAgo-1 + ' years ago';
            }
        },
        canGetPostRaw(post) {
            return this.getPostRaw(post) !== null
        },
        getReadingTimeInMinutes(post) {
            const content = this.getPostContent(post);
            if (!content) return 'Some'
            const words = content.split(/\s+/).length;
            const readingTime = Math.ceil(words / 150);
            return readingTime;
        },
        getPagePosts() {
            return this.posts.slice(this.page * this.post_per_page, (this.page + 1) * this.post_per_page);
        },
        nextPage() {
            this.page++;
        },
        previousPage() {
            this.page--;
        }
    },
    template: `
<div style="flex-grow: 1; flex-basis: 100%; display: flex; flex-direction: column;">
    <div style="flex-grow: 1; flex-basis: 100%;">
        <div class="item mb-5" v-for="post in getPagePosts()">
            <div class="row g-3 g-xl-0">
                <div class="col-2 col-xl-3">
                    <img class="img-fluid post-thumb" :src="getPostImage(post)" alt="image">
                </div>
                <div class="col">
                    <h3 class="title mb-1"><a class="text-link" v-on:click="loadPost(post.path)">{{ getPostTitle(post) }}</a></h3>
                    <div class="meta mb-1">
                        <span class="date">Published {{ getPostAge(post) }}</span>
                        <span class="time">{{ getReadingTimeInMinutes(post) }} minutes</span>
                        <span class="author" v-if="getPostAuthor(post)">{{ getPostAuthor(post) }}</span>
                    </div>
                    <div class="intro" v-if="canGetPostRaw(post)">
                        {{ getPostDescription(post) }}
                    </div>
                    <a class="text-link" v-on:click="loadPost(post.path)">Read more &rarr;</a>
                </div><!--//col-->
            </div><!--//row-->
        </div><!--//item-->
    </div>

    <nav class="blog-nav nav nav-justified my-5" style="flex-basis: 0;">
        <a class="nav-link-next nav-item nav-link rounded" v-if="page > 0" v-on:click="previousPage()">Previous<i class="arrow-prev fas fa-long-arrow-alt-left"></i></a>
        <a class="nav-link-next nav-item nav-link rounded" v-if="page < last_page" v-on:click="nextPage()">Next<i class="arrow-next fas fa-long-arrow-alt-right"></i></a>
    </nav>
</div>
`
})
