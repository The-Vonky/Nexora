# Nexora — Demonstração isolada no Render

## Objetivo

Publicar **uma demonstração interativa com dados fictícios**, sem conexão com Supabase, sem credenciais administrativas, sem executar migrations e sem Docker.

Esta não é a aplicação de produção: as interações são simuladas no navegador e armazenadas apenas no `localStorage` do visitante. As telas demonstram as categorias e fluxos do produto; não substituem homologação, integrações, autorização ou execução em banco real.

## Repositório e branch

- Repositório: `The-Vonky/Nexora`
- Branch: `demo/render-apresentacao-20261123`
- Aplicação real permanece inalterada; o modo demo possui entrada e build exclusivos em `apps/web/demo`.

## Build do site estático no Render

- Tipo: **Static Site**
- Repositório: `https://github.com/The-Vonky/Nexora`
- Branch: `demo/render-apresentacao-20261123`
- Build Command: `npm ci && npm run build:demo`
- Publish Directory: `apps/web/dist/demo`
- Environment variables: **nenhuma**
- Rewrites: **nenhuma**, a navegação usa rotas com `#`.

## Execução local

```powershell
git fetch origin
git switch demo/render-apresentacao-20261123
npm ci
npm run build:demo
npm run dev:demo
```

Abra a URL que o Vite informar, normalmente `http://localhost:5173`.

## Demonstração e limitações

- Auditorias: iniciar checklist ilustrativo, marcar itens e associar nome de arquivo (não realiza upload).
- Planos de Ação: criar e alterar situação.
- Curva ABC: produtos, categorias, comparações e CSV ilustrativo; importação registra apenas o nome do arquivo.
- Vendas e Maquininhas: criar/cancelar lançamentos Stone e PIX, consultar indicadores e exportar CSV.
- Salas: solicitar, aprovar, rejeitar e cancelar reservas, com validação simplificada de conflito.
- Comunicados: criar rascunho, publicar e arquivar.
- Relatos e Sugestões: enviar e resolver relatos fictícios.
- Administração: usuários simulados, perfis, catálogo de permissões, unidades, setores e log local.
- **Não há autenticação real**, controle de acesso, integração externa, persistência compartilhada, segurança multi-tenant ou motor de regras de produção.
- Os dados persistem no navegador individual e podem ser restaurados pelo botão **Restaurar dados**.

O build demo não importa o Supabase client. Nunca cadastrar chaves `service_role` no Render ou no frontend. Para validar os módulos reais, use outro projeto Supabase não produtivo, com migrations aprovadas e infraestrutura apropriada.
