<script setup>


import {ref} from "vue";
import Modal from "@/components/Modal.vue";

const skills = ref([
  {
    name: 'Problem Solving',
    description: 'I have a knack for solving complex problems and creating efficient solutions, demonstrated through my work on ERP systems and AI-driven workflow improvements.',
    icon: 'light-bulb',
  },
  {
    name: 'Flexibility',
    description: 'I adapt quickly to new technologies and project requirements, having worked across multiple frameworks and programming languages in different roles.',
    icon: 'arrows-right-left',
  },
  {
    name: 'Adaptability',
    description: 'I have successfully transitioned between different tech stacks, such as from PHP-based software maintenance to Python/Vue full-stack development.',
    icon: 'arrows-right-left',
  },
  {
    name: 'Communication',
    description: 'I excel at explaining technical concepts to clients and teams, as demonstrated through leadership roles in volunteer organizations and client-facing projects.',
    icon: 'chat-bubble-left-right',
  },
  {
    name: 'LLMs',
    description: 'I have hands-on experience integrating large language models (LLMs) into applications to enhance functionality and user experience.',
    icon: 'server',
  },
  {
    name: 'Public Sector AI',
    description: 'Currently working with the North Carolina Department of Information Technology to design and prototype AI applications for government services.',
    icon: 'bolt',
  },
  {
    name: 'Python',
    description: 'Experienced in Python for backend development, data processing, and AI applications, used in projects like Voltera’s AI-driven SNF workflow optimizations.',
    icon: 'python',
  },
  {
    name: 'JavaScript',
    description: 'Proficient in JavaScript for front-end and full-stack development, including Vue.js, React.js, and Angular.',
    icon: 'code-bracket',
  },
  {
    name: 'Vue.js',
    description: 'Developed multiple applications using Vue.js, including a custom software solution for worship song lyric display.',
    icon: 'vue-logo',
  },
  {
    name: 'React.js',
    description: 'Built and maintained React.js applications, including AI-enhanced document processing at Voltera.',
    icon: 'react-logo',
  },
  {
    name: 'Angular',
    description: 'Worked with Angular for frontend development in an ERP system at Inonde.',
    icon: 'angular-logo',
  },
  {
    name: 'Node.js',
    description: 'Built backend services using Node.js, including Express APIs and MERN stack applications.',
    icon: 'node-js',
  },
  {
    name: 'Java',
    description: 'Experienced in Java for object-oriented programming, algorithm design, and coursework.',
    icon: 'code-bracket',
  },
  {
    name: 'PHP',
    description: 'Maintained and upgraded PHP-based applications for clients while at Inonde.',
    icon: 'code-bracket',
  },
  {
    name: 'MySQL',
    description: 'Designed and optimized MySQL databases for various applications, including ERP systems.',
    icon: 'circle-stack',
  },
  {
    name: 'MongoDB',
    description: 'Used MongoDB for NoSQL database management in MERN stack applications.',
    icon: 'server-stack',
  },
  {
    name: 'Docker',
    description: 'Containerized applications for deployment using Docker.',
    icon: 'cube',
  },
  {
    name: 'Kubernetes',
    description: 'Familiar with Kubernetes for container orchestration and scalable deployment strategies.',
    icon: 'server-stack',
  },
  {
    name: 'AWS',
    description: 'Worked with AWS services for hosting, cloud storage, and AI processing.',
    icon: 'aws-logo',
  },
  {
    name: '100 WPM Typing Speed',
    description: 'Highly efficient at typing, improving workflow and productivity in development and documentation.',
    icon: 'command-line',
  },
  {
    name: 'UI/UX Design',
    description: 'Designed and implemented user-friendly interfaces, especially in web development projects.',
    icon: 'window',
  },
  {
    name: 'Linux/Bash Scripting',
    description: 'Comfortable working in Linux environments, writing scripts for automation and system administration.',
    icon: 'computer-desktop',
  },
  {
    name: 'Version Control (Git)',
    description: 'Proficient in Git for collaboration and code management, integrating with 1Password for SSH key management.',
    icon: 'git',
  },
  {
    name: 'Squarespace Development',
    description: 'Built and maintained multiple Squarespace websites for small businesses and nonprofits. ' +
        'Squarespace Circle member.',
    icon: 'squarespace-logo',
  },
  {
    name: 'Adobe Creative Suite',
    description: 'Skilled in Photoshop, Premiere, InDesign, and Audition for multimedia projects.',
    icon: 'adobe-logo',
  },
]);

const projects = ref([
  {
    name: 'Write In Wallace West',
    type: 'Website Design',
    description: 'I built a bold, engaging website for Wallace West’s District 18 campaign, ensuring a seamless ' +
        'experience for visitors to learn about his platform and get involved. Combined with dynamic social media ' +
        'graphics and print materials, the site helped amplify his message across multiple channels.',
    link: 'https://writeinwallacewest.com'
  },
  {
    name: 'Spiritual Twist Productions',
    type: 'Web Development',
    description: 'Spiritual Twist Productions needed a modern website and a custom registration system to manage their ' +
        'growing programs. I redesigned their site and built an intuitive signup platform, improving accessibility and ' +
        'streamlining administrative tasks for staff and participants.\n',
    link: 'https://spiritualtwist.com'
  },
  {
    name: 'Brandy Morley Music',
    type: 'Website Design',
    description: 'I designed a responsive website for Brandy Morley Music, showcasing her debut album YOU STAY with' +
        'integrated music streaming, a blog, and an online store. The site includes a newsletter signup with a fre' +
        ' magazine download to share song stories.\n',
    link: 'https://brandymorleymusic.com'
  },
  {
    name: 'Personal Portfolio Site',
    type: 'Front-End Development',
    description: 'I built a sleek, responsive portfolio using Vue.js and Tailwind CSS to showcase my work in full-stack ' +
        'development and UI/UX design. The site is optimized for performance, ensuring a smooth browsing experience for ' +
        'potential clients and employers.',
    link: 'https://lukeertzberger.com'
  },
  {
    name: 'STP Worship System',
    type: 'Software Development',
    description: 'I built a Python/Flask and Vue.js system that synchronizes lyrics and chord charts in real time for ' +
        'Spiritual Twist Productions. It runs offline on a Raspberry Pi network with a secure lockdown browser and mobile ' +
        'controls to streamline worship services.',
    link: '/STP%20Worship%20System%20Vue.js%20Python.pdf'
  },
  {
    name: 'And Many More!',
    type: 'Software, Web, Media, and More',
    description: 'From AI-powered software to branding and web development, I’ve tackled a wide range of projects. ' +
        'I’d love for yours to be next! Let’s connect to discuss how I can help bring your vision to life.\n',
    link: '/contact',
    linkText: 'Contact Me'
  }
]);

const skillsModalOpen = ref(false)

const skillsModalInfo = ref({
  title: 'Skill Loading...',
  description: 'Description Loading...',
  icon: 'server',
})

const openSkillsModal = (skill) => {
  skillsModalInfo.value = skill
  skillsModalInfo.value.title = skill?.name
  skillsModalOpen.value = true
}
</script>

<template>
  <main class="bg-gray-900 text-white">
    <div id="home"><!-- So it will jump to here not to the hero below --></div>

    <!-- Hero Section -->
    <section class="text-center py-20">
      <h2 class="text-4xl font-bold font-heading" v-fade-in>LUKE ERTZBERGER</h2>
      <p class="text-gray-400 mt-4" v-fade-in>Senior AI Engineer | Technical Advisor | Problem Solver</p>
      <div class="flex flex-wrap justify-center items-center gap-3 mt-6">
        <a href="https://checkr.com/profiles/u/3b74a057-6205-47a5-8f00-37d67729f0bd?_ref=embed_badge" target="_blank" rel="noopener">
          <img src="https://checkr.com/profiles/u/3b74a057-6205-47a5-8f00-37d67729f0bd/verified_badge?_ref=embed_badge" alt="Checkr Profile" />
        </a>

        <a href="https://pros.squarespace.com/blog/work-with-a-circle-member" target="_blank" rel="noopener">
          <img src="/logos/Circle%20Gold%20Partner%202025.webp" alt="Squarespace Circle Gold Partner" width="100"/>
        </a>

        <a href="https://apps.apple.com/us/developer/luke-ertzberger/id1828987839" target="_blank" rel="noopener">
          <img src="https://img.shields.io/badge/Apple%20Developer-555555?logo=apple&logoColor=white" alt="Apple Developer" />
        </a>


        <a href="https://www.linkedin.com/in/lukeertzberger/overlay/about-this-profile/" target="_blank" rel="noopener">
          <img src="/logos/linked-in-verified-badge.webp" alt="LinkedIn Verified" width="100"/>
        </a>


        <a href="https://www.hackerrank.com/certificates/93af2358ff6e" target="_blank" rel="noopener">
          <img src="https://img.shields.io/badge/HackerRank-Software%2520Engineer?style=flat&logo=hackerrank&logoColor=white&logoSize=10&label=Software%20Engineer&labelColor=%2332c766&color=lightgrey" alt="HackerRank Software Developer Certification" />
        </a>

      </div>
      <div class="flex justify-center mt-6" v-fade-in>
        <div class="grid grid-cols-1 md:grid-cols-2 py-5 mx-10 max-w-300 gap-12 md:gap-0">
          <div class="">
            <p class="text-grey-400 text-center w-full text-2xl">
              Hi! I'm an AI Developer and Technical Advisor passionate about designing responsible AI solutions and engaging digital experiences for the public sector.
              I specialize in building advanced AI applications with large language models and machine learning frameworks, while also bringing full-stack development expertise to create scalable systems that serve citizens effectively.
              I excel at transforming complex AI concepts into practical, ethical solutions that streamline government workflows and enhance public services.
            </p>
            <a href="#projects" class="mt-6 inline-block bg-cyan-500 px-6 py-3 rounded-lg hover:bg-cyan-600">View My
              Work</a>
          </div>

          <div class="w-full flex justify-center">
            <img
                src="/images/luke-headshot-transparent-background.png"
                alt="A digitally painted portrait of a young man with light skin, short light brown hair, and blue eyes.
                 He is wearing a black suit with a white dress shirt and a black tie. He has a warm smile and is looking
                 slightly to the side. The background is a neutral gray color, and the art style is semi-realistic with
                 smooth shading and soft lighting."
                 class="shadow-lg aspect-square w-90 h-90 rotate-3 rounded-2xl bg-zinc-100 object-cover dark:bg-zinc-800"
            >
          </div>
        </div>
      </div>

    </section>

    <!-- About Section -->
    <section id="about" class="py-20 bg-gray-800">
      <div class="container mx-auto text-center flex justify-center flex-col max-w-300" v-fade-in>
        <h2 class="text-3xl font-bold font-heading">A Bit About Me</h2>
        <p class="text-gray-400 mt-4 px-4">
          I'm passionate about building responsible and impactful AI solutions for the public sector and private enterprise. Currently serving with the <a href="https://it.nc.gov" target="_blank" class="underline">North Carolina Department of Information Technology</a> as an AI Developer and Technical Advisor, I design and prototype advanced AI applications leveraging large language models, AI agents, and machine learning frameworks while guiding strategic adoption across state agencies. My role spans building proof-of-concepts and pilot applications, evaluating emerging technologies such as synthetic data and digital twins, and advising teams on responsible integration of AI into government services. I contribute to establishing AI governance frameworks and practical policies that prioritize ethics, security, and transparency, helping lead innovation efforts that ensure North Carolina's AI initiatives remain accountable, impactful, and citizen-focused.
          <br><br>
          I also serve as a Senior AI Engineer at <a href="https://synply.io" target="_blank" class="underline">Synply</a>, where I develop cutting-edge AI systems and advise on strategic implementations that enhance efficiency, scalability, and innovation. I work closely with leadership to align AI initiatives with business objectives while ensuring technical excellence and ethical integrity in all deployments.
          <br><br>
          My technical expertise spans Python, JavaScript, and full-stack development, with specialized experience in AI-driven solutions and scalable digital systems. Through my work at <a href="https://triunecreative.com" target="_blank" class="underline">Triune Creative</a>, I've led web design and media projects for nonprofits and small businesses, focusing on user-friendly, client-centric designs. My development experience also includes work at various startups engineering AI-enhanced workflows, optimizing ERP systems, and leveraging cloud infrastructure to improve software performance.
          <br><br>
          Beyond coding, I have a diverse range of interests and experiences that shape who I am. I was homeschooled, which gave me the flexibility to develop a deep love for learning and problem-solving. Music is also a significant part of my life - I've played piano since I was four and currently <a href="https://sophisticatedsoundandkeys.com/" target="_blank" class="underline">play weddings</a>. In my free time, I enjoy reading, particularly books on apologetics, allegories, and historical fiction.
        </p>
      </div>
    </section>

    <!-- Skills Modal -->
    <Modal
        v-model:open="skillsModalOpen"
        :title="skillsModalInfo.title"
        :message="skillsModalInfo.description"
        :icon="skillsModalInfo.icon"
        icon-color-class="text-cyan-500"
    />

    <!-- Skills Section -->
    <section id="skills" class="py-20 flex justify-center">
      <div class="container mx-auto text-center max-w-300" v-fade-in>
        <h2 class="text-3xl font-bold font-heading">Skills</h2>
        <div class="container mx-auto text-center flex justify-center">
          <p class="text-gray-400 mt-3 max-w-200 text-center">
            I have experience in a variety of technologies and tools, including but not limited to some of the skills listed below. Click on each to learn more!
          </p>
        </div>

        <div class="flex flex-wrap justify-center mt-6 gap-4 px-2">
          <template v-for="skill in skills">
            <span class="bg-gray-700 px-4 py-2 rounded act-like-button" @click="openSkillsModal(skill)">{{ skill?.name }}</span>
          </template>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-20 bg-gray-800">
      <div class="container mx-auto text-center" v-fade-in-immediately>
        <h2 class="text-3xl font-bold font-heading">Projects</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          <template v-for="project in projects">
            <div class="bg-gray-700 p-6 rounded-lg">
              <h3 class="text-lg font-semibold font-heading">{{ project?.name }}</h3>
              <h5 class="text-gray-500 mt-2">{{ project?.type }}</h5>
              <p class="text-gray-400 mt-2">{{ project?.description }}</p>
              <a
                  :href="project?.link"
                  class="mt-4 inline-block bg-cyan-500 px-6 py-3 rounded-lg hover:bg-cyan-600"
                  target="_blank"
              >{{ project?.linkText ? project.linkText : "View Project" }}</a>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-20">
      <div class="container mx-auto text-center" v-fade-in>
        <h2 class="text-3xl font-bold font-heading">Contact Me</h2>
        <p class="text-gray-400 mt-4 px-5">Reach out for collaborations, projects, or just to say hi!</p>
        <a href="/contact" class="mt-6 inline-block bg-cyan-500 px-6 py-3 rounded-lg hover:bg-cyan-600">Let's Connect</a>
      </div>
    </section>
  </main>
</template>

<style scoped>
.act-like-button {
  cursor: pointer;
  transition: background-color 0.3s ease;
}
</style>