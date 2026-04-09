import { ParsedCVData } from "@/types/cv";
import { Change } from "@/types/boost";

function parsePath(path: string): (string | number)[] {
  const parts: (string | number)[] = [];
  const regex = /(\w+)|\[(-?\d+)\]/g;
  let match;
  while ((match = regex.exec(path)) !== null) {
    if (match[1]) parts.push(match[1]);
    else if (match[2]) parts.push(parseInt(match[2], 10));
  }
  return parts;
}

function getValueAtPath(obj: Record<string, unknown>, pathParts: (string | number)[]): unknown {
  let current: unknown = obj;
  for (const part of pathParts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string | number, unknown>)[part];
  }
  return current;
}

function setValueAtPath(obj: Record<string, unknown>, pathParts: (string | number)[], value: unknown): void {
  let current: Record<string | number, unknown> = obj;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!(part in current)) {
      const nextPart = pathParts[i + 1];
      current[part] = typeof nextPart === "number" ? [] : {};
    }
    current = current[part] as Record<string | number, unknown>;
  }
  current[pathParts[pathParts.length - 1]] = value;
}

function addValueAtPath(obj: Record<string, unknown>, pathParts: (string | number)[], value: unknown): void {
  let current: unknown = obj;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (current == null || typeof current !== "object") return;
    if (!(part in (current as Record<string | number, unknown>))) {
      const nextPart = pathParts[i + 1];
      (current as Record<string | number, unknown>)[part] = typeof nextPart === "number" ? [] : {};
    }
    current = (current as Record<string | number, unknown>)[part];
  }
  const lastPart = pathParts[pathParts.length - 1];
  if (lastPart === -1 && Array.isArray(current)) {
    current.push(value);
  } else if (typeof lastPart === "number" && Array.isArray(current)) {
    current.splice(lastPart, 0, value);
  } else if (typeof current === "object" && current !== null) {
    (current as Record<string | number, unknown>)[lastPart] = value;
  }
}

function removeValueAtPath(obj: Record<string, unknown>, pathParts: (string | number)[]): void {
  let current: unknown = obj;
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (current == null || typeof current !== "object") return;
    if (!(part in (current as Record<string | number, unknown>))) return;
    current = (current as Record<string | number, unknown>)[part];
  }
  const lastPart = pathParts[pathParts.length - 1];
  if (Array.isArray(current) && typeof lastPart === "number") {
    current.splice(lastPart, 1);
  } else if (typeof lastPart === "string" && typeof current === "object" && current !== null) {
    delete (current as Record<string, unknown>)[lastPart];
  }
}

export function applySingleChange(cvData: ParsedCVData, change: Change): ParsedCVData {
  const updated: ParsedCVData = JSON.parse(JSON.stringify(cvData));
  const pathParts = parsePath(change.path);
  if (pathParts.length === 0) return updated;

  try {
    switch (change.type) {
      case "modify":
        setValueAtPath(updated as unknown as Record<string, unknown>, pathParts, change.after);
        break;
      case "add":
        addValueAtPath(updated as unknown as Record<string, unknown>, pathParts, change.after);
        break;
      case "remove":
        removeValueAtPath(updated as unknown as Record<string, unknown>, pathParts);
        break;
    }
  } catch (e) {
    console.error(`Failed to apply change ${change.change_id}:`, e);
  }
  return updated;
}

export function revertSingleChange(cvData: ParsedCVData, change: Change): ParsedCVData {
  const updated: ParsedCVData = JSON.parse(JSON.stringify(cvData));
  const pathParts = parsePath(change.path);
  if (pathParts.length === 0) return updated;

  try {
    switch (change.type) {
      case "modify":
        setValueAtPath(updated as unknown as Record<string, unknown>, pathParts, change.before);
        break;
      case "add":
        removeValueAtPath(updated as unknown as Record<string, unknown>, pathParts);
        break;
      case "remove":
        addValueAtPath(updated as unknown as Record<string, unknown>, pathParts, change.before);
        break;
    }
  } catch (e) {
    console.error(`Failed to revert change ${change.change_id}:`, e);
  }
  return updated;
}

export function applyMultipleChanges(cvData: ParsedCVData, changes: Change[]): ParsedCVData {
  const sorted = [...changes].sort((a, b) => {
    const order: Record<string, number> = { remove: 0, modify: 1, add: 2, reorder: 3 };
    return (order[a.type] ?? 3) - (order[b.type] ?? 3);
  });
  let result = JSON.parse(JSON.stringify(cvData)) as ParsedCVData;
  for (const change of sorted) {
    result = applySingleChange(result, change);
  }
  return result;
}

export function formatChangeValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(formatChangeValue).join(", ");
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export function getValueAtCVPath(cvData: ParsedCVData, path: string): unknown {
  const pathParts = parsePath(path);
  return getValueAtPath(cvData as unknown as Record<string, unknown>, pathParts);
}
