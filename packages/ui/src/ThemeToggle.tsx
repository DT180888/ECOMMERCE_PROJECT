import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { Button } from "./Button";
import { useTheme } from './ThemeProvider';

export const ThemeToggle = ({ className }: { className?: string }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={className}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <SunIcon className="w-5 h-5 animate-in zoom-in rotate-90 duration-500" />
      ) : (
        <MoonIcon className="w-5 h-5 animate-in zoom-in duration-500" />
      )}
    </Button>
  );
};
