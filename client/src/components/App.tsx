import React, { useState } from "react";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  LinearProgress, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Stack 
} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { runQueue } from "../utils/queueManager";
import { createTask } from "../taskFactory";

function App() {
  const [value, setValue] = useState(10);
  const [results, setResults] = useState<number[]>([]);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  const totalTasks = 1000;

  const handleStart = async () => {
    setStarted(true);
    setResults([]);
    setProgress(0);

    const tasks = Array.from({ length: totalTasks }, (_, i) =>
      createTask(i + 1, (index) => {
        setResults((prev) => [index, ...prev]); // Додаємо нові результати на початок списку
        setProgress((p) => p + 1);
      })
    );

    await runQueue(tasks, {
      concurrency: value,
      ratePerSecond: value,
    });

    setStarted(false);
    console.log("ALL DONE");
  };

  // Розрахунок відсотка для прогрес-бару
  const progressBuffer = (progress / totalTasks) * 100;

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Queue Manager Test
        </Typography>

        <Stack spacing={3}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Concurrency & Rate"
              type="number"
              variant="outlined"
              fullWidth
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              disabled={started}
              inputProps={{ min: 1, max: 100 }}
            />
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrowIcon />}
              onClick={handleStart}
              disabled={started}
              sx={{ whiteSpace: 'nowrap', minWidth: '120px' }}
            >
              Start
            </Button>
          </Box>

          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progress: {progress} / {totalTasks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progressBuffer)}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progressBuffer} sx={{ height: 10, borderRadius: 5 }} />
          </Box>

          <Typography variant="h6">Results Log:</Typography>
          
          <Paper variant="outlined" sx={{ maxHeight: 300, overflow: "auto", bgcolor: '#f5f5f5' }}>
            <List dense>
              {results.length === 0 && (
                <ListItem>
                  <ListItemText primary="No tasks completed yet" sx={{ textAlign: 'center', color: 'gray' }} />
                </ListItem>
              )}
              {results.map((r, i) => (
                <ListItem key={i} divider>
                  <ListItemText primary={`Task #${r} completed successfully`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Stack>
      </Paper>
    </Container>
  );
}

export default App;
