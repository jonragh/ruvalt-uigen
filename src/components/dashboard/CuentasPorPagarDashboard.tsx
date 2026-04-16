const proveedores = [
  { nombre: "ELIAS MENDOZA AGUIRRE",             total: 604_436.54 },
  { nombre: "PROMOTORA LAND",                    total: 375_211.20 },
  { nombre: "COMISION FEDERAL DE ELECTRICIDAD",  total: 304_451.38 },
  { nombre: "ANDRE VILLALPANDO FONSECA",         total: 303_352.98 },
  { nombre: "GALGO ALIMENTOS",                   total: 283_427.00 },
  { nombre: "ABARROTES RAUL",                    total: 172_899.48 },
  { nombre: "BANCO SANTANDER MEXICO",            total:  92_273.56 },
  { nombre: "LITO ETIQUETAS",                    total:  79_477.63 },
  { nombre: "GEO PACK",                          total:  79_170.00 },
  { nombre: "SIGMA FOODSERVICE COMERCIAL",       total:  77_697.34 },
];

const TOTAL_GENERAL  = 3_528_105.56;
const TOTAL_TOP10    = proveedores.reduce((s, p) => s + p.total, 0);
const TOTAL_OTROS    = TOTAL_GENERAL - TOTAL_TOP10;
const CANTIDAD_OTROS = 67;

const fmt = (n: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(n);

const pct = (n: number) => ((n / TOTAL_GENERAL) * 100).toFixed(1) + "%";

function Barra({ valor, color }: { valor: number; color: string }) {
  const ancho = Math.max((valor / TOTAL_GENERAL) * 100, 0.4);
  return (
    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
      <div
        className="h-1.5 rounded-full"
        style={{ width: `${ancho}%`, backgroundColor: color }}
      />
    </div>
  );
}

function Fila({
  rank,
  nombre,
  total,
  esOtros = false,
}: {
  rank: number | null;
  nombre: string;
  total: number;
  esOtros?: boolean;
}) {
  const color = esOtros
    ? "#94a3b8"
    : rank != null && rank <= 3
    ? "#3b82f6"
    : "#60a5fa";

  const badgeBg   = esOtros ? "#f1f5f9" : rank != null && rank <= 3 ? "#dbeafe" : "#eff6ff";
  const badgeText = esOtros ? "#94a3b8" : rank != null && rank <= 3 ? "#1d4ed8" : "#3b82f6";

  return (
    <div className="px-5 py-3.5 hover:bg-blue-50/40 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Nombre */}
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: badgeBg, color: badgeText }}
          >
            {esOtros ? "+" : rank}
          </span>
          <span
            className="text-sm font-medium truncate"
            style={{ color: esOtros ? "#64748b" : "#1e293b" }}
            title={nombre}
          >
            {nombre}
          </span>
        </div>
        {/* Monto */}
        <div className="text-right flex-shrink-0">
          <div className="text-sm font-semibold text-slate-800">{fmt(total)}</div>
          <div className="text-xs text-slate-400">{pct(total)}</div>
        </div>
      </div>
      <div className="ml-9">
        <Barra valor={total} color={color} />
      </div>
    </div>
  );
}

export default function CuentasPorPagarDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-6 pt-10">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">
            Pastriva
          </p>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Cuentas por Pagar
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            77 proveedores · ordenados de mayor a menor
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total general",          value: fmt(TOTAL_GENERAL), sub: null,               color: "text-slate-900" },
            { label: "Top 10 proveedores",      value: fmt(TOTAL_TOP10),   sub: pct(TOTAL_TOP10),   color: "text-blue-600"  },
            { label: `Otros (${CANTIDAD_OTROS})`, value: fmt(TOTAL_OTROS), sub: pct(TOTAL_OTROS),   color: "text-slate-500" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
              <p className="text-xs text-slate-400 font-medium mb-0.5">{label}</p>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              {sub && <p className="text-xs text-slate-400">{sub} del total</p>}
            </div>
          ))}
        </div>

        {/* Tabla */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Header de columnas */}
          <div className="flex justify-between px-5 py-2.5 bg-slate-50 border-b border-slate-100">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Proveedor
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Saldo pendiente
            </span>
          </div>

          {/* Filas top 10 */}
          <div className="divide-y divide-slate-100">
            {proveedores.map((p, i) => (
              <Fila key={p.nombre} rank={i + 1} nombre={p.nombre} total={p.total} />
            ))}
          </div>

          {/* Separador punteado */}
          <div className="border-t border-dashed border-slate-200" />

          {/* Fila Otros */}
          <Fila
            rank={null}
            nombre={`Otros (${CANTIDAD_OTROS} proveedores)`}
            total={TOTAL_OTROS}
            esOtros
          />

          {/* Fila Total */}
          <div className="border-t-2 border-slate-200 bg-slate-50 px-5 py-4 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Total general
            </span>
            <div className="text-right">
              <p className="text-base font-bold text-slate-900">{fmt(TOTAL_GENERAL)}</p>
              <p className="text-xs text-slate-400">77 proveedores</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4 text-center">
          Fuente: 3. Cuentas por Pagar.xlsx · Hoja "Totales"
        </p>
      </div>
    </div>
  );
}
