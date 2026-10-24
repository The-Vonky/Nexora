# Nexora — Supabase hospedado e primeiros acessos

**Situação em 24/10/2026:** projeto Supabase **Nexora**, organização **Nexora**, região **us-west-2**, ref `cjqlldrxpiwldekxywwa`; 19 migrations aplicadas. **Nenhuma conta de usuário foi criada e não houve deploy da aplicação. PRODUÇÃO: NO-GO.**

**Este projeto é separado da Gaúcha.** Não utilizar credenciais, contas de usuários, armazenamento, hosts, backups nem dados da Gaúcha.

## 1. Estado do banco e migrations

- As 19 migrations de `supabase/migrations/` foram aplicadas ao projeto **Nexora**, sem copiar registros da empresa de origem.
- O histórico remoto foi reconciliado de forma transacional: `supabase_migrations.schema_migrations.version` agora usa o timestamp original do respectivo arquivo, com os 19 nomes e SQL originais preservados.
- Conferido: 22 tabelas de domínio, 9 seções/158 critérios, quatro buckets `action-plan-evidence`, `audit-checklist-evidence`, `unit-covers` e `abc-source-files`.
- **Não reaplicar as migrations iniciais**, não executar resets ou `db push` sem primeiro consultar o histórico. A sincronização do ledger não comprova ausência de drift futuro.

Para conferir de forma não destrutiva na CLI, autentique-se e faça o link **somente** ao ref `cjqlldrxpiwldekxywwa`, depois execute `supabase migration list --linked` e `supabase db push --linked --dry-run`. Confirme a lista e flags com `supabase --help` e `supabase db push --help` no ambiente instalado.

## 2. Expor as APIs dos módulos (configuração obrigatória no Dashboard)

Abra **Integrations → Data API → Exposed schemas** do projeto Nexora e acrescente:
- `core`
- `audit`
- `action_plans`
- `abc`

Preserve os schemas padrão já existentes. **Não exponha** `private`, `audit_private`, `action_plans_private` ou `abc_private`. Esses contêm funções auxiliares privilegiadas.

Os grants, RLS, funções RPC e buckets estão definidos nas migrations. **Não usar GRANT ALL genérico** para resolver falta de acesso: audite os grants específicos e as políticas de cada schema. O `supabase/config.toml` do repositório configura apenas o ambiente *local*, não altera automaticamente a configuração do projeto hospedado.

Painel: https://supabase.com/dashboard/project/cjqlldrxpiwldekxywwa/integrations/data_api/settings

## 3. Conectar o frontend ao Supabase Nexora

No computador de desenvolvimento:

```powershell
git clone https://github.com/The-Vonky/Nexora.git
cd Nexora
npm ci
Copy-Item apps/web/.env.example apps/web/.env.local
```

Preencha **apenas** a chave pública `sb_publishable_...` da Nexora em `apps/web/.env.local`:

```dotenv
VITE_SUPABASE_URL=https://cjqlldrxpiwldekxywwa.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=COLE_A_CHAVE_PUBLICA_DA_NEXORA
```

Localize-a em **Project Settings → API Keys** no Dashboard Nexora. Nunca comite `.env.local`, publique `service_role`, `sb_secret_`, senhas ou tokens pessoais. A URL hospedada não é secreta; a chave *publishable* é própria para frontends. O frontend foi protegido para recusar URLs hospedadas de outros projetos Supabase. Endereços `localhost` / `127.0.0.1` continuam permitidos para CI e laboratório local.

```powershell
npm run dev
```

O comando inicia a aplicação no Vite; isso **não publica** o sistema. Enquanto a URL aponta ao Supabase hospedado, qualquer ação operacional de teste afetará o banco de **Nexora** (não um laboratório descartável). Use dados sintéticos e evite importações reais antes da homologação.

## 4. Criar e promover o primeiro administrador

1. Em **Authentication → Providers → Email**, mantenha confirmação de e-mail habilitada. Em **Authentication → Settings**, desabilite **Allow new users to sign up** para operação por convite/administração, conforme a versão do Dashboard.
2. Configure o **Site URL** e os **Redirect URLs** para uma origem controlada antes de enviar convites. Em homologação local, `http://localhost:5173` pode ser permitido; remova-o da configuração produtiva conforme a política da empresa.
3. Em **Authentication → Users → Add user**, crie ou convide a pessoa indicada. Nunca informe senhas, tokens de convite ou chaves no GitHub ou no ChatGPT. Se convidar por e-mail, conclua a confirmação da conta antes do bootstrap.
4. Verifique que existe **exatamente um** usuário autorizado, com `email_confirmed_at` preenchido, e seu perfil está ativo. O `core.profiles` é criado automaticamente pelo trigger ao criar usuário no Auth.
5. Somente depois, por operação administrativa autorizada no SQL Editor da **Nexora**, execute `select private.bootstrap_administrator('<UUID_DO_USUARIO_CONFIRMADO>'::uuid);`. Esse procedimento é **executado uma única vez** e não é acessível à API pública. Não use ID de outra empresa.

Ao concluir, valide o login, o perfil, `core.my_access`, os controles por unidade e a proibição de acessos indevidos. Não crie administradores via inserção direta em `auth.users`.

## 5. Gate antes de publicar

- Revisar o aviso de RLS da `core.unit_cover_assets` (ausência intencional de policies diretas, fluxo via RPC/Storage) e os avisos de performance de FKs sem índices.
- Verificar API schemas hospedados, configuração de e-mail, redirecionamentos e acesso com usuário real e sessão autenticada.
- Executar testes no ambiente de homologação com dados sintéticos, plano de backup/restore, monitoramento, domínio, TLS e controle de deploy.
- Não vincular GitHub Actions da Nexora a banco da Gaúcha, nem adicionar comandos automáticos de `db push` sem revisão de destino e histórico.

**Status: backend estruturado e identidade independente; frontend configurável e primeiro usuário pendente. Sem homologação nem autorização para produção.**
