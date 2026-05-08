import { validRange } from './validRange.js'
const nameRegex = /^[a-zA-Z]+$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const titleRegex = /^[a-zA-Z\s]+$/
const cityRegex = /^[a-zA-Z\s]+$/

export const checkCheck = {
  isExist(x, err, text = 'This field') {
    if (
      x === undefined ||
      x === null ||
      (typeof x === 'string' && x.trim().length === 0)
    ) {
      if (err) err.push(`${text} is required.`)
      return false
    }
    return true
  },
  isValidLength(value, err, min, max, text = 'This field') {
    if (max === Infinity) {
      if (value.length < min) {
        err.push(`${text} should be at least ${min} characters long.`)
        return false
      }
    } else if (value.length < min || value.length > max) {
      err.push(`${text} should be between ${min} and ${max} characters long.`)
      return false
    }
    return true
  },
  isValidWords(value, err) {
    if (
      validRange['keyWordModeration'].some((word) =>
        value.toLowerCase().includes(word),
      )
    ) {
      err.push('Detected inappropriate language.')
      return false
    }
    return true
  },
  isValidRex(value, err, regex, text = 'Please enter a valid value') {
    if (!regex.test(value)) {
      err.push(`${text}`)
      return false
    }
    return true
  },
  isValidName(name, err) {
    if (!this.isExist(name, err, 'Name')) return
    if (!this.isValidLength(name, err, 2, 20, 'Name')) return
    this.isValidRex(name, err, nameRegex, 'Name can only contain letters')
  },
  isValidEmail(email, err) {
    if (!this.isExist(email, err, 'Email')) return
    !this.isValidRex(
      email,
      err,
      emailRegex,
      'Please enter a valid email address.',
    )
  },
  isValidPassword(password, err) {
    if (!this.isExist(password, err, 'Password')) return
    if (!this.isValidLength(password, err, 8, Infinity, 'Password')) return
    if (!/[A-Z]/.test(password))
      err.push('Password should contain at least one uppercase character')
    if (!/[0-9]/.test(password))
      err.push('Password should contain at least one number')
    if (!/[^A-Za-z0-9]/.test(password))
      err.push('Password should contain at least one special character')
  },
  isValidAge(age, err) {
    if (!this.isExist(age, err, 'Age')) return
    if (!Number.isInteger(age)) err.push('Age should be a number.')
    age = parseInt(age)
    if (isNaN(age)) err.push('Age should be a number.')
    if (age <= 0 || age > 120) err.push('Please enter a valid age.')
    if (age < 13) err.push('You must be at least 13 years old to register.')
  },
  isValidMaxParticipants(maxParticipants, err) {
    if (!this.isExist(maxParticipants, err, 'Max participants')) return
    const num = Number(maxParticipants)
    if (!Number.isInteger(num) || Number(num) <= 0)
      err.push('Max participants must be a positive number.')
    if (num < 2 || num > 20)
      err.push('Max participants must be between 2 and 20.')
  },
  isValidAgeRestriction(ageRestriction, err) {
    if (!this.isExist(ageRestriction, err, 'Age restriction')) return
    const parts = ageRestriction.split('-')
    if (parts.length !== 2) {
      err.push('Age restriction must be in the format "min-max".')
      return
    }
    const min = Number(parts[0])
    const max = Number(parts[1])
    if (
      !Number.isInteger(min) ||
      !Number.isInteger(max) ||
      min < 0 ||
      max < 0 ||
      min > max
    ) {
      err.push('Please enter a valid age restriction range.')
    }
    if (min < 13 || max > 120)
      err.push('Age restriction must be between 13 and 120.')
  },
  isValidDescription(description, err) {
    if (!this.isExist(description, err, 'Description')) return
    this.isValidLength(description, err, 10, 300, 'Description')
  },
  isValideTitle(title, err) {
    if (!this.isExist(title, err, 'Title')) return
    if (
      !this.isValidRex(
        title,
        err,
        titleRegex,
        'Invalid character in title, can only contain letters and spaces',
      )
    )
      return
    this.isValidLength(title, err, 3, 20, 'Title')
  },
  isValideLocation(location, err) {
    if (!this.isExist(location, err, 'Location')) return
    this.isValidLength(location, err, 5, 100, 'Location')
  },
  isValideDateAndTime(date, time, err) {
    if (!this.isExist(date, err, 'Date')) return
    if (!this.isExist(time, err, 'Time')) return
    const now = new Date()
    const inputDate = new Date(`${date}T${time}`)
    if (isNaN(inputDate.getTime()))
      err.push('Please enter a valid date and time.')
    else if (inputDate < now) err.push('Date and time must be in the future.')
  },
  isValidBio(bio, err) {
    if (!this.isExist(bio, err, 'Bio')) return
    if (!this.isValidLength(bio, err, 5, 200, 'Bio')) return
    this.isValidWords(bio, err)
  },
  isValidCity(city, err) {
    if (!this.isExist(city, err, 'City')) return
    if (!this.isValidLength(city, err, 1, 45, 'City')) return
    this.isValidRex(
      city,
      err,
      cityRegex,
      'Invalid character in city, can only contain letters and spaces',
    )
  },
  isValidComment(comment, err) {
    if (!this.isExist(comment, err, 'Comment')) return
    if (!this.isValidLength(comment, err, 2, 300, 'Comment')) return
    this.isValidWords(comment, err)
  },
  isValidSearch(searchText, err) {
    if (!this.isExist(searchText, err, 'Search text')) return
    if (!this.isValidLength(searchText, err, 0, 100, 'Search text')) return
    this.isValidWords(searchText, err)
  },
  isValidRange(value, err, tar) {
    if (!this.isExist(value, err, tar)) return
    if (!validRange[tar].includes(value.toLowerCase()))
      err.push(
        `Please input a valid ${tar}. The valid options are: ${validRange[tar].join(', ')}.`,
      )
  },
}
