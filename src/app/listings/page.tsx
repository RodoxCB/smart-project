"use client"

function ListingsPageContent() {
  console.log('ListingsPageContent is rendering!')
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1>Teste - Página de Listagens</h1>
      <p>Se você vê esta mensagem, o componente está funcionando!</p>
      <p>Agora podemos restaurar a funcionalidade completa.</p>
    </div>
  )
}

export default function ListingsPage() {
  return <ListingsPageContent />
}
