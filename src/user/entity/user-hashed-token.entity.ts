import { ApiProperty } from '@nestjs/swagger';
import { BaseAudit } from 'src/common/base.audit';
import { Column, DeepPartial, Entity, ManyToOne } from 'typeorm';
import { UserEntity } from './user.enity';

@Entity({ name: 'user_hashed_token' })
export class UserHashedTokenEntity extends BaseAudit {
  @ApiProperty()
  @ManyToOne((type) => UserEntity, (user) => user.hashedTokens, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;

  @Column({ nullable: false })
  @ApiProperty({ nullable: false })
  token: string;

  @Column({ nullable: false, unique: true })
  @ApiProperty({ nullable: false })
  tokenId: string;

  constructor(partial: DeepPartial<UserHashedTokenEntity> = null) {
    super();
    Object.assign(this, partial);
  }
}
