"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BoostListItem } from "@/types/boost";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Sparkles, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function BoostsListPage() {
  const router = useRouter();
  const [boosts, setBoosts] = useState<BoostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadBoosts();
  }, []);

  const loadBoosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/v1/boosts");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load boosts");
      setBoosts(data.boosts || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load boosts"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (boostId: string) => {
    if (!confirm("Delete this boost?")) return;
    try {
      setDeletingId(boostId);
      const response = await fetch(`/api/v1/boosts/${boostId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete");
      }
      setBoosts((prev) => prev.filter((b) => b.boost_id !== boostId));
      toast.success("Boost deleted");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-green-600";
      case "pending":
        return "bg-amber-500";
      case "rejected":
        return "bg-red-600";
      default:
        return "bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              My Boosts
            </h1>
          </div>
          <Link href="/dashboard/scoring">
            <Button variant="outline" size="sm">
              Score a CV
            </Button>
          </Link>
        </div>

        {boosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No boosts yet</h3>
              <p className="text-muted-foreground mb-4">
                Score a CV against a job description, then use Auto-Boost to
                generate AI improvements.
              </p>
              <Link href="/dashboard/scoring">
                <Button>Score a CV</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {boosts.map((boost) => (
              <Card key={boost.boost_id} className="hover:ring-2 hover:ring-blue-200 transition-all">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">
                          {boost.cv_name}
                        </span>
                        <Badge
                          className={`${getStatusColor(boost.status)} text-[10px] h-4`}
                        >
                          {boost.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {boost.job_title} &middot;{" "}
                        {boost.changes_count} suggestions &middot;{" "}
                        {new Date(boost.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/boosts/${boost.boost_id}`)
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(boost.boost_id)}
                        disabled={deletingId === boost.boost_id}
                      >
                        {deletingId === boost.boost_id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
