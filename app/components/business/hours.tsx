import { cn } from "@/app/lib/utils";

interface BusinessHoursProps {
    hours?: string[];
    className?: string;
}

interface ParsedHours {
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function parseHoursString(hourString: string): ParsedHours | null {
    // Parse various formats like "Monday: 9:00 AM - 5:00 PM" or "Sunday: Closed"
    const parts = hourString.split(": ");
    if (parts.length !== 2) return null;
    
    const day = parts[0].trim();
    const timeRange = parts[1].trim();
    
    if (timeRange.toLowerCase() === "closed") {
        return { day, open: "", close: "", isClosed: true };
    }
    
    const times = timeRange.split(" - ");
    if (times.length !== 2) return null;
    
    return {
        day,
        open: times[0].trim(),
        close: times[1].trim(),
        isClosed: false
    };
}

function isBusinessOpen(hours: string[]): { isOpen: boolean; todayHours: ParsedHours | null } {
    const now = new Date();
    const currentDay = DAYS_OF_WEEK[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // Find today's hours
    const todayHoursString = hours.find(h => h.toLowerCase().includes(currentDay.toLowerCase()));
    if (!todayHoursString) return { isOpen: false, todayHours: null };
    
    const todayHours = parseHoursString(todayHoursString);
    if (!todayHours || todayHours.isClosed) return { isOpen: false, todayHours };
    
    // Convert times to minutes for comparison
    const convertTo24Hour = (timeStr: string): number => {
        const [time, period] = timeStr.split(" ");
        const [hours, minutes] = time.split(":").map(Number);
        let hour24 = hours;
        
        if (period === "PM" && hours !== 12) hour24 += 12;
        if (period === "AM" && hours === 12) hour24 = 0;
        
        return hour24 * 60 + minutes;
    };
    
    const openTime = convertTo24Hour(todayHours.open);
    const closeTime = convertTo24Hour(todayHours.close);
    
    const isOpen = currentTime >= openTime && currentTime <= closeTime;
    
    return { isOpen, todayHours };
}

export default function BusinessHours({ hours, className }: BusinessHoursProps) {
    if (!hours || hours.length === 0) return null;
    
    const { isOpen } = isBusinessOpen(hours);
    const currentDay = DAYS_OF_WEEK[new Date().getDay()];
    
    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center gap-2">
                <h3 className="font-semibold">Business Hours</h3>
                <span className={cn(
                    "px-2 py-1 text-xs font-medium rounded-full",
                    isOpen 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                )}>
                    {isOpen ? "Open Now" : "Closed"}
                </span>
            </div>
            
            <ul className="space-y-2">
                {hours.map((hour, index) => {
                    const parsed = parseHoursString(hour);
                    const isToday = parsed && parsed.day === currentDay;
                    
                    return (
                        <li 
                            key={index} 
                            className={cn(
                                "flex justify-between py-1.5 px-2 rounded",
                                isToday && "bg-primary/5 font-medium"
                            )}
                        >
                            <span className="text-sm">{parsed?.day || hour.split(":")[0]}</span>
                            <span className={cn(
                                "text-sm",
                                parsed?.isClosed && "text-muted-foreground"
                            )}>
                                {parsed?.isClosed ? "Closed" : hour.split(": ")[1]}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}