createApp({
    components: {
        PageMenuComponent,
        PageComponent
    },
    setup() {
        const message = ref('Hello vue!')
        const page_path = ref('')
        return {
            message,
            page_path
        }
    },
    methods: {
        loadPage(page_path) {
            this.page_path = page_path
        }
    },
    template: `
        <div>
            <PageMenuComponent v-on:loadPage="loadPage"/>
            <hr/>
            <PageComponent :page_path="page_path"/>
        </div>
    `
}).mount('#app')
