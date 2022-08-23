import { promises as fs } from "node:fs";
import { simpleGit } from "simple-git";

interface Timestamps {
  published: number;
  modified: number;
}

export const getTimestamps = async (file: string): Promise<Timestamps> => {
  const { total, latest, all } = await simpleGit().log({ file });

  if (total === 0) {
    const { birthtimeMs, mtimeMs } = await fs.stat(file);
    return { published: birthtimeMs, modified: mtimeMs };
  }

  const first = all[total - 1];
  const last = latest;

  if (typeof first === "undefined" || last === null) {
    throw new Error("logs missing");
  }

  const published = Date.parse(first.date);
  const modified = Date.parse(last.date);

  return { published, modified };
};
