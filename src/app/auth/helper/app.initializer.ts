import { AuthService } from '../services/auth/auth.service';

export const appInitializer = (authService: AuthService) =>{
    return () => {
      return new Promise((resolve) => {
        // @ts-ignore
        authService.getUserByToken().subscribe().add(resolve);
      });
    };
  }