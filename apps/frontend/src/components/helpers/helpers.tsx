export const getInitials = (name: string): string => {
  if (!name) return '';

  const parts = name.split(' ');
  if (parts.length === 0) return '';

  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial =
    parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : '';

  return firstInitial + lastInitial;
};
