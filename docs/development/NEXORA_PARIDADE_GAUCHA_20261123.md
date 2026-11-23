# Nexora — matriz de portabilidade da Gaúcha Gestão (23/11/2026)

- Origem: The-Vonky/Gaucha-Gestao, main `cbdf8a92786bbfa10e0dd5e56ad2a430a39e4e79`.
- Destino: The-Vonky/Nexora, base `c3a4d70ed4eaadf408bac61abb4c50d234a6febb`.
- Escopo: código de `apps/web`, serviço interno de identidade, 26 migrations incrementais, dependências e testes. Sem copiar banco de dados, dados de produção, host C30, segredos ou assets da marca Gaúcha.
- Identidade: componentes `brand.tsx`, tokens visuais, favicon, `index.html`, `backendOrigin.ts`, `client.ts` e `supabase/config.toml` da Nexora preservados; o login e shell receberam ajustes para exibir Nexora.
- Módulos: `sales`, `rooms`, `announcements` e `feedback`; atualização de `audit` e exportações; conta/ciclo de senha condicionado à implantação própria.

## Critérios para aprovação

1. CI: typecheck, lint, testes de domínio, build e checagem do artefato.
2. Migrations: revisão na ordem original e teste em banco PostgreSQL/Supabase descartável, incluindo RLS e operações de Auth/Storage; não aplicar cegamente no ambiente hospedado.
3. Brand e isolamento: não aceitar URLs, logos ou credenciais de origem Gaúcha; testar URL host do Supabase Nexora e bloqueio de URL de outro projeto.
4. Backend hospedado: validar migrations, buckets privados, grants, schema API e usuários autorizados sem usar dados da Gaúcha.
5. Identidade: manter a flag desligada até que o serviço Nexora independente seja implantado e homologado; garantir fluxo normal de login enquanto estiver desligado.
6. Imagens: caso imgproxy não esteja disponível, permitir acesso seguro ao original sem prometer miniaturas processadas.
7. Demonstração: usar dados sintéticos próprios da Nexora, realizar smoke test de login, rotas, leituras, exportações e gravações com permissões por unidade.
8. Publicação: garantir rollback documentado e GO específico para o ambiente Nexora antes de alterar o serviço de demonstração.

**Estado:** entrega candidata de código, sem GO para produção/demonstração pública até validações. Nenhum dado ou ambiente hospedado é alterado apenas por este commit.
