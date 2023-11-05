import { DBLogicBase, DBType } from '@testomate/framework'
import mongoose, { Document, Schema } from 'mongoose'

// MongoDB model definition for Querying
const MongoUserModel = mongoose.model<MongoUser>(
  'User', // Name of the model
  new Schema({
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    passwordHash: {
      type: String,
    },
  }),
  'users', // Name of the collection
)

// MongoDB interface for results
export interface MongoUser extends Document {
  firstName: string
  lastName: string
  email: string
  passwordHash: string
}

// MongoDB implementation of Logic
export class MongoUserDBLogic extends DBLogicBase<unknown> {
  constructor() {
    super(DBType.Mongo)
  }

  public async getByFirstName(firstName: string): Promise<MongoUser[]> {
    return await MongoUserModel.find({ firstName }).exec()
  }
}
