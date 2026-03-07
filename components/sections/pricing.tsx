import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with CV optimization",
    features: [
      { name: "2 CVs maximum", included: true },
      { name: "5 CV scores per month", included: true },
      { name: "Manual editing", included: true },
      { name: "Basic templates", included: true },
      { name: "Standard support", included: true },
      { name: "AI auto-boost", included: false },
      { name: "Unlimited CVs", included: false },
      { name: "Unlimited scoring", included: false },
      { name: "Premium templates", included: false },
      { name: "Version history", included: false },
      { name: "Priority support", included: false },
    ],
    cta: "Get Started Free",
    href: "/register",
    popular: false,
  },
  {
    name: "Professional",
    price: 9,
    period: "month",
    description: "Everything you need to land your dream job",
    features: [
      { name: "Unlimited CVs", included: true },
      { name: "Unlimited CV scoring", included: true },
      { name: "AI auto-boost", included: true },
      { name: "Premium templates", included: true },
      { name: "Version history tracking", included: true },
      { name: "Priority support", included: true },
      { name: "Advanced analytics", included: true },
      { name: "Export to multiple formats", included: true },
      { name: "Custom branding", included: true },
      { name: "Early access to new features", included: true },
      { name: "Dedicated account manager", included: false },
    ],
    cta: "Start Professional",
    href: "/register?plan=pro",
    popular: true,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Simple, <span className="text-primary">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your needs. Start free, upgrade when
            you're ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "border-2 border-primary shadow-xl scale-105"
                  : "border-2"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-primary text-white px-4 py-1 text-sm font-semibold">
                    <Zap className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <Link href={plan.href} className="block">
                  <Button
                    size="lg"
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-muted-foreground">
                    What's included:
                  </p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-3 text-sm"
                      >
                        {feature.included ? (
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={
                            feature.included
                              ? ""
                              : "text-muted-foreground/70 line-through"
                          }
                        >
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="border-2">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Frequently Asked Questions
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">
                    Can I switch plans anytime?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Yes! You can upgrade or downgrade your plan at any time.
                    Changes take effect immediately.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    What payment methods do you accept?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We accept all major credit cards, debit cards, and mobile
                    money through Paystack.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Is there a free trial for Pro?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    You can start with our Free plan to test the platform. No
                    credit card required.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Can I cancel my subscription?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel anytime. You'll continue to have access
                    until the end of your billing period.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Do you offer refunds?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We offer a 14-day money-back guarantee if you're not
                    satisfied with our service.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Is my data secure?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Absolutely. We use bank-level encryption and never share
                    your information with third parties.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need a custom plan for your team?{" "}
            <Link href="#" className="text-primary hover:underline font-medium">
              Contact our sales team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
