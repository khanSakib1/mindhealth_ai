import { BreathingExercise } from "@/components/exercises/breathing-exercise";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2 } from "lucide-react";

const mindfulnessTips = [
    "Focus on your breath for one minute. Notice the sensation of air entering and leaving your body.",
    "Pay attention to the sounds around you. Can you identify five different sounds?",
    "Mindfully eat a meal or snack. Notice the textures, smells, and tastes.",
    "Take a short walk and notice the feeling of your feet on the ground.",
    "Observe your thoughts without judgment, like clouds passing in the sky."
];

const gratitudePrompts = [
    "What is one thing that made you smile today?",
    "Who is someone you are grateful for, and why?",
    "What is a small pleasure you enjoyed recently?",
    "What is something beautiful you saw today?",
    "What is a skill or ability you are thankful to have?"
];

export default function ExercisesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Guided Exercises</h1>
        <p className="text-muted-foreground">Tools to help you find calm and presence.</p>
      </div>

      <Tabs defaultValue="breathing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breathing">Breathing</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
          <TabsTrigger value="gratitude">Gratitude</TabsTrigger>
        </TabsList>
        <TabsContent value="breathing">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Box Breathing</CardTitle>
              <CardDescription>A simple technique to calm your nervous system. Follow the visual guide.</CardDescription>
            </CardHeader>
            <CardContent>
              <BreathingExercise />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mindfulness">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Mindfulness Tips</CardTitle>
                    <CardDescription>Simple practices to bring your attention to the present moment.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {mindfulnessTips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-accent-foreground/50 mt-1 flex-shrink-0" />
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="gratitude">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Gratitude Prompts</CardTitle>
                    <CardDescription>Reflect on the good things in your life to cultivate a positive mindset.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {gratitudePrompts.map((prompt, index) => (
                           <li key={index} className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-accent-foreground/50 mt-1 flex-shrink-0" />
                                <span>{prompt}</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
