import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AIFriendlyResponseProps {
  journalContent: string;
}

export function AIFriendlyResponse({
  journalContent,
}: AIFriendlyResponseProps) {
  return (
    <Card className="bg-blue-50 dark:bg-blue-900">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/ai-avatar.png" alt="AI Friend" />
            <AvatarFallback>MS</AvatarFallback>
          </Avatar>
          <CardTitle>Mind Scribe</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg leading-relaxed">{journalContent}</p>
      </CardContent>
    </Card>
  );
}
