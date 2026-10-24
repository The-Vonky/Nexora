# Nexora

**Plataforma corporativa modular de gestão** derivada do projeto Gaúcha Gestão, com **as mesmas funcionalidades e módulos implementados** na versão de origem selecionada, mas mantida em repositório e ambientes separados.

> **Status: projeto Supabase Nexora criado e 19 migrations aplicadas; ainda sem administrador, frontend publicado ou homologação. PRODUÇÃO: NO-GO.**
> A criação da Nexora **não** migra dados, funcionários, credenciais, configurações nem a infraestrutura da Gaúcha.

## Origem e garantia de equivalência

- Repositório-base: `The-Vonky/Gaucha-Gestao`.
- Versão de referência: commit `677a70c690b93d81f373a572187b79adf18f0ff0`, branch `main`, 23/10/2026.
- No momento da importação, a árvore possuía **310 arquivos**; foram preservados os arquivos da origem e aplicadas depois somente alterações de identidade e isolamento no projeto derivado.
- Desde a derivação, o histórico Git da Nexora é **independente**. Alterações futuras na Gaúcha não são integradas automaticamente.
- Decisões/execuções específicas da Gaúcha, como o STAGING na C30, **não se aplicam à Nexora**.

## Módulos preservados

| Área | Funcionalidades presentes no código de origem |
| --- | --- |
| Core e Administração | Login/autenticação, gestão de perfis, usuários, papéis, permissões, unidades, setores, diretório e logs |
| Auditoria de Qualidade | Checklists, auditorias, evidências, histórico/reabertura, exportação e relatórios |
| Planos de Ação | Planos manuais e associados à auditoria, ciclo corretivo, atribuição, evidências e verificação |
| Curva ABC | Importação XLSX, versões/revisões, consulta e análises existentes na origem |
| Plataforma | Navegação responsiva, componentes compartilhados, design system, fluxos de testes e migrações SQL |

**Equivalência funcional refere-se ao código existente, não a funcionalidades ainda propostas ou pendentes na origem.** Leia a documentação herdada em `docs/` com atenção aos respectivos estados AS-IS / PROPOSTO / PENDENTE.

## Arquitetura

- Frontend: React 19, TypeScript 5, Vite 6, React Router 7.
- Backend: Supabase Auth, PostgREST, Storage, PostgreSQL 17.
- Autorização: Row-Level Security (RLS), grants e funções RPC no banco.
- Qualidade: Vitest, PGlite, Playwright, GitHub Actions.
- Estrutura: `apps/web` (aplicação), `supabase/migrations` (schema e política), `infra/` (laboratório de infraestrutura), `tests/` (verificações) e `docs/` (referências técnicas).

## Conexão ao Supabase Nexora hospedado

O banco da organização Nexora já foi estruturado no Supabase hospedado. Para configuração de API, frontend e primeiro administrador, siga **[Configuração do Supabase Nexora](docs/deployment/NEXORA_SUPABASE_SETUP.md)**. Não confunda o projeto hospedado com o laboratório local abaixo.

## Iniciar o desenvolvimento local isolado

**Pré-requisitos:** Git, Node.js ≥22.12, npm, Docker Engine/Desktop e Supabase CLI (o projeto de origem usava a versão 2.117.0 via npx). Antes de executar, confira containers, portas, projetos e volumes Docker já existentes. **Não interrompa nem reinicie serviços da Gaúcha.**

```bash
git clone https://github.com/The-Vonky/Nexora.git
cd Nexora
npm ci
```

O projeto Supabase local está identificado como **`nexora-local`** em `supabase/config.toml`, porém **as portas padrão herdadas (API 54321, banco 54322, Studio 54323 e frontend 5173) permanecem iguais**. Isso exige que não exista outro projeto ocupando essas portas. Se houver, estabeleça um conjunto exclusivo de portas e revise todos os consumidores antes de inicializar a Nexora; não use reset ou stop no projeto da Gaúcha para liberar as portas.

Quando a exclusividade das portas e do Docker for verificada, em terminal Bash/WSL2:

```bash
npx --yes supabase@2.117.0 start -x realtime,imgproxy,mailpit,edge-runtime,logflare,vector,supavisor
npx --yes supabase@2.117.0 status
cp apps/web/.env.example apps/web/.env.local
```

Edite `apps/web/.env.local` somente com a **URL do Supabase local Nexora** e a chave pública **publishable** desse mesmo projeto:

```dotenv
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=COLE_SOMENTE_A_CHAVE_PUBLICA_DA_NEXORA
```

Nunca use senha, `service_role`, secret key ou dados reais em variáveis públicas ou no repositório. Após configurar a instância, crie **um usuário de teste novo** no Auth local, habilite o perfil administrador pelos procedimentos documentados em `docs/development/LOCAL_FOUNDATION.md` **somente no banco Nexora**, e inicie:

```bash
npm run dev
```

## Verificações de código (não são homologação produtiva)

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run verify:build
```

O build pressupõe URL e publishable key de frontend configuradas; confira o workflow `.github/workflows/validate.yml` para variáveis de build de CI sem credenciais reais. Testes que criam ou apagam dados só podem ser executados em ambientes **descartáveis e exclusivos da Nexora**.

## O que falta para operar em outra empresa

1. Confirmar autorização de reutilização do software, da arquitetura, das dependências e dos assets corporativos.
2. **Concluído:** banco/Auth/Storage exclusivo da Nexora criado no Supabase e 19 migrations aplicadas. Ainda é necessário configurar a exposição dos schemas de API e validar os acessos.
3. Definir administradores, autenticação, política de acesso e domínio da Nexora.
4. Realizar revisão de segurança, testes funcionais com dados sintéticos, recuperação de backup, observabilidade e homologação própria.
5. Formalizar decisão de implantação/produção e plano de rollback.

## Governança e documentação

- [Instruções para agentes](AGENTS.md), [Orientações Claude](CLAUDE.md), [Índice documental legado](docs/README.md).
- Os documentos de `docs/` foram trazidos para **preservar o conhecimento técnico da origem**. URLs do repositório original, questões de hardware, nomes da empresa Gaúcha, decisões locais e evidências de CI/produção da origem **não são evidências operacionais da Nexora**.
- Para mudanças daqui em diante, usar PRs e issues no repositório Nexora. Não editar o Gaúcha Gestão ao desenvolver a Nexora.
