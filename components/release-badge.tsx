"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { appVersion, releaseChannel, gitShaShort } from "@/lib/version";

interface ReleaseBadgeProps {
  className?: string;
}

export default function ReleaseBadge({ className }: ReleaseBadgeProps) {
  const channelLabel = releaseChannel.toUpperCase();
  const sha = gitShaShort ? ` • ${gitShaShort}` : "";

  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 ReleaseBadge Component Debug:');
    console.log('  appVersion:', appVersion);
    console.log('  releaseChannel:', releaseChannel);
    console.log('  gitShaShort:', gitShaShort);
    console.log('  channelLabel:', channelLabel);
    console.log('  sha:', sha);
  }

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2",
        className
      )}
      aria-label="Application release info"
    >
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{channelLabel}</Badge>
        <span className="text-xs text-muted-foreground">v{appVersion}{sha}</span>
      </div>
      <a
        href="/docs/releases/changelog"
        className="text-xs text-primary hover:underline"
        aria-label="View changelog"
      >
        Changelog
      </a>
    </div>
  );
}


