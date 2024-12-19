import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TimeUnitProps {
  value: number;
  label: string;
}

export function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <Card className={cn(
        "w-24 h-24 flex items-center justify-center",
        "glass-effect border-[rgba(255,255,255,0.15)]",
        "transform hover:translate-y-1 transition-all duration-300",
        "hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
      )}>
        <CardContent className="p-0 flex items-center justify-center">
          <span className="text-4xl font-pixel text-white tracking-wider opacity-90">
            {value.toString().padStart(2, '0')}
          </span>
        </CardContent>
      </Card>
      <span className="mt-3 text-base font-pixel text-white uppercase tracking-wide opacity-75">
        {label}
      </span>
    </div>
  );
}