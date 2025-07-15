// GymTracker.jsx actualizado – múltiples ejercicios, menús desplegables, diseño mejorado
// Puedes copiar esto como el nuevo contenido de tu archivo principal

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function GymTracker() {
  const emptyExercise = {
    exercise: "",
    warmupWeight: "",
    warmupReps: "",
    sets: [
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" },
      { weight: "", reps: "" }
    ],
    notes: ""
  };

  const emptyForm = {
    day: "",
    group: "",
    exercises: [structuredClone(emptyExercise)]
  };

  const [sessions, setSessions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [routineTemplates, setRoutineTemplates] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [unit, setUnit] = useState("kg");

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    const savedTemplates = JSON.parse(localStorage.getItem("routineTemplates") || "[]");
    const savedUnit = localStorage.getItem("unit") || "kg";
    setSessions(savedSessions);
    setRoutineTemplates(savedTemplates);
    setUnit(savedUnit);
  }, []);

  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("routineTemplates", JSON.stringify(routineTemplates));
  }, [routineTemplates]);

  useEffect(() => {
    localStorage.setItem("unit", unit);
  }, [unit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleExerciseChange = (idx, field, value) => {
    const updatedExercises = [...form.exercises];
    updatedExercises[idx][field] = value;
    setForm({ ...form, exercises: updatedExercises });
  };

  const handleSetChange = (exerciseIdx, setIdx, field, value) => {
    const updatedExercises = [...form.exercises];
    updatedExercises[exerciseIdx].sets[setIdx][field] = value;
    setForm({ ...form, exercises: updatedExercises });
  };

  const calculate1RM = (weight, reps) => {
    const w = Number(weight);
    const r = Number(reps);
    if (!w || !r) return 0;
    return Math.round(w * (1 + r / 30));
  };

  const handleSubmit = () => {
    const best1RM = Math.max(
      ...form.exercises.flatMap((ex) =>
        ex.sets.map((s) => calculate1RM(s.weight, s.reps))
      )
    );

    const newSession = {
      ...form,
      unit,
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      best1RM
    };

    setSessions([...sessions, newSession]);
    setForm(emptyForm);
  };

  const handleSaveRoutine = () => {
    setRoutineTemplates([...routineTemplates, form]);
  };

  const handleLoadRoutine = (tpl) => {
    setForm(tpl);
  };

  const addExercise = () => {
    setForm({ ...form, exercises: [...form.exercises, structuredClone(emptyExercise)] });
  };

  const filteredSessions = filterDate
    ? sessions.filter((s) => s.date === filterDate)
    : sessions;

  const muscleGroups = [
    "Pecho", "Espalda", "Piernas (cuádriceps)", "Piernas (isquiotibiales)",
    "Piernas (gemelos)", "Hombros", "Bíceps", "Tríceps", "Abdomen"
  ];

  const daysOfWeek = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
  ];

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Registro de Entrenamiento</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Unidad de Peso</label>
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        >
          <option value="kg">Kilogramos (kg)</option>
          <option value="lb">Libras (lb)</option>
        </select>
      </div>

      <Card className="mb-6">
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2">
            <select
              name="day"
              value={form.day}
              onChange={handleChange}
              className="border rounded px-2 py-2 w-full"
            >
              <option value="">Selecciona Día</option>
              {daysOfWeek.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              name="group"
              value={form.group}
              onChange={handleChange}
              className="border rounded px-2 py-2 w-full"
            >
              <option value="">Selecciona Grupo Muscular</option>
              {muscleGroups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {form.exercises.map((ex, idx) => (
            <div key={idx} className="border p-3 rounded space-y-2 bg-gray-50">
              <Input
                value={ex.exercise}
                onChange={(e) => handleExerciseChange(idx, "exercise", e.target.value)}
                placeholder={`Ejercicio #${idx + 1}`}
              />
              <div className="flex gap-2">
                <Input
                  value={ex.warmupWeight}
                  onChange={(e) => handleExerciseChange(idx, "warmupWeight", e.target.value)}
                  placeholder={`Calentamiento Peso (${unit})`}
                  type="number"
                />
                <Input
                  value={ex.warmupReps}
                  onChange={(e) => handleExerciseChange(idx, "warmupReps", e.target.value)}
                  placeholder="Reps"
                  type="number"
                />
              </div>

              {ex.sets.map((set, sidx) => (
                <div key={sidx} className="flex gap-2">
                  <Input
                    value={set.weight}
                    onChange={(e) => handleSetChange(idx, sidx, "weight", e.target.value)}
                    placeholder={`Serie ${sidx + 1} - Peso (${unit})`}
                    type="number"
                  />
                  <Input
                    value={set.reps}
                    onChange={(e) => handleSetChange(idx, sidx, "reps", e.target.value)}
                    placeholder={`Serie ${sidx + 1} - Reps`}
                    type="number"
                  />
                </div>
              ))}

              <Input
                value={ex.notes}
                onChange={(e) => handleExerciseChange(idx, "notes", e.target.value)}
                placeholder="Notas"
              />
            </div>
          ))}

          <Button onClick={addExercise} className="bg-indigo-500 text-white w-full">
            + Añadir otro ejercicio
          </Button>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} className="bg-green-600 text-white w-full">
              Guardar Sesión
            </Button>
            <Button variant="secondary" onClick={handleSaveRoutine} className="w-full">
              Guardar como Rutina
            </Button>
          </div>
        </CardContent>
      </Card>

      {routineTemplates.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Rutinas Guardadas</h2>
          <div className="space-y-2 mt-2">
            {routineTemplates.map((tpl, idx) => (
              <Button key={idx} onClick={() => handleLoadRoutine(tpl)} variant="outline" className="w-full">
                {tpl.group || "Rutina"}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-4">
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          placeholder="Filtrar por fecha"
        />
      </div>

      <h2 className="text-xl font-semibold mb-2">Progreso</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={filteredSessions}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="best1RM" stroke="#4f46e5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}