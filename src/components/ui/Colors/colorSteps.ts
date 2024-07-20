import { linearScale } from "../../helpers";

export const getHue = (
  value: number,
  start?: { hue: number; edge: number },
  end?: { hue: number; edge: number },
): number => {
  if (!start) {
    start = {hue: 0, edge: 0}
  }

  if (!end) {
    end = {hue: 360, edge: 359}
  }

  const scale = linearScale([start.edge, end.edge], [start.hue, end.hue]);

  return scale(value);
};
