export const ACEH_KABUPATENS = ['Pidie Jaya', 'Aceh Utara'];

/**
 * Checks if a given kabupaten is allowed for Aceh admin.
 * @param kabupaten Name of the kabupaten to check.
 * @returns true if the kabupaten is in the permitted list.
 */
export function isAcehKabupatenAllowed(kabupaten: string): boolean {
  return ACEH_KABUPATENS.includes(kabupaten);
}
