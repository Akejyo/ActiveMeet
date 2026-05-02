export const checkCheck = {
  isValidName(name) {
    name = this.isString(name, 'Name')
    if (name.length < 2 || name.length > 20)
      throw 'Name should be at least 2 characters long with a max of 20 characters'
    if (!/^[a-zA-Z]+$/.test(name)) throw 'Name is letters only'
    return name
  },
  isValidHandle(handle) {
    handle = this.isString(handle, 'Handle')
    if (handle.length < 5 || handle.length > 12)
      throw 'Handle should be at least 5 characters long with a max of 12 characters'
    if (!/^[a-zA-Z0-9]+$/.test(handle))
      throw 'Handle should only contain letters and positive whole numbers'
    return handle
  },
  isValidPassword(password) {
    password = this.isString(password, 'Password')
    if (password.length < 8)
      throw 'Password should be a minimum of 8 characters long'
    if (!/[A-Z]/.test(password))
      throw 'Password should contain at least one uppercase character'
    if (!/[0-9]/.test(password))
      throw 'Password should contain at least one number'
    if (!/[^A-Za-z0-9]/.test(password))
      throw 'Password should contain at least one special character'
    return password
  },
  isValidMembershipLevel(membershipLevel) {
    // transform to lowercase
    membershipLevel = this.isString(
      membershipLevel,
      'Membership Level',
    ).toLowerCase()
    const validLevels = ['manager', 'member']
    if (!validLevels.includes(membershipLevel))
      throw `The ONLY two valid membershipLevels are "manager" or "member"`
    return membershipLevel
  },
  isExist(x) {
    if (x === undefined || x === null)
      throw `provided variable is undefined or null`
    return true
  },
  isArray(x) {
    this.isExist(x)
    if (!Array.isArray(x)) throw `${x} is not an array or no variable provided`
    return true
  },
  isNumber(x, text = 'provided variable') {
    this.isExist(x)
    if (typeof x !== 'number') throw `${x} is not a number`
    if (isNaN(x)) throw `${text} is NaN`
    if (Math.abs(x) === Infinity) throw `${text} is Infinity`
    return true
  },
  isString(x, text = 'string') {
    this.isExist(x, text)
    // is string and not empty after .trim(), return .trim()
    if (!(typeof x === 'string' || x instanceof String))
      throw `${x} is not a string`
    let s = x.trim()
    if (s.length === 0) throw `${text} is empty`
    return s
  },
  isEmpty(x, text = 'provided variable') {
    this.isExist(x, text)
    if (!x.length) throw `${text} is empty`
    return true
  },
  isObject(x) {
    this.isExist(x)
    if (Array.isArray(x) || x === null || typeof x !== 'object')
      throw `${x} is not an Object`
    return true
  },
  isFunc(x) {
    this.isExist(x)
    if (typeof x !== 'function') throw `${x} is not a function`
    return true
  },
}
