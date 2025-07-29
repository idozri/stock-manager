import { IsNotEmpty, IsString } from 'class-validator';

export class UserSessionDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  createdAt: string;
}

export interface UserContextType {
  user: UserSessionDto | null;
  isLoading: boolean;
  hasSession: boolean;
  createSession: (userName: string) => void;
  updateUser: (newName: string) => void;
  logout: () => void;
}
