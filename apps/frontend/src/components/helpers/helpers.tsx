//  generating initials
export const getInitials = (name: string): string => {
  const trimmed = name.trim();
  if (!trimmed) return 'U';

  const parts = trimmed
    .split(' ')
    .map((p) => p.trim())
    .filter(Boolean);

  const first = parts[0]?.[0]?.toUpperCase() || '';
  const second =
    parts.length > 1
      ? parts[1]?.[0]?.toUpperCase()
      : parts[0]?.[1]?.toUpperCase() || '';

  const initials = (first + second).slice(0, 2);
  return initials || 'U';
};

// converting name objects to strings.
type NameObject =
  | {
      first?: string;
      middle?: string;
      last?: string;
    }
  | string;

export const convertObjectNameToString = (name: NameObject): string => {
  if (typeof name === 'string') {
    return name;
  }

  if (!name || typeof name !== 'object') return '';
  const { first, middle, last } = name;
  const parts = [first, middle, last]
    .map((part) => part?.trim())
    .filter((part) => !!part);

  return parts.join(' ');
};

// generate slug from name
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') 
    .replace(/[\s_-]+/g, '-') 
    .replace(/^-+|-+$/g, ''); 
};
