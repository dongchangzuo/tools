const FULLWIDTH_TO_HALFWIDTH: Record<string, string> = {
  '０': '0',
  '１': '1',
  '２': '2',
  '３': '3',
  '４': '4',
  '５': '5',
  '６': '6',
  '７': '7',
  '８': '8',
  '９': '9',
  '＋': '+',
  '－': '-',
  '—': '-',
  '﹣': '-',
  '＊': '*',
  '×': '*',
  '／': '/',
  '÷': '/',
  '（': '(',
  '）': ')',
  '【': '[',
  '】': ']',
  '［': '[',
  '］': ']',
  '｛': '{',
  '｝': '}',
  '　': '',
  ' ': '',
  '\t': '',
  '\n': '',
  '\r': '',
}

export function normalizeExpression(expression: string): string {
  let result = ''
  for (const char of expression) {
    const mapped = FULLWIDTH_TO_HALFWIDTH[char]
    if (mapped !== undefined) {
      result += mapped
    } else {
      result += char
    }
  }
  return result
}
