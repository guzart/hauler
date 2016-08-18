
export default function provide(namespace: string, value: Object, target = global) {
  const parts = namespace.split('.');
  let cur = target;
  for (let part; parts.length && (part = parts.shift());) {
    if (!parts.length && value !== undefined) {
      cur[part] = value;
    } else if (cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
}
