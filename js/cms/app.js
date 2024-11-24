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
        },
        loadPost(post_path) {
            this.page_path = post_path
        }
    },
    template: `
        <div>
            <header class="header text-center" style="background: rgb(44, 134, 78)">
                <h1 class="blog-name pt-lg-4 mb-0"><a class="no-text-decoration" href="index.html">Mario Baldi's Blog</a></h1>

                <nav class="navbar navbar-expand-lg navbar-dark" >
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navigation" aria-controls="navigation" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div id="navigation" class="collapse navbar-collapse flex-column" >
                        <div class="profile-section pt-3 pt-lg-0">
                            <img class="profile-image mb-3 rounded-circle mx-auto" src="https://avatars.githubusercontent.com/u/8032315?v=4" alt="image" >

                            <div class="bio mb-3" style="text-align: left;">
                                <ul class="bio-list">
                                    <li>🌍  I'm based in Italy 🇮🇹</li>
                                    <li>🖥️  See my portfolio at Linkedin</li>
                                    <li>✉️  You can contact me at mariobaldi.py@gmail.com</li>
                                    <li>🧠  I'm learning Rust 🦀</li>
                                    <li>🤝  I'm open to collaborating on interesting projects</li>
                                    <li>⚡  Open to conversations about tech, ideas, or just some fun, let’s connect!</li>
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

                        <PageMenuComponent @loadPage="loadPage"/>

                        <div class="my-2 my-md-3">
                            <a class="btn btn-primary" href="https://themes.3rdwavemedia.com/" target="_blank">Get in Touch</a>
                        </div>
                    </div>
                </nav>
            </header>

            <div class="main-wrapper">
                <section class="cta-section theme-bg-light py-5" style="background-color: rgb(27, 29, 30) !important">
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

                <section class="blog-list px-3 py-5 p-md-5">
                    <div class="container single-col-max-width">
                        <PageComponent :page_path="page_path" @loadPost="loadPost"/>
                    </div>
                </section>

                <footer class="footer text-center py-2 theme-bg-dark">
                    <!--/* This template is free as long as you keep the footer attribution link. If you'd like to use the template without the attribution link, you can buy the commercial license via our website: themes.3rdwavemedia.com Thank you for your support. :) */-->
                    <small class="copyright">Powered by <a href="https://github.com/baldimario/github-cms" target="_blank">Github CMS</a> project</small>
                </footer>
            </div><!--//main-wrapper-->
        </div>
    `
}).mount('#app')