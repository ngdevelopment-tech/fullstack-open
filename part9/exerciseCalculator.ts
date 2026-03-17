interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (dailyHours: Array<number>, target: number): Result => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter(h => h > 0).length;
  const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;

  let rating;
  let ratingDescription;

  if (average < target * 0.5) {
    rating = 1;
    ratingDescription = 'you need to work much harder';
  } else if (average < target) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 3;
    ratingDescription = 'excellent work, target met';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

const target = Number(process.argv[2]);
const dailyHours = process.argv.slice(3).map(h => Number(h));

if (!isNaN(target) && dailyHours.every(h => !isNaN(h))) {
  console.log(calculateExercises(dailyHours, target));
} else {
  console.log('Error: Please provide valid numbers.');
}