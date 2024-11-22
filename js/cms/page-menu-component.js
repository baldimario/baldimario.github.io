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
  template: `<ul>
    <li v-for="page in pages"> <button v-on:click="loadPage(page.path)"> {{ page.name }} </button> </li>
  </ul>`
})
