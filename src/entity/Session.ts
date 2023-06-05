import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
}
