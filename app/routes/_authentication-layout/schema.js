import * as v from 'valibot'

export const AuthenticationFormSchema = v.object({
  email: v.pipe(
    v.string('Email must be a string.'),
    v.email('Correct Email format.'),
  ),
  password: v.pipe(
    v.string('Password must be a string.'),
    v.minLength(8, 'Password must be at least 8 characters.'),
    v.maxLength(120, 'Password must be at most 120 characters.'),
  ),
})
