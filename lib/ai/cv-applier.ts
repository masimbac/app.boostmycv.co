import { ParsedCVData } from "@/types/cv";
import { Change } from "@/types/boost";

/**
 * Applies accepted changes to CV data to create an improved version
 */
export function applyChangesToCV(
  cvData: ParsedCVData,
  changes: Change[]
): ParsedCVData {
  // Deep clone the CV data to avoid mutations
  const updatedCV: ParsedCVData = JSON.parse(JSON.stringify(cvData));

  // Filter only accepted changes
  const acceptedChanges = changes.filter((change) => change.accepted);

  // Sort changes by type to ensure proper order:
  // 1. remove (do first to avoid index issues)
  // 2. modify (do second)
  // 3. add (do last)
  // 4. reorder (do last)
  const sortedChanges = acceptedChanges.sort((a, b) => {
    const order = { remove: 0, modify: 1, add: 2, reorder: 3 };
    return order[a.type] - order[b.type];
  });

  for (const change of sortedChanges) {
    try {
      applyChange(updatedCV, change);
    } catch (error) {
      console.error(`Failed to apply change ${change.change_id}:`, error);
      // Continue with other changes even if one fails
    }
  }

  return updatedCV;
}

/**
 * Applies a single change to the CV data
 */
function applyChange(cvData: ParsedCVData, change: Change): void {
  const { path, type, after } = change;

  // Parse the path to navigate the data structure
  const pathParts = parsePath(path);

  switch (type) {
    case "modify":
      setValueAtPath(cvData, pathParts, after);
      break;

    case "add":
      addValueAtPath(cvData, pathParts, after);
      break;

    case "remove":
      removeValueAtPath(cvData, pathParts);
      break;

    case "reorder":
      // Reorder is handled by removing and adding in new position
      // For now, we'll implement basic reordering for array items
      // This would need more context about target position
      console.warn("Reorder not fully implemented yet");
      break;
  }
}

/**
 * Parses a path string like "work_experience[0].responsibilities[1]"
 * into parts: ["work_experience", 0, "responsibilities", 1]
 */
function parsePath(path: string): (string | number)[] {
  const parts: (string | number)[] = [];
  const regex = /(\w+)|\[(-?\d+)\]/g;
  let match;

  while ((match = regex.exec(path)) !== null) {
    if (match[1]) {
      parts.push(match[1]); // Property name
    } else if (match[2]) {
      parts.push(parseInt(match[2], 10)); // Array index
    }
  }

  return parts;
}

/**
 * Sets a value at the specified path
 */
function setValueAtPath(
  obj: any,
  pathParts: (string | number)[],
  value: any
): void {
  let current = obj;

  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!(part in current)) {
      // Create intermediate objects/arrays as needed
      const nextPart = pathParts[i + 1];
      current[part] = typeof nextPart === "number" ? [] : {};
    }
    current = current[part];
  }

  const lastPart = pathParts[pathParts.length - 1];
  current[lastPart] = value;
}

/**
 * Adds a value at the specified path (for array additions)
 */
function addValueAtPath(
  obj: any,
  pathParts: (string | number)[],
  value: any
): void {
  let current = obj;

  // Navigate to the parent (which should be an array)
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!(part in current)) {
      const nextPart = pathParts[i + 1];
      current[part] = typeof nextPart === "number" ? [] : {};
    }
    current = current[part];
  }

  const lastPart = pathParts[pathParts.length - 1];

  // Handle special case: [-1] means append to array
  if (lastPart === -1) {
    if (pathParts.length === 1) {
      // Top-level array (like skills)
      const parentKey = pathParts[0];
      if (Array.isArray(current)) {
        current.push(value);
      } else {
        throw new Error(`Expected array at path, got ${typeof current}`);
      }
    } else {
      // Nested array
      const parentKey = pathParts[pathParts.length - 2];
      const parent = current;
      if (Array.isArray(parent)) {
        parent.push(value);
      } else {
        throw new Error(`Expected array at path, got ${typeof parent}`);
      }
    }
  } else if (typeof lastPart === "number") {
    // Insert at specific index
    if (Array.isArray(current)) {
      current.splice(lastPart, 0, value);
    } else {
      throw new Error(`Expected array at path, got ${typeof current}`);
    }
  } else {
    // Add as property
    current[lastPart] = value;
  }
}

/**
 * Removes a value at the specified path
 */
function removeValueAtPath(obj: any, pathParts: (string | number)[]): void {
  let current = obj;

  // Navigate to the parent
  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!(part in current)) {
      return; // Path doesn't exist, nothing to remove
    }
    current = current[part];
  }

  const lastPart = pathParts[pathParts.length - 1];

  if (Array.isArray(current) && typeof lastPart === "number") {
    // Remove from array
    current.splice(lastPart, 1);
  } else if (typeof lastPart === "string") {
    // Remove property
    delete current[lastPart];
  }
}

/**
 * Validates that changes can be applied to the CV data
 */
export function validateChanges(
  cvData: ParsedCVData,
  changes: Change[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const change of changes) {
    try {
      const pathParts = parsePath(change.path);

      // Basic validation: check if path is reasonable
      if (pathParts.length === 0) {
        errors.push(`Change ${change.change_id}: Invalid path "${change.path}"`);
        continue;
      }

      // Check if section exists in CV data
      const section = pathParts[0] as string;
      const validSections = [
        "personal_info",
        "professional_summary",
        "work_experience",
        "education",
        "skills",
        "projects",
        "certifications",
      ];

      if (!validSections.includes(section)) {
        errors.push(
          `Change ${change.change_id}: Invalid section "${section}"`
        );
      }

      // Type-specific validation
      if (change.type === "modify" && change.after === null) {
        errors.push(
          `Change ${change.change_id}: Modify change must have 'after' value`
        );
      }

      if (change.type === "add" && change.after === null) {
        errors.push(
          `Change ${change.change_id}: Add change must have 'after' value`
        );
      }
    } catch (error) {
      errors.push(
        `Change ${change.change_id}: ${
          error instanceof Error ? error.message : "Validation error"
        }`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
