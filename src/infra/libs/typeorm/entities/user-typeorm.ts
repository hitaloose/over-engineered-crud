import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm'

import { User } from '@/domain/entities/user'
import { constraintNames } from '@/infra/libs/typeorm/migrations/helpers'

@Entity({ name: 'user' })
@Unique(constraintNames.userUsernameUnique, ['username'])
@Unique(constraintNames.userEmailUnique, ['email'])
export class UserTypeorm implements User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar' })
  name!: string

  @Column({ type: 'varchar' })
  username!: string

  @Column({ type: 'varchar' })
  email!: string

  @Column({ type: 'varchar' })
  hashedPassword!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
