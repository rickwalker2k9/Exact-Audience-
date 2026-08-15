import { afterEach, describe, expect, it, vi } from "vitest";
import { getDailyProfiles, LAMBO_POOL } from "./dynamicProfiles";
import { LAMBO_PEOPLE } from "./lamborghiniPeopleSegment";

describe("Lamborghini daily profile rotation", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("contains a broad pool of distinct Lamborghini journeys that supports full three-profile rotations", () => {
    expect(LAMBO_POOL.length).toBeGreaterThanOrEqual(15);
    expect(LAMBO_POOL.length % 3).toBe(0);
    expect(new Set(LAMBO_POOL.map(profile => profile.name)).size).toBe(LAMBO_POOL.length);
  });

  it("advances through every Lamborghini profile once before repeating a three-profile group", () => {
    vi.useFakeTimers();
    const baseDate = new Date("2026-08-15T12:00:00.000Z");
    const displayedProfiles = new Set<string>();
    const rotationDays = LAMBO_POOL.length / 3;

    for (let day = 0; day < rotationDays; day += 1) {
      vi.setSystemTime(new Date(baseDate.getTime() + day * 86_400_000));
      const profileIds = getDailyProfiles("lamborghini").map(profile => profile.id);

      expect(profileIds).toHaveLength(3);
      expect(profileIds.some(id => displayedProfiles.has(id))).toBe(false);
      profileIds.forEach(id => displayedProfiles.add(id));
    }

    expect(displayedProfiles.size).toBe(LAMBO_POOL.length);
  });

  it("uses a refreshed, distinct Arizona roster in the People tab", () => {
    expect(LAMBO_PEOPLE).toHaveLength(60);
    expect(new Set(LAMBO_PEOPLE.map(person => `${person.firstName} ${person.lastName}`)).size).toBe(LAMBO_PEOPLE.length);
    expect(LAMBO_PEOPLE.every(person => person.state === "AZ")).toBe(true);
  });
});
