import express from 'express';
import diagnosisRouter from './src/routes/diagnoses';
import patientRouter from './src/routes/patients';
import cors from 'cors';

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2);
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal (healthy weight)';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
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

  return { periodLength, trainingDays, success, rating, ratingDescription, target, average };
};

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api/diagnoses', diagnosisRouter);
app.use('/api/patients', patientRouter);
app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!height || !weight || isNaN(height) || isNaN(weight)) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(height, weight);
  return res.send({ weight, height, bmi });
});

app.post('/exercises', (req, res) => {
  const body = req.body as { daily_exercises: unknown, target: unknown };
  const { daily_exercises, target } = body;

  if (!daily_exercises || target === undefined) {
    return res.status(400).send({ error: "parameters missing" });
  }

  const isValidTarget = !isNaN(Number(target));
  const isValidExercises = Array.isArray(daily_exercises) && 
    daily_exercises.every(e => !isNaN(Number(e)));

  if (!isValidTarget || !isValidExercises) {
    return res.status(400).send({ error: "malformatted parameters" });
  }

  const result = calculateExercises(daily_exercises as number[], Number(target));

  return res.send({ result });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});