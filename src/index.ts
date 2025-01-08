import { CLI } from "./CLI";
import { Account } from "./account";
import { Auth } from "./auth";

const startupParts = [
  "   __________  ____  ___       ____  ___    _   ____ __",
  "  / ____/ __ \\/ __ \\/   |     / __ )/   |  / | / / //_/",
  " / /   / / / / / / / /| |    / __  / /| | /  |/ / ,<   ",
  "/ /___/ /_/ / /_/ / ___ |   / /_/ / ___ |/ /|  / /| |  ",
  "\\____/\\____/_____/_/  |_|  /_____/_/  |_/_/ |_/_/ |_|",
  "",
  "La banque de demain, aujourd'hui.",
  "",
];

console.log(startupParts.join("\n"));

const auth = new Auth(); // Gestion de l'authentification
const accounts: Record<string, Account> = {}; // Stockage des comptes

// Menu principal
const mainCLI = new CLI([
  {
    title: "Créer un compte",
    value: "create",
    action: async () => {
      const username = await CLI.askValue("Entrez un nom d'utilisateur :", "text");
      if (accounts[username]) {
        console.log("Ce nom d'utilisateur existe déjà. Essayez un autre.");
        return;
      }

      const pin = await CLI.askHiddenValue("Créez un code PIN (4 chiffres) :");
      const creationMessage = await auth.createUser(pin);
      if (creationMessage !== "Utilisateur créé avec succès.") {
        console.log(creationMessage);
        return;
      }

      const initialBalance = await CLI.askValue(
        "Quel est le solde initial pour le compte ?",
        "number"
      );

      accounts[username] = new Account(initialBalance);
      console.log(
        `Compte créé avec succès ! Nom d'utilisateur : ${username}, Solde initial : ${initialBalance} €`
      );
    },
  },
  {
    title: "Se connecter à un compte",
    value: "login",
    action: async () => {
      const username = await CLI.askValue("Entrez votre nom d'utilisateur :", "text");
      const account = accounts[username];
      if (!account) {
        console.log("Aucun compte trouvé avec ce nom d'utilisateur.");
        return;
      }

      let pin;
      let isVerifiedMessage;
      do {
        pin = await CLI.askHiddenValue("Entrez votre code PIN :");
        isVerifiedMessage = await auth.verifyUser(pin);
        console.log(isVerifiedMessage);
        if (isVerifiedMessage === "Trop de tentatives échouées. L'application va se fermer.") {
          process.exit(1); // Ferme l'application après trop de tentatives échouées
        }
      } while (isVerifiedMessage !== "Connexion réussie.");

      await accountMenu(username, account);
    },
  },
]);

// Menu du compte
async function accountMenu(username: string, account: Account) {
  const cli = new CLI([
    {
      title: "Afficher le solde",
      value: "balance",
      action: async () => {
        console.log(account.getBalance());
        await accountMenu(username, account);
      },
    },
    {
      title: "Faire un dépôt",
      value: "deposit",
      action: async () => {
        const amount = await CLI.askValue("Montant à déposer :", "number");
        console.log(account.deposer(amount));
        await accountMenu(username, account);
      },
    },
    {
      title: "Faire un retrait",
      value: "withdraw",
      action: async () => {
        const amount = await CLI.askValue("Montant à retirer :", "number");
        console.log(account.retreat(amount));
        await accountMenu(username, account);
      },
    },
    {
      title: "Afficher l'historique",
      value: "history",
      action: async () => {
        console.log(account.getHistory());
        await accountMenu(username, account);
      },
    },
  ]);

  console.log(`Bienvenue ${username}!`);
  await cli.menu();
}

// Lancer le menu principal
mainCLI.menu();
