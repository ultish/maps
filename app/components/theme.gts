import Component from '@glimmer/component';
import { didInsert } from './ol';
export default class Theme extends Component {
  inserted() {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // Get the html element

    // Check user preference on page load
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    if (prefersDark) {
      htmlElement.classList.add('dark-theme');
    }

    themeToggle.addEventListener('click', () => {
      htmlElement.classList.toggle('dark-theme');

      // Save the theme to localStorage (optional)
      const theme = htmlElement.classList.contains('dark-theme')
        ? 'dark'
        : 'light';
      localStorage.setItem('theme', theme);
    });

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      htmlElement.classList.add(`${savedTheme}-theme`);
    }
  }

  <template>
    <button id='theme-toggle' {{didInsert onInsert=this.inserted}}>Toggle Theme</button>
  </template>
}
