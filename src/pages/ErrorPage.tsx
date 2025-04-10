import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouteError } from "react-router";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="rounded-2xl shadow-xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold  mb-4">Page not Found!</h1>
        <p className="mb-4">This page does not exist</p>
        {error instanceof Error && (
          <pre className="text-sm rounded p-3 text-left overflow-x-auto">
            {error.message}
          </pre>
        )}
        <Button>
          <a href="/" className="">
            Go Home
          </a>
        </Button>
      </Card>
    </div>
  );
}
