const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2);

  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Normal (healthy weight)';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  return 'Obese';
};

const height = Number(process.argv[2]);
const weight = Number(process.argv[3]);

if (!isNaN(height) && !isNaN(weight)) {
  console.log(calculateBmi(height, weight));
} else {
  console.log('Error: Please provide valid numbers for height and weight.');
}