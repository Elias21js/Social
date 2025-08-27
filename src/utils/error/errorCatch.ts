export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err && typeof (err as any).response?.data?.error === "string") {
    return (err as any).response.data.error;
  }

  if (err instanceof Error) return err.message;

  return "Erro desconhecido";
}
