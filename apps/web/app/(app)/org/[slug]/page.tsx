export default async function OrgPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <div className="space-y-4 py-4">
      <h1 className="text-2xl font-bold">Organização: {slug}</h1>
      <p className="text-muted-foreground">Crie um projeto usando o menu lá no topo!</p>
    </div>
  )
}