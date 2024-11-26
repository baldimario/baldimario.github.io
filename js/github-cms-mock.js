var env = {
    github: {
        api: 'https://api.github.com',
        raw: 'https://raw.githubusercontent.com'
    }
}

var GithubFileSystem = (function () {
    function GithubFileSystem(config, cache=null) {
      this._config = config;
      this.cache = cache || new Cache('gitcms', 10)
    }

    function decodeBase64( string ) {
      return decodeURIComponent(window.atob( string ));
    }

    function getApiUrl(directory) {
        return [
            env.github.api,
            'repos',
            config.github.username,
            config.github.repository,
            'contents',
            config.github.root,
            directory
        ].join('/') + '?ref=' + config.github.branch;
    }

    function getRawUrl(path) {
        return [
            env.github.api,
            'repos',
            config.github.username,
            config.github.repository,
            'contents',
            path
        ].join('/') + '?ref=' + config.github.branch;
    }

    async function ls(directory, regexp = null) {
      let key = directory + ( regexp ? ':' + regexp.toString() : '')
      let response = this.cache.get(key)
      if (response !== null) return response
      console.log('not cached')

      if (directory == 'pages') {
        response = [
          {
            "name": "about.md",
            "path": "cms/pages/about.md",
            "sha": "3ad9d0a0a3363274ad5be48c31116c0bdd615408",
            "size": 1732,
            "url": "https://api.github.com/repos/baldimario/baldimario.github.io/contents/cms/pages/about.md?ref=master",
            "html_url": "https://github.com/baldimario/baldimario.github.io/blob/master/cms/pages/about.md",
            "git_url": "https://api.github.com/repos/baldimario/baldimario.github.io/git/blobs/3ad9d0a0a3363274ad5be48c31116c0bdd615408",
            "download_url": "https://raw.githubusercontent.com/baldimario/baldimario.github.io/master/cms/pages/about.md",
            "type": "file",
            "_links": {
              "self": "https://api.github.com/repos/baldimario/baldimario.github.io/contents/cms/pages/about.md?ref=master",
              "git": "https://api.github.com/repos/baldimario/baldimario.github.io/git/blobs/3ad9d0a0a3363274ad5be48c31116c0bdd615408",
              "html": "https://github.com/baldimario/baldimario.github.io/blob/master/cms/pages/about.md"
            }
          },
          {
            "name": "contact.md",
            "path": "cms/pages/contact.md",
            "sha": "93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
            "size": 1124,
            "url": "https://api.github.com/repos/baldimario/baldimario.github.io/contents/cms/pages/contact.md?ref=master",
            "html_url": "https://github.com/baldimario/baldimario.github.io/blob/master/cms/pages/contact.md",
            "git_url": "https://api.github.com/repos/baldimario/baldimario.github.io/git/blobs/93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
            "download_url": "https://raw.githubusercontent.com/baldimario/baldimario.github.io/master/cms/pages/contact.md",
            "type": "file",
            "_links": {
              "self": "https://api.github.com/repos/baldimario/baldimario.github.io/contents/cms/pages/contact.md?ref=master",
              "git": "https://api.github.com/repos/baldimario/baldimario.github.io/git/blobs/93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
              "html": "https://github.com/baldimario/baldimario.github.io/blob/master/cms/pages/contact.md"
            }
          },
          {
            "name": "projects.md",
            "path": "cms/pages/projects.md",
            "sha": "93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
            "size": 1124,
            "url": "https://api.github.com/repos/baldimario/baldimario.github.io/contents/cms/pages/projects.md?ref=master",
            "html_url": "https://github.com/baldimario/baldimario.github.io/blob/master/cms/pages/projects.md",
            "git_url": "https://api.github.com/repos/baldimario/baldimario.github.io/git/blobs/93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
            "download_url": "https://raw.githubusercontent.com/baldimario/baldimario.github.io/master/cms/pages/projects.md",
            "type": "file",
            "_links": {
              "self": "https://api.github.com/repos/baldimario/baldimario.github.io/contents/cms/pages/projects.md?ref=master",
              "git": "https://api.github.com/repos/baldimario/baldimario.github.io/git/blobs/93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
              "html": "https://github.com/baldimario/baldimario.github.io/blob/master/cms/pages/projects.md"
            }
          },
          {
            "name": "curriculumVitae.md",
            "path": "cms/pages/curriculumVitae.md",
            "sha": "93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
            "size": 1124,
            "url": "https://api.github.com/repos/baldimario/baldimario.github.io/contents/cms/pages/curriculumVitae.md?ref=master",
            "html_url": "https://github.com/baldimario/baldimario.github.io/blob/master/cms/pages/curriculumVitae.md",
            "git_url": "https://api.github.com/repos/baldimario/baldimario.github.io/git/blobs/93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
            "download_url": "https://raw.githubusercontent.com/baldimario/baldimario.github.io/master/cms/pages/curriculumVitae.md",
            "type": "file",
            "_links": {
              "self": "https://api.github.com/repos/baldimario/baldimario.github.io/contents/cms/pages/curriculumVitae.md?ref=master",
              "git": "https://api.github.com/repos/baldimario/baldimario.github.io/git/blobs/93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
              "html": "https://github.com/baldimario/baldimario.github.io/blob/master/cms/pages/curriculumVitae.md"
            }
          }
        ]
      }
      else if(directory == 'posts') {
        response = [
          {
            "name": "pythonDomainDrivenDesign.md",
            "path": "cms/posts/pythonDomainDrivenDesign.md",
            "sha": "93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
            "size": 1124,
            "url": "https://api.github.com/repos/baldimario/baldimario.github.io/contents/cms/pages/pythonDomainDrivenDesign.md?ref=master",
            "html_url": "https://github.com/baldimario/baldimario.github.io/blob/master/cms/pages/pythonDomainDrivenDesign.md",
            "git_url": "https://api.github.com/repos/baldimario/baldimario.github.io/git/blobs/93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
            "download_url": "https://raw.githubusercontent.com/baldimario/baldimario.github.io/master/cms/pages/pythonDomainDrivenDesign.md",
            "type": "file",
            "_links": {
              "self": "https://api.github.com/repos/baldimario/baldimario.github.io/contents/cms/pages/pythonDomainDrivenDesign.md?ref=master",
              "git": "https://api.github.com/repos/baldimario/baldimario.github.io/git/blobs/93b07d0e2f1a139d763c529ade77ddcd2db34d4d",
              "html": "https://github.com/baldimario/baldimario.github.io/blob/master/cms/pages/pythonDomainDrivenDesign.md"
            }
          }
        ]
      }

      this.cache.set(key, response)
      return response
    }

    async function cat(path) {
      let response = this.cache.get(path)
      if (response !== null) return response
      console.log('not cached')

      if (path == 'cms/pages/about.md') {
        response = `
# About Us

## Who We Are
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae eros eget tellus tristique bibendum. Donec rutrum sed sem quis venenatis. Proin viverra risus a eros volutpat tempor. In quis arcu et eros porta lobortis sit amet at dui.

## Our Mission
Curabitur laoreet, mauris vel blandit fringilla, leo elit rhoncus nunc, at iaculis lacus sem a est. Sed placerat pharetra lacus. Proin vehicula, libero ac egestas cursus, felis sapien gravida urna, a facilisis elit magna at eros. Etiam ut risus et erat iaculis mattis non ac odio.

## Our Values
1. **Integrity**
   Maecenas vehicula, massa vel hendrerit malesuada, orci nulla pellentesque diam, a varius nisi lacus eget urna.

2. **Innovation**
   Aliquam erat volutpat. Phasellus euismod, odio a molestie facilisis, nisi lectus scelerisque eros, eu posuere nisi velit quis purus.

3. **Community**
   Suspendisse potenti. Fusce sit amet vestibulum mi, eget vestibulum felis. Vivamus at felis quis elit fermentum blandit.

## What We Do
Sed at risus quam. Nullam tincidunt, libero non posuere consequat, orci erat pellentesque ligula, ac hendrerit lacus elit sit amet turpis. Nullam scelerisque ligula non orci dapibus, eget vehicula lacus ultricies.

### Key Services
- Lorem ipsum dolor sit amet, consectetur adipiscing elit.
- Nulla facilisi. Pellentesque id quam nec turpis interdum venenatis.
- Praesent malesuada tincidunt libero, a facilisis magna fringilla quis.

## Join Us
Vestibulum tristique, velit non efficitur eleifend, justo odio condimentum metus, at ultricies sapien velit quis mauris. Nunc sed orci ac eros auctor convallis. Curabitur fringilla tempus ligula vel cursus.

We'd love to have you on this journey with us!
        `
      }
      else if(path == 'cms/pages/contact.md') {
        response = `
# Contact Us

## Get in Touch
Have questions or need assistance? We're here to help! Feel free to reach out to us using any of the methods below. Our team will get back to you as soon as possible.

## Address
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
**1234 Ipsum Street**
Dolor City, Lorem State, 56789

## Phone
Call us anytime during business hours:
**+1 (123) 456-7890**

## Email
For general inquiries, send us an email:
**support@example.com**

## Social Media
Follow us on social media to stay updated:
- **[Facebook](#)**: facebook.com/example
- **[Twitter](#)**: twitter.com/example
- **[Instagram](#)**: instagram.com/example

## Business Hours
We’re available during the following times:
- **Monday to Friday**: 9:00 AM - 6:00 PM
- **Saturday**: 10:00 AM - 4:00 PM
- **Sunday**: Closed

## Contact Form
If you prefer, you can fill out the form below, and we’ll get back to you:
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque at vestibulum eros. Praesent luctus ligula vitae erat cursus, id facilisis neque facilisis.

Name: __________
        `
      }
      else if(path == 'cms/pages/projects.md') {
        response = `
# Projects

## Our Work
We take pride in delivering innovative solutions that make an impact. Explore some of our recent projects and see how we’re shaping the future through creativity and dedication.

---

### **Project A: Building the Future**
**Date**: January 2024
**Category**: Technology & Innovation

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce in facilisis massa. Integer euismod, sapien vel posuere facilisis, eros ligula aliquam urna, sed convallis purus enim non purus.

**Highlights**:
- Developed a cutting-edge AI-powered tool.
- Reduced operational costs by 25%.
- Enhanced user experience for over 10,000 users.

[Learn More](#)

---

### **Project B: Transforming Education**
**Date**: October 2023
**Category**: EdTech

Nulla facilisi. Suspendisse vehicula eu augue vel vestibulum. Phasellus vitae lectus non magna ultrices tristique at ut erat. Integer lacinia magna nec urna sollicitudin consequat.

**Highlights**:
- Created an adaptive e-learning platform.
- Partnered with leading institutions worldwide.
- Increased course completion rates by 40%.

[Learn More](#)

---

### **Project C: Community Empowerment**
**Date**: June 2023
**Category**: Social Impact

Vivamus in risus a orci faucibus congue. Aenean posuere tristique sem, vitae aliquet turpis fermentum eget. Curabitur dapibus, purus id sagittis scelerisque, sapien augue luctus purus, ut ultricies sapien est id risus.

**Highlights**:
- Organized a successful mentorship program for youth.
- Raised $100,000 for local initiatives.
- Built long-lasting community partnerships.

[Learn More](#)

---

## Want to Collaborate?
We’re always looking for exciting new challenges and partners. If you’d like to work with us, get in touch today:
**[Contact Us](#)**
        `
      }
      else if(path == 'cms/pages/curriculumVitae.md') {
        response = `
# Curriculum Vitae

## Personal Information
**Name**: John Doe
**Email**: john.doe@example.com
**Phone**: +1 (123) 456-7890
**LinkedIn**: [linkedin.com/in/johndoe](#)
**Portfolio**: [www.johndoe.com](#)

---

## Professional Summary
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id massa nec lectus fermentum consectetur. Vivamus eget velit ut erat interdum auctor. Cras vel urna sit amet justo vulputate tristique vel quis lorem.

---

## Education
### **Master of Science in Computer Science**
**University of Lorem Ipsum** – May 2020
- Graduated with Honors (GPA: 4.0/4.0)
- Thesis: "Artificial Intelligence in Modern Applications"

### **Bachelor of Science in Information Technology**
**Dolor Sit Amet University** – May 2018
- Minor in Data Analytics
- Dean’s List for four consecutive semesters

---

## Professional Experience
### **Senior Software Engineer**
**Tech Solutions Inc.** – June 2020 to Present
- Led the development of scalable web applications, increasing system efficiency by 30%.
- Supervised a team of 10 engineers, fostering collaboration and innovation.
- Designed and implemented API integrations, reducing manual workload by 40%.

### **Junior Developer Intern**
**Innovate Corp.** – January 2020 to May 2020
- Assisted in building front-end components for a SaaS platform.
- Conducted debugging sessions, resolving 95% of reported bugs within SLA timeframes.
- Wrote technical documentation to streamline onboarding processes.

---

## Skills
- **Programming Languages**: Python, JavaScript, C++
- **Frameworks**: React, Node.js, Django
- **Tools**: Git, Docker, Kubernetes
- **Other**: Agile Methodologies, Technical Writing

---

## Certifications
- **Certified Cloud Practitioner** – AWS, 2023
- **Advanced Python Developer** – Codecademy, 2022
- **Data Science Professional Certificate** – Coursera, 2021

---

## Projects
- **AI Chatbot for Customer Support**: Developed a chatbot using NLP, reducing query resolution time by 50%.
- **E-Learning Platform**: Built a learning management system, scaling to over 20,000 active users.
- **Mobile Expense Tracker**: Designed a cross-platform app with real-time data syncing features.

---

## Interests
- Open-source contributions
- Public speaking on tech innovation
- Mentorship programs for aspiring developers

---

*References available upon request.*
        `
      }
      else if(path == 'cms/posts/pythonDomainDrivenDesign.md') {
        response = `
---
{
  "title": "Python Domain Driven Design :D",
  "description": "Domain-Driven Design (DDD) is a software development approach that emphasizes aligning the implementation of a system with its business domain. By focusing on the core domain and its logic, DDD helps teams deliver solutions that accurately reflect the business requirements.",
  "image": "https://raw.githubusercontent.com/baldimario/hexagonal-python/refs/heads/develop/logo.png",
  "datetime": "2024/10/24 03:00",
  "author": "Mario Baldi"
}
---

# Domain-Driven Design (DDD) in Python: A Practical Introduction

Domain-Driven Design (DDD) is a software development approach that emphasizes aligning the implementation of a system with its business domain. By focusing on the core domain and its logic, DDD helps teams deliver solutions that accurately reflect the business requirements.

In this post, we’ll explore how to implement DDD principles using Python.

---

## What is Domain-Driven Design?

DDD is based on several key principles:

1. **Ubiquitous Language**: Collaborate with domain experts to create a common language that is used consistently across code, documentation, and conversations.
2. **Bounded Contexts**: Divide the system into distinct domains, each with a clear boundary, to manage complexity.
3. **Entities and Value Objects**: Identify the core concepts of the domain and model them appropriately.
4. **Aggregates**: Group related entities to ensure consistency and encapsulation.
5. **Repositories**: Abstract the storage and retrieval of entities.

---

## Why Use DDD with Python?

Python’s flexibility, readability, and rich ecosystem make it a great fit for implementing DDD. Frameworks like **FastAPI**, **Django**, or **SQLAlchemy** can be used to structure and implement DDD patterns.

---

## Implementing DDD in Python

### 1. Define the Domain Layer

The **Domain Layer** models the business logic using entities, value objects, and domain services.
        `
      }

      this.cache.set(path, response)
      return response
    }

    GithubFileSystem.prototype.ls = async function (directory, regexp = null) {
      return await ls.call(this, directory, regexp);
    }

    GithubFileSystem.prototype.cat = async function (path) {
      return await cat.call(this, path);
    }

    return GithubFileSystem;
}());

