import './assets/main.css'
import './assets/base.scss'
import router from './router'


import { createApp } from 'vue'
import App from './App.vue'


const fadeIn = {
    mounted(el) {
        // Automatically add the required classes.
        el.classList.add('opacity-0', 'transition-opacity', 'duration-1000');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Trigger when at least 33% of the element is visible.
                if (entry.intersectionRatio >= 0.33) {
                    el.classList.add('opacity-100');

                    // Remove opacity-0 after the transition completes.
                    const handleTransitionEnd = (e) => {
                        if (e.propertyName === 'opacity') {
                            el.classList.remove('opacity-0');
                            el.removeEventListener('transitionend', handleTransitionEnd);
                        }
                    };
                    el.addEventListener('transitionend', handleTransitionEnd);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.33 });

        observer.observe(el);
    }
}

const fadeInImmediately = {
    mounted(el) {
        // Automatically add the required classes.
        el.classList.add('opacity-0', 'transition-opacity', 'duration-1000');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Trigger when at least 5% of the element is visible.
                if (entry.intersectionRatio >= 0.05) {
                    el.classList.add('opacity-100');

                    // Remove opacity-0 after the transition completes.
                    const handleTransitionEnd = (e) => {
                        if (e.propertyName === 'opacity') {
                            el.classList.remove('opacity-0');
                            el.removeEventListener('transitionend', handleTransitionEnd);
                        }
                    };
                    el.addEventListener('transitionend', handleTransitionEnd);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.33 });

        observer.observe(el);
    }
}



const app = createApp(App)
app.use(router)
app.directive('fade-in', fadeIn)
app.directive('fade-in-immediately', fadeInImmediately)
app.mount('#app')
