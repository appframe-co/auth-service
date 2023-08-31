import { RoutesInput } from '@/types/types'
import login from './login.route'
import signup from './signup.route'
import beginPasswordReset from './begin-password-reset.route'
import passwordReset from './password-reset.route'
import user from './user.route'

export default ({ app }: RoutesInput) => {
    app.use('/api/login', login);
    app.use('/api/signup', signup);
    app.use('/api/begin_password_reset', beginPasswordReset)
    app.use('/api/password_reset', passwordReset)

    app.use('/api/user', user)
};