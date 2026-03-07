import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Shield, Globe } from "lucide-react";

const services = [
  {
    icon: TrendingUp,
    title: "CV Optimization",
    description:
      "Advanced algorithms analyze your resume against thousands of successful applications to identify what works.",
    features: [
      "Industry-specific insights",
      "ATS optimization",
      "Keyword density analysis",
      "Format recommendations",
    ],
  },
  {
    icon: Target,
    title: "Job Description Matching",
    description:
      "Instantly see how well your resume aligns with any job posting and get specific improvement suggestions.",
    features: [
      "Real-time scoring",
      "Gap identification",
      "Skill mapping",
      "Experience matching",
    ],
  },
  {
    icon: Brain,
    title: "Keyword Analysis",
    description:
      "Identify and optimize the right keywords to ensure your resume passes Applicant Tracking Systems.",
    features: [
      "Industry keyword database",
      "Contextual placement",
      "Density optimization",
      "Synonym suggestions",
    ],
  },
  {
    icon: Shield,
    title: "ATS Compatibility Check",
    description:
      "Ensure your resume is formatted correctly to pass through Applicant Tracking Systems used by employers.",
    features: [
      "Format validation",
      "Parsing verification",
      "Structure analysis",
      "Compatibility score",
    ],
  },
  {
    icon: Sparkles,
    title: "Professional Formatting",
    description:
      "Access premium templates designed by career experts to make your resume visually appealing and professional.",
    features: [
      "Multiple template styles",
      "Custom color schemes",
      "Font optimization",
      "Layout customization",
    ],
  },
  {
    icon: Globe,
    title: "Multi-Version Management",
    description:
      "Create and manage multiple versions of your resume tailored for different job applications and industries.",
    features: [
      "Version tracking",
      "Quick duplications",
      "Side-by-side comparison",
      "Easy organization",
    ],
  },
];

function Target(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function Brain(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

function Sparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Comprehensive <span className="text-primary">Services</span> for
            Your Success
          </h2>
          <p className="text-xl text-muted-foreground">
            From analysis to optimization, we provide end-to-end solutions to
            help you create the perfect resume.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <service.icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {service.description}
                  </p>
                </div>

                <ul className="space-y-2 pt-2">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Upload Your CV</h4>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop your resume or paste your information
                      directly.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Add Job Description
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Paste the job posting you want to apply for.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Get AI Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive detailed scoring and recommendations instantly.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Boost & Export</h4>
                    <p className="text-sm text-muted-foreground">
                      Apply improvements and download your optimized resume.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b">
                    <span className="font-semibold">Match Score</span>
                    <span className="text-3xl font-bold text-primary">92%</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Skills Match</span>
                        <span className="text-primary font-medium">95%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[95%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Experience</span>
                        <span className="text-primary font-medium">88%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[88%]"></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Keywords</span>
                        <span className="text-primary font-medium">93%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full w-[93%]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
