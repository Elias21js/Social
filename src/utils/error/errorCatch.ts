export function getErrorMessage(err: unknown): string {
  // erro vindo de axios/fetch tradicional
  if (err && typeof err === "object" && "response" in err && typeof (err as any).response?.data?.error === "string") {
    return (err as any).response.data.error;
  }

  // erro vindo do backend no formato que você mostrou
  if (err && typeof err === "object" && "data" in err && (err as any).data?.err?.message) {
    return (err as any).data.err.message;
  }

  if (err instanceof Error) return err.message;

  return "Erro desconhecido";
}
