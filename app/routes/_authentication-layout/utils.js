import bcrypt from 'bcryptjs'

export function hashPassword(password) {
  return bcrypt.hashSync(password)
}

export function comparePassword({ password, passwordWithHash }) {
  return bcrypt.compareSync(password, passwordWithHash)
}
