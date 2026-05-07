export const checkCheck = {
  isExist(x, err) {
    if (
      x === undefined ||
      x === null ||
      (typeof x === 'string' && x.trim().length === 0)
    ) {
      if (err) {
        err.push('This field is required.')
        return err
      } else return false
    }
    return err || true
  },
  isValidName(name, err) {
    this.isExist(name, err)
    if (name.length < 2 || name.length > 20)
      err.push(
        'Name should be at least 2 characters long with a max of 20 characters',
      )
    if (!/^[a-zA-Z]+$/.test(name)) err.push('Name is letters only')
    return err
  },
  isValidEmail(email, err) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    this.isExist(email, err)
    if (!emailRegex.test(email)) err.push('Please enter a valid email address.')
    return err
  },
  isValidPassword(password, err) {
    this.isExist(password, err)
    if (password.length < 8)
      err.push('Password should be a minimum of 8 characters long')
    if (!/[A-Z]/.test(password))
      err.push('Password should contain at least one uppercase character')
    if (!/[0-9]/.test(password))
      err.push('Password should contain at least one number')
    if (!/[^A-Za-z0-9]/.test(password))
      err.push('Password should contain at least one special character')
    return err
  },
  isValidAge(age, err) {
    this.isExist(age, err)
    if (!Number.isInteger(age) || Number(age) <= 0)
      err.push('Please enter a valid age.')
    age = parseInt(age)
    if (isNaN(age)) err.push('Age should be a number.')
    if (age < 13) err.push('You must be at least 13 years old to register.')
    return err
  },
  isValidMaxParticipants(maxParticipants, err) {
    this.isExist(maxParticipants, err)
    if (!Number.isInteger(maxParticipants) || Number(maxParticipants) <= 0)
      err.push('Max participants must be a positive number.')
    return err
  },
  isValidDescription(description, err) {
    this.isExist(description, err)
    if (description.length < 10 || description.length > 500)
      err.push(
        'Description should be at least 10 characters long with a max of 500 characters',
      )
    return err
  },
}
