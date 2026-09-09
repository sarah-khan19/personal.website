const menuToggle = document.querySelector('.menu-toggle')
const mobileNav = document.querySelector('.nav-mobile')

menuToggle?.addEventListener('click', () => {
  const open = mobileNav?.classList.toggle('open')
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false')
  document.body.style.overflow = open ? 'hidden' : ''
})

mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open')
    menuToggle?.setAttribute('aria-expanded', 'false')
    document.body.style.overflow = ''
  })
})

const form = document.querySelector('#contact-form')
const status = document.querySelector('.form-status')

form?.addEventListener('submit', (event) => {
  event.preventDefault()
  const data = new FormData(form)
  const name = String(data.get('name') ?? '').trim()
  const email = String(data.get('email') ?? '').trim()
  const message = String(data.get('message') ?? '').trim()
  const subject = encodeURIComponent(`Portfolio note from ${name}`)
  const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`)
  window.location.href = `mailto:sa29khan@uwaterloo.ca?subject=${subject}&body=${body}`
  if (status) {
    status.textContent = 'Your email app should open with the message filled in.'
  }
})

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const revealItems = document.querySelectorAll('.reveal')

if (reduceMotion) {
  revealItems.forEach((el) => el.classList.add('is-visible'))
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -10% 0px' },
  )

  revealItems.forEach((el) => observer.observe(el))
}
