const currentPath = ref(window.location.hash)
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

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
            page_path,
            currentPath
        }
    },
    computed: {
        currentView() {
            return this.currentPath
        }
    },
    watch: {
        currentPath(newVal, oldVal) {
            let new_page = newVal.replace('#', config.github.root + '/')
            console.log('old page: ', this.page_path)
            console.log('new page: ', new_page)
            this.page_path = new_page
        }
    },
    methods: {
        toggleMenu() {
          let navigation = document.getElementById('navigation')
          if (navigation.classList.contains('show')) {
            navigation.classList.remove('show')
          } else {
            navigation.classList.add('show')
          }
        },
        closeMenu() {
          let navigation = document.getElementById('navigation')
          navigation.classList.remove('show')
        },
        goHome() {
            this.closeMenu()
        },
        openMenu() {
          let navigation = document.getElementById('navigation')
          navigation.classList.add('show')
        }
    },
    template: `
        <div>
            <header class="header text-center" style="background: rgb(44, 134, 78)">
                <h1 class="blog-name pt-lg-4 mb-0" style="z-index: 100; margin-left: 0px; position"><a class="no-text-decoration" v-on:click="goHome">Mario Baldi's Blog</a></h1>

                <nav class="navbar navbar-expand-lg navbar-dark">
                    <button class="navbar-toggler" style="z-index: 200;" type="button" data-bs-toggle="collapse" data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon" v-on:click="toggleMenu"></span>
                    </button>

                    <div id="navigation" class="collapse navbar-collapse flex-column" >
                        <div class="profile-section pt-3 pt-lg-0">
                            <img class="profile-image mb-3 rounded-circle mx-auto" src="https://avatars.githubusercontent.com/u/8032315?v=4" alt="image" >

                            <div class="bio mb-3" style="text-align: left;">
                                <ul class="bio-list">
                                    <li>🌍 I'm based in Italy 🇮🇹</li>
                                    <li>🖥️ See my skills on <a href="https://www.linkedin.com/in/mario-baldi-1bb75077/">Linkedin</a></li>
                                    <li>✉️  You can send me an <a href="mailto:mariobaldi.py@gmail.com">mail</a></li>
                                    <li>🧠 I'm learning Rust 🦀</li>
                                    <li>🤝 I'm open to collaborations</li>
                                    <li>⚡ I'm open to conversations about tech, ideas and more, let’s connect!</li>
                                </ul>
                            </div><!--//bio-->
                            <ul class="social-list list-inline py-3 mx-auto">
                                <!--<li class="list-inline-item"><a href="#"><i class="fab fa-twitter fa-fw"></i></a></li>-->
                                <li class="list-inline-item"><a href="https://www.linkedin.com/in/mario-baldi-1bb75077/"><i class="fab fa-linkedin-in fa-fw"></i></a></li>
                                <li class="list-inline-item"><a href="https://github.com/baldimario"><i class="fab fa-github-alt fa-fw"></i></a></li>
                                <!--<li class="list-inline-item"><a href="#"><i class="fab fa-stack-overflow fa-fw"></i></a></li>
                                <li class="list-inline-item"><a href="#"><i class="fab fa-codepen fa-fw"></i></a></li>-->
                            </ul><!--//social-list-->
                            <hr>
                        </div><!--//profile-section-->

                        <PageMenuComponent/>

                        <div class="my-2 my-md-3">
                            <a class="btn btn-primary" href="mailto:mariobaldi.py@gmail.com" target="_blank">Get in Touch</a>
                        </div>
                    </div>
                </nav>
            </header>

            <div class="main-wrapper" style="display: flex; flex-direction: column; min-height: 100vh;">
                <section class="cta-section theme-bg-light py-5" style="background-color: rgb(27, 29, 30) !important; flex-basis: 0;">
                    <div class="container text-center single-col-max-width">
                        <h2 class="heading text-white">Mario Baldi's Developer Blog</h2>
                        <div class="intro text-light">I write code... and the bugs write themselves.</div>
                        <!--<div class="single-form-max-width pt-3 mx-auto">
                            <form class="signup-form row g-2 g-lg-2 align-items-center">
                                <div class="col-12 col-md-9">
                                    <input type="email" id="semail" name="semail1" class="form-control me-md-1 semail text-white" placeholder="Enter email" style="background: #181a1b;">
                                </div>
                                <div class="col-12 col-md-2">
                                    <button type="submit" class="btn btn-primary">Subscribe</button>
                                </div>
                            </form>
                        </div>--><!--//single-form-max-width-->
                    </div><!--//container-->
                </section>

                <section class="blog-list px-3 py-5 p-md-5" style="flex-grow: 1; flex-basis: 100%; display: flex; flex-direction: column;">
                    <div class="container single-col-max-width" style="flex-grow: 1; flex-basis: 100%; display: flex; flex-direction: column;">
                        <PageComponent :page_path="page_path"/>
                    </div>
                </section>

                <footer class="footer text-center theme-bg-dark" style="flex-basis: 0;">
                    <small class="copyright">Powered by <a href="https://github.com/baldimario/github-cms" target="_blank">Github CMS</a> project</small>
                </footer>
            </div><!--//main-wrapper-->
        </div>
    `
}).mount('#app')
