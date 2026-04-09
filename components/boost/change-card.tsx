"use client";

import { Change } from "@/types/boost";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Plus, Minus, Edit, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatChangeValue } from "@/lib/cv-changes";

interface ChangeCardProps {
  change: Change;
  onAccept: () => void;
  onReject: () => void;
  isAccepted: boolean;
}

export function ChangeCard({
  change,
  onAccept,
  onReject,
  isAccepted,
}: ChangeCardProps) {
  const getTypeIcon = () => {
    switch (change.type) {
      case "add":
        return <Plus className="h-4 w-4" />;
      case "remove":
        return <Minus className="h-4 w-4" />;
      case "modify":
        return <Edit className="h-4 w-4" />;
      case "reorder":
        return <ArrowUpDown className="h-4 w-4" />;
    }
  };

  const getTypeBadgeVariant = () => {
    switch (change.type) {
      case "add":
        return "default";
      case "remove":
        return "destructive";
      case "modify":
        return "secondary";
      case "reorder":
        return "outline";
    }
  };

  const getSectionLabel = (section: string) => {
    return section
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card
      className={cn(
        "transition-all",
        isAccepted && "border-green-500 bg-green-50/50"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={getTypeBadgeVariant()} className="gap-1">
                {getTypeIcon()}
                {change.type.charAt(0).toUpperCase() + change.type.slice(1)}
              </Badge>
              <Badge variant="outline">{getSectionLabel(change.section)}</Badge>
            </div>
            <CardTitle className="text-base mt-2">
              {change.field_label}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isAccepted ? "default" : "outline"}
              onClick={onAccept}
              className={cn(isAccepted && "bg-green-600 hover:bg-green-700")}
            >
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button
              size="sm"
              variant={!isAccepted ? "default" : "outline"}
              onClick={onReject}
              className={cn(
                !isAccepted && "bg-red-600 hover:bg-red-700 text-white"
              )}
            >
              <X className="h-4 w-4 mr-1" />
              Reject
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Before/After comparison */}
        <div className="grid gap-4">
          {change.before !== null && change.before !== undefined && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                Before:
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm">
                {formatChangeValue(change.before)}
              </div>
            </div>
          )}

          {change.after !== null && change.after !== undefined && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">
                After:
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-md text-sm">
                {formatChangeValue(change.after)}
              </div>
            </div>
          )}
        </div>

        {/* Reasoning */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            Reasoning:
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
            {change.reasoning}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
