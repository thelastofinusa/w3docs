import chalk, { type ColorName } from "chalk";
import * as p from "@clack/prompts";

export async function sleep(duration = 1500, name = "Timer"): Promise<void> {
  await new Promise((resolve) => setTimeout(() => resolve({ name }), duration));
}

type IntroOptions = {
  title: string;
  badge?: string;
  icon?: string;
  iconColor?: ColorName;
};

export function renderIntro({
  title,
  badge = "w3xp",
  icon = "⬒",
  iconColor = "blue",
}: IntroOptions) {
  const iconColored = (chalk[iconColor] || chalk.blue)(icon);
  p.intro(`${iconColored} ${badge} ${chalk.dim("→")} ${chalk.white(title)}`);
}

export function createSpinner(
  colorOrGetter: ColorName | (() => ColorName) = "blue",
) {
  return p.spinner({
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    styleFrame: (frame) => {
      const c =
        typeof colorOrGetter === "function" ? colorOrGetter() : colorOrGetter;
      const fn = chalk[c] as (text: string) => string;
      return fn(frame);
    },
  });
}
