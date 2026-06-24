const GRADIENTS = [
  "linear-gradient(135deg,#e8b86a,#e0789f)",
  "linear-gradient(135deg,#6fa3cc,#8a93d6)",
  "linear-gradient(135deg,#cf8fc4,#e0789f)",
  "linear-gradient(135deg,#8a93d6,#6fa3cc)",
  "linear-gradient(135deg,#6fa3cc,#e0789f)",
  "linear-gradient(135deg,#e8b86a,#cf8fc4)",
];

export function gradientAt(i) {
  return GRADIENTS[i % GRADIENTS.length];
}
