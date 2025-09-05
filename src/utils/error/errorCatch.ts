export function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as any).response?.data;
    if (data?.error) return data.error;
    if (data?.err?.message) return data.err.message;
    if (data?.message) return data.message; // ✅ aqui
  }

  if (err instanceof Error) return err.message;

  return "Erro desconhecido";
}
