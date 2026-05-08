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

  // Home
  const searchForm = document.querySelector('form[action="/"]')
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      const searchText = getFieldValue(searchForm, 'searchText')
      const sports = getFieldValue(searchForm, 'sport')

      const errors = []
      checkCheck.isValidRange(sports, errors, 'sport')
      checkCheck.isValidSearch(searchText, errors)
      if (errors.length > 0) {
        e.preventDefault()
        // showErrors(searchForm, errors)
        alert(errors.join('\n'))
      }
    })
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

      let errors = []
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

      let errors = []
      checkCheck.isValidName(firstName, errors)
      checkCheck.isValidName(lastName, errors)
      checkCheck.isValidEmail(email, errors)
      checkCheck.isValidPassword(password, errors)
      checkCheck.isValidAge(age, errors)
      checkCheck.isValidRange(gender, errors, 'gender')
      checkCheck.isValidRange(skill, errors, 'skill')
      checkCheck.isValidRange(city, errors, 'city')
      checkCheck.isValidRange(state, errors, 'state')

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
      const ageRestriction = getFieldValue(postCreateForm, 'ageRestriction')
      const skillLevel = getFieldValue(postCreateForm, 'skillLevel')
      const genderRestriction = getFieldValue(
        postCreateForm,
        'genderRestriction',
      )
      const description = getFieldValue(postCreateForm, 'description')

      let errors = []
      checkCheck.isValideTitle(title, errors)
      checkCheck.isValidRange(sport, errors, 'sport')
      checkCheck.isValideLocation(location, errors)
      checkCheck.isValideDateAndTime(date, time, errors)
      checkCheck.isValidMaxParticipants(maxParticipants, errors)
      checkCheck.isValidAgeRestriction(ageRestriction, errors)
      checkCheck.isValidRange(skillLevel, errors, 'skill')
      checkCheck.isValidRange(genderRestriction, errors, 'genderRestriction')
      checkCheck.isValidDescription(description, errors)

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
      const bio = getFieldValue(profileEditForm, 'bio')

      let errors = []
      checkCheck.isValidName(firstName, errors)
      checkCheck.isValidName(lastName, errors)
      checkCheck.isValidCity(city, errors)
      checkCheck.isValidRange(state, errors, 'state')
      checkCheck.isValidBio(bio, errors)

      if (errors.length > 0) {
        e.preventDefault()
        showErrors(profileEditForm, errors)
      } else {
        showErrors(profileEditForm, [])
      }
    })
  }

  // edit comment
  const commentForm = document
    .querySelector('textarea[name="comment"]')
    ?.closest('form')
  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault()
      const comment = getFieldValue(commentForm, 'comment')
      const errors = []
      checkCheck.isValidComment(comment, errors)

      if (errors.length > 0) {
        showErrors(commentForm, errors)
        return
      }

      const requestConfig = {
        method: 'POST',
        url: commentForm.action,
        contentType: 'application/json',
        data: JSON.stringify({ comment })
      }

      $.ajax(requestConfig).then(
        (data) => {
          if (!data.success) {
            showErrors(commentForm, data.errors || ['Could not post comment.'])
            return
          }

          showErrors(commentForm, [])

          const commentList = document.querySelector('.comment-list')
          const commentElement = document.createElement('div')
          commentElement.className = 'comment'

          const authorElement = document.createElement('strong')
          authorElement.textContent = data.comment.author

          const contentElement = document.createElement('p')
          contentElement.textContent = data.comment.content

          commentElement.appendChild(authorElement)
          commentElement.appendChild(contentElement)
          commentList.appendChild(commentElement)
          commentForm.querySelector('textarea[name="comment"]').value = ''
        },
        (error) => {
          if (error.status === 401) {
            window.location.href = '/profile/login'
            return
          }

          if (error.responseJSON && error.responseJSON.errors) {
            showErrors(commentForm, error.responseJSON.errors)
          } else {
            showErrors(commentForm, ['Could not submit comment. Please try again.'])
          }
        }
      )
    })
  }

  // Report page
  const reportForm = document.querySelector('form[action="/report"]')
  if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      const reportType = getFieldValue(reportForm, 'reportType')
      const targetEmail = getFieldValue(reportForm, 'targetEmail')
      const reason = getFieldValue(reportForm, 'reason')
      const description = getFieldValue(reportForm, 'description')

      let errors = []
      checkCheck.isValidRange(reportType, errors, 'reportType')
      checkCheck.isValidEmail(targetEmail, errors)
      checkCheck.isValidRange(reason, errors, 'reason')
      checkCheck.isValidDescription(description, errors)

      if (errors.length > 0) {
        e.preventDefault()
        showErrors(reportForm, errors)
      } else {
        showErrors(reportForm, [])
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
