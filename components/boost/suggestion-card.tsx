"use client";

import { Change } from "@/types/boost";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Undo2,
  Plus,
  Minus,
  Edit,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatChangeValue } from "@/lib/cv-changes";

interface SuggestionCardProps {
  change: Change;
  isApplied: boolean;
  onApply: () => void;
  onRevert: () => void;
}

export function SuggestionCard({
  change,
  isApplied,
  onApply,
  onRevert,
}: SuggestionCardProps) {
  const getTypeIcon = () => {
    switch (change.type) {
      case "add":
        return <Plus className="h-3 w-3" />;
      case "remove":
        return <Minus className="h-3 w-3" />;
      case "modify":
        return <Edit className="h-3 w-3" />;
      default:
        return <ArrowRight className="h-3 w-3" />;
    }
  };

  const getTypeBadgeVariant = (): "default" | "destructive" | "secondary" | "outline" => {
    switch (change.type) {
      case "add":
        return "default";
      case "remove":
        return "destructive";
      case "modify":
        return "secondary";
      default:
        return "outline";
    }
  };

  const beforeStr = formatChangeValue(change.before);
  const afterStr = formatChangeValue(change.after);

  return (
    <div
      className={cn(
        "rounded-lg border p-3 text-sm transition-all",
        isApplied
          ? "border-green-300 bg-green-50/50"
          : "border-muted hover:border-blue-300"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap min-w-0">
          <Badge variant={getTypeBadgeVariant()} className="gap-1 text-[10px] h-4">
            {getTypeIcon()}
            {change.type}
          </Badge>
          <span className="text-xs font-medium truncate">
            {change.field_label}
          </span>
        </div>
        {isApplied ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onRevert}
            className="h-7 text-xs shrink-0 gap-1"
          >
            <Undo2 className="h-3 w-3" />
            Undo
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onApply}
            className="h-7 text-xs shrink-0 gap-1 bg-blue-600 hover:bg-blue-700"
          >
            <Check className="h-3 w-3" />
            Apply
          </Button>
        )}
      </div>

      {/* Compact diff view */}
      <div className="space-y-1.5">
        {change.before !== null && change.before !== undefined && beforeStr && (
          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800 line-through">
            {beforeStr.length > 200 ? beforeStr.slice(0, 200) + "..." : beforeStr}
          </div>
        )}
        {change.after !== null && change.after !== undefined && afterStr && (
          <div className="p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
            {afterStr.length > 200 ? afterStr.slice(0, 200) + "..." : afterStr}
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-2 italic">
        {change.reasoning}
      </p>
    </div>
  );
}
