import { BookOpen, BookText, Lightbulb, Briefcase, Heart, Music } from "lucide-react"

export const categoryIcons = {
  all: <BookOpen className="h-4 w-4 ml-2" />,
  fiction: <BookText className="h-4 w-4 ml-2" />,
  "self-help": <Lightbulb className="h-4 w-4 ml-2" />,
  business: <Briefcase className="h-4 w-4 ml-2" />,
  romance: <Heart className="h-4 w-4 ml-2" />,
  biography: <Music className="h-4 w-4 ml-2" />,
} as const 