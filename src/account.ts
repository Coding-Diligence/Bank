export interface Operation {
  date: string;
  type: "deposer" | "retrait";
  amount: number;
  balance: number;
  status: "succés" | "erreur";
}

export class Account {
  private balance: number;
  private history: Operation[];

  constructor(BalanceBase: number=0) {
    this.balance = BalanceBase;
    this.history = [];
  }

  public verification(amount: number): string | null {
    if (!Number.isInteger(amount) || amount <= 0) {
      return 'Le montant doit être un entier positif';
    }
    return null;
  }

  public deposer(amount: number): string {
    this.verification(amount)

    this.balance += amount;
    this.recordOperation("deposer", amount, "succés");
    return `Dépôt de ${amount} € réussi. Nouveau solde : ${this.balance} €`;
  }

  public retirer(amount: number): string {
    this.verification(amount)

    if (amount > this.balance) {
      this.recordOperation("retrait", amount, "erreur");
      return `Retrait échoué : fonds insuffisants. Solde actuel : ${this.balance} €`;
    }

    this.balance -= amount;
    this.recordOperation("retrait", amount, "succés");
    return `Retrait de ${amount} € réussi. Nouveau solde : ${this.balance} €`;
  }

  public getBalance(): string {
    return `La solde est de ${this.balance} €`;
  }

  public getHistory(): string {
    if (this.history.length === 0) {
      return "Aucune opération n'a était éffectué";
    }

    const lastOperations = this.history.slice(-10).map((op) => {
      return `${op.date} | ${op.type === "deposer" ? "Dépot" : "Retrait"} | Montant : ${op.amount} € | Solde : ${op.balance} € | Statut : ${op.status}`;
    });

    return lastOperations.join("\n")
  }

  private recordOperation(type: "deposer" | "retrait", amount: number, status : "succés" | "erreur"): void {
    const operation: Operation = {
      date: new Date().toISOString(),
      type,
      amount,
      balance: this.balance,
      status,
    };
    this.history.push(operation);
  }
}