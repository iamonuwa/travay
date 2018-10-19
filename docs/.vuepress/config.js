module.exports = {
  title: 'Travay Guide',
  description: 'How to use Travay',
  base: '/guide/',
  // dest: path.join(path.resolve(__dirname), '..', '..', 'dist', 'docs'),
  locales: {
    '/en/': {
      lang: 'English',
      title: 'Travay',
      description: 'The Long-Term Jobs Market of Haiti'
    },
    '/ht/': {
      lang: 'Haitian Creole',
      title: 'Travay',
      description: 'Travay nan long tèm nan Ayiti'
    },
    '/fr/': {
      lang: 'French',
      title: 'Travay',
      description: 'FR LANGUAGE'
    }
  },
  themeConfig: {
    lastUpdated: 'Last Updated',
    nav: [
      {text: 'Home', link: '/'},
      {text: 'Go to Travay', link: 'https://www.travayht.com'},
      {text: 'Contact Us', link: '../en/contact-us'},
    ],
    sidebar: [
      {
        title: 'Travay',
        collapsable: true,
        children: [
          '/',
          '../en/how-tos',
          '../en/faqs',
          '../en/dictionary',
          '../en/privacy-policy',
          '../en/contact-us'
        ]
      },
      {
        title: 'Required Third Party Applications',
        collapsable: true,
        children: [
          '../en/tools/metamask'
        ]
      }
    ]
  }
};
