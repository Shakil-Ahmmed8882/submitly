import { CheckCircle2, Clock } from "lucide-react";

const ROWS = [
  { title: "E-commerce Dashboard", cat: "Full Stack", status: "Reviewed" },
  { title: "Weather App", cat: "Frontend", status: "Pending" },
  { title: "REST API Server", cat: "Backend", status: "Reviewed" },
  { title: "Portfolio Site", cat: "Frontend", status: "Reviewed" },
];

const RECENT = [
  { title: "E-commerce Dashboard", time: "2 hrs ago", status: "Reviewed" },
  { title: "REST API Server", time: "1 day ago", status: "Reviewed" },
];

export default function Features() {
  return (
    <section className="py-6 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_32px_64px_-16px_rgba(0,0,0,0.6)]">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/50" />
            <span className="h-3 w-3 rounded-full bg-amber-500/50" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/50" />
            <div className="ml-4 flex flex-1 items-center gap-2 max-w-[220px] rounded-md border border-border bg-card/60 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500/70 shrink-0" />
              <span className="text-xs text-muted-foreground truncate">submitly.app/dashboard</span>
            </div>
          </div>

          {/* App chrome */}
          <div className="grid sm:grid-cols-[200px_1fr] min-h-[440px]">
            {/* Sidebar */}
            <div className="border-r border-border bg-background/40 p-4 hidden sm:flex sm:flex-col">
              <div className="mb-6 px-3">
                <p className="text-sm font-semibold">Submitly</p>
              </div>
              <p className="px-3 mb-2 text-[10px] font-semibold text-muted-foreground/40 uppercase tracking-wider">Navigation</p>
              {[
                { label: "Dashboard", active: false },
                { label: "Submit project", active: false },
                { label: "My submissions", active: true },
                { label: "Profile", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`mb-0.5 rounded-lg px-3 py-2 text-xs transition-colors ${
                    item.active
                      ? "bg-card font-medium text-foreground border border-border"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </div>
              ))}

              <div className="mt-auto pt-4 border-t border-border">
                <div className="flex items-center gap-2.5 px-3 py-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 shrink-0" />
                  <div>
                    <p className="text-xs font-medium">Shakil A.</p>
                    <p className="text-[10px] text-muted-foreground">Student</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content */}
            <div className="p-6">
              {/* Header row */}
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">My submissions</p>
                  <p className="text-xs text-muted-foreground mt-0.5">4 projects submitted</p>
                </div>
                <div className="flex gap-1.5">
                  {["All", "Reviewed", "Pending"].map((f, i) => (
                    <span
                      key={f}
                      className={`rounded-full px-3 py-1 text-xs transition-colors ${
                        i === 0
                          ? "border border-border bg-card text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Table header */}
              <div className="mb-2 grid grid-cols-[1fr_100px_80px] gap-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                <span>Project</span>
                <span>Category</span>
                <span>Status</span>
              </div>

              {/* Rows */}
              <div className="space-y-1.5">
                {ROWS.map((row) => (
                  <div
                    key={row.title}
                    className="grid grid-cols-[1fr_100px_80px] items-center gap-3 rounded-xl border border-border bg-background/60 px-3 py-3 hover:bg-background transition-colors"
                  >
                    <p className="text-xs font-medium truncate">{row.title}</p>
                    <p className="text-xs text-muted-foreground">{row.cat}</p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset w-fit ${
                        row.status === "Reviewed"
                          ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                      }`}
                    >
                      {row.status === "Reviewed" ? (
                        <CheckCircle2 className="size-2.5" aria-hidden="true" />
                      ) : (
                        <Clock className="size-2.5" aria-hidden="true" />
                      )}
                      {row.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Activity footer */}
              <div className="mt-6 pt-5 border-t border-border">
                <p className="mb-3 text-xs font-medium text-muted-foreground">Recent activity</p>
                <div className="space-y-2">
                  {RECENT.map((r) => (
                    <div key={r.title} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{r.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground/50">{r.time}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                          <CheckCircle2 className="size-2.5" aria-hidden="true" />
                          {r.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
