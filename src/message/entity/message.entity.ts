import { ApiProperty } from '@nestjs/swagger';
import { BaseAudit } from 'src/common/base.audit';
import { foreignProperty } from 'src/common/foreign.property';
import { UserEntity } from 'src/user/entity/user.enity';
import { BaseEntity, Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'message' })
export class MessageEntity extends BaseAudit {
  @ApiProperty()
  @Column({ nullable: false, type: 'text' })
  content: string;

  @ApiProperty(foreignProperty)
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'creatorId' })
  creator: UserEntity;

  @ApiProperty(foreignProperty)
  @OneToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'receiverId' })
  recipient: UserEntity;
}
