import { useTheme } from "../../theme/useTheme";

type ThemedCompleteLogoProps = {
  className?: string;
  alt?: string;
};

export default function ThemedCompleteLogo({ className, alt = "SchoolOS" }: ThemedCompleteLogoProps) {
  const { resolvedTheme } = useTheme();
  const src = resolvedTheme === "dark" ? "/completelogo-dark.svg" : "/completelogo-light.svg";

  return <img src={src} alt={alt} className={className} />;
}
