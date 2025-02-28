
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;
  
  // Check if it's a quota exceeded error to show a more specific message
  const isQuotaExceeded = error.includes('OpenAI API key has reached its usage limit') || 
                           error.includes('exceeded your current quota');
  
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {isQuotaExceeded ? (
          <>
            {error} <br />
            <a 
              href="https://platform.openai.com/account/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              Visit your OpenAI billing page
            </a>
          </>
        ) : (
          error
        )}
      </AlertDescription>
    </Alert>
  );
}
