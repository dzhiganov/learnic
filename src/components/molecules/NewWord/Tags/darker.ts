const darker = (color: string): string => {
  const [matched] = color.match(/\(\d{1,3},\s\d{1,3}%,\s\d{1,3}%\)$/gm) || [];

  if (!matched) return color;

  const [h, s, l] = matched.split(',').map((item: string) => {
    const [d] = item.match(/\d{1,3}/g) || [];
    return parseInt(d, 10);
  });
  const newL = l - 40;

  return `hsl(${h}, ${s}%, ${newL < 0 ? 0 : newL}%)`;
};

export default darker;
