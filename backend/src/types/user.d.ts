import { User as UserModel } from '../server/database/models/User'

export type User = Pick<UserModel, 'id' | 'email'>

export default User
