import { useState, useEffect, useCallback } from 'react';
import { Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeUnit } from '@/components/TimeUnit';
import { SnowEffect } from '@/components/SnowEffect';
import { supabase } from '@/lib/supabase';

function App() {
  const { toast } = useToast();
  const [targetDate, setTargetDate] = useState(() => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 15);
    return date;
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [isRunning, setIsRunning] = useState(true);

  const saveTimer = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('timers')
        .insert([
          {
            end_time: targetDate.toISOString(),
            title: '15 Minute Timer',
            is_completed: false,
            user_id: 'anonymous' // Replace with actual user ID when auth is implemented
          }
        ]);

      if (error) throw error;

      toast({
        title: 'Timer saved!',
        description: 'Your timer has been saved to the database.'
      });
    } catch (error) {
      toast({
        title: 'Error saving timer',
        description: 'Failed to save timer to database.',
        variant: 'destructive'
      });
    }
  }, [targetDate, toast]);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        setIsRunning(false);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        saveTimer();
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate, isRunning, saveTimer]);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    if (!isNaN(newDate.getTime())) {
      setTargetDate(newDate);
      setIsRunning(true);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: 'url("https://i.imgur.com/4c1u0JF.jpg")' }}
    >
      <SnowEffect />
      <div className="absolute inset-0 grid-overlay opacity-50"></div>
      <Card className="w-full max-w-2xl glass-effect border-[rgba(255,255,255,0.1)] pixel-shadow relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Timer className="w-16 h-16 text-white opacity-90" strokeWidth={1.2} />
          </div>
          <CardTitle className="text-3xl font-pixel text-white tracking-wider opacity-90">15 MINUTE TIMER</CardTitle>
          <p className="font-pixel text-sm text-white tracking-wide opacity-75">SET TARGET DATE AND TIME</p>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex justify-center space-x-4">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hours" />
            <TimeUnit value={timeLeft.minutes} label="Minutes" />
            <TimeUnit value={timeLeft.seconds} label="Seconds" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
