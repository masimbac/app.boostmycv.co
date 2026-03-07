import {
  FileUp,
  Brain,
  Target,
  Lightbulb,
  Zap,
  Download,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const products = [
  {
    icon: FileUp,
    title: "CV Upload & Parsing",
    description:
      "Upload your resume in PDF or Word format. Our AI extracts and structures your information automatically.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Brain,
    title: "AI-Powered Scoring",
    description:
      "Get instant feedback on how well your CV matches job descriptions with detailed percentage scores.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: Target,
    title: "Gap Analysis",
    description:
      "Identify missing skills, experience, and keywords that employers are looking for in candidates.",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    icon: Lightbulb,
    title: "Smart Recommendations",
    description:
      "Receive actionable suggestions to improve your resume based on industry best practices and job requirements.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    icon: Zap,
    title: "One-Click Boost",
    description:
      "Let AI automatically apply recommendations to enhance your CV and increase your match score.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Download,
    title: "Professional Export",
    description:
      "Download your optimized resume as a professionally formatted PDF using premium templates.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

export function ProductsSection() {
  return (
    <section id="products" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-primary">Stand Out</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Our comprehensive suite of AI-powered tools helps you create resumes
            that get noticed by hiring managers and pass ATS systems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
            >
              <CardContent className="p-6 space-y-4">
                <div
                  className={`${product.bgColor} w-14 h-14 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <product.icon className={`h-7 w-7 ${product.color}`} />
                </div>
                <h3 className="text-xl font-semibold">{product.title}</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-3 rounded-full">
            <span className="text-sm font-medium">
              🎯 Increase your interview chances by up to 80%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
