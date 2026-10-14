import { useState, useEffect } from 'react';

// Relógio real do dispositivo, atualizado a cada segundo.
// useDeviceTime = true => usa o fuso real do aparelho (não falsifica).
// useDeviceTime = false => formata no fuso escolhido (padrão America/Sao_Paulo).
export function useClock(timezone, useDeviceTime) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const tz = useDeviceTime ? undefined : timezone;

  const time = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: tz,
  }).format(now);

  const date = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: tz,
  }).format(now);

  const longDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: tz,
  }).format(now);

  return { now, time, date, longDate };
}