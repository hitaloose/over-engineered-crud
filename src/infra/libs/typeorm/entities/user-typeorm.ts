import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@/domain/entities/user'

@Entity()
export class UserTypeorm implements User {
  @PrimaryGeneratedColumn()
  id!: string

  @Column()
  name!: string

  @Column()
  username!: string

  @Column()
  email!: string

  @Column()
  hashedPassword!: string
}
