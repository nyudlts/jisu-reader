export interface AccessibilityMetadata {
    accessMode: string[];
    feature: string[];
    hazard: string[];
    summary: string;
}

export interface AccessibilityInfo {
    waysOfReading: string[];
    navigation: string[];
    hazards: string[];
    summary: string;
}

export function extractAccessibilityInfo(publication: any): AccessibilityInfo {
  const feature = publication?.metadata?.otherMetadata?.accessibility?.feature ?? [];
  const accessModeSufficient = publication?.metadata?.otherMetadata?.accessibility?.accessModeSufficient[0] ?? [];
  const hazard = publication?.metadata?.otherMetadata?.accessibility?.hazard ?? [];
  const summary = publication?.metadata?.otherMetadata?.accessibility?.summary ?? "";

  const waysOfReading: string[] = [];
  const navigation: string[] = [];
  const hazards: string[] = [];

  if (feature.includes("displayTransformability")) {
    waysOfReading.push("Appearance can be modified");
  }

  if (accessModeSufficient.includes("textual")) {
    waysOfReading.push("Readable in read aloud or dynamic braille");
  }

  if (feature.includes("structuralNavigation")) {
    navigation.push("Headings");
  }

  if (feature.includes("index")) {
    navigation.push("Index");
  }

  if (feature.includes("tableOfContents")) {
    navigation.push("Table of Contents");
  }

  if (hazard.includes("none")) {
    hazards.push("No hazards");
  }

  return {
    waysOfReading,
    navigation,
    hazards,
    summary
  };
}




