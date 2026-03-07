import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Resume Optimization
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Boost Your CV to{" "}
              <span className="text-primary">Match Any Job</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-xl">
              Transform your resume with AI-powered insights. Get detailed gap
              analysis, personalized recommendations, and land more interviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="text-base">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#products">
                <Button size="lg" variant="outline" className="text-base">
                  See How It Works
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Free forever plan</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>5 scores included</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

              <div className="relative bg-white rounded-lg shadow-2xl p-8 border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-100 rounded w-24"></div>
                    </div>
                    <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                  </div>

                  <div className="space-y-3">
                    <div className="h-3 bg-primary/20 rounded w-full"></div>
                    <div className="h-3 bg-primary/20 rounded w-5/6"></div>
                    <div className="h-3 bg-primary/20 rounded w-4/6"></div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 bg-green-200 rounded-full"></div>
                        <span className="text-sm font-semibold text-green-600">
                          92%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-200 rounded w-28"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-16 bg-yellow-200 rounded-full"></div>
                        <span className="text-sm font-semibold text-yellow-600">
                          78%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-green-200 rounded-full"></div>
                        <span className="text-sm font-semibold text-green-600">
                          95%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-center">
                    <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-medium">
                      Optimized by AI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Trusted by job seekers at leading companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-50 grayscale">
            {["Company A", "Company B", "Company C", "Company D", "Company E"].map(
              (company) => (
                <div
                  key={company}
                  className="text-xl font-bold text-muted-foreground"
                >
                  {company}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
