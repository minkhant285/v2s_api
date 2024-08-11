import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import bcrypt from 'bcrypt';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    username: string;

    @Column({ select: false })
    password: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    registeredType: string;

    @Column({ default: false })
    twoWayAuth: boolean;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    photoUrl: string;

    @Column({ nullable: true })
    dob: Date;

    @Column({ nullable: true, select: false })
    resetPasswordToken: string;

    @Column({ nullable: true, type: "datetime", select: false })
    resetPasswordExpires: Date;

    @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP', type: 'datetime' })
    created_at: Date;

    @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP', type: 'datetime' })
    updated_at: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }

    async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
}
