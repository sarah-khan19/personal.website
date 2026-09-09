import { createRoot } from 'react-dom/client'
import AnimatedList from './AnimatedList.jsx'

const items = [
  'University of Waterloo Math',
  "President's Scholarship",
  'Web & SEO Consultant',
  'Math Tutor',
  'Soulful Colour research',
  'Python CLI practice',
  'HTML, CSS & Python',
  'Open to internships',
]

const destinations = {
  'University of Waterloo Math': '#education',
  "President's Scholarship": '#education',
  'Web & SEO Consultant': '#experience',
  'Math Tutor': '#experience',
  'Soulful Colour research': '#projects',
  'Python CLI practice': '#projects',
  'HTML, CSS & Python': '#skills',
  'Open to internships': '#contact',
}

const root = document.getElementById('animated-list-root')

if (root) {
  createRoot(root).render(
    <AnimatedList
      items={items}
      showGradients
      displayScrollbar={false}
      onItemSelect={(item) => {
        const href = destinations[item]
        if (href) {
          document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
        }
      }}
    />,
  )
}
