import Image from "next/image";
import { cn } from "@/lib/utils";
import { MEAL_TYPE_OPTIONS } from "@/lib/meals/constants";
import type { MealType } from "@/lib/types/meals";

interface MealTypeImageProps {
  mealType: MealType;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
}

export function MealTypeImage({
  mealType,
  alt,
  className,
  imageClassName,
  sizes = "160px",
  priority = false,
}: MealTypeImageProps) {
  const option = MEAL_TYPE_OPTIONS.find((item) => item.value === mealType);

  if (!option) return null;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={option.imageSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
