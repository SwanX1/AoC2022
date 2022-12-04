import { existsSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { Logger } from 'logerian';
import chalk from "chalk";

const cachedResources = new Map<string, Promise<string> | string>();
export function getResource(resourceIdentifier: string): Promise<string> {
  const resourcePath = path.join(__dirname, "../assets", resourceIdentifier);
  if (existsSync(resourcePath)) {
    const cached = cachedResources.get(resourcePath);
    switch (typeof cached) {
      case "object":
        return cached;
      case "string":
        return Promise.resolve(cached);
      case "undefined":
        const readPromise = readFile(resourcePath).then(buf => buf.toString());
        cachedResources.set(resourcePath, readPromise);
        return readPromise.then(resource => {
          cachedResources.set(resourcePath, resource);
          return resource;
        });
    }
  } else {
    throw new Error("Resource doesn't exist!");
  }
}

export function formatTime(ns: number): string {
  return (ns / 1000000).toFixed(3) + "ms";
}

export function measurePerf(): () => string {
  const timeStart = process.hrtime.bigint();
  return () => {
    const timeEnd = process.hrtime.bigint();
    const nanoseconds = timeEnd - timeStart;

    return formatTime(Number(nanoseconds));
  };
}

export function getLogger(filename: string): Logger {
  const identifier = path.parse(filename).base.replace(/.js$/, "");

  return new Logger({
    identifier,
    streams: [
      {
        stream: process.stdout,
        interceptString: data => chalk`{magenta [${identifier.toUpperCase()}]} ` + data
      },
    ],
  })
}
