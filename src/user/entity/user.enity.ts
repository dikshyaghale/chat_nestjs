import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { BaseAudit } from 'src/common/base.audit';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { UserHashedTokenEntity } from './user-hashed-token.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseAudit {
  @ApiProperty()
  @Column({ nullable: false })
  firstName: string;

  @ApiProperty()
  @Column({ nullable: false })
  lastName: string;

  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty()
  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false })
  password: string;

  @ApiProperty({ nullable: true })
  @Column()
  gender: string;

  @ApiProperty()
  @Column({ nullable: true })
  dob: Date;

  @ApiHideProperty()
  @OneToMany(() => UserHashedTokenEntity, (hashedToken) => hashedToken.user)
  hashedTokens: UserHashedTokenEntity[];

  @BeforeInsert()
  async prepareEntity() {
    const salt = await bcrypt.genSalt();
    if (this.password) this.password = await bcrypt.hash(this.password, salt);
  }
}
