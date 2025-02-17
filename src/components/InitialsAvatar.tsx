const getInitials = (name: string): string => {
  const words = name.trim().split(" ");
  if (words.length === 0) return "";
  const firstInitial = words[0].charAt(0).toUpperCase();
  if (words.length === 1) return firstInitial;
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};

export default function InitialsAvatar({ name }: { name: string }) {
  const initials = getInitials(name);
  return (
    <div className="rounded-full bg-[#d81b60] w-20 h-20 border-white border-4 flex items-center justify-center font-bold text-3xl">
      {initials}
    </div>
  );
}
