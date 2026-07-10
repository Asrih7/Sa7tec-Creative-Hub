import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Seo } from "@/components/Seo";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page Not Found | SA7TEC"
        description="The page you are looking for could not be found. Return to SA7TEC’s homepage or contact us directly."
        path="/404"
        noindex
      />
      <div className="min-h-screen w-full flex items-center justify-center bg-[var(--s7-bg)] px-4 py-16 text-[var(--s7-fg)]">
        <Card className="w-full max-w-lg border-[var(--s7-border)] bg-[var(--s7-card-bg)] shadow-2xl">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2 items-center">
              <AlertCircle className="h-8 w-8 text-red-500" aria-hidden="true" />
              <h1 className="text-2xl font-bold">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm leading-6 text-[var(--s7-fg-dim)]">
              The page you are looking for does not exist or may have moved. You can return to the homepage or get in touch with us.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/" className="inline-flex items-center justify-center rounded-full bg-[var(--s7-cyan)] px-4 py-2 text-sm font-semibold text-slate-950">
                Back home
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-[var(--s7-border)] px-4 py-2 text-sm font-semibold">
                Contact us
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
