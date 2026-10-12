const exactCaseInsensitive = (value: string) =>
  new RegExp('^' + value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');

export default exactCaseInsensitive;
