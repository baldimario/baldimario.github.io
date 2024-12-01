const PageComponent = defineComponent({
  props: ["page_path"],
  emits: ['loadPost'],
  components: {
    Pagination
  },
  setup() {
    let post = ref('')
    return { post }
  },
  methods: {
    loadPost(post_path) {
      this.$emit('loadPost', post_path)
    },
    formatMdFileName(filename) {
        let newname = filename.replace(/([A-Z])/g, ' $1').trim().replace('.md', '');
        return newname.charAt(0).toUpperCase() + newname.slice(1);
    },
    /*getPost(post) {
        return ghfs.cat(post.path).then((data) => {
            this.post_map[post.path] = data
        })
    },*/
    getPostRaw() {
        return this.post ? this.post : null
    },
    getPostMetadata() {
        let post_raw = this.getPostRaw();
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
    getPostContent() {
        let post_raw = this.getPostRaw();
        if (!post_raw) return null
        const lines = post_raw.split('\n');
        const start = lines.findIndex(line => line.trim().startsWith('---'));
        const end = lines.findIndex((line, index) => index > start && line.trim().startsWith('---'));
        if (start !== 0) {
            return lines.join('\n')
        } else {
            const content = lines.slice(end+1).join('\n');
            return content;
        }
    },
    getPostContentRendered() {
      let content = this.getPostContent()
      if (!content) return ''
      return marked.parse(content)
    },
    getPostImage() {
        let metadata = this.getPostMetadata();
        return metadata && metadata.image ? metadata.image : "https://placehold.co/400x350/444/FFF?text=Image%20:D";
    },
    getPostAuthor() {
        let metadata = this.getPostMetadata();
        return metadata ? metadata['author'] : '';
    },
    getPostDescription() {
        let metadata = this.getPostMetadata();
        return metadata ? metadata['description'] : "";
    },
    getPostAge() {
      let metadata = this.getPostMetadata();
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
    canGetPostRaw() {
        return this.getPostRaw() !== null
    },
    getReadingTimeInMinutes() {
        const content = this.getPostContent();
        if (!content) return 'Some'
        const words = content.split(/\s+/).length;
        const readingTime = Math.ceil(words / 150);
        return readingTime;
    },
  },
  watch: {
    page_path: {
      handler(new_value) {
        ghfs.cat(new_value).then((data) => {
          this.post = data
        })
      }
    }
  },
  template: `<div style="flex-grow: 1; flex-basis: 100%; display: flex; flex-direction: column;">
    <div v-if="page_path" style="flex-grow: 1; flex-basis: 100%; display: flex; flex-direction: column;">
      <div class="meta mb-1">
        <span class="date">Published {{ getPostAge() }}</span>
        <span class="time">{{ getReadingTimeInMinutes() }} minutes</span>
        <span class="author" v-if="getPostAuthor()">{{ getPostAuthor() }}</span>
      </div>
      <div v-html="getPostContentRendered()">
      </div>
    </div>
    <div v-else style="flex-grow: 1; flex-basis: 100%; display: flex; flex-direction: column;">
      <Pagination @loadPost="loadPost"/>
    </div>
  </div>`
})
