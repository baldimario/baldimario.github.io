const PageMenuComponent = defineComponent({
  emits: ["loadPage"],
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
      this.$emit('loadPage', page_path)
    }
  },
  template: `<ul style="padding: 0">
    <li v-for="page in pages" style="display: inline; margin-right: 10px; list-pagina">
      <button
      v-on:click="loadPage(page.path)">
        {{ page.name }}
      </button>
    </li>
  </ul>`
})
