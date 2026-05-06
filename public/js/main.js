document.addEventListener('DOMContentLoaded', () => {
  const showLoginButton = document.getElementById('show-login-button')
  const loginPage = document.getElementById('login-page')

  if (showLoginButton && loginPage) {
    showLoginButton.addEventListener('click', () => {
      loginPage.classList.toggle('login-mode')
    })
  }

  const loginForm = document.getElementById('login-form')

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      const email = document.getElementById('login-email').value.trim()
      const password = document.getElementById('login-password').value.trim()
      const errorBox = document.getElementById('login-client-error')

      const errors = []

      if (!email) {
        errors.push('Email is required.')
      } else if (!email.includes('@') || email.split('@').length !== 2) {
        errors.push('Please enter a valid email address.')
      }

      if (!password) {
        errors.push('Password is required.')
      } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters long.')
      } else if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter.')
      } else if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number.')
      } else if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push('Password must contain at least one special character.')
      }

      if (errors.length > 0) {
        e.preventDefault()
        errorBox.hidden = false
        errorBox.textContent = errors.join(' ')
        loginPage.classList.add('login-mode')
      } else {
        errorBox.hidden = true
        errorBox.textContent = ''
      }
    })
  }

  const backendError = document.getElementById('errmess2')
  if (backendError && loginPage) {
    loginPage.classList.add('login-mode')
  }

  const transitionLinks = document.querySelectorAll('.page-transition-link')

  transitionLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault()

      const href = link.getAttribute('href')

      document.body.classList.add('page-fade-out')

      setTimeout(() => {
        window.location.href = href
      }, 350)
    })
  })
})
