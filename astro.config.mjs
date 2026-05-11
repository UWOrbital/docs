// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics'

// https://astro.build/config
export default defineConfig({
  site: 'https://uworbital.github.io',
  base: '/docs/',
  integrations: [
    starlight({
      customCss: [
        './src/styles/custom.css',
      ],
      expressiveCode: {
        themes: ['github-light-high-contrast', 'tokyo-night'],
        removeUnusedThemes: true,
        styleOverrides: {
          // You can also override styles
          borderRadius: '0.5rem',
          borderColor: ['gray', 'black'],
          frames: {
            terminalTitlebarBackground: ['#414868', 'lightGray'],
            terminalTitlebarBorderBottomColor: ['gray', 'black'],
            terminalTitlebarDotsOpacity: '0.5',
            terminalTitlebarForeground: ['white', 'black']
          }
        },
      },
      components: {
        ThemeSelect: './src/components/ThemeSelect.astro',
        Pagination: './src/components/Pagination.astro',
      },
      title: 'UW Orbital',
      logo: {
        src: './src/assets/icons/orbital_logo_long.png',
        replacesTitle: true,
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/UWOrbital',
        },
        {
          icon: 'discord',
          label: 'Discord',
          href: 'https://discord.gg/cw2gYKCTYJ',
        }],
      plugins: [
        starlightSidebarTopics([
          {
            label: 'Workflow',
            link: '/start-here/',
            icon: 'open-book',
            items: [
              {
                label: 'Start here',
                autogenerate: { directory: 'start-here' },
              },
            ],
          },
          {
            label: 'Firmware',
            link: '/fw-setup/',
            icon: 'setting',
            items: [
              {
                label: 'Setup',
                autogenerate: { directory: 'fw-setup'},
              },
              {
                label: 'Build guides',
                autogenerate: { directory: 'fw-build' },
              },
              {
                label: 'Comms guides',
                autogenerate: { directory: 'comms' },
              },
              {
                label: 'FreeRTOS tasks',
                autogenerate: { directory: 'tasks' },
              },
            ],
          },
          {
            label: 'Ground station',
            link: '/gs-setup/',
            icon: 'laptop',
            items: [
              {
                label: 'Setting up',
                autogenerate: { directory: 'gs-setup' },
              },
              {
                label: 'Frontend docs',
                autogenerate: { directory: 'frontend' },
              },
              {
                label: 'Backend docs',
                autogenerate: { directory: 'backend' },
              },
            ],
          },
          {
            label: 'Interfaces',
            link: '/interfaces/',
            icon: 'rss',
            items: [
              {
                label: 'Interfaces',
                autogenerate: { directory: 'interfaces' },
              },
            ],
          },
        ]),
      ],
    }),
  ],
});
