export class History {
  private operations: string[] = [];

  public recordOperation(operation: string): void {
    this.operations.push(`${new Date().toISOString()} - ${operation}`);
  }

  public getHistory(): string {
    return this.operations.join("\n");
  }
}
