import { checkCheck } from './clientValidation.js'
document.addEventListener('DOMContentLoaded', () => {
  const getFieldValue = (form, name) => {
    const fields = form.querySelectorAll(`[name="${name}"]`)
    if (!fields.length) return ''
    const first = fields[0]
    if (
      fields.length > 1 &&
      (first.type === 'radio' || first.type === 'checkbox')
    ) {
      const checked = Array.from(fields).find((f) => f.checked)
      return checked ? checked.value.trim() : ''
    }
    return (first.value || '').trim()
  }

  const showErrors = (form, errors, fallbackId = null) => {
    let errorBox = form.querySelector('.client-error')

    if (!errorBox && fallbackId) {
      errorBox = document.getElementById(fallbackId)
    }

    if (!errorBox) {
      errorBox = document.createElement('p')
      errorBox.className = 'error client-error'
      form.insertBefore(errorBox, form.querySelector('button[type="submit"]'))
    }

    if (errors.length > 0) {
      errorBox.hidden = false
      errorBox.textContent = errors.join(' ')
    } else {
      errorBox.hidden = true
      errorBox.textContent = ''
    }
  }

  // Login
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
      const email = getFieldValue(loginForm, 'email')
      const password = getFieldValue(loginForm, 'password')

      const errors = []
      errors = checkCheck.isValidEmail(email, errors)
      errors = checkCheck.isValidPassword(password, errors)

      if (errors.length > 0) {
        e.preventDefault()
        showErrors(loginForm, errors, 'login-client-error')
        if (loginPage) loginPage.classList.add('login-mode')
      } else {
        showErrors(loginForm, [], 'login-client-error')
      }
    })
  }

  // Register
  const registerForm = document.querySelector(
    'form[action="/profile/register"]',
  )

  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      const firstName = getFieldValue(registerForm, 'firstName')
      const lastName = getFieldValue(registerForm, 'lastName')
      const email = getFieldValue(registerForm, 'email')
      const password = getFieldValue(registerForm, 'password')
      const age = getFieldValue(registerForm, 'age')
      const gender = getFieldValue(registerForm, 'gender')
      const skill = getFieldValue(registerForm, 'skill')
      const city = getFieldValue(registerForm, 'city')
      const state = getFieldValue(registerForm, 'state')

      const errors = []
      errors = checkCheck.isValidName(firstName, errors)
      errors = checkCheck.isValidName(lastName, errors)
      errors = checkCheck.isValidEmail(email, errors)
      errors = checkCheck.isValidPassword(password, errors)
      errors = checkCheck.isValidAge(age, errors)
      errors = checkCheck.isExist(gender, errors)
      errors = checkCheck.isExist(skill, errors)
      errors = checkCheck.isExist(city, errors)
      errors = checkCheck.isExist(state, errors)

      if (errors.length > 0) {
        e.preventDefault()
        showErrors(registerForm, errors)
      } else {
        showErrors(registerForm, [])
      }
    })
  }

  // Create post
  const postCreateForm = document.querySelector('form[action="/posts/create"]')

  if (postCreateForm) {
    postCreateForm.addEventListener('submit', (e) => {
      const title = getFieldValue(postCreateForm, 'title')
      const sport = getFieldValue(postCreateForm, 'sport')
      const location = getFieldValue(postCreateForm, 'location')
      const date = getFieldValue(postCreateForm, 'date')
      const time = getFieldValue(postCreateForm, 'time')
      const maxParticipants = getFieldValue(postCreateForm, 'maxParticipants')
      const skillLevel = getFieldValue(postCreateForm, 'skillLevel')
      const genderRestriction = getFieldValue(
        postCreateForm,
        'genderRestriction',
      )
      const description = getFieldValue(postCreateForm, 'description')

      const errors = []
      errors = checkCheck.isExist(title, errors)
      errors = checkCheck.isExist(sport, errors)
      errors = checkCheck.isExist(location, errors)
      errors = checkCheck.isExist(date, errors)
      errors = checkCheck.isExist(time, errors)
      errors = checkCheck.isValidMaxParticipants(maxParticipants, errors)
      errors = checkCheck.isExist(skillLevel, errors)
      errors = checkCheck.isExist(genderRestriction, errors)
      errors = checkCheck.isValidDescription(description, errors)

      if (errors.length > 0) {
        e.preventDefault()
        showErrors(postCreateForm, errors)
      } else {
        showErrors(postCreateForm, [])
      }
    })
  }

  // Edit profile
  const profileEditForm = document.querySelector('form[action="/profile/edit"]')

  if (profileEditForm) {
    profileEditForm.addEventListener('submit', (e) => {
      const firstName = getFieldValue(profileEditForm, 'firstName')
      const lastName = getFieldValue(profileEditForm, 'lastName')
      const city = getFieldValue(profileEditForm, 'city')
      const state = getFieldValue(profileEditForm, 'state')

      const errors = []
      errors = checkCheck.isExist(firstName, errors)
      errors = checkCheck.isExist(lastName, errors)
      errors = checkCheck.isExist(city, errors)
      errors = checkCheck.isExist(state, errors)

      if (errors.length > 0) {
        e.preventDefault()
        showErrors(profileEditForm, errors)
      } else {
        showErrors(profileEditForm, [])
      }
    })
  }

  // Backend login error
  const backendError = document.getElementById('errmess2')
  if (backendError && loginPage) {
    loginPage.classList.add('login-mode')
  }

  // Page transition links
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
