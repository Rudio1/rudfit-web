import { getInitials } from "@/lib/meals/progress";
import { cn } from "@/lib/utils";

interface FriendAvatarProps {
  name: string;
  profileImageUrl: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "size-10 text-sm",
  md: "size-14 text-base",
  lg: "size-16 text-lg",
};

export function FriendAvatar({
  name,
  profileImageUrl,
  size = "md",
  className,
}: FriendAvatarProps) {
  const sizeClass = SIZE_CLASSES[size];

  if (profileImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profileImageUrl}
        alt=""
        className={cn(
          "rounded-full object-cover ring-1 ring-border",
          sizeClass,
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary/10 font-semibold text-primary",
        sizeClass,
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}
