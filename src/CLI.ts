import type { Choice, PromptType } from "prompts";
import prompts from "prompts";

export interface CLIChoice extends Choice {
  action: Function;
}

export class CLI {
  public choices: CLIChoice[] = [];

  constructor(choices: CLIChoice[] = []) {
    this.choices = choices;
  }

  public static async askValue(message: string, type: "text"): Promise<string>;
  public static async askValue(
    message: string,
    type: "number"
  ): Promise<number>;
  public static async askValue(
    message: string,
    type: PromptType = "text"
  ): Promise<string | number> {
    const response = await prompts({
      type,
      name: "value",
      message,
    });

    return response.value;
  }

  public async menu() {
    const response = await prompts({
      type: "select",
      name: "action",
      message: "Que voulez-vous faire ?",
      choices: [
        ...this.choices.map((choice) => ({
          title: choice.title,
          value: choice.value,
        })),
        { title: "Quitter", value: "quit" },
      ],
    });

    const choice = this.choices.find(
      (choice) => choice.value === response.action
    );

    if (choice) await choice.action();
    else await this.quit();

    console.log("\n");
    this.menu();
  }

  public static async askHiddenValue(message: string): Promise<string> {
    const response = await prompts({
      type: 'password',
      name: 'value',
      message,
    });

    return response.value;
  }


  private async quit() {
    const randomTime = Math.floor(Math.random() * 2);
    await new Promise((resolve) => setTimeout(resolve, randomTime * 1000));

    console.log("Au revoir !");
    process.exit(0);
  }
}
