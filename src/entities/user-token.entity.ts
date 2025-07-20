import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_token")
export class UserToken {
  @PrimaryGeneratedColumn({ type: "int", name: "user_token_id", unsigned: true })
  userTokenId: number;

  @Column({type: 'int', name: 'user_id', unsigned: true})
  userId: number;

  @Column({type: 'timestamp', name: 'created_at'})
  createdAt: string;
  
  @Column({type: 'text'})
  token: string;

  @Column({type: 'datetime', name: "expires_at"})
  expiresAt: string
  
  @Column({type: 'tinyint', name: "is_valid", default: 1})
  isValid: number
}