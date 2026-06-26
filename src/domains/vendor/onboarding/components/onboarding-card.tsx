import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function OnboardingCard({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className='border-border/50 bg-card/60 backdrop-blur-xl'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
