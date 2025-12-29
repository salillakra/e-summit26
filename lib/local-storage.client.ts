"use client";

export function setLocalStorageValue(key: string, value: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
}

export function getLocalStorageValue(key: string): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(key);
  }
  return null;
}
