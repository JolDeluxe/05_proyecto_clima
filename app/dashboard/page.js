import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="w-full h-full" />}>
      <DashboardClient />
    </Suspense>
  );
}
