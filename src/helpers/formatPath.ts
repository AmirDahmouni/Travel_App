export default function removePublic(input: string): string {
  return input.replace('./public', '');
}
