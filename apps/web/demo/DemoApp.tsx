import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import "./demo.css";

type Sale = { id: string; date: string; unit: string; method: string; amount: number; status: string };
type Audit = { id: string; unit: string; date: string; checked: string[]; status: string; evidence?: string };
type Action = { id: string; title: string; owner: string; status: string; due: string };
type Booking = { id: string; room: string; owner: string; date: string; start: string; end: string; status: string };
type Notice = { id: string; title: string; body: string; status: string; priority: string };
type Feedback = { id: string; type: string; text: string; status: string };
type User = { id: string; name: string; email: string; role: string; active: boolean };
type Import = { id: string; name: string; date: string; rows: number };
type DemoData = { sales: Sale[]; audits: Audit[]; actions: Action[]; bookings: Booking[]; notices: Notice[]; feedback: Feedback[]; users: User[]; units: string[]; sectors: string[]; imports: Import[]; logs: { id: string; date: string; event: string }[] };
type NavItem = { path: string; title: string; desc: string };
type NavGroup = { title: string; items: NavItem[] };

const STORAGE = "nexora-presentation-demo-v1";
const id = () => Math.random().toString(36).slice(2, 10);
const iso = (offset = 0) => { const d = new Date(); d.setDate(d.getDate() + offset); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const money = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const dateBR = (s: string) => { if (!s) return "—"; const [y, m, d] = s.split("-"); return d + "/" + m + "/" + y; };
const checklist = ["Atendimento e recepção", "Limpeza e organização", "Segurança operacional", "Conferência de estoque", "Documentação da unidade", "Padronização de processos"];
const catalog = [
  { name: "Café tradicional 500g", category: "Mercearia", units: 340, value: 6250 },
  { name: "Arroz branco 5kg", category: "Mercearia", units: 260, value: 5890 },
  { name: "Detergente neutro 500ml", category: "Limpeza", units: 510, value: 1940 },
  { name: "Papel toalha", category: "Higiene", units: 220, value: 2360 },
  { name: "Água mineral 500ml", category: "Bebidas", units: 690, value: 1725 },
  { name: "Açúcar cristal 5kg", category: "Mercearia", units: 160, value: 2280 },
];
const nav: NavGroup[] = [
  { title: "Visão geral", items: [{ path: "/", title: "Início", desc: "Painel com as áreas de trabalho" }] },
  { title: "Qualidade", items: [
    { path: "/audit", title: "Auditorias", desc: "Inspeções, checklist e evidências" },
    { path: "/action-plans", title: "Planos de Ação", desc: "Ações corretivas e acompanhamento" },
  ] },
  { title: "Custos", items: [
    { path: "/abc", title: "Curva ABC", desc: "Indicadores por categoria" },
    { path: "/abc/imports", title: "Importações", desc: "Histórico de cargas" },
    { path: "/abc/compare", title: "Comparações", desc: "Análises por unidade" },
    { path: "/abc/reports", title: "Relatórios", desc: "Exportação de dados" },
    { path: "/abc/products", title: "Produtos", desc: "Catálogo simulado" },
    { path: "/abc/categories", title: "Categorias", desc: "Grupos de consumo" },
  ] },
  { title: "Comercial", items: [
    { path: "/sales/dashboard", title: "Vendas / Maquininhas", desc: "Resultados Stone e PIX" },
    { path: "/sales/entries", title: "Lançamentos", desc: "Controle de transações" },
  ] },
  { title: "Administrativo", items: [{ path: "/rooms", title: "Agendamento de Salas", desc: "Agenda e solicitações" }] },
  { title: "Comunicação", items: [
    { path: "/admin/announcements", title: "Comunicados", desc: "Avisos institucionais" },
    { path: "/admin/feedback", title: "Relatos e Sugestões", desc: "Manifestações da equipe" },
  ] },
  { title: "Administração", items: [
    { path: "/admin/users", title: "Usuários", desc: "Pessoas e acesso" },
    { path: "/admin/roles", title: "Perfis de acesso", desc: "Papéis demonstrativos" },
    { path: "/admin/permissions", title: "Permissões", desc: "Catálogo de capacidades" },
    { path: "/admin/units", title: "Unidades", desc: "Estrutura operacional" },
    { path: "/admin/sectors", title: "Setores", desc: "Estrutura organizacional" },
    { path: "/admin/logs", title: "Logs do sistema", desc: "Registros da demonstração" },
  ] },
];
const seeded: DemoData = {
  sales: [
    { id: "V-101", date: iso(-3), unit: "Centro", method: "Stone", amount: 3290, status: "Confirmado" },
    { id: "V-102", date: iso(-2), unit: "Matriz", method: "PIX", amount: 2750, status: "Confirmado" },
    { id: "V-103", date: iso(-1), unit: "Centro", method: "PIX", amount: 1890, status: "Confirmado" },
    { id: "V-104", date: iso(), unit: "Matriz", method: "Stone", amount: 4160, status: "Confirmado" },
    { id: "V-105", date: iso(), unit: "Centro", method: "Stone", amount: 1380, status: "Confirmado" },
  ],
  audits: [
    { id: "AUD-104", unit: "Matriz", date: iso(-2), checked: checklist.slice(0, 5), status: "Em andamento" },
    { id: "AUD-103", unit: "Centro", date: iso(-7), checked: [...checklist], status: "Concluída", evidence: "inspecao-centro.jpg" },
  ],
  actions: [
    { id: "PA-31", title: "Revisar sinalização do estoque", owner: "Marina", status: "Em andamento", due: iso(5) },
    { id: "PA-32", title: "Atualizar rotina de conferência", owner: "Carlos", status: "Pendente", due: iso(9) },
    { id: "PA-33", title: "Validar documentação da unidade", owner: "Camila", status: "Concluído", due: iso(-1) },
  ],
  bookings: [
    { id: "RES-21", room: "Sala de Reunião", owner: "Marina", date: iso(1), start: "09:00", end: "10:00", status: "Aprovada" },
    { id: "RES-22", room: "Sala de Reunião", owner: "Carlos", date: iso(2), start: "14:00", end: "15:00", status: "Pendente" },
  ],
  notices: [
    { id: "COM-11", title: "Reunião de alinhamento", body: "Alinhamento geral de indicadores na sexta-feira.", status: "Publicado", priority: "Informativo" },
    { id: "COM-12", title: "Atualização das rotinas", body: "Novos procedimentos de inspeção estão disponíveis para consulta.", status: "Rascunho", priority: "Importante" },
  ],
  feedback: [
    { id: "REL-11", type: "Sugestão", text: "Adicionar um filtro por setor nas auditorias.", status: "Aberto" },
    { id: "REL-12", type: "Problema", text: "Revisar instruções da importação de relatórios.", status: "Em análise" },
  ],
  users: [
    { id: "U-1", name: "Administrador Demo", email: "admin.demo@exemplo.test", role: "Administrador", active: true },
    { id: "U-2", name: "Marina Almeida", email: "marina@exemplo.test", role: "Auditor", active: true },
    { id: "U-3", name: "Carlos Pereira", email: "carlos@exemplo.test", role: "Operador", active: true },
  ],
  units: ["Matriz", "Centro"],
  sectors: ["Administrativo", "Comercial", "Operações", "Qualidade"],
  imports: [{ id: "IMP-01", name: "consumo_exemplo_outubro.csv", date: iso(-5), rows: 124 }],
  logs: [{ id: "L-1", date: new Date().toLocaleString("pt-BR"), event: "Ambiente demonstrativo inicializado" }],
};
function readData(): DemoData {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) {
      const saved = JSON.parse(raw) as DemoData;
      if (saved && Array.isArray(saved.sales) && Array.isArray(saved.users) && Array.isArray(saved.logs)) return saved;
    }
  } catch { /* Uma carga local inválida não impede a demonstração. */ }
  return seeded;
}
function exportCsv(filename: string, header: string[], records: (string | number)[][]) {
  const protect = (v: string | number) => {
    let s = String(v);
    if (/^[=+@\t\r]/.test(s)) s = "'" + s;
    return '"' + s.replace(/"/g, '""') + '"';
  };
  const text = [header, ...records].map(r => r.map(protect).join(";")).join("\r\n");
  const file = new Blob(["\uFEFF", text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Field({ label, name, type = "text", options, required = true, defaultValue, min, step }: { label: string; name: string; type?: string; options?: string[]; required?: boolean; defaultValue?: string; min?: string; step?: string }) {
  return <label className="dm-field"><span>{label}</span>{options
    ? <select name={name} required={required} defaultValue={defaultValue}>{options.map(o => <option key={o}>{o}</option>)}</select>
    : <input name={name} type={type} required={required} defaultValue={defaultValue} min={min} step={step} />}</label>;
}
function Panel({ children, title, action }: { children: ReactNode; title?: string; action?: ReactNode }) {
  return <section className="dm-panel">{title && <div className="dm-panel-head"><h2>{title}</h2>{action}</div>}{children}</section>;
}
function Metric({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return <div className="dm-metric"><span>{label}</span><strong>{value}</strong>{sub && <small>{sub}</small>}</div>;
}
function Status({ value }: { value: string }) {
  const positive = ["Concluída", "Concluído", "Publicado", "Confirmado", "Aprovada", "Ativo", "Resolvido"].includes(value);
  const negative = ["Cancelado", "Rejeitada", "Inativo", "Arquivado"].includes(value);
  return <span className={"dm-status " + (positive ? "good" : negative ? "muted" : "warn")}>{value}</span>;
}
function Empty({ text = "Nenhum registro disponível." }: { text?: string }) { return <div className="dm-empty">{text}</div>; }
function value(f: FormData, k: string) { return String(f.get(k) ?? "").trim(); }

export function DemoApp() {
  const [data, setData] = useState<DemoData>(readData);
  const [page, setPage] = useState(() => window.location.hash.slice(1) || "/");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [selectedAudit, setSelectedAudit] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { const f = () => { setPage(window.location.hash.slice(1) || "/"); setMobileOpen(false); }; window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f); }, []);
  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(data)); }, [data]);
  const edit = (change: (current: DemoData) => DemoData, message: string) => {
    setData(current => {
      const next = change(current);
      return { ...next, logs: [{ id: id(), date: new Date().toLocaleString("pt-BR"), event: message }, ...next.logs].slice(0, 60) };
    });
    setToast(message + " · alteração demonstrativa");
  };
  const submit = (fn: (form: FormData) => void) => (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fn(new FormData(e.currentTarget));
    e.currentTarget.reset();
  };
  const reset = () => { if (confirm("Restaurar todos os dados fictícios desta demonstração?")) { localStorage.removeItem(STORAGE); setData({ ...seeded, sales: [...seeded.sales], audits: [...seeded.audits], actions: [...seeded.actions], bookings: [...seeded.bookings], notices: [...seeded.notices], feedback: [...seeded.feedback], users: [...seeded.users], imports: [...seeded.imports], logs: [...seeded.logs] }); setToast("Dados fictícios restaurados"); } };
  const currentNav = nav.flatMap(g => g.items).find(item => item.path === page);
  const activeSales = data.sales.filter(s => s.status !== "Cancelado");
  const salesTotal = activeSales.reduce((a, b) => a + b.amount, 0);
  const salesByUnit = data.units.map(unit => ({ unit, amount: activeSales.filter(s => s.unit === unit).reduce((a, s) => a + s.amount, 0) }));
  const maxSales = Math.max(1, ...salesByUnit.map(u => u.amount));
  const abcTotal = catalog.reduce((a, c) => a + c.value, 0);
  const abcRanked = useMemo(() => [...catalog].sort((a, b) => b.value - a.value), []);
  const pageHeading = page === "/" ? "Áreas de trabalho" : currentNav?.title ?? "Nexora";

  const home = <div className="dm-home">
    <div className="dm-welcome"><div><p className="dm-overline">VISÃO GERAL</p><h2>Seu ambiente de demonstração está pronto.</h2><p>Explore os fluxos do Nexora com registros fictícios. Nenhuma ação altera o Supabase ou dados reais.</p></div><span className="dm-welcome-visual">N</span></div>
    <div className="dm-metrics"><Metric label="Módulos demonstrativos" value="13+" sub="Com fluxos navegáveis" /><Metric label="Vendas registradas" value={money(salesTotal)} sub="Dados ilustrativos" /><Metric label="Auditorias" value={String(data.audits.length)} sub="Checklist de exemplo" /><Metric label="Reservas" value={String(data.bookings.length)} sub="Agenda fictícia" /></div>
    {nav.slice(1).map(g => <section className="dm-home-group" key={g.title}><div className="dm-group-title"><h2>{g.title}</h2><span>{g.items.length} áreas</span></div><div className="dm-cards">{g.items.map(item => <a href={"#" + item.path} className="dm-card" key={item.path}><span className="dm-card-icon">{item.title.slice(0, 2).toUpperCase()}</span><strong>{item.title}</strong><small>{item.desc}</small><span className="dm-card-arrow">Abrir →</span></a>)}</div></section>)}
  </div>;

  const audit = <div className="dm-two">
    <Panel title="Inspeções"><div className="dm-table-wrap"><table><thead><tr><th>ID</th><th>Unidade</th><th>Data</th><th>Progresso</th><th>Situação</th><th></th></tr></thead><tbody>{data.audits.map(a => <tr key={a.id}><td>{a.id}</td><td>{a.unit}</td><td>{dateBR(a.date)}</td><td>{a.checked.length}/{checklist.length}</td><td><Status value={a.status}/></td><td><button className="dm-link" onClick={() => setSelectedAudit(a.id)}>Abrir checklist</button></td></tr>)}</tbody></table></div></Panel>
    <Panel title="Nova inspeção"><form className="dm-form" onSubmit={submit(f => { const uid = "AUD-" + (100 + data.audits.length + 5); edit(d => ({ ...d, audits: [{ id: uid, unit: value(f,"unit"), date: iso(), checked: [], status: "Em andamento" }, ...d.audits] }), "Inspeção " + uid + " criada"); setSelectedAudit(uid); })}><Field label="Unidade" name="unit" options={data.units}/><button className="dm-btn" type="submit">Criar inspeção</button></form></Panel>
    <div className="dm-wide"><Panel title="Checklist geral · demonstração">{(() => { const a = data.audits.find(x => x.id === (selectedAudit ?? data.audits[0]?.id)); if (!a) return <Empty/>; return <div><p className="dm-hint">Inspeção {a.id} · {a.unit}. Marque os itens verificados. Este é um recorte ilustrativo do checklist completo.</p><div className="dm-checklist">{checklist.map(item => <label className="dm-check" key={item}><input type="checkbox" checked={a.checked.includes(item)} onChange={e => edit(d => ({ ...d, audits: d.audits.map(x => x.id === a.id ? { ...x, checked: e.target.checked ? [...x.checked, item] : x.checked.filter(c => c !== item), status: (e.target.checked ? [...x.checked, item] : x.checked.filter(c => c !== item)).length === checklist.length ? "Concluída" : "Em andamento" } : x) }), "Checklist atualizado")}/><span>{item}</span></label>)}</div><div className="dm-inline"><label className="dm-btn light">Associar evidência fictícia<input hidden type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) edit(d => ({ ...d, audits: d.audits.map(x => x.id === a.id ? { ...x, evidence: file.name } : x) }), "Nome da evidência registrado"); }} /></label>{a.evidence && <span className="dm-hint">Arquivo selecionado: {a.evidence} (não enviado)</span>}<button className="dm-btn secondary" onClick={() => exportCsv("auditorias-demo.csv", ["ID","Unidade","Data","Situação","Itens verificados"], data.audits.map(x => [x.id,x.unit,x.date,x.status,x.checked.length]))}>Exportar CSV</button></div></div>; })()}</Panel></div>
  </div>;

  const actions = <div className="dm-two"><Panel title="Planos de Ação"><div className="dm-table-wrap"><table><thead><tr><th>Ação</th><th>Responsável</th><th>Prazo</th><th>Situação</th><th></th></tr></thead><tbody>{data.actions.map(a => <tr key={a.id}><td><strong>{a.title}</strong><small className="dm-cell-small">{a.id}</small></td><td>{a.owner}</td><td>{dateBR(a.due)}</td><td><Status value={a.status}/></td><td><select aria-label={"Situação de " + a.title} value={a.status} onChange={e => edit(d => ({ ...d, actions: d.actions.map(x => x.id === a.id ? { ...x, status: e.target.value } : x) }), "Plano de ação atualizado")}><option>Pendente</option><option>Em andamento</option><option>Concluído</option></select></td></tr>)}</tbody></table></div></Panel><Panel title="Nova ação corretiva"><form className="dm-form" onSubmit={submit(f => edit(d => ({ ...d, actions: [{ id: "PA-" + id(), title: value(f,"title"), owner: value(f,"owner"), due: value(f,"due"), status: "Pendente" }, ...d.actions] }), "Plano de ação criado"))}><Field label="Descrição" name="title"/><Field label="Responsável" name="owner"/><Field label="Prazo" name="due" type="date" defaultValue={iso(7)}/><button className="dm-btn">Adicionar ação</button></form></Panel></div>;

  const abc = <div className="dm-stack"><div className="dm-metrics"><Metric label="Consumo valorizado" value={money(abcTotal)} sub="Amostra simulada" /><Metric label="Produtos" value={String(catalog.length)}/><Metric label="Categorias" value="4"/><Metric label="Última importação" value={dateBR(data.imports[0]?.date ?? iso())}/></div><Panel title="Distribuição de consumo por produto"><div className="dm-bars">{abcRanked.map((c,i) => <div className="dm-barrow" key={c.name}><span>{c.name}</span><div className="dm-bar-track"><div className={"dm-bar dm-bar-" + (i%3)} style={{width:(c.value / abcRanked[0].value * 100) + "%"}}/></div><strong>{money(c.value)}</strong></div>)}</div></Panel></div>;
  const abcPage = page === "/abc" || page === "/abc/compare" ? <div className="dm-stack">{abc}<Panel title={page === "/abc/compare" ? "Comparação de consumo por unidade" : "Indicadores ilustrativos"}><div className="dm-metrics"><Metric label="Matriz" value={money(abcTotal * 0.57)}/><Metric label="Centro" value={money(abcTotal * 0.43)}/><Metric label="Classificação ABC" value="A / B / C" sub="Ordenação por valor"/></div></Panel></div>
    : page === "/abc/imports" ? <div className="dm-two"><Panel title="Histórico de importações"><div className="dm-table-wrap"><table><thead><tr><th>Arquivo</th><th>Data</th><th>Registros</th></tr></thead><tbody>{data.imports.map(i=><tr key={i.id}><td>{i.name}</td><td>{dateBR(i.date)}</td><td>{i.rows}</td></tr>)}</tbody></table></div></Panel><Panel title="Simular importação"><p className="dm-hint">A seleção registra o nome do arquivo local; não realiza importação real nem envia dados.</p><input type="file" accept=".csv,.xlsx,.xls" onChange={e => { const f=e.target.files?.[0]; if(f) edit(d=>({ ...d,imports:[{id:id(),name:f.name,date:iso(),rows:0},...d.imports]}),"Importação ilustrativa registrada"); e.target.value=""; }}/></Panel></div>
    : page === "/abc/reports" ? <Panel title="Relatórios e exportações"><p className="dm-hint">Arquivo CSV ilustrativo com produtos e valores fictícios.</p><button className="dm-btn" onClick={()=>exportCsv("curva-abc-demo.csv",["Produto","Categoria","Quantidade","Valor"],catalog.map(c=>[c.name,c.category,c.units,c.value]))}>Baixar relatório CSV</button></Panel>
    : page === "/abc/products" ? <Panel title="Produtos demonstrativos"><div className="dm-table-wrap"><table><thead><tr><th>Produto</th><th>Categoria</th><th>Quantidade</th><th>Consumo</th></tr></thead><tbody>{abcRanked.map(c=><tr key={c.name}><td>{c.name}</td><td>{c.category}</td><td>{c.units}</td><td>{money(c.value)}</td></tr>)}</tbody></table></div></Panel>
    : <Panel title="Categorias de consumo"><div className="dm-metrics">{Array.from(new Set(catalog.map(x=>x.category))).map(cat=><Metric key={cat} label={cat} value={money(catalog.filter(x=>x.category===cat).reduce((a,b)=>a+b.value,0))}/>)}</div></Panel>;

  const sales = page === "/sales/dashboard"
    ? <div className="dm-stack"><div className="dm-metrics"><Metric label="Vendas registradas" value={money(salesTotal)} sub="Valores fictícios"/><Metric label="Transações" value={String(activeSales.length)}/><Metric label="Total Stone" value={money(activeSales.filter(s=>s.method==="Stone").reduce((a,b)=>a+b.amount,0))}/><Metric label="Total PIX" value={money(activeSales.filter(s=>s.method==="PIX").reduce((a,b)=>a+b.amount,0))}/></div><Panel title="Vendas por unidade"><div className="dm-bars">{salesByUnit.map((s,i)=><div className="dm-barrow" key={s.unit}><span>{s.unit}</span><div className="dm-bar-track"><div className={"dm-bar dm-bar-"+i} style={{width:(s.amount/maxSales*100)+"%"}}/></div><strong>{money(s.amount)}</strong></div>)}</div><div className="dm-inline"><a className="dm-btn" href="#/sales/entries">Abrir lançamentos →</a><button className="dm-btn secondary" onClick={()=>exportCsv("vendas-demo.csv",["ID","Data","Unidade","Forma","Valor","Status"],data.sales.map(s=>[s.id,s.date,s.unit,s.method,s.amount,s.status]))}>Exportar CSV</button></div></Panel></div>
    : <div className="dm-two"><Panel title="Lançamentos de vendas"><div className="dm-table-wrap"><table><thead><tr><th>Data</th><th>Unidade</th><th>Forma</th><th>Valor</th><th>Situação</th><th></th></tr></thead><tbody>{data.sales.map(s=><tr key={s.id}><td>{dateBR(s.date)}</td><td>{s.unit}</td><td>{s.method}</td><td><strong>{money(s.amount)}</strong></td><td><Status value={s.status}/></td><td>{s.status!=="Cancelado"&&<button className="dm-link danger" onClick={()=>edit(d=>({...d,sales:d.sales.map(x=>x.id===s.id?{...x,status:"Cancelado"}:x)}),"Lançamento cancelado")}>Cancelar</button>}</td></tr>)}</tbody></table></div></Panel><Panel title="Novo lançamento"><form className="dm-form" onSubmit={submit(f => { const amount=Number(value(f,"amount")); if(!Number.isFinite(amount)||amount<=0){setToast("Informe um valor positivo");return;} edit(d=>({...d,sales:[{id:"V-"+id(),date:value(f,"date"),unit:value(f,"unit"),method:value(f,"method"),amount,status:"Confirmado"},...d.sales]}),"Venda lançada"); })}><Field label="Data" type="date" name="date" defaultValue={iso()}/><Field label="Unidade" name="unit" options={data.units}/><Field label="Meio de pagamento" name="method" options={["Stone","PIX"]}/><Field label="Valor (R$)" name="amount" type="number" min="0.01" step="0.01"/><button className="dm-btn">Registrar venda</button></form></Panel></div>;

  const rooms = <div className="dm-two"><Panel title="Agenda da sala"><div className="dm-table-wrap"><table><thead><tr><th>Data</th><th>Horário</th><th>Responsável</th><th>Situação</th><th>Ação</th></tr></thead><tbody>{data.bookings.map(b=><tr key={b.id}><td>{dateBR(b.date)}</td><td>{b.start}–{b.end}</td><td>{b.owner}</td><td><Status value={b.status}/></td><td>{b.status==="Pendente"?<div className="dm-inline"><button className="dm-link" onClick={()=>edit(d=>({...d,bookings:d.bookings.map(x=>x.id===b.id?{...x,status:"Aprovada"}:x)}),"Reserva aprovada")}>Aprovar</button><button className="dm-link danger" onClick={()=>edit(d=>({...d,bookings:d.bookings.map(x=>x.id===b.id?{...x,status:"Rejeitada"}:x)}),"Reserva rejeitada")}>Rejeitar</button></div>:b.status==="Aprovada"?<button className="dm-link danger" onClick={()=>edit(d=>({...d,bookings:d.bookings.map(x=>x.id===b.id?{...x,status:"Cancelado"}:x)}),"Reserva cancelada")}>Cancelar</button>:"—"}</td></tr>)}</tbody></table></div></Panel><Panel title="Solicitar reserva"><form className="dm-form" onSubmit={submit(f=>{const start=value(f,"start"),end=value(f,"end"),day=value(f,"date");if(start>=end){setToast("O horário final precisa ser posterior ao inicial.");return;}if(data.bookings.some(b=>b.date===day&&b.status==="Aprovada"&&start<b.end&&end>b.start)){setToast("Horário ocupado: escolha outro período.");return;}edit(d=>({...d,bookings:[{id:"RES-"+id(),room:"Sala de Reunião",owner:value(f,"owner"),date:day,start,end,status:"Pendente"},...d.bookings]}),"Solicitação de reserva criada");})}><Field label="Responsável" name="owner"/><Field label="Data" name="date" type="date" defaultValue={iso(1)} min={iso()}/><div className="dm-field-grid"><Field label="Início" name="start" type="time" defaultValue="10:00"/><Field label="Fim" name="end" type="time" defaultValue="11:00"/></div><button className="dm-btn">Solicitar reserva</button></form></Panel></div>;

  const announcements = <div className="dm-two"><Panel title="Comunicados institucionais"><div className="dm-items">{data.notices.map(n=><article className="dm-item" key={n.id}><div className="dm-item-top"><strong>{n.title}</strong><Status value={n.status}/></div><p>{n.body}</p><small>{n.priority} · {n.id}</small>{n.status==="Rascunho"&&<button className="dm-btn small" onClick={()=>edit(d=>({...d,notices:d.notices.map(x=>x.id===n.id?{...x,status:"Publicado"}:x)}),"Comunicado publicado")}>Publicar</button>}{n.status==="Publicado"&&<button className="dm-link" onClick={()=>edit(d=>({...d,notices:d.notices.map(x=>x.id===n.id?{...x,status:"Arquivado"}:x)}),"Comunicado arquivado")}>Arquivar</button>}</article>)}</div></Panel><Panel title="Novo comunicado"><form className="dm-form" onSubmit={submit(f=>edit(d=>({...d,notices:[{id:"COM-"+id(),title:value(f,"title"),body:value(f,"body"),priority:value(f,"priority"),status:"Rascunho"},...d.notices]}),"Rascunho criado"))}><Field label="Título" name="title"/><Field label="Prioridade" name="priority" options={["Informativo","Importante","Crítico"]}/><label className="dm-field"><span>Mensagem</span><textarea required minLength={8} name="body" rows={4}/></label><button className="dm-btn">Salvar rascunho</button></form></Panel></div>;

  const feedback = <div className="dm-two"><Panel title="Caixa de relatos"><div className="dm-items">{data.feedback.map(f=><article className="dm-item" key={f.id}><div className="dm-item-top"><strong>{f.type}</strong><Status value={f.status}/></div><p>{f.text}</p><small>{f.id}</small>{f.status!=="Resolvido"&&<button className="dm-btn small light" onClick={()=>edit(d=>({...d,feedback:d.feedback.map(x=>x.id===f.id?{...x,status:"Resolvido"}:x)}),"Relato resolvido")}>Marcar como resolvido</button>}</article>)}</div></Panel><Panel title="Enviar relato ou sugestão"><form className="dm-form" onSubmit={submit(f=>edit(d=>({...d,feedback:[{id:"REL-"+id(),type:value(f,"type"),text:value(f,"text"),status:"Aberto"},...d.feedback]}),"Novo relato registrado"))}><Field label="Tipo" name="type" options={["Sugestão","Problema"]}/><label className="dm-field"><span>Descrição</span><textarea required minLength={10} name="text" rows={5}/></label><button className="dm-btn">Enviar relato</button></form></Panel></div>;

  const users = <div className="dm-two"><Panel title="Usuários fictícios"><div className="dm-table-wrap"><table><thead><tr><th>Nome</th><th>E-mail</th><th>Papel</th><th>Situação</th><th></th></tr></thead><tbody>{data.users.map(u=><tr key={u.id}><td>{u.name}</td><td>{u.email}</td><td>{u.role}</td><td><Status value={u.active?"Ativo":"Inativo"}/></td><td><button className="dm-link" onClick={()=>edit(d=>({...d,users:d.users.map(x=>x.id===u.id?{...x,active:!x.active}:x)}),"Situação de usuário alterada")}>{u.active?"Desativar":"Ativar"}</button></td></tr>)}</tbody></table></div></Panel><Panel title="Cadastrar usuário fictício"><form className="dm-form" onSubmit={submit(f=>edit(d=>({...d,users:[{id:id(),name:value(f,"name"),email:value(f,"email"),role:value(f,"role"),active:true},...d.users]}),"Usuário fictício cadastrado"))}><Field label="Nome" name="name"/><Field label="E-mail fictício" name="email" type="email"/><Field label="Perfil" name="role" options={["Operador","Auditor","Gestor","Administrador"]}/><button className="dm-btn">Adicionar usuário</button></form></Panel></div>;
  const roles = <Panel title="Perfis de acesso · demonstração"><div className="dm-role-grid">{[{n:"Administrador",d:"Gestão de usuários, perfis, comunicados e relatórios",p:12},{n:"Gestor",d:"Acompanhamento de indicadores, ações e reservas",p:8},{n:"Auditor",d:"Inspeções, checklist e planos de ação",p:6},{n:"Operador",d:"Lançamentos e solicitações operacionais",p:4}].map(r=><div className="dm-role" key={r.n}><strong>{r.n}</strong><p>{r.d}</p><small>{r.p} capacidades ilustrativas</small></div>)}</div><p className="dm-hint">Esta tela demonstra a organização dos papéis. Não altera permissões do banco real.</p></Panel>;
  const permissions = <Panel title="Catálogo de permissões · demonstração"><div className="dm-table-wrap"><table><thead><tr><th>Módulo</th><th>Capacidades representadas</th><th>Escopo</th></tr></thead><tbody>{[["Auditorias","Consultar · Criar · Concluir","Unidade"],["Planos de Ação","Consultar · Criar · Atualizar","Unidade"],["Vendas","Dashboard · Lançar · Cancelar","Unidade"],["Agendamento","Consultar · Solicitar · Aprovar","Global"],["Comunicados","Criar · Publicar · Arquivar","Global"],["Relatos","Enviar · Consultar · Resolver","Global"],["Administração","Usuários · Papéis · Estrutura","Global"]].map(row=><tr key={row[0]}>{row.map((c,i)=><td key={i}>{c}</td>)}</tr>)}</tbody></table></div></Panel>;
  const organization = page === "/admin/units" || page === "/admin/sectors";
  const isUnit = page === "/admin/units";
  const org = organization ? <div className="dm-two"><Panel title={isUnit?"Unidades operacionais":"Setores"}><div className="dm-items">{(isUnit?data.units:data.sectors).map((item,i)=><div className="dm-org-row" key={item}><span className="dm-dot"/><strong>{item}</strong><small>Registro {i+1} · Demonstração</small></div>)}</div></Panel><Panel title={isUnit?"Nova unidade":"Novo setor"}><form className="dm-form" onSubmit={submit(f=>{const name=value(f,"name");const a=isUnit?data.units:data.sectors;if(a.includes(name)){setToast("Registro já existente");return;}edit(d=>isUnit?{...d,units:[...d.units,name]}:{...d,sectors:[...d.sectors,name]},isUnit?"Unidade criada":"Setor criado");})}><Field label="Nome" name="name"/><button className="dm-btn">Adicionar</button></form></Panel></div> : null;
  const logs = <Panel title="Atividades da demonstração"><p className="dm-hint">Eventos gerados apenas neste navegador. Não são registros de auditoria de produção.</p><div className="dm-table-wrap"><table><thead><tr><th>Data/hora</th><th>Evento</th></tr></thead><tbody>{data.logs.map(l=><tr key={l.id}><td>{l.date}</td><td>{l.event}</td></tr>)}</tbody></table></div></Panel>;

  const body = page === "/" ? home : page === "/audit" ? audit : page === "/action-plans" ? actions : page.startsWith("/abc") ? abcPage : page.startsWith("/sales") ? sales : page === "/rooms" ? rooms : page === "/admin/announcements" ? announcements : page === "/admin/feedback" ? feedback : page === "/admin/users" ? users : page === "/admin/roles" ? roles : page === "/admin/permissions" ? permissions : organization ? org : page === "/admin/logs" ? logs : <Panel title="Página não encontrada"><a href="#/">Voltar ao início</a></Panel>;
  return <div className="dm-layout">
    <aside className={"dm-sidebar" + (mobileOpen?" open":"")}><div className="dm-brand"><div className="dm-logo"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M5 8v16l13 7V14L31 7v16" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round"/></svg></div><div><strong>Nexora</strong><small>AMBIENTE DEMO</small></div></div><label className="dm-search"><span>Buscar no menu</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Pesquisar área..." /></label><nav aria-label="Menu principal">{nav.map(g=>{const items=g.items.filter(i=>(i.title+" "+g.title).toLowerCase().includes(search.toLowerCase()));return items.length?<section key={g.title}><p>{g.title}</p>{items.map(item=><a onClick={()=>setMobileOpen(false)} className={item.path===page?"active":""} href={"#"+item.path} key={item.path}><span className="dm-nav-icon">{item.title.slice(0,1)}</span>{item.title}</a>)}</section>:null;})}</nav><div className="dm-sidebar-bottom"><div className="dm-avatar">AD</div><div><strong>Administrador Demo</strong><small>Dados fictícios · acesso livre</small></div></div></aside>
    <div className="dm-content"><header className="dm-topbar"><button className="dm-mobile" onClick={()=>setMobileOpen(x=>!x)} aria-label="Abrir menu">☰</button><div className="dm-breadcrumb">Nexora <span>/</span> {pageHeading}</div><div className="dm-top-actions"><span className="dm-badge">AMBIENTE DEMO</span><button className="dm-reset" onClick={reset}>Restaurar dados</button></div></header><main className="dm-main"><div className="dm-page-head"><p className="dm-overline">NEXORA / DEMONSTRAÇÃO INTERATIVA</p><h1>{pageHeading}</h1><p>{page === "/" ? "Módulos operacionais disponíveis para apresentação" : currentNav?.desc || "Acompanhe os indicadores demonstrativos"}</p></div>{body}<footer className="dm-footer">Nexora · Ambiente demonstrativo independente · Dados e operações simulados · Nenhuma conexão com sistemas reais</footer></main></div>{mobileOpen&&<button className="dm-overlay" onClick={()=>setMobileOpen(false)} aria-label="Fechar menu"/>}
    {toast && <div className="dm-toast" role="status"><span>{toast}</span><button onClick={()=>setToast("")} aria-label="Fechar notificação">×</button></div>}
  </div>;
}
