import bcrypt from 'bcrypt';

interface User {
  pinHash: string;
}

export class Auth {
  private users: User[] = [];
  private failedAttempts: number = 0;

  constructor() {
    this.users = [];
    this.failedAttempts = 0;
  }

  public async createUser(pin: string): Promise<string> {
    if (!/^\d{4}$/.test(pin)) {
      return "Le code secret doit contenir 4 chiffres.";
    }
    const pinHash = await bcrypt.hash(pin, 10);
    this.users.push({ pinHash });
    return "User créé avec succès.";
  }

  public async verifyUser(pin: string): Promise<string> {
    if (this.failedAttempts >= 3) {
      return "Trop de tentatives. Tchouss.";
    }

    const user = this.users[0];
    if (!user) {
      return "User non trouvé.";
    }

    const isValid = await bcrypt.compare(pin, user.pinHash);
    if (isValid) {
      this.failedAttempts = 0
      return "Connexion réussie.";
    } else {
      this.failedAttempts++;
      const remainingAttempts = 3 - this.failedAttempts;
      if (this.failedAttempts >= 3) {
        return "Trop de tentatives. Tchouss.";
      }
      return `Code PIN incorrect. Il reste ${remainingAttempts} tentative(s).`;
    }
  }
}
