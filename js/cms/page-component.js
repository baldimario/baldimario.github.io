const PageComponent = defineComponent({
  props: ["page_path"],
  setup() {
    let content = ref('')
    return { content }
  },
  watch: {
    page_path: {
      handler(new_value) {
        ghfs.cat(new_value).then((data) => {
          this.content = marked.parse(data)
        })
      }
    }
  },
  template: `<div v-html="content">
  </div>`
})
