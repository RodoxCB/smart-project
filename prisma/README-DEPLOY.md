# 🚀 Configuração para Deploy e Seed

## Para executar o seed real no banco de dados:

### 1. **Configurar Banco de Dados Neon PostgreSQL**

1. Criar conta no [Neon](https://neon.tech)
2. Criar novo projeto
3. Copiar a connection string

### 2. **Configurar .env**

```bash
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

NEXTAUTH_SECRET="sua-chave-secreta-super-segura"
NEXTAUTH_URL="https://seu-dominio.vercel.app"

CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

ADMIN_EMAIL="admin@busmarket.com"
ADMIN_PASSWORD="admin123"
```

### 3. **Executar Seed**

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

## 📊 O que o Seed Inclui:

### 👥 **4 Usuários:**
- 1 Admin: `admin@busmarket.com` / `admin123`
- 3 Usuários: Para testes de autenticação

### 🚌 **16 Anúncios de Ônibus:**
- **5 categorias**: Executivos, Urbanos, Rodoviários, Escolares, Fretamento
- **7 marcas**: Mercedes-Benz, Volvo, Scania, Marcopolo, MAN, Comil, Caio
- **Faixa de preço**: R$ 75.000 - R$ 720.000
- **15 localizações**: Todas as regiões do Brasil
- **3 anúncios em destaque**
- **1 anúncio vendido** (para demonstração)

### 🖼️ **Imagens de Exemplo:**
- 3 imagens por anúncio principal (URLs do Unsplash)
- Prontas para quando configurar o Cloudinary

### 🎯 **Variações Incluídas:**
- Anos: 2010 a 2022
- Capacidades: 32 a 180 passageiros
- Combustíveis: Diesel
- Transmissões: Manual, Automático, Automatizado
- Quilometragem: 25.000 a 400.000 km

## 🔧 Para Produção:

1. **Alterar senha admin** para algo seguro
2. **Configurar Cloudinary** para upload real de imagens
3. **Configurar domínio personalizado** (opcional)
4. **Configurar backup** no Neon
5. **Monitorar uso** do Cloudinary

## 🚀 Deploy no Vercel:

1. Conectar repositório ao Vercel
2. Configurar variáveis de ambiente
3. Deploy automático

**Custo mensal estimado: R$ 0** 🎉
