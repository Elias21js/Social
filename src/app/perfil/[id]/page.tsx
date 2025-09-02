import { getProfileById } from "@/app/models/users.models";
import PerfilClient from "../perfilClient"; // client-side
import { notFound } from "next/navigation";

interface PerfilPageProps {
  params: { id: string };
}

export default async function PerfilPage({ params }: PerfilPageProps) {
  const param = await params;
  const initialData = await getProfileById(param.id);

  if (!initialData) return notFound();
  console.log(initialData);

  return <PerfilClient initialData={initialData} />;
}
