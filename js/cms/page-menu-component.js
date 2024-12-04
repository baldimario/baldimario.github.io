const PageMenuComponent = defineComponent({
  setup() {
    const pages = ref([])
    return { pages }
  },
  mounted() {
    ghfs.ls('pages', /.*\.md$/g).then((data) => {
        this.pages = data
    })
  },
  methods: {
    loadPage(page_path) {
        location.hash = page_path.replace(config.github.root + '/', '')
    },
    formatMdFileName(filename) {
      let newname = filename.replace(/([A-Z])/g, ' $1').trim().replace('.md', '');
      return newname.charAt(0).toUpperCase() + newname.slice(1);
    }
  },
  template: `
  <ul class="navbar-nav flex-column text-start">
    <li class="nav-item">
      <a class="nav-link active" v-on:click="loadPage('')"><i class="fas fa-home fa-fw me-2"></i>Blog Home <span class="sr-only">(current)</span></a>
    </li>
    <li v-for="page in pages" class="nav-item" v-for="page in pages">
      <a class="nav-link" v-on:click="loadPage(page.path)"><i class="fas fa-bookmark fa-fw me-2"></i>{{ formatMdFileName(page.name) }}</a>
    </li>
  </ul>
  `
})
