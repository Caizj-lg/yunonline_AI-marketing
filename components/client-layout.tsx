import { AuthGate } from "./auth-gate";
import { Sidebar } from "./sidebar";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return <AuthGate><main className="app-shell"><Sidebar /><div className="content">{children}</div></main></AuthGate>;
}
