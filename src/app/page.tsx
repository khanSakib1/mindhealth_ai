import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppLogo } from "@/components/icons";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { BookText, HeartPulse, MessageSquare, Smile, ArrowRight } from "lucide-react";

const features = [
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "AI Chat Assistant",
    description: "Engage in supportive conversations with an empathetic AI trained for mental wellness.",
    image: PlaceHolderImages.find(img => img.id === 'chat')
  },
  {
    icon: <Smile className="h-8 w-8 text-primary" />,
    title: "Mood Tracker",
    description: "Log your daily mood and gain insights into your emotional patterns over time.",
    image: PlaceHolderImages.find(img => img.id === 'mood')
  },
  {
    icon: <BookText className="h-8 w-8 text-primary" />,
    title: "Smart Journal",
    description: "Write your thoughts and let our AI provide summaries, sentiment analysis, and tips.",
    image: PlaceHolderImages.find(img => img.id === 'journal')
  },
  {
    icon: <HeartPulse className="h-8 w-8 text-primary" />,
    title: "Guided Exercises",
    description: "Access a library of calming exercises, including breathing and mindfulness.",
    image: PlaceHolderImages.find(img => img.id === 'exercises')
  },
];

const heroImage = PlaceHolderImages.find(img => img.id === 'hero');

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2">
          <AppLogo className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold font-headline">MindfulJourney</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative py-24 sm:py-40 text-center">
          <div className="absolute inset-0">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent"></div>
          </div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl lg:text-7xl font-headline bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                Your Path to a Healthier Mind
              </h1>
              <p className="mt-6 text-lg leading-8 text-foreground/80 max-w-2xl mx-auto">
                MindfulJourney is your personal AI companion for mental wellness. Track your mood, journal your thoughts, and find peace with guided exercises.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Start for Free <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-primary">Core Features</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">
                Everything You Need for a Balanced Mind
              </p>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Our tools are designed to provide support and insight on your mental wellness journey.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
                {features.map((feature) => (
                  <Card key={feature.title} className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          {feature.icon}
                        </div>
                        <CardTitle className="font-headline">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary/50">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <AppLogo className="h-8 w-8 text-primary" />
          </div>
           <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} MindfulJourney. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
